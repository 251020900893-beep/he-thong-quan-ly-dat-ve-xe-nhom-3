package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;

import java.util.List;
import exception.TripNotFoundException;
public class TripService {

    private final BusTripRepository busTripRepository =
            new BusTripRepository();

    public List<BusTrip> getAllTrips() {
        return busTripRepository.findAll();
    }

    public BusTrip findTripById(String tripId) {
        BusTrip trip = busTripRepository.findById(tripId);

        if (trip == null) {
            throw new TripNotFoundException(
                    "Không tìm thấy chuyến xe: " + tripId
            );
        }

        return trip;
    }

    public List<BusTrip> findTrips(
            String departure,
            String destination
    ) {
        if (departure == null || departure.isEmpty()) {
            throw new IllegalArgumentException(
                    "Điểm đi không được để trống"
            );
        }

        if (destination == null || destination.isEmpty()) {
            throw new IllegalArgumentException(
                    "Điểm đến không được để trống"
            );
        }

        return busTripRepository.findByRoute(
                departure,
                destination
        );
    }

    public void createTrip(BusTrip trip) {
        validateTrip(trip);

        if (busTripRepository.exists(trip.getTripId())) {
            throw new IllegalArgumentException(
                    "Mã chuyến xe đã tồn tại"
            );
        }

        busTripRepository.save(trip);
    }

    public boolean updateTrip(BusTrip trip) {
        validateTrip(trip);

        if (!busTripRepository.exists(trip.getTripId())) {
            throw new TripNotFoundException(
                    "Chuyến xe không tồn tại"
            );
        }

        return busTripRepository.update(trip);
    }

    public boolean deleteTrip(String tripId) {
        if (!busTripRepository.exists(tripId)) {
            throw new TripNotFoundException(
                    "Chuyến xe không tồn tại"
            );
        }

        return busTripRepository.delete(tripId);
    }

    private void validateTrip(BusTrip trip) {
        if (trip == null) {
            throw new IllegalArgumentException(
                    "Chuyến xe không được để trống"
            );
        }

        if (trip.getTripId() == null
                || trip.getTripId().isEmpty()) {
            throw new IllegalArgumentException(
                    "Mã chuyến xe không được để trống"
            );
        }

        if (trip.getDeparture() == null
                || trip.getDeparture().isEmpty()) {
            throw new IllegalArgumentException(
                    "Điểm đi không được để trống"
            );
        }

        if (trip.getDestination() == null
                || trip.getDestination().isEmpty()) {
            throw new IllegalArgumentException(
                    "Điểm đến không được để trống"
            );
        }

        if (trip.getDepartureTime() == null
                || trip.getDepartureTime().isEmpty()) {
            throw new IllegalArgumentException(
                    "Thời gian khởi hành không được để trống"
            );
        }

        if (trip.getLicensePlate() == null
                || trip.getLicensePlate().isEmpty()) {
            throw new IllegalArgumentException(
                    "Biển số xe không được để trống"
            );
        }

        if (trip.getTotalSeats() <= 0) {
            throw new IllegalArgumentException(
                    "Tổng số ghế phải lớn hơn 0"
            );
        }

        if (trip.getDeparture().equals(
                trip.getDestination()
        )) {
            throw new IllegalArgumentException(
                    "Điểm đi và điểm đến không được giống nhau"
            );
        }
    }
}