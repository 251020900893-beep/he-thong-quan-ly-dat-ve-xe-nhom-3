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
        if (isBlank(seatId)) {
            return null;
        }

        for (Seat seat : findAll()) {
            if (sameText(
                    seat.getSeatId(),
                    seatId
            )) {
                return seat;
            }
        }

        return null;
    }

    public List<Seat> findByTripId(String tripId) {
        List<Seat> result = new ArrayList<>();

        if (isBlank(tripId)) {
            return result;
        }

        for (Seat seat : findAll()) {
            if (sameText(
                    seat.getTripId(),
                    tripId
            )) {
                result.add(seat);
            }
        }

        return result;
    }

    public Seat findByTripIdAndSeatNumber(
            String tripId,
            String seatNumber
    ) {
        if (isBlank(tripId)
                || isBlank(seatNumber)) {

            return null;
        }

        for (Seat seat : findAll()) {
            boolean correctTrip =
                    sameText(
                            seat.getTripId(),
                            tripId
                    );

            boolean correctSeatNumber =
                    sameText(
                            seat.getSeatNumber(),
                            seatNumber
                    );

            if (correctTrip && correctSeatNumber) {
                return seat;
            }
        }

        return null;
    }

    public List<Seat> findByStatus(String status) {
        List<Seat> result = new ArrayList<>();

        if (isBlank(status)) {
            return result;
        }

        for (Seat seat : findAll()) {
            if (sameText(
                    seat.getStatus(),
                    status
            )) {
                result.add(seat);
            }
        }

        return result;
    }

    public List<Seat> findByTripIdAndStatus(
            String tripId,
            String status
    ) {
        List<Seat> result = new ArrayList<>();

        if (isBlank(tripId)
                || isBlank(status)) {

            return result;
        }

        for (Seat seat : findAll()) {
            boolean correctTrip =
                    sameText(
                            seat.getTripId(),
                            tripId
                    );

            boolean correctStatus =
                    sameText(
                            seat.getStatus(),
                            status
                    );

            if (correctTrip && correctStatus) {
                result.add(seat);
            }
        }

        return result;
    }

    public void save(Seat seat) {
        List<Seat> seats = findAll();

        seats.add(seat);

        fileManager.writeList(
                FILE_PATH,
                seats
        );
    }

    public boolean update(Seat seat) {
        if (seat == null
                || isBlank(seat.getSeatId())) {

            return false;
        }

        List<Seat> seats = findAll();

        for (int i = 0; i < seats.size(); i++) {
            Seat currentSeat = seats.get(i);

            if (sameText(
                    currentSeat.getSeatId(),
                    seat.getSeatId()
            )) {
                seats.set(i, seat);

                fileManager.writeList(
                        FILE_PATH,
                        seats
                );

                return true;
            }
        }

        return false;
    }

    public boolean updateStatus(
            String seatId,
            String status
    ) {
        if (isBlank(seatId)
                || isBlank(status)) {

            return false;
        }

        List<Seat> seats = findAll();

        for (Seat seat : seats) {
            if (sameText(
                    seat.getSeatId(),
                    seatId
            )) {
                seat.setStatus(status.trim());

                fileManager.writeList(
                        FILE_PATH,
                        seats
                );

                return true;
            }
        }

        return false;
    }

    public boolean delete(String seatId) {
        if (isBlank(seatId)) {
            return false;
        }

        List<Seat> seats = findAll();

        boolean removed = seats.removeIf(
                seat -> sameText(
                        seat.getSeatId(),
                        seatId
                )
        );

        if (removed) {
            fileManager.writeList(
                    FILE_PATH,
                    seats
            );
        }

        return removed;
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

    public int count() {
        return findAll().size();
    }

    public int countByTripId(String tripId) {
        return findByTripId(tripId).size();
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