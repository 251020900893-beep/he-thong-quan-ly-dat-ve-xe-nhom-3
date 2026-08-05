package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;
import com.example.hethongquanlydatvexe.repository.SeatRepository;
import com.example.hethongquanlydatvexe.utils.Constants;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

public class SeatService {

    private final SeatRepository seatRepository =
            new SeatRepository();

    private final BusTripRepository busTripRepository =
            new BusTripRepository();

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public Seat findSeatById(String seatId) {
        Seat seat = seatRepository.findById(seatId);

        if (seat == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy ghế: " + seatId
            );
        }

        return seat;
    }

    public List<Seat> getSeatsByTrip(String tripId) {
        if (!busTripRepository.exists(tripId)) {
            throw new NoSuchElementException(
                    "Chuyến xe không tồn tại"
            );
        }

        return seatRepository.findByTripId(tripId);
    }

    public List<Seat> getAvailableSeatsByTrip(String tripId) {
        List<Seat> availableSeats = new ArrayList<>();
        List<Seat> seats = getSeatsByTrip(tripId);

        for (Seat seat : seats) {
            if (seat.getStatus().equals(
                    Constants.SEAT_CON_TRONG
            )) {
                availableSeats.add(seat);
            }
        }

        return availableSeats;
    }

    public Seat findSeatInTrip(
            String tripId,
            String seatNumber
    ) {
        Seat seat = seatRepository.findByTripIdAndSeatNumber(
                tripId,
                seatNumber
        );

        if (seat == null) {
            throw new NoSuchElementException(
                    "Ghế không tồn tại trong chuyến xe"
            );
        }

        return seat;
    }

    public boolean isSeatAvailable(
            String tripId,
            String seatNumber
    ) {
        Seat seat = findSeatInTrip(tripId, seatNumber);

        return seat.getStatus().equals(
                Constants.SEAT_CON_TRONG
        );
    }

    public Seat validateSelectedSeat(
            String tripId,
            String seatNumber
    ) {
        Seat seat = findSeatInTrip(tripId, seatNumber);

        if (!seat.getStatus().equals(
                Constants.SEAT_CON_TRONG
        )) {
            throw new IllegalStateException(
                    "Ghế đã được đặt"
            );
        }

        return seat;
    }

    public void createSeat(Seat seat) {
        if (seat == null) {
            throw new IllegalArgumentException(
                    "Ghế không được để trống"
            );
        }

        if (!busTripRepository.exists(seat.getTripId())) {
            throw new NoSuchElementException(
                    "Chuyến xe không tồn tại"
            );
        }

        if (seatRepository.exists(seat.getSeatId())) {
            throw new IllegalArgumentException(
                    "Mã ghế đã tồn tại"
            );
        }

        if (seatRepository.existsInTrip(
                seat.getTripId(),
                seat.getSeatNumber()
        )) {
            throw new IllegalArgumentException(
                    "Số ghế đã tồn tại trong chuyến"
            );
        }

        seatRepository.save(seat);
    }

    public boolean updateSeat(Seat seat) {
        if (!seatRepository.exists(seat.getSeatId())) {
            throw new NoSuchElementException(
                    "Ghế không tồn tại"
            );
        }

        return seatRepository.update(seat);
    }

    public boolean deleteSeat(String seatId) {
        if (!seatRepository.exists(seatId)) {
            throw new NoSuchElementException(
                    "Ghế không tồn tại"
            );
        }

        return seatRepository.delete(seatId);
    }
}