package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.exception.TripNotFoundException;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;
import com.example.hethongquanlydatvexe.repository.SeatRepository;

import java.util.ArrayList;
import java.util.List;

public class TripService {

    private final BusTripRepository busTripRepository = new BusTripRepository();
    private final SeatRepository seatRepository = new SeatRepository();

    public List<BusTrip> getAllTrips() {
        List<BusTrip> trips = busTripRepository.findAll();
        for (BusTrip trip : trips) {
            String tripId = (trip.getTripId() != null && !trip.getTripId().isBlank())
                    ? trip.getTripId()
                    : trip.getId();

            if (tripId == null) continue;

            List<Seat> seats = seatRepository.findByTripId(tripId);

            if (seats == null || seats.isEmpty()) {
                seats = generateDefaultSeats(tripId, trip.getTotalSeats());
                for (Seat s : seats) {
                    seatRepository.save(s);
                }
            } else {
                // Quét và tự động giải phóng ghế hết hạn 3 phút (Realtime)
                boolean seatUpdated = false;
                for (Seat s : seats) {
                    if (s.checkAndAutoReleaseHold()) {
                        seatRepository.update(s);
                        seatUpdated = true;
                    }
                }
                if (seatUpdated) {
                    seats = seatRepository.findByTripId(tripId);
                }
            }
            trip.setSeats(seats);
        }
        return trips;
    }

    public BusTrip findTripById(String tripId) {
        BusTrip trip = busTripRepository.findById(tripId);
        if (trip == null) {
            throw new TripNotFoundException("Không tìm thấy chuyến xe: " + tripId);
        }
        String validTripId = (trip.getTripId() != null && !trip.getTripId().isBlank())
                ? trip.getTripId()
                : trip.getId();

        List<Seat> seats = seatRepository.findByTripId(validTripId);
        if (seats != null) {
            for (Seat s : seats) {
                if (s.checkAndAutoReleaseHold()) {
                    seatRepository.update(s);
                }
            }
        }
        trip.setSeats(seatRepository.findByTripId(validTripId));
        return trip;
    }

    private List<Seat> generateDefaultSeats(String tripId, int totalSeats) {
        List<Seat> list = new ArrayList<>();
        int count = (totalSeats > 0) ? totalSeats : 9;

        list.add(new Seat(tripId + "-A1", tripId, "A1", "NORMAL", 0.0, "AVAILABLE", null, null, null));
        list.add(new Seat(tripId + "-A2", tripId, "A2", "NORMAL", 0.0, "AVAILABLE", null, null, null));

        int vipCount = (count <= 9) ? 4 : 6;
        for (int i = 1; i <= vipCount; i++) {
            list.add(new Seat(tripId + "-B" + i, tripId, "B" + i, "VIP", 50000.0, "AVAILABLE", null, null, null));
        }

        int backCount = count - 2 - vipCount;
        for (int i = 1; i <= backCount; i++) {
            list.add(new Seat(tripId + "-C" + i, tripId, "C" + i, "NORMAL", 0.0, "AVAILABLE", null, null, null));
        }
        return list;
    }
}