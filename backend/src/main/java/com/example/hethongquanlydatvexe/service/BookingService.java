package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.model.Customer;
import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.model.Ticket;
import com.example.hethongquanlydatvexe.exception.BusinessRuleException;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;
import com.example.hethongquanlydatvexe.repository.CustomerRepository;
import com.example.hethongquanlydatvexe.repository.SeatRepository;
import com.example.hethongquanlydatvexe.repository.TicketRepository;
import com.example.hethongquanlydatvexe.utils.IdGenerator;

import java.time.Instant;

public class BookingService {

    // Khóa JVM tĩnh bảo vệ toàn bộ tiến trình đặt vé - thanh toán - hủy vé chống race condition
    private static final Object BOOKING_LOCK = new Object();

    private final SeatRepository seatRepo = new SeatRepository();
    private final BusTripRepository tripRepo = new BusTripRepository();
    private final TicketRepository ticketRepo = new TicketRepository();
    private final CustomerRepository customerRepo = new CustomerRepository();

    /**
     * Giữ chỗ ghế trong 180 giây (3 phút)
     */
    public Ticket holdSeat(
            String tripId,
            String seatNumber,
            String customerName,
            String customerPhone,
            String customerEmail,
            String customerType,
            String paymentMethod) {

        synchronized (BOOKING_LOCK) {
            BusTrip trip = tripRepo.findById(tripId);
            if (trip == null) {
                throw new BusinessRuleException("Không tìm thấy chuyến xe: " + tripId);
            }

            Seat seat = seatRepo.findByTripIdAndSeatNumber(tripId, seatNumber);
            if (seat == null) {
                throw new BusinessRuleException("Ghế không tồn tại trong chuyến xe!");
            }

            // Seat tự kiểm tra và cập nhật trạng thái HOLDING
            String expiresAt = seat.holdSeat(customerPhone, 180);
            seatRepo.update(seat);

            Customer customer = customerRepo.findByPhone(customerPhone);
            if (customer == null) {
                customer = new Customer(
                        IdGenerator.nextCustomerId(),
                        customerName,
                        customerPhone,
                        customerEmail,
                        customerType
                );
                customerRepo.save(customer);
            } else {
                customer.setFullName(customerName);
                customer.setCustomerType(customerType);
                customerRepo.update(customer);
            }

            DiscountPolicy discountPolicy;
            if ("VIP".equalsIgnoreCase(customerType)) {
                discountPolicy = new VipDiscount();
            } else if ("MEMBER".equalsIgnoreCase(customerType)) {
                discountPolicy = new MemberDiscount();
            } else {
                discountPolicy = new StandardDiscount(0);
            }

            double basePrice = trip.getBasePrice();
            double surcharge = "VIP".equalsIgnoreCase(seat.getSeatType()) ? 50000.0 : 0.0;
            double rawPrice = basePrice + surcharge;
            double discountAmount = discountPolicy.calculateDiscount(rawPrice);
            double finalPrice = rawPrice - discountAmount;

            String ticketId = "VE-"
                    + (trip.getTripCode() != null ? trip.getTripCode().replace("-", "") : "HN0800")
                    + "-"
                    + seatNumber
                    + "-"
                    + ((int) (Math.random() * 9000) + 1000);

            Ticket ticket = new Ticket(
                    ticketId,
                    customer,
                    trip,
                    seat,
                    finalPrice
            );

            ticket.setStatus("HOLDING");
            ticket.setPaymentMethod(paymentMethod != null ? paymentMethod : "BANKING");
            ticket.setCreatedAt(Instant.now().toString());
            ticket.setExpiresAt(expiresAt);

            ticketRepo.save(ticket);
            return ticket;
        }
    }

    /**
     * Xử lý thanh toán vé (Chặn vé đã hết hạn 3 phút)
     */
    public Ticket processPayment(String ticketId, String paymentMethodType) {
        synchronized (BOOKING_LOCK) {
            Ticket ticket = ticketRepo.findById(ticketId);

            if (ticket == null) {
                throw new BusinessRuleException("Không tìm thấy mã vé: " + ticketId);
            }

            if ("PAID".equalsIgnoreCase(ticket.getStatus())) {
                throw new BusinessRuleException("Vé này đã được thanh toán trước đó!");
            }

            if (!"HOLDING".equalsIgnoreCase(ticket.getStatus())) {
                throw new BusinessRuleException("Vé không còn ở trạng thái giữ chỗ!");
            }

            if (ticket.getExpiresAt() == null || ticket.getExpiresAt().isBlank()) {
                throw new BusinessRuleException("Vé không có thời gian hết hạn hợp lệ!");
            }

            // Kiểm tra thời hạn 3 phút của vé
            final Instant expiresAt;
            try {
                expiresAt = Instant.parse(ticket.getExpiresAt());
            } catch (Exception ex) {
                throw new BusinessRuleException("Thời gian hết hạn của vé không hợp lệ!");
            }

            if (!Instant.now().isBefore(expiresAt)) {
                ticket.setStatus("CANCELLED");
                ticketRepo.update(ticket);

                if (ticket.getTrip() != null && ticket.getSeat() != null) {
                    Seat seat = seatRepo.findByTripIdAndSeatNumber(
                            ticket.getTrip().getTripId(),
                            ticket.getSeat().getSeatNumber()
                    );
                    if (seat != null) {
                        seat.releaseHold();
                        seatRepo.update(seat);
                    }
                }
                throw new BusinessRuleException("Thời gian giữ vé 3 phút đã hết. Ghế đã được tự động giải phóng!");
            }

            PaymentMethod paymentMethod;
            if ("E_WALLET".equalsIgnoreCase(paymentMethodType)) {
                paymentMethod = new EWalletPayment();
            } else if ("CASH".equalsIgnoreCase(paymentMethodType)) {
                paymentMethod = new CashPayment();
            } else {
                paymentMethod = new BankingPayment();
            }

            boolean success = paymentMethod.pay(ticket.getPrice());
            if (!success) {
                throw new BusinessRuleException("Thanh toán qua cổng " + paymentMethodType + " thất bại!");
            }

            ticket.setStatus("PAID");
            ticket.setPaymentMethod(paymentMethodType);
            ticket.setPaidAt(Instant.now().toString());
            ticketRepo.update(ticket);

            if (ticket.getTrip() != null && ticket.getSeat() != null) {
                Seat seat = seatRepo.findByTripIdAndSeatNumber(
                        ticket.getTrip().getTripId(),
                        ticket.getSeat().getSeatNumber()
                );
                if (seat != null) {
                    seat.confirmBooking(ticketId);
                    seatRepo.update(seat);
                }
            }

            return ticket;
        }
    }

    /**
     * Hủy giữ chỗ vé
     */
    public void cancelHold(String ticketId) {
        synchronized (BOOKING_LOCK) {
            Ticket ticket = ticketRepo.findById(ticketId);
            if (ticket == null) {
                throw new BusinessRuleException("Không tìm thấy mã vé: " + ticketId);
            }

            if ("PAID".equalsIgnoreCase(ticket.getStatus())) {
                throw new BusinessRuleException("Không thể hủy vé đã thanh toán!");
            }

            ticket.setStatus("CANCELLED");
            ticketRepo.update(ticket);

            if (ticket.getTrip() != null && ticket.getSeat() != null) {
                Seat seat = seatRepo.findByTripIdAndSeatNumber(
                        ticket.getTrip().getTripId(),
                        ticket.getSeat().getSeatNumber()
                );
                if (seat != null) {
                    seat.releaseHold();
                    seatRepo.update(seat);
                }
            }
        }
    }
}