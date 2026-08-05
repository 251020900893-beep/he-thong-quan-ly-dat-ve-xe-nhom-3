package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

public class TripService {

    private final BusTripRepository busTripRepository;

    public TripService() {
        this(new BusTripRepository());
    }

    public TripService(BusTripRepository busTripRepository) {
        if (busTripRepository == null) {
            throw new IllegalArgumentException(
                    "BusTripRepository không được để trống"
            );
        }

        this.busTripRepository = busTripRepository;
    }

    public List<BusTrip> getAllTrips() {
        return busTripRepository.findAll();
    }

    public BusTrip findTripById(String tripId) {
        validateText(tripId, "Mã chuyến xe");

        BusTrip trip = busTripRepository.findById(
                tripId.trim()
        );

        if (trip == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy chuyến xe có mã: "
                            + tripId
            );
        }

        return trip;
    }

    public List<BusTrip> findTrips(
            String departure,
            String destination
    ) {
        validateText(departure, "Điểm đi");
        validateText(destination, "Điểm đến");

        List<BusTrip> result = new ArrayList<>();

        for (BusTrip trip : busTripRepository.findAll()) {
            boolean correctDeparture =
                    sameText(
                            trip.getDeparture(),
                            departure
                    );

            boolean correctDestination =
                    sameText(
                            trip.getDestination(),
                            destination
                    );

            if (correctDeparture && correctDestination) {
                result.add(trip);
            }
        }

        return result;
    }

    public List<BusTrip> findTripsByDeparture(
            String departure
    ) {
        validateText(departure, "Điểm đi");

        List<BusTrip> result = new ArrayList<>();

        for (BusTrip trip : busTripRepository.findAll()) {
            if (sameText(
                    trip.getDeparture(),
                    departure
            )) {
                result.add(trip);
            }
        }

        return result;
    }

    public List<BusTrip> findTripsByDestination(
            String destination
    ) {
        validateText(destination, "Điểm đến");

        List<BusTrip> result = new ArrayList<>();

        for (BusTrip trip : busTripRepository.findAll()) {
            if (sameText(
                    trip.getDestination(),
                    destination
            )) {
                result.add(trip);
            }
        }

        return result;
    }

    public boolean tripExists(String tripId) {
        if (isBlank(tripId)) {
            return false;
        }

        return busTripRepository.exists(
                tripId.trim()
        );
    }

    public int countTrips() {
        return busTripRepository.count();
    }

    public int getTotalSeats(String tripId) {
        BusTrip trip = findTripById(tripId);

        if (trip.getTotalSeats() <= 0) {
            throw new IllegalStateException(
                    "Tổng số ghế của chuyến xe không hợp lệ"
            );
        }

        return trip.getTotalSeats();
    }

    public BusTrip createTrip(BusTrip trip) {
        validateTrip(trip);

        if (busTripRepository.exists(trip.getTripId())) {
            throw new IllegalArgumentException(
                    "Mã chuyến xe đã tồn tại: "
                            + trip.getTripId()
            );
        }

        busTripRepository.save(trip);

        return trip;
    }

    public BusTrip updateTrip(BusTrip trip) {
        validateTrip(trip);

        if (!busTripRepository.exists(trip.getTripId())) {
            throw new NoSuchElementException(
                    "Không tìm thấy chuyến xe có mã: "
                            + trip.getTripId()
            );
        }

        boolean updated =
                busTripRepository.update(trip);

        if (!updated) {
            throw new IllegalStateException(
                    "Không thể cập nhật chuyến xe: "
                            + trip.getTripId()
            );
        }

        return trip;
    }

    public boolean deleteTrip(String tripId) {
        validateText(tripId, "Mã chuyến xe");

        if (!busTripRepository.exists(tripId.trim())) {
            throw new NoSuchElementException(
                    "Không tìm thấy chuyến xe có mã: "
                            + tripId
            );
        }

        return busTripRepository.delete(
                tripId.trim()
        );
    }

    public boolean matchesRoute(
            BusTrip trip,
            String departure,
            String destination
    ) {
        if (trip == null
                || isBlank(departure)
                || isBlank(destination)) {

            return false;
        }

        return sameText(
                trip.getDeparture(),
                departure
        ) && sameText(
                trip.getDestination(),
                destination
        );
    }

    private void validateTrip(BusTrip trip) {
        if (trip == null) {
            throw new IllegalArgumentException(
                    "Chuyến xe không được để trống"
            );
        }

        validateText(
                trip.getTripId(),
                "Mã chuyến xe"
        );

        validateText(
                trip.getDeparture(),
                "Điểm đi"
        );

        validateText(
                trip.getDestination(),
                "Điểm đến"
        );

        validateText(
                trip.getDepartureTime(),
                "Thời gian khởi hành"
        );

        validateText(
                trip.getLicensePlate(),
                "Biển số xe"
        );

        if (trip.getTotalSeats() <= 0) {
            throw new IllegalArgumentException(
                    "Tổng số ghế phải lớn hơn 0"
            );
        }

        if (sameText(
                trip.getDeparture(),
                trip.getDestination()
        )) {
            throw new IllegalArgumentException(
                    "Điểm đi và điểm đến không được trùng nhau"
            );
        }
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

    private void validateText(
            String value,
            String fieldName
    ) {
        if (isBlank(value)) {
            throw new IllegalArgumentException(
                    fieldName + " không được để trống"
            );
        }
    }
}