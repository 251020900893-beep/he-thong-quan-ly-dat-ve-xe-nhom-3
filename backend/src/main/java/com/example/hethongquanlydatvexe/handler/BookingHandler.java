package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Booking;
import com.example.hethongquanlydatvexe.service.BookingService;
import com.example.hethongquanlydatvexe.service.StandardDiscount;
import com.example.hethongquanlydatvexe.service.PaymentMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingHandler {

    private final BookingService bookingService =
            new BookingService();

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest request) {

        try {

            Booking booking =
                    bookingService.processBooking(
                            request.getCustomer(),
                            request.getTrip(),
                            request.getSeat(),
                            request.getBasePrice(),
                            new StandardDiscount(0),
                            new PaymentMethod() {
                                @Override
                                public boolean pay(double amount) {
                                    return true;
                                }
                            }
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(booking);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }
}