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
        List<Ticket> tickets = findAll();

        for (Ticket ticket : tickets) {
            if (ticket.getTicketId().equals(ticketId)) {
                return ticket;
            }
        }

        return null;
    }

    public List<Ticket> findByCustomerId(String customerId) {
        List<Ticket> result = new ArrayList<>();
        List<Ticket> tickets = findAll();

        for (Ticket ticket : tickets) {
            if (ticket.getCustomer() != null
                    && ticket.getCustomer().getId().equals(customerId)) {
                result.add(ticket);
            }
        }

        return result;
    }

    public List<Ticket> findByTripId(String tripId) {
        List<Ticket> result = new ArrayList<>();
        List<Ticket> tickets = findAll();

        for (Ticket ticket : tickets) {
            if (ticket.getTrip() != null
                    && ticket.getTrip().getTripId().equals(tripId)) {
                result.add(ticket);
            }
        }

        return result;
    }

    public void save(Ticket ticket) {
        List<Ticket> tickets = findAll();

        tickets.add(ticket);

        fileManager.writeList(FILE_PATH, tickets);
    }

    public boolean update(Ticket ticket) {
        List<Ticket> tickets = findAll();

        for (int i = 0; i < tickets.size(); i++) {
            if (tickets.get(i).getTicketId()
                    .equals(ticket.getTicketId())) {

                tickets.set(i, ticket);
                fileManager.writeList(FILE_PATH, tickets);

                return true;
            }
        }

        return false;
    }

    public boolean delete(String ticketId) {
        List<Ticket> tickets = findAll();

        for (int i = 0; i < tickets.size(); i++) {
            if (tickets.get(i).getTicketId().equals(ticketId)) {
                tickets.remove(i);
                fileManager.writeList(FILE_PATH, tickets);

                return true;
            }
        }

        return false;
    }

    public boolean exists(String ticketId) {
        return findById(ticketId) != null;
    }
}