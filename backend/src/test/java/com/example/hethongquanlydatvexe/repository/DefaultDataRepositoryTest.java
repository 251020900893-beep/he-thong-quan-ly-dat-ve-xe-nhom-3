package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.model.Ticket;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DefaultDataRepositoryTest {

    @Test
    void defaultTicketsAndSeatsAreStableAndConsistent() {
        List<Ticket> tickets = new TicketRepository().findDefaults();
        List<Seat> seats = new SeatRepository().findDefaults();

        assertEquals(36, tickets.size());
        assertEquals(126, seats.size());
        assertFalse(tickets.stream().anyMatch(ticket ->
                "VE-HNHP0700-B1-1024".equals(ticket.getTicketId())
                        || "VE-HPHN0800-B2-3523".equals(ticket.getTicketId())));

        Set<String> ticketIds = new HashSet<>();
        Set<String> paidSeats = new HashSet<>();
        for (Ticket ticket : tickets) {
            assertTrue(ticketIds.add(ticket.getTicketId()), "Duplicate ticket ID: " + ticket.getTicketId());
            if ("PAID".equalsIgnoreCase(ticket.getStatus())) {
                String seatKey = ticket.getTrip().getTripId() + "|" + ticket.getSeat().getSeatNumber();
                assertTrue(paidSeats.add(seatKey), "Duplicate PAID seat: " + seatKey);
                Seat seat = seats.stream()
                        .filter(candidate -> candidate.getTripId().equals(ticket.getTrip().getTripId())
                                && candidate.getSeatNumber().equals(ticket.getSeat().getSeatNumber()))
                        .findFirst()
                        .orElse(null);
                assertNotNull(seat, "Missing seat for ticket: " + ticket.getTicketId());
                assertEquals("BOOKED", seat.getStatus());
                assertEquals(ticket.getTicketId(), seat.getBookedTicketId());
            }
        }

        assertEquals(24, paidSeats.size());
        assertEquals(102, seats.stream().filter(seat -> "AVAILABLE".equals(seat.getStatus())).count());
        assertEquals(24, seats.stream().filter(seat -> "BOOKED".equals(seat.getStatus())).count());
        assertEquals(0, seats.stream().filter(seat -> "HOLDING".equals(seat.getStatus())).count());
        assertTrue(seats.stream().allMatch(seat -> seat.getHoldingCustomerId() == null
                && seat.getHoldingTicketId() == null
                && seat.getHoldingExpiresAt() == null));
    }
}
