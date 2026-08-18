package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Ticket;
import com.example.hethongquanlydatvexe.dto.ApiResponse;
import com.example.hethongquanlydatvexe.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/booking", "/api/payment", "/bookings"})
@CrossOrigin(origins = "*")
public class BookingHandler {

    // Handler chỉ phụ thuộc vào tầng Service (Đảm bảo chuẩn 3 Tầng)
    private final BookingService bookingService = new BookingService();

    @PostMapping("/hold")
    public ResponseEntity<ApiResponse<Ticket>> holdBooking(@RequestBody Map<String, Object> payload) {
        String tripId = (String) payload.get("tripId");
        String seatNumber = (String) payload.get("seatNumber");
        String customerName = (String) payload.get("customerName");
        String customerPhone = (String) payload.get("customerPhone");
        String customerEmail = (String) payload.getOrDefault("customerEmail", "");
        String customerType = (String) payload.getOrDefault("customerType", "NORMAL");
        String paymentMethod = (String) payload.getOrDefault("paymentMethod", "BANKING");

        Ticket ticket = bookingService.holdSeat(tripId, seatNumber, customerName, customerPhone, customerEmail, customerType, paymentMethod);
        return ResponseEntity.ok(ApiResponse.ok(ticket, "Giữ chỗ 3 phút thành công!"));
    }

    @PostMapping("/cancel-hold")
    public ResponseEntity<ApiResponse<Void>> cancelHold(@RequestBody Map<String, String> payload) {
        String ticketId = payload.get("ticketId");
        bookingService.cancelHold(ticketId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Đã hủy giữ chỗ và giải phóng ghế"));
    }

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<Ticket>> processPayment(@RequestBody Map<String, Object> payload) {
        String ticketId = (String) payload.get("ticketId");
        String paymentMethod = (String) payload.getOrDefault("paymentMethod", "BANKING");

        Ticket ticket = bookingService.processPayment(ticketId, paymentMethod);
        return ResponseEntity.ok(ApiResponse.ok(ticket, "Thanh toán và xuất vé thành công!"));
    }
}