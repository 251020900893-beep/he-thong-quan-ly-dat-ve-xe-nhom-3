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
import com.example.hethongquanlydatvexe.utils.BookingLock;

import java.time.Instant;

public class BookingService {

    // Khóa JVM tĩnh bảo vệ toàn bộ tiến trình đặt vé - thanh toán - hủy vé chống race condition
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

        synchronized (BookingLock.LOCK) {
            BusTrip trip = tripRepo.findById(tripId);
            if (trip == null) {
                throw new BusinessRuleException("Không tìm thấy chuyến xe: " + tripId);
            }

            Seat seat = seatRepo.findByTripIdAndSeatNumber(tripId, seatNumber);
            if (seat == null) {
                throw new BusinessRuleException("Ghế không tồn tại trong chuyến xe!");
            }

            String ticketId = generateUniqueTicketId(trip, seatNumber);
            Seat originalSeat = copySeat(seat);

            // Seat lưu ticketId để vé cũ không thể tác động hold mới.
            String expiresAt = seat.holdSeat(customerPhone, ticketId, 180);
            seatRepo.update(seat);

            Customer customer = customerRepo.findByPhone(customerPhone);
            boolean newCustomer = customer == null;
            if (customer == null) {
                customer = new Customer(
                        IdGenerator.nextCustomerId(customerRepo.findAll()),
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
            double surcharge = Math.max(0.0, seat.getSurcharge());
            double rawPrice = basePrice + surcharge;
            double discountAmount = discountPolicy.calculateDiscount(rawPrice);
            double finalPrice = rawPrice - discountAmount;

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

            try {
                ticketRepo.save(ticket);
                return ticket;
            } catch (RuntimeException ex) {
                seatRepo.update(originalSeat);
                if (newCustomer) {
                    customerRepo.delete(customer.getId());
                }
                throw ex;
            }
        }
    }

    /**
     * Xử lý thanh toán vé (Chặn vé đã hết hạn 3 phút)
     */
    public Ticket processPayment(String ticketId, String paymentMethodType) {
        synchronized (BookingLock.LOCK) {
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


            Seat seat = requireCurrentlyOwnedSeat(ticket);

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

                seat.releaseHold(ticketId);
                seatRepo.update(seat);
                throw new BusinessRuleException("Thời gian giữ vé 3 phút đã hết. Ghế đã được tự động giải phóng!");
            }

            if (ticketRepo.hasPaidTicketForSeat(
                    ticket.getTrip().getTripId(),
                    ticket.getSeat().getSeatNumber(),
                    ticketId)) {
                throw new BusinessRuleException("Ghế này đã có vé thanh toán hợp lệ!");
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

            Seat originalSeat = copySeat(seat);
            ticket.setStatus("PAID");
            ticket.setPaymentMethod(paymentMethodType);
            ticket.setPaidAt(Instant.now().toString());
            seat.confirmBooking(ticketId, ticket.getCustomer().getPhone());
            ticket.setSeat(seat);

            seatRepo.update(seat);
            try {
                ticketRepo.update(ticket);
            } catch (RuntimeException ex) {
                seatRepo.update(originalSeat);
                throw ex;
            }

            return ticket;
        }
    }

    /**
     * Hủy giữ chỗ vé
     */
    public void cancelHold(String ticketId) {
        synchronized (BookingLock.LOCK) {
            Ticket ticket = ticketRepo.findById(ticketId);
            if (ticket == null) {
                throw new BusinessRuleException("Không tìm thấy mã vé: " + ticketId);
            }

            if (!"HOLDING".equalsIgnoreCase(ticket.getStatus())) {
                throw new BusinessRuleException("Chỉ có thể hủy vé đang giữ chỗ!");
            }

            Seat seat = requireCurrentlyOwnedSeat(ticket);
            Seat originalSeat = copySeat(seat);
            seat.releaseHold(ticketId);
            seatRepo.update(seat);
            ticket.setStatus("CANCELLED");
            try {
                ticketRepo.update(ticket);
            } catch (RuntimeException ex) {
                seatRepo.update(originalSeat);
                throw ex;
            }
        }
    }

    private Seat requireCurrentlyOwnedSeat(Ticket ticket) {
        if (ticket.getTrip() == null || ticket.getSeat() == null || ticket.getCustomer() == null) {
            throw new BusinessRuleException("Vé không có thông tin chuyến, ghế hoặc khách hàng hợp lệ!");
        }
        Seat seat = seatRepo.findByTripIdAndSeatNumber(
                ticket.getTrip().getTripId(), ticket.getSeat().getSeatNumber());
        if (seat == null
                || !seat.isHeldBy(ticket.getTicketId())
                || !ticket.getCustomer().getPhone().equals(seat.getHoldingCustomerId())) {
            throw new BusinessRuleException("Vé không sở hữu lượt giữ ghế hiện tại!");
        }
        return seat;
    }

    private String generateUniqueTicketId(BusTrip trip, String seatNumber) {
        for (int attempt = 0; attempt < 100; attempt++) {
            String ticketId = "VE-"
                    + (trip.getTripCode() != null ? trip.getTripCode().replace("-", "") : "HN0800")
                    + "-" + seatNumber + "-"
                    + ((int) (Math.random() * 9000) + 1000);
            if (ticketRepo.findById(ticketId) == null) {
                return ticketId;
            }
        }
        throw new BusinessRuleException("Không thể tạo mã vé duy nhất. Vui lòng thử lại!");
    }

    private Seat copySeat(Seat source) {
        Seat copy = new Seat(source.getSeatId(), source.getTripId(), source.getSeatNumber(),
                source.getSeatType(), source.getSurcharge(), source.getStatus(),
                source.getHoldingExpiresAt(), source.getHoldingCustomerId(), source.getBookedTicketId());
        copy.setHoldingTicketId(source.getHoldingTicketId());
        return copy;
    }
}
