package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;
import com.example.hethongquanlydatvexe.repository.SeatRepository;
import com.example.hethongquanlydatvexe.utils.Constants;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

public class SeatService {

    private final SeatRepository seatRepository;
    private final BusTripRepository busTripRepository;

    public SeatService() {
        this(new SeatRepository(), new BusTripRepository());
    }

    public SeatService(
            SeatRepository seatRepository,
            BusTripRepository busTripRepository
    ) {
        if (seatRepository == null) {
            throw new IllegalArgumentException(
                    "SeatRepository không được để trống"
            );
        }

        if (busTripRepository == null) {
            throw new IllegalArgumentException(
                    "BusTripRepository không được để trống"
            );
        }

        this.seatRepository = seatRepository;
        this.busTripRepository = busTripRepository;
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public Seat findSeatById(String seatId) {
        validateText(seatId, "Mã ghế");

        Seat seat = seatRepository.findById(seatId.trim());

        if (seat == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy ghế có mã: " + seatId
            );
        }

        return seat;
    }

    public List<Seat> getSeatsByTrip(String tripId) {
        validateTripExists(tripId);
        return seatRepository.findByTripId(tripId.trim());
    }

    public List<Seat> getAvailableSeatsByTrip(String tripId) {
        validateTripExists(tripId);

        List<Seat> result = new ArrayList<>();

        for (Seat seat : seatRepository.findByTripId(tripId.trim())) {
            if (isAvailableStatus(seat.getStatus())) {
                result.add(seat);
            }
        }

        return result;
    }

    public List<Seat> getBookedSeatsByTrip(String tripId) {
        validateTripExists(tripId);

        List<Seat> result = new ArrayList<>();

        for (Seat seat : seatRepository.findByTripId(tripId.trim())) {
            if (isBookedStatus(seat.getStatus())) {
                result.add(seat);
            }
        }

        return result;
    }

    public int countSeatsByTrip(String tripId) {
        validateTripExists(tripId);
        return seatRepository.countByTripId(tripId.trim());
    }

    public int countAvailableSeatsByTrip(String tripId) {
        return getAvailableSeatsByTrip(tripId).size();
    }

    public int countBookedSeatsByTrip(String tripId) {
        return getBookedSeatsByTrip(tripId).size();
    }

    public boolean seatExists(String seatId) {
        if (isBlank(seatId)) {
            return false;
        }

        return seatRepository.exists(seatId.trim());
    }

    public boolean seatExistsInTrip(
            String tripId,
            String seatNumber
    ) {
        if (isBlank(tripId) || isBlank(seatNumber)) {
            return false;
        }

        return seatRepository.existsInTrip(
                tripId.trim(),
                seatNumber.trim()
        );
    }

    public Seat findSeatInTrip(
            String tripId,
            String seatNumber
    ) {
        validateTripExists(tripId);
        validateText(seatNumber, "Số ghế");

        Seat seat = seatRepository.findByTripIdAndSeatNumber(
                tripId.trim(),
                seatNumber.trim()
        );

        if (seat == null) {
            throw new NoSuchElementException(
                    "Ghế " + seatNumber
                            + " không tồn tại trong chuyến "
                            + tripId
            );
        }

        return seat;
    }

    public boolean isSeatAvailable(
            String tripId,
            String seatNumber
    ) {
        return isAvailableStatus(
                findSeatInTrip(tripId, seatNumber).getStatus()
        );
    }

    public Seat validateSelectedSeat(
            String tripId,
            String seatNumber
    ) {
        Seat seat = findSeatInTrip(tripId, seatNumber);

        if (!isAvailableStatus(seat.getStatus())) {
            throw new IllegalStateException(
                    "Ghế " + seatNumber
                            + " của chuyến " + tripId
                            + " đã được đặt"
            );
        }

        return seat;
    }

    public Seat createSeat(Seat seat) {
        validateSeat(seat);

        if (!busTripRepository.exists(seat.getTripId())) {
            throw new NoSuchElementException(
                    "Chuyến xe không tồn tại: " + seat.getTripId()
            );
        }

        if (seatRepository.exists(seat.getSeatId())) {
            throw new IllegalArgumentException(
                    "Mã ghế đã tồn tại: " + seat.getSeatId()
            );
        }

        if (seatRepository.existsInTrip(
                seat.getTripId(),
                seat.getSeatNumber()
        )) {
            throw new IllegalArgumentException(
                    "Số ghế " + seat.getSeatNumber()
                            + " đã tồn tại trong chuyến "
                            + seat.getTripId()
            );
        }

        seat.setSeatType(
                normalizeSeatType(seat.getSeatType())
        );

        seat.setStatus(
                normalizeSeatStatus(seat.getStatus())
        );

        seatRepository.save(seat);

        return seat;
    }

