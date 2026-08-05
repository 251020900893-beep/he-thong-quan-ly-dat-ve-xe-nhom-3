package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Ticket;

import java.util.ArrayList;
import java.util.List;

public class TicketRepository {

    private static final String FILE_PATH = "data/tickets.json";

    private final FileManager fileManager = new FileManager();

    public List<Ticket> findAll() {
        return fileManager.readList(
                FILE_PATH,
                FileManager.getListType(Ticket.class)
        );
    }

    public Ticket findById(String ticketId) {
        if (isBlank(ticketId)) {
            return null;
        }

        for (Ticket ticket : findAll()) {
            if (sameText(
                    ticket.getTicketId(),
                    ticketId
            )) {
                return ticket;
            }
        }

        return null;
    }

    public List<Ticket> findByCustomerId(
            String customerId
    ) {
        List<Ticket> result = new ArrayList<>();

        if (isBlank(customerId)) {
            return result;
        }

        for (Ticket ticket : findAll()) {
            if (ticket.getCustomer() != null
                    && sameText(
                    ticket.getCustomer().getId(),
                    customerId
            )) {
                result.add(ticket);
            }
        }

        return result;
    }

    public List<Ticket> findByTripId(
            String tripId
    ) {
        List<Ticket> result = new ArrayList<>();

        if (isBlank(tripId)) {
            return result;
        }

        for (Ticket ticket : findAll()) {
            if (ticket.getTrip() != null
                    && sameText(
                    ticket.getTrip().getTripId(),
                    tripId
            )) {
                result.add(ticket);
            }
        }

        return result;
    }

    public Ticket findByTripIdAndSeatId(
            String tripId,
            String seatId
    ) {
        if (isBlank(tripId)
                || isBlank(seatId)) {

            return null;
        }

        for (Ticket ticket : findAll()) {
            boolean correctTrip =
                    ticket.getTrip() != null
                            && sameText(
                            ticket.getTrip().getTripId(),
                            tripId
                    );

            boolean correctSeat =
                    ticket.getSeat() != null
                            && sameText(
                            ticket.getSeat().getSeatId(),
                            seatId
                    );

            if (correctTrip && correctSeat) {
                return ticket;
            }
        }

        return null;
    }

    public Ticket findByTripIdAndSeatNumber(
            String tripId,
            String seatNumber
    ) {
        if (isBlank(tripId)
                || isBlank(seatNumber)) {

            return null;
        }

        for (Ticket ticket : findAll()) {
            boolean correctTrip =
                    ticket.getTrip() != null
                            && sameText(
                            ticket.getTrip().getTripId(),
                            tripId
                    );

            boolean correctSeatNumber =
                    ticket.getSeat() != null
                            && sameText(
                            ticket.getSeat().getSeatNumber(),
                            seatNumber
                    );

            if (correctTrip && correctSeatNumber) {
                return ticket;
            }
        }

        return null;
    }

    public void save(Ticket ticket) {
        List<Ticket> tickets = findAll();

        tickets.add(ticket);

        fileManager.writeList(
                FILE_PATH,
                tickets
        );
    }

    public boolean update(Ticket ticket) {
        if (ticket == null
                || isBlank(ticket.getTicketId())) {

            return false;
        }

        List<Ticket> tickets = findAll();

        for (int i = 0; i < tickets.size(); i++) {
            Ticket currentTicket = tickets.get(i);

            if (sameText(
                    currentTicket.getTicketId(),
                    ticket.getTicketId()
            )) {
                tickets.set(i, ticket);

                fileManager.writeList(
                        FILE_PATH,
                        tickets
                );

                return true;
            }
        }

        return false;
    }

    public boolean delete(String ticketId) {
        if (isBlank(ticketId)) {
            return false;
        }

        List<Ticket> tickets = findAll();

        boolean removed = tickets.removeIf(
                ticket -> sameText(
                        ticket.getTicketId(),
                        ticketId
                )
        );

        if (removed) {
            fileManager.writeList(
                    FILE_PATH,
                    tickets
            );
        }

        return removed;
    }

    public boolean exists(String ticketId) {
        return findById(ticketId) != null;
    }

    public boolean seatHasTicket(
            String tripId,
            String seatNumber
    ) {
        return findByTripIdAndSeatNumber(
                tripId,
                seatNumber
        ) != null;
    }

    public int count() {
        return findAll().size();
    }

    public int countByCustomerId(
            String customerId
    ) {
        return findByCustomerId(
                customerId
        ).size();
    }

    public int countByTripId(
            String tripId
    ) {
        return findByTripId(
                tripId
        ).size();
    }

    private boolean sameText(
            String firstValue,
            String secondValue
    ) {
        return firstValue != null
                && secondValue != null
                && firstValue.trim()
                .equalsIgnoreCase(secondValue.trim());
    }

    private boolean isBlank(String value) {
        return value == null
                || value.trim().isEmpty();
    }
}