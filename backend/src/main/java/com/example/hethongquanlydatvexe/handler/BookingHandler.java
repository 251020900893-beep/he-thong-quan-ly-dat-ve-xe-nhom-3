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
        String tripId = requiredString(payload, "tripId", 50);
        String seatNumber = requiredString(payload, "seatNumber", 20);
        String customerName = requiredString(payload, "customerName", 100);
        String customerPhone = requiredString(payload, "customerPhone", 20);
        String customerEmail = optionalString(payload, "customerEmail", 254, "");
        String customerType = optionalString(payload, "customerType", 20, "NORMAL").toUpperCase();
        String paymentMethod = optionalString(payload, "paymentMethod", 20, "BANKING").toUpperCase();

        if (!customerPhone.matches("0\\d{9}")) {
            throw new IllegalArgumentException("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0");
        }
        if (!customerEmail.isEmpty() && !customerEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }
        if (!customerType.matches("NORMAL|MEMBER|VIP")) {
            throw new IllegalArgumentException("Loại khách hàng không hợp lệ");
        }
        validatePaymentMethod(paymentMethod);

        Ticket ticket = bookingService.holdSeat(tripId, seatNumber, customerName, customerPhone, customerEmail, customerType, paymentMethod);
        return ResponseEntity.ok(ApiResponse.ok(ticket, "Giữ chỗ 3 phút thành công!"));
    }

    @PostMapping("/cancel-hold")
    public ResponseEntity<ApiResponse<Void>> cancelHold(@RequestBody Map<String, Object> payload) {
        String ticketId = requiredString(payload, "ticketId", 100);
        bookingService.cancelHold(ticketId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Đã hủy giữ chỗ và giải phóng ghế"));
    }

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<Ticket>> processPayment(@RequestBody Map<String, Object> payload) {
        String ticketId = requiredString(payload, "ticketId", 100);
        String paymentMethod = optionalString(payload, "paymentMethod", 20, "BANKING").toUpperCase();
        validatePaymentMethod(paymentMethod);

        Ticket ticket = bookingService.processPayment(ticketId, paymentMethod);
        return ResponseEntity.ok(ApiResponse.ok(ticket, "Thanh toán và xuất vé thành công!"));
    }

    private static String requiredString(Map<String, Object> payload, String field, int maxLength) {
        Object value = payload.get(field);
        if (!(value instanceof String text)) {
            throw new IllegalArgumentException("Trường " + field + " phải là chuỗi");
        }
        String normalized = text.trim();
        if (normalized.isEmpty() || normalized.length() > maxLength) {
            throw new IllegalArgumentException("Trường " + field + " không hợp lệ");
        }
        return normalized;
    }

    private static String optionalString(
            Map<String, Object> payload, String field, int maxLength, String defaultValue) {
        if (!payload.containsKey(field) || payload.get(field) == null) return defaultValue;
        Object value = payload.get(field);
        if (!(value instanceof String text)) {
            throw new IllegalArgumentException("Trường " + field + " phải là chuỗi");
        }
        String normalized = text.trim();
        if (normalized.length() > maxLength) {
            throw new IllegalArgumentException("Trường " + field + " quá dài");
        }
        return normalized.isEmpty() ? defaultValue : normalized;
    }

    private static void validatePaymentMethod(String paymentMethod) {
        if (!paymentMethod.matches("BANKING|BANK_TRANSFER|E_WALLET|CASH")) {
            throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
        }
    }
}