    public Seat updateSeat(Seat seat) {
        validateSeat(seat);

        Seat currentSeat = findSeatById(seat.getSeatId());

        if (!busTripRepository.exists(seat.getTripId())) {
            throw new NoSuchElementException(
                    "Chuyến xe không tồn tại: " + seat.getTripId()
            );
        }

        Seat duplicatedSeat =
                seatRepository.findByTripIdAndSeatNumber(
                        seat.getTripId(),
                        seat.getSeatNumber()
                );

        if (duplicatedSeat != null
                && !sameText(
                duplicatedSeat.getSeatId(),
                currentSeat.getSeatId()
        )) {
            throw new IllegalArgumentException(
                    "Số ghế " + seat.getSeatNumber()
                            + " đã tồn tại trong chuyến "
                            + seat.getTripId()
            );
        }

        seat.setSeatType(
                normalizeSeatType(seat.getSeatType())
        );

        seat.setStatus(
                normalizeSeatStatus(seat.getStatus())
        );

        boolean updated = seatRepository.update(seat);

        if (!updated) {
            throw new IllegalStateException(
                    "Không thể cập nhật ghế: " + seat.getSeatId()
            );
        }

        return seat;
    }

    public Seat bookSeat(
            String tripId,
            String seatNumber
    ) {
        Seat seat = validateSelectedSeat(tripId, seatNumber);

        boolean updated = seatRepository.updateStatus(
                seat.getSeatId(),
                Constants.SEAT_DA_DAT
        );

        if (!updated) {
            throw new IllegalStateException(
                    "Không thể cập nhật trạng thái ghế " + seatNumber
            );
        }

        seat.setStatus(Constants.SEAT_DA_DAT);

        return seat;
    }

    public Seat releaseSeat(
            String tripId,
            String seatNumber
    ) {
        Seat seat = findSeatInTrip(tripId, seatNumber);

        if (isAvailableStatus(seat.getStatus())) {
            return seat;
        }

        boolean updated = seatRepository.updateStatus(
                seat.getSeatId(),
                Constants.SEAT_CON_TRONG
        );

        if (!updated) {
            throw new IllegalStateException(
                    "Không thể cập nhật trạng thái ghế " + seatNumber
            );
        }

        seat.setStatus(Constants.SEAT_CON_TRONG);

        return seat;
    }

    public boolean deleteSeat(String seatId) {
        validateText(seatId, "Mã ghế");

        if (!seatRepository.exists(seatId.trim())) {
            throw new NoSuchElementException(
                    "Không tìm thấy ghế có mã: " + seatId
            );
        }

        return seatRepository.delete(seatId.trim());
    }

    public List<Seat> findSeatsByTypeAndTrip(
            String tripId,
            String seatType
    ) {
        validateTripExists(tripId);

        String normalizedType =
                normalizeSeatType(seatType);

        List<Seat> result = new ArrayList<>();

        for (Seat seat : seatRepository.findByTripId(tripId.trim())) {
            if (sameText(seat.getSeatType(), normalizedType)) {
                result.add(seat);
            }
        }

        return result;
    }

    public List<Seat> findAvailableSeatsByTypeAndTrip(
            String tripId,
            String seatType
    ) {
        validateTripExists(tripId);

        String normalizedType =
                normalizeSeatType(seatType);

        List<Seat> result = new ArrayList<>();

        for (Seat seat : seatRepository.findByTripId(tripId.trim())) {
            boolean correctType =
                    sameText(seat.getSeatType(), normalizedType);

            boolean available =
                    isAvailableStatus(seat.getStatus());

            if (correctType && available) {
                result.add(seat);
            }
        }

        return result;
    }

    private void validateSeat(Seat seat) {
        if (seat == null) {
            throw new IllegalArgumentException(
                    "Ghế không được để trống"
            );
        }

        validateText(seat.getSeatId(), "Mã ghế");
        validateText(seat.getTripId(), "Mã chuyến xe");
        validateText(seat.getSeatNumber(), "Số ghế");
        validateText(seat.getSeatType(), "Loại ghế");
        validateText(seat.getStatus(), "Trạng thái ghế");

        normalizeSeatType(seat.getSeatType());
        normalizeSeatStatus(seat.getStatus());
    }

    private void validateTripExists(String tripId) {
        validateText(tripId, "Mã chuyến xe");

        if (!busTripRepository.exists(tripId.trim())) {
            throw new NoSuchElementException(
                    "Chuyến xe không tồn tại: " + tripId
            );
        }
    }

    private String normalizeSeatType(String seatType) {
        validateText(seatType, "Loại ghế");

        String normalized = seatType
                .trim()
                .replace(" ", "")
                .replace("_", "")
                .toLowerCase();

        if (normalized.equals("thuong")
                || normalized.equals("ghethuong")) {
            return Constants.SEAT_THUONG;
        }

        if (normalized.equals("vip")
                || normalized.equals("ghevip")) {
            return Constants.SEAT_VIP;
        }

        throw new IllegalArgumentException(
                "Loại ghế không hợp lệ: " + seatType
        );
    }

    private String normalizeSeatStatus(String status) {
        validateText(status, "Trạng thái ghế");

        String normalized = status
                .trim()
                .replace(" ", "")
                .replace("_", "")
                .toLowerCase();

        if (normalized.equals("controng")) {
            return Constants.SEAT_CON_TRONG;
        }

        if (normalized.equals("dadat")) {
            return Constants.SEAT_DA_DAT;
        }

        throw new IllegalArgumentException(
                "Trạng thái ghế không hợp lệ: " + status
        );
    }

    private boolean isAvailableStatus(String status) {
        return sameText(
                status,
                Constants.SEAT_CON_TRONG
        );
    }

    private boolean isBookedStatus(String status) {
        return sameText(
                status,
                Constants.SEAT_DA_DAT
        );
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