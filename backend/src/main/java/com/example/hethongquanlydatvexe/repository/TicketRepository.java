package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Ticket;

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

    public void save(Ticket ticket) {

        List<Ticket> tickets = findAll();

        tickets.add(ticket);

        fileManager.writeList(FILE_PATH, tickets);
    }

    public boolean update(Ticket ticket) {

        List<Ticket> tickets = findAll();

        for (int i = 0; i < tickets.size(); i++) {

            if (tickets.get(i).getTicketId().equals(ticket.getTicketId())) {

                tickets.set(i, ticket);

                fileManager.writeList(FILE_PATH, tickets);

                return true;
            }

        }

        return false;
    }

    public boolean delete(String ticketId) {

        List<Ticket> tickets = findAll();

        boolean removed = tickets.removeIf(
                ticket -> ticket.getTicketId().equals(ticketId)
        );

        if (removed) {
            fileManager.writeList(FILE_PATH, tickets);
        }

        return removed;
    }

    public boolean exists(String ticketId) {
        return findById(ticketId) != null;
    }

    public int count() {
        return findAll().size();
    }

}