package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.*;
import exception.SeatAlreadyBookedException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BookingService {

    private static final double VIP_SURCHARGE = 50000.0;

    /**
     * Hàm lõi xử lý Đặt vé và Thanh toán
     * @param customer: Khách hàng đặt vé
     * @param trip: Chuyến xe đang chọn
     * @param selectedSeat: Ghế khách đã chọn
     * @param basePrice: Giá vé gốc của chuyến đó
     * @param discountPolicy: Chính sách giảm giá (Truyền vào Đa hình)
     * @param paymentMethod: Phương thức thanh toán (Truyền vào Đa hình)
     */
    public Booking processBooking(
            Customer customer,
            BusTrip trip,
            Seat selectedSeat,
            double basePrice,
            DiscountPolicy discountPolicy,
            PaymentMethod paymentMethod) {

       if ("Đã đặt".equalsIgnoreCase(selectedSeat.getStatus()) || "Booked".equalsIgnoreCase(selectedSeat.getStatus())) {
            throw new SeatAlreadyBookedException("Ghế " + selectedSeat.getSeatNumber() + " đã có người đặt!");
        }

        double finalPrice = basePrice;

         if ("VIP".equalsIgnoreCase(selectedSeat.getSeatType())) {
            finalPrice += VIP_SURCHARGE;
        }

        if (discountPolicy != null) {
            double discountAmount = discountPolicy.calculateDiscount(finalPrice);
            finalPrice -= discountAmount;
        }

        boolean isPaid = paymentMethod.pay(finalPrice);

        if (!isPaid) {
            throw new RuntimeException("Thanh toán thất bại! Vui lòng thử lại.");
        }

        selectedSeat.setStatus("Đã đặt");

        Ticket newTicket = new Ticket();
        newTicket.setTicketId("TKT-" + UUID.randomUUID().toString().substring(0,8));
        newTicket.setCustomer(customer);
        newTicket.setTrip(trip);
        newTicket.setSeat(selectedSeat);
        newTicket.setPrice(finalPrice);

        List<Ticket> tickets = new ArrayList<>();
        tickets.add(newTicket);

        Booking newBooking = new Booking();
        newBooking.setBookingId("BKG-" + UUID.randomUUID().toString().substring(0,8));
        newBooking.setCustomer(customer);
        newBooking.setTickets(tickets);
        newBooking.setTotalAmount(finalPrice);
        newBooking.setBookingTime(java.time.LocalDateTime.now().toString());

        return newBooking;
    }
}