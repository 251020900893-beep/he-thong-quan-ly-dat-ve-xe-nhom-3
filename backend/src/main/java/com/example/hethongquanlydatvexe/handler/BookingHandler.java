package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Booking;
import com.example.hethongquanlydatvexe.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingHandler {

    private final BookingService bookingService = new BookingService();

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            // Khởi tạo phương thức thanh toán dựa vào dữ liệu FE gửi lên
            PaymentMethod paymentMethod;
            String methodType = request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "";

            switch (methodType) {
                case "CASH":
                case "TIEN_MAT":
                    paymentMethod = new CashPayment();
                    break;
                case "BANKING":
                case "CHUYEN_KHOAN":
                    paymentMethod = new BankingPayment();
                    break;
                case "E_WALLET":
                case "MOMO":
                case "VI_DIEN_TU":
                    paymentMethod = new EWalletPayment();
                    break;
                default:
                    throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ!");
            }

            Booking booking = bookingService.processBooking(
                    request.getCustomer(),
                    request.getTrip(),
                    request.getSeat(),
                    request.getBasePrice(),
                    new StandardDiscount(0),
                    paymentMethod
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(booking);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}