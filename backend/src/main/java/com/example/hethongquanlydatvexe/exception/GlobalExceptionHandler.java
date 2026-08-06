package com.example.hethongquanlydatvexe.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Không tìm thấy Chuyến xe -> HTTP 404
    @ExceptionHandler(TripNotFoundException.class)
    public ResponseEntity<String> handleTripNotFound(TripNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 2. Không tìm thấy Khách hàng -> HTTP 404
    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<String> handleCustomerNotFound(CustomerNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 3. Ghế đã bị người khác đặt -> HTTP 409 (Conflict)
    @ExceptionHandler(SeatAlreadyBookedException.class)
    public ResponseEntity<String> handleSeatAlreadyBooked(SeatAlreadyBookedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // 4. Ghế không tồn tại -> HTTP 404
    @ExceptionHandler(SeatNotFoundException.class)
    public ResponseEntity<String> handleSeatNotFound(SeatNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 5. Vé không tồn tại -> HTTP 404
    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<String> handleTicketNotFound(TicketNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 6. Thanh toán thất bại -> HTTP 400 (Bad Request)
    @ExceptionHandler(PaymentFailedException.class)
    public ResponseEntity<String> handlePaymentFailed(PaymentFailedException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 7. Lỗi hệ thống không lường trước -> HTTP 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Đã xảy ra lỗi hệ thống: " + ex.getMessage());
    }
}