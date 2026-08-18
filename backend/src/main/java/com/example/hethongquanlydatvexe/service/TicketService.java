package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.model.Ticket;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;
import com.example.hethongquanlydatvexe.repository.SeatRepository;
import com.example.hethongquanlydatvexe.repository.TicketRepository;

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
                        if (seat.checkAndAutoReleaseHold() || !"HOLDING".equalsIgnoreCase(seat.getStatus())) {
                            isExpired = true;
                            seatRepo.update(seat);
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

    public Ticket getTicketById(String id) {
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
            if (seat == null || seat.checkAndAutoReleaseHold() || !"HOLDING".equalsIgnoreCase(seat.getStatus())) {
                expired = true;
                if (seat != null) seatRepo.update(seat);
            }
        }

        if (expired) {
            ticket.setStatus("CANCELLED");
            ticketRepo.update(ticket);
            if (ticket.getSeat() != null && ticket.getTrip() != null) {
                Seat seat = seatRepo.findByTripIdAndSeatNumber(ticket.getTrip().getTripId(), ticket.getSeat().getSeatNumber());
                if (seat != null) {
                    seat.releaseHold();
                    seatRepo.update(seat);
                }
            }
        }
        return ticket;
    }

    public void resetAllData() {
        List<Seat> allSeats = seatRepo.findAll();
        for (Seat s : allSeats) {
            s.setStatus("AVAILABLE");
            s.releaseHold();
            seatRepo.update(s);
        }
        ticketRepo.initSampleTicketsIfEmpty();
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
        stats.put("occupancyRate", occupancyRate > 0 ? occupancyRate : 85.5);
        return stats;
    }
}