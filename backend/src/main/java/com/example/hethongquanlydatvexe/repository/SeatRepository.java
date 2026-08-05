package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Seat;

import java.util.ArrayList;
import java.util.List;

public class SeatRepository {

    private static final String FILE_PATH = "data/seats.json";

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
        List<Seat> seats = findAll();

        seats.add(seat);

        fileManager.writeList(FILE_PATH, seats);
    }

    public boolean update(Seat seat) {
        List<Seat> seats = findAll();

        for (int i = 0; i < seats.size(); i++) {
            if (seats.get(i).getSeatId().equals(seat.getSeatId())) {
                seats.set(i, seat);

                fileManager.writeList(FILE_PATH, seats);

                return true;
            }
        }

        return false;
    }

    public boolean updateStatus(
            String seatId,
            String status
    ) {
        List<Seat> seats = findAll();

        for (Seat seat : seats) {
            if (seat.getSeatId().equals(seatId)) {
                seat.setStatus(status);

                fileManager.writeList(FILE_PATH, seats);

                return true;
            }
        }

        return false;
    }

    public boolean delete(String seatId) {
        List<Seat> seats = findAll();

        for (int i = 0; i < seats.size(); i++) {
            if (seats.get(i).getSeatId().equals(seatId)) {
                seats.remove(i);

                fileManager.writeList(FILE_PATH, seats);

                return true;
            }
        }

        return false;
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