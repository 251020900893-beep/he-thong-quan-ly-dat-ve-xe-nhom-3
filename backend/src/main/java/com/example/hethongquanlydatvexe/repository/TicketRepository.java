package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.model.Customer;
import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.model.Ticket;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class TicketRepository {
    private static final String FILE_PATH = "data/tickets.json";
    private final FileManager fileManager = new FileManager();
    private final Type listType = new TypeToken<List<Ticket>>() {}.getType();

    public List<Ticket> findAll() {
        List<Ticket> list = fileManager.readList(FILE_PATH, listType);
        return (list != null) ? list : new ArrayList<>();
    }

    public Ticket findById(String id) {
        return findAll().stream()
                .filter(t -> t.getTicketId() != null && t.getTicketId().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
    }

    public void save(Ticket ticket) {
        List<Ticket> list = findAll();
        list.add(ticket);
        fileManager.writeList(FILE_PATH, list);
    }

    public void update(Ticket ticket) {
        List<Ticket> list = findAll();
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getTicketId() != null && list.get(i).getTicketId().equalsIgnoreCase(ticket.getTicketId())) {
                list.set(i, ticket);
                fileManager.writeList(FILE_PATH, list);
                return;
            }
        }
    }

    public void delete(String id) {
        List<Ticket> list = findAll();
        boolean removed = list.removeIf(t -> t.getTicketId() != null && t.getTicketId().equalsIgnoreCase(id));
        if (removed) {
            fileManager.writeList(FILE_PATH, list);
        }
    }

    public void initSampleTicketsIfEmpty() {
        List<Ticket> sampleTickets = new ArrayList<>();

        Customer c1 = new Customer("KH001", "Nguyễn Văn Hùng", "0912345678", "hung.nguyen@gmail.com", "VIP");
        BusTrip trip1 = new BusTrip();
        trip1.setTripId("CX001");
        trip1.setTripCode("HN-HP-0630");
        trip1.setDeparture("Hà Nội (BX Mỹ Đình)");
        trip1.setDestination("Hải Phòng (BX Vĩnh Niệm)");
        trip1.setDepartureTime("06:30");
        trip1.setArrivalTime("08:00");
        trip1.setLicensePlate("29B-688.88");
        trip1.setBusType("Limousine VIP 9 Chỗ");
        trip1.setBasePrice(230000.0);
        trip1.setTotalSeats(9);

        Seat s1 = new Seat("CX001-S03", "CX001", "B1", "VIP", 50000.0, "BOOKED", null, null, "VE-0001");
        Ticket t1 = new Ticket("VE-HNHP0700-B1-1024", c1, trip1, s1, 216000.0);
        t1.setStatus("PAID");
        t1.setPaymentMethod("BANKING");
        t1.setCreatedAt(Instant.now().toString());
        t1.setPaidAt(Instant.now().toString());
        sampleTickets.add(t1);

        Customer c2 = new Customer("KH002", "Trần Thị Mai", "0987654321", "mai.tran@gmail.com", "MEMBER");
        BusTrip trip2 = new BusTrip();
        trip2.setTripId("CX008");
        trip2.setTripCode("HP-HN-0830");
        trip2.setDeparture("Hải Phòng (BX Vĩnh Niệm)");
        trip2.setDestination("Hà Nội (BX Giáp Bát)");
        trip2.setDepartureTime("08:30");
        trip2.setArrivalTime("10:00");
        trip2.setLicensePlate("15B-666.99");
        trip2.setBusType("Limousine Luxury 12 Chỗ");
        trip2.setBasePrice(240000.0);
        trip2.setTotalSeats(12);

        Seat s2 = new Seat("CX008-B2", "CX008", "B2", "VIP", 50000.0, "BOOKED", null, null, "VE-0002");
        Ticket t2 = new Ticket("VE-HPHN0800-B2-3523", c2, trip2, s2, 252000.0);
        t2.setStatus("PAID");
        t2.setPaymentMethod("E_WALLET");
        t2.setCreatedAt(Instant.now().toString());
        t2.setPaidAt(Instant.now().toString());
        sampleTickets.add(t2);

        fileManager.writeList(FILE_PATH, sampleTickets);
    }
}