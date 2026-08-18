package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.dto.ApiResponse;
import com.example.hethongquanlydatvexe.model.*;
import com.example.hethongquanlydatvexe.repository.*;
import com.example.hethongquanlydatvexe.utils.IdGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping({"/api/booking", "/api/payment", "/bookings"})
@CrossOrigin(origins = "*")
public class BookingHandler {

    private final SeatRepository seatRepo = new SeatRepository();
    private final BusTripRepository tripRepo = new BusTripRepository();
    private final TicketRepository ticketRepo = new TicketRepository();
    private final CustomerRepository customerRepo = new CustomerRepository();

    // 1. Giữ chỗ 3 phút: POST /api/booking/hold
    @PostMapping("/hold")
    public ResponseEntity<ApiResponse<Ticket>> holdBooking(@RequestBody Map<String, Object> payload) {
        String tripId = (String) payload.get("tripId");
        String seatNumber = (String) payload.get("seatNumber");
        String customerName = (String) payload.get("customerName");
        String customerPhone = (String) payload.get("customerPhone");
        String customerType = (String) payload.getOrDefault("customerType", "NORMAL");
        String paymentMethod = (String) payload.getOrDefault("paymentMethod", "BANKING");

        BusTrip trip = tripRepo.findById(tripId);
        if (trip == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy chuyến xe: " + tripId));
        }

        Seat seat = seatRepo.findByTripIdAndSeatNumber(tripId, seatNumber);
        if (seat == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Ghế không tồn tại"));
        }

        // Thực hiện giữ chỗ 180s (3 phút)
        String expiresAt = seat.holdSeat(customerPhone, 180);
        seatRepo.update(seat);

        // Tạo / cập nhật khách hàng
        Customer customer = customerRepo.findByPhone(customerPhone);
        if (customer == null) {
            customer = new Customer(IdGenerator.nextCustomerId(), customerName, customerPhone, "", customerType);
            customerRepo.save(customer);
        } else {
            customer.setFullName(customerName);
            customer.setCustomerType(customerType);
            customerRepo.update(customer);
        }

        // Tính giá theo Business Rules (Áp dụng đa hình giảm giá)
        double basePrice = trip.getBasePrice();
        double surcharge = "VIP".equalsIgnoreCase(seat.getSeatType()) ? 40000 : 0;
        double rawPrice = basePrice + surcharge;
        double discountPercent = "VIP".equalsIgnoreCase(customerType) ? 20 : "MEMBER".equalsIgnoreCase(customerType) ? 10 : 0;
        double discountAmount = rawPrice * (discountPercent / 100.0);
        double finalPrice = rawPrice - discountAmount;

        String ticketId = "VE-" + (trip.getTripCode() != null ? trip.getTripCode().replace("-", "") : "HN0800")
                + "-" + seatNumber + "-" + ((int)(Math.random() * 9000) + 1000);

        Ticket ticket = new Ticket(ticketId, customer, trip, seat, finalPrice);
        ticket.setStatus("HOLDING");
        ticket.setPaymentMethod(paymentMethod);
        ticket.setCreatedAt(Instant.now().toString());
        ticket.setExpiresAt(expiresAt);

        ticketRepo.save(ticket);

        return ResponseEntity.ok(ApiResponse.ok(ticket, "Giữ chỗ 3 phút thành công!"));
    }

    // 2. Hủy giữ chỗ: POST /api/booking/cancel-hold
    @PostMapping("/cancel-hold")
    public ResponseEntity<ApiResponse<Void>> cancelHold(@RequestBody Map<String, String> payload) {
        String ticketId = payload.get("ticketId");
        Ticket ticket = ticketRepo.findById(ticketId);
        if (ticket != null) {
            ticket.setStatus("CANCELLED");
            ticketRepo.update(ticket);

            if (ticket.getTrip() != null && ticket.getSeat() != null) {
                Seat seat = seatRepo.findByTripIdAndSeatNumber(ticket.getTrip().getTripId(), ticket.getSeat().getSeatNumber());
                if (seat != null) {
                    seat.releaseHold();
                    seatRepo.update(seat);
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.ok(null, "Đã hủy giữ chỗ và giải phóng ghế"));
    }

    // 3. Xử lý thanh toán: POST /api/payment/process
    @PostMapping("/process")
    public ResponseEntity<ApiResponse<Ticket>> processPayment(@RequestBody Map<String, Object> payload) {
        String ticketId = (String) payload.get("ticketId");
        String paymentMethod = (String) payload.getOrDefault("paymentMethod", "BANKING");

        Ticket ticket = ticketRepo.findById(ticketId);
        if (ticket == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin vé!"));
        }

        ticket.setStatus("PAID");
        ticket.setPaymentMethod(paymentMethod);
        ticket.setPaidAt(Instant.now().toString());
        ticketRepo.update(ticket);

        if (ticket.getTrip() != null && ticket.getSeat() != null) {
            Seat seat = seatRepo.findByTripIdAndSeatNumber(ticket.getTrip().getTripId(), ticket.getSeat().getSeatNumber());
            if (seat != null) {
                seat.confirmBooking(ticketId);
                seatRepo.update(seat);
            }
        }

        return ResponseEntity.ok(ApiResponse.ok(ticket, "Thanh toán và xuất vé thành công!"));
    }
}