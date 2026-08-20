package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.model.Ticket;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;
import com.example.hethongquanlydatvexe.repository.SeatRepository;
import com.example.hethongquanlydatvexe.repository.TicketRepository;
import com.example.hethongquanlydatvexe.exception.BusinessRuleException;
import com.example.hethongquanlydatvexe.utils.BookingLock;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class TicketService {

    private final TicketRepository ticketRepo = new TicketRepository();
    private final SeatRepository seatRepo = new SeatRepository();
    private final BusTripRepository tripRepo = new BusTripRepository();

    public List<Ticket> searchTickets(String query) {
        synchronized (BookingLock.LOCK) {
            List<Ticket> allTickets = ticketRepo.findAll();
            List<Ticket> expiredTickets = new ArrayList<>();

        for (Ticket t : allTickets) {
            if ("HOLDING".equalsIgnoreCase(t.getStatus())) {
                boolean isExpired = false;

                if (t.getExpiresAt() != null) {
                    try {
                        Instant exp = Instant.parse(t.getExpiresAt());
                        if (Instant.now().isAfter(exp)) {
                            isExpired = true;
                        }
                    } catch (Exception ignored) {}
                }

                if (t.getSeat() != null && t.getTrip() != null) {
                    Seat seat = seatRepo.findByTripIdAndSeatNumber(t.getTrip().getTripId(), t.getSeat().getSeatNumber());
                    if (seat != null) {
                        boolean owned = seat.isHeldBy(t.getTicketId());
                        if (!owned || seat.checkAndAutoReleaseHold() || !"HOLDING".equalsIgnoreCase(seat.getStatus())) {
                            isExpired = true;
                            if (owned) seatRepo.update(seat);
                        }
                    }
                }

                if (isExpired) {
                    t.setStatus("CANCELLED");
                    expiredTickets.add(t);
                }
            }
        }

        for (Ticket t : expiredTickets) {
            ticketRepo.update(t);
        }

            String q = (query != null) ? query.trim().toLowerCase() : "";
            return allTickets.stream()
                .filter(t -> q.isEmpty() ||
                        (t.getTicketId() != null && t.getTicketId().toLowerCase().contains(q)) ||
                        (t.getCustomer() != null && t.getCustomer().getPhone() != null && t.getCustomer().getPhone().contains(q)) ||
                        (t.getCustomer() != null && t.getCustomer().getFullName() != null && t.getCustomer().getFullName().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }
    }

    public Ticket getTicketById(String id) {
        synchronized (BookingLock.LOCK) {
            Ticket ticket = ticketRepo.findById(id);
        if (ticket == null) return null;
        if (!"HOLDING".equalsIgnoreCase(ticket.getStatus())) return ticket;

        boolean expired = false;
        if (ticket.getExpiresAt() == null || ticket.getExpiresAt().isBlank()) {
            expired = true;
        } else {
            try {
                Instant exp = Instant.parse(ticket.getExpiresAt());
                expired = !Instant.now().isBefore(exp);
            } catch (Exception ex) {
                expired = true;
            }
        }

        if (!expired && ticket.getSeat() != null && ticket.getTrip() != null) {
            Seat seat = seatRepo.findByTripIdAndSeatNumber(ticket.getTrip().getTripId(), ticket.getSeat().getSeatNumber());
            boolean owned = seat != null && seat.isHeldBy(ticket.getTicketId());
            if (!owned || seat.checkAndAutoReleaseHold() || !"HOLDING".equalsIgnoreCase(seat.getStatus())) {
                expired = true;
                if (owned) seatRepo.update(seat);
            }
        }

        if (expired) {
            ticket.setStatus("CANCELLED");
            ticketRepo.update(ticket);
            if (ticket.getSeat() != null && ticket.getTrip() != null) {
                Seat seat = seatRepo.findByTripIdAndSeatNumber(ticket.getTrip().getTripId(), ticket.getSeat().getSeatNumber());
                if (seat != null && seat.isHeldBy(ticket.getTicketId())) {
                    seat.releaseHold(ticket.getTicketId());
                    seatRepo.update(seat);
                }
            }
        }
            return ticket;
        }
    }

    public void resetAllData() {
        synchronized (BookingLock.LOCK) {
            List<Ticket> tickets = ticketRepo.findDefaults();
            List<Seat> seats = seatRepo.findDefaults();
            Map<String, Long> paidPerSeat = tickets.stream()
                    .filter(t -> "PAID".equalsIgnoreCase(t.getStatus()) && t.getTrip() != null && t.getSeat() != null)
                    .collect(Collectors.groupingBy(
                            t -> t.getTrip().getTripId() + "|" + t.getSeat().getSeatNumber(),
                            Collectors.counting()));
            if (paidPerSeat.values().stream().anyMatch(count -> count > 1)) {
                throw new BusinessRuleException("Dữ liệu mặc định có nhiều vé PAID trùng ghế!");
            }

            for (Ticket ticket : tickets) {
                if ("PAID".equalsIgnoreCase(ticket.getStatus())
                        && ticket.getTrip() != null && ticket.getSeat() != null) {
                    Seat seat = seats.stream().filter(candidate ->
                                    candidate.getTripId().equals(ticket.getTrip().getTripId())
                                            && candidate.getSeatNumber().equals(ticket.getSeat().getSeatNumber()))
                            .findFirst()
                            .orElseThrow(() -> new BusinessRuleException("Vé PAID mặc định tham chiếu ghế không tồn tại!"));
                    if (!"BOOKED".equalsIgnoreCase(seat.getStatus())
                            || !ticket.getTicketId().equalsIgnoreCase(seat.getBookedTicketId())) {
                        throw new BusinessRuleException("Dữ liệu mặc định Ticket/Seat không nhất quán!");
                    }
                }
            }
            seatRepo.restoreDefaultsWithTickets(seats, tickets);
        }
    }

    public Map<String, Object> getStaffDashboardStats() {
        List<Ticket> tickets = ticketRepo.findAll();
        double totalRevenue = tickets.stream()
                .filter(t -> "PAID".equalsIgnoreCase(t.getStatus()))
                .mapToDouble(Ticket::getPrice)
                .sum();
        long paidCount = tickets.stream().filter(t -> "PAID".equalsIgnoreCase(t.getStatus())).count();

        // Tính tỷ lệ lấp đầy động theo tổng số ghế thực tế
        List<BusTrip> trips = tripRepo.findAll();
        int totalSeats = trips.stream().mapToInt(BusTrip::getTotalSeats).sum();
        double occupancyRate = totalSeats > 0 ? Math.round(((double) paidCount / totalSeats) * 1000.0) / 10.0 : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalTicketsBooked", paidCount);
        stats.put("occupancyRate", occupancyRate);
        return stats;
    }
}
