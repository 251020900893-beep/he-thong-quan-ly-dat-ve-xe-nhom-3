package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Ticket;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class TicketRepository {
    private static final String FILE_PATH = "data/tickets.json";
    private static final String DEFAULT_RESOURCE = "/default-data/tickets.json";
    private final FileManager fileManager = new FileManager();
    private final Type listType = new TypeToken<List<Ticket>>() {}.getType();

    public List<Ticket> findAll() {
        List<Ticket> list = fileManager.readList(FILE_PATH, listType);
        return (list != null) ? list : new ArrayList<>();
    }

    public List<Ticket> findDefaults() {
        return fileManager.readResourceList(DEFAULT_RESOURCE, listType);
    }

    public Ticket findById(String id) {
        return findAll().stream()
                .filter(t -> t.getTicketId() != null && t.getTicketId().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
    }

    public void save(Ticket ticket) {
        fileManager.<Ticket, Void>updateList(FILE_PATH, listType, list -> {
            boolean duplicate = list.stream().anyMatch(existing ->
                    existing.getTicketId() != null
                            && existing.getTicketId().equalsIgnoreCase(ticket.getTicketId()));
            if (duplicate) {
                throw new IllegalArgumentException("Mã vé đã tồn tại: " + ticket.getTicketId());
            }
            list.add(ticket);
            return null;
        });
    }

    public void update(Ticket ticket) {
        fileManager.<Ticket, Boolean>updateList(FILE_PATH, listType, list -> {
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).getTicketId() != null
                        && list.get(i).getTicketId().equalsIgnoreCase(ticket.getTicketId())) {
                    list.set(i, ticket);
                    return true;
                }
            }
            return false;
        });
    }

    public void delete(String id) {
        fileManager.<Ticket, Boolean>updateList(FILE_PATH, listType, list ->
                list.removeIf(t -> t.getTicketId() != null && t.getTicketId().equalsIgnoreCase(id)));
    }

    public boolean hasPaidTicketForSeat(String tripId, String seatNumber, String excludingTicketId) {
        return findAll().stream().anyMatch(ticket ->
                "PAID".equalsIgnoreCase(ticket.getStatus())
                        && ticket.getTrip() != null
                        && ticket.getSeat() != null
                        && tripId.equals(ticket.getTrip().getTripId())
                        && seatNumber.equals(ticket.getSeat().getSeatNumber())
                        && !ticket.getTicketId().equalsIgnoreCase(excludingTicketId));
    }

    public void replaceAll(List<Ticket> tickets) {
        fileManager.writeList(FILE_PATH, new ArrayList<>(tickets));
    }
}
