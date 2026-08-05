package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;

import java.util.ArrayList;
import java.util.List;

public class TripService {

    private final BusTripRepository busTripRepository;

    public TripService() {
        this.busTripRepository = new BusTripRepository();
    }

    public TripService(BusTripRepository busTripRepository) {
        if (busTripRepository == null) {
            throw new IllegalArgumentException(
                    "BusTripRepository không được null"
            );
        }

        this.busTripRepository = busTripRepository;
    }

    // Lấy toàn bộ danh sách chuyến xe
    public List<BusTrip> getAllTrips() {
        return busTripRepository.findAll();
    }

    // Tìm chuyến xe theo mã chuyến
    public BusTrip findTripById(String tripId) throws Exception {
        validateText(tripId, "Mã chuyến xe");

        BusTrip trip = busTripRepository.findById(tripId.trim());

        if (trip == null) {
            throw new Exception(
                    "Không tìm thấy chuyến xe có mã: " + tripId
            );
        }

        return trip;
    }

    // Tìm chuyến theo cả điểm đi và điểm đến
    public List<BusTrip> findTrips(
            String departure,
            String destination
    ) {
        validateText(departure, "Điểm đi");
        validateText(destination, "Điểm đến");

        List<BusTrip> trips = busTripRepository.findAll();
        List<BusTrip> result = new ArrayList<>();

        for (BusTrip trip : trips) {
            boolean sameDeparture =
                    equalsIgnoreCaseAndTrim(
                            trip.getDeparture(),
                            departure
                    );

            boolean sameDestination =
                    equalsIgnoreCaseAndTrim(
                            trip.getDestination(),
                            destination
                    );

            if (sameDeparture && sameDestination) {
                result.add(trip);
            }
        }

        return result;
    }

    // Tìm chuyến theo điểm đi
    public List<BusTrip> findTripsByDeparture(
            String departure
    ) {
        validateText(departure, "Điểm đi");

        List<BusTrip> result = new ArrayList<>();

        for (BusTrip trip : busTripRepository.findAll()) {
            if (equalsIgnoreCaseAndTrim(
                    trip.getDeparture(),
                    departure
            )) {
                result.add(trip);
            }
        }

        return result;
    }

    // Tìm chuyến theo điểm đến
    public List<BusTrip> findTripsByDestination(
            String destination
    ) {
        validateText(destination, "Điểm đến");

        List<BusTrip> result = new ArrayList<>();

        for (BusTrip trip : busTripRepository.findAll()) {
            if (equalsIgnoreCaseAndTrim(
                    trip.getDestination(),
                    destination
            )) {
                result.add(trip);
            }
        }

        return result;
    }

    // Kiểm tra chuyến xe có tồn tại
    public boolean tripExists(String tripId) {
        if (tripId == null || tripId.trim().isEmpty()) {
            return false;
        }

        return busTripRepository.exists(tripId.trim());
    }

    // Đếm tổng số chuyến xe
    public int countTrips() {
        return busTripRepository.count();
    }

    // Kiểm tra tổng số ghế của chuyến
    public int getTotalSeats(String tripId) throws Exception {
        BusTrip trip = findTripById(tripId);

        if (trip.getTotalSeats() <= 0) {
            throw new Exception(
                    "Tổng số ghế của chuyến xe không hợp lệ"
            );
        }

        return trip.getTotalSeats();
    }

    // Kiểm tra chuyến có đúng tuyến hay không
    public boolean matchesRoute(
            BusTrip trip,
            String departure,
            String destination
    ) {
        if (trip == null) {
            return false;
        }

        if (departure == null || destination == null) {
            return false;
        }

        return equalsIgnoreCaseAndTrim(
                trip.getDeparture(),
                departure
        ) && equalsIgnoreCaseAndTrim(
                trip.getDestination(),
                destination
        );
    }

    // So sánh hai chuỗi không phân biệt hoa thường và khoảng trắng
    private boolean equalsIgnoreCaseAndTrim(
            String firstValue,
            String secondValue
    ) {
        if (firstValue == null || secondValue == null) {
            return false;
        }

        return firstValue.trim()
                .equalsIgnoreCase(secondValue.trim());
    }

    // Kiểm tra dữ liệu chuỗi đầu vào
    private void validateText(
            String value,
            String fieldName
    ) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    fieldName + " không được để trống"
            );
        }
    }
}