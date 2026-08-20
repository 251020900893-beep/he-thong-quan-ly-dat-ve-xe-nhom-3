package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Seat;

import java.util.ArrayList;
import java.util.List;

public class SeatRepository {

    private static final String FILE_PATH = "data/seats.json";
    private static final String DEFAULT_RESOURCE = "/default-data/seats.json";

    private final FileManager fileManager = new FileManager();

    public List<Seat> findAll() {
        return fileManager.readList(
                FILE_PATH,
                FileManager.getListType(Seat.class)
        );
    }

    public Seat findById(String seatId) {
        List<Seat> seats = findAll();

        for (Seat seat : seats) {
            if (seat.getSeatId().equals(seatId)) {
                return seat;
            }
        }

        return null;
    }

    public List<Seat> findByTripId(String tripId) {
        List<Seat> result = new ArrayList<>();
        List<Seat> seats = findAll();

        for (Seat seat : seats) {
            if (seat.getTripId().equals(tripId)) {
                result.add(seat);
            }
        }

        return result;
    }

    public Seat findByTripIdAndSeatNumber(
            String tripId,
            String seatNumber
    ) {
        List<Seat> seats = findAll();

        for (Seat seat : seats) {
            if (seat.getTripId().equals(tripId)
                    && seat.getSeatNumber().equals(seatNumber)) {
                return seat;
            }
        }

        return null;
    }

    public void save(Seat seat) {
        fileManager.<Seat, Void>updateList(FILE_PATH, FileManager.getListType(Seat.class), seats -> {
            seats.add(seat);
            return null;
        });
    }

    public boolean update(Seat seat) {
        return fileManager.<Seat, Boolean>updateList(FILE_PATH, FileManager.getListType(Seat.class), seats -> {
            for (int i = 0; i < seats.size(); i++) {
                if (seats.get(i).getSeatId().equals(seat.getSeatId())) {
                    seats.set(i, seat);
                    return true;
                }
            }
            return false;
        });
    }

    public boolean updateStatus(
            String seatId,
            String status
    ) {
        return fileManager.<Seat, Boolean>updateList(FILE_PATH, FileManager.getListType(Seat.class), seats -> {
            for (Seat seat : seats) {
                if (seat.getSeatId().equals(seatId)) {
                    seat.setStatus(status);
                    return true;
                }
            }
            return false;
        });
    }

    public boolean delete(String seatId) {
        return fileManager.<Seat, Boolean>updateList(FILE_PATH, FileManager.getListType(Seat.class), seats ->
                seats.removeIf(existing -> existing.getSeatId().equals(seatId)));
    }

    public List<Seat> findDefaults() {
        return fileManager.readResourceList(
                DEFAULT_RESOURCE,
                FileManager.getListType(Seat.class)
        );
    }

    public void restoreDefaultsWithTickets(List<Seat> seats, List<com.example.hethongquanlydatvexe.model.Ticket> tickets) {
        fileManager.replaceTwoLists(
                FILE_PATH, new ArrayList<>(seats),
                "data/tickets.json", new ArrayList<>(tickets)
        );
    }

    public void replaceAll(List<Seat> seats) {
        fileManager.writeList(FILE_PATH, new ArrayList<>(seats));
    }

    public boolean exists(String seatId) {
        return findById(seatId) != null;
    }

    public boolean existsInTrip(
            String tripId,
            String seatNumber
    ) {
        return findByTripIdAndSeatNumber(
                tripId,
                seatNumber
        ) != null;
    }
}
