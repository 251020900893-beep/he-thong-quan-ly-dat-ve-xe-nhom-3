package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.repository.BusTripRepository;
import com.example.hethongquanlydatvexe.repository.SeatRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

public class SeatService {

    private static final String STATUS_AVAILABLE = "ConTrong";
    private static final String STATUS_BOOKED = "DaDat";

    private static final String TYPE_NORMAL = "Thuong";
    private static final String TYPE_VIP = "VIP";

    private final SeatRepository seatRepository;
    private final BusTripRepository busTripRepository;

    public SeatService() {
        this(
                new SeatRepository(),
                new BusTripRepository()
        );
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

        Seat seat = seatRepository.findById(
                seatId.trim()
        );

        if (seat == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy ghế có mã: "
                            + seatId
            );
        }

        return seat;
    }

    public List<Seat> getSeatsByTrip(String tripId) {
        validateTripExists(tripId);

        return seatRepository.findByTripId(
                tripId.trim()
        );
    }

    public List<Seat> getAvailableSeatsByTrip(
            String tripId
    ) {
        validateTripExists(tripId);

        List<Seat> result = new ArrayList<>();

        for (Seat seat
                : seatRepository.findByTripId(tripId.trim())) {

            if (isAvailableStatus(seat.getStatus())) {
                result.add(seat);
            }
        }

        return result;
    }

    public List<Seat> getBookedSeatsByTrip(
            String tripId
    ) {
        validateTripExists(tripId);

        List<Seat> result = new ArrayList<>();

        for (Seat seat
                : seatRepository.findByTripId(tripId.trim())) {

            if (isBookedStatus(seat.getStatus())) {
                result.add(seat);
            }
        }

        return result;
    }

    public int countSeatsByTrip(String tripId) {
        validateTripExists(tripId);

        return seatRepository.countByTripId(
                tripId.trim()
        );
    }

    public int countAvailableSeatsByTrip(
            String tripId
    ) {
        return getAvailableSeatsByTrip(
                tripId
        ).size();
    }

    public int countBookedSeatsByTrip(
            String tripId
    ) {
        return getBookedSeatsByTrip(
                tripId
        ).size();
    }

    public boolean seatExists(String seatId) {
        if (isBlank(seatId)) {
            return false;
        }

        return seatRepository.exists(
                seatId.trim()
        );
    }

    public boolean seatExistsInTrip(
            String tripId,
            String seatNumber
    ) {
        if (isBlank(tripId)
                || isBlank(seatNumber)) {

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
        validateText(
                seatNumber,
                "Số ghế"
        );

        Seat seat =
                seatRepository.findByTripIdAndSeatNumber(
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
        Seat seat = findSeatInTrip(
                tripId,
                seatNumber
        );

        return isAvailableStatus(
                seat.getStatus()
        );
    }

    public Seat validateSelectedSeat(
            String tripId,
            String seatNumber
    ) {
        Seat seat = findSeatInTrip(
                tripId,
                seatNumber
        );

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

        if (!busTripRepository.exists(
                seat.getTripId()
        )) {
            throw new NoSuchElementException(
                    "Chuyến xe không tồn tại: "
                            + seat.getTripId()
            );
        }

        if (seatRepository.exists(
                seat.getSeatId()
        )) {
            throw new IllegalArgumentException(
                    "Mã ghế đã tồn tại: "
                            + seat.getSeatId()
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

        seat.setStatus(
                normalizeSeatStatus(
                        seat.getStatus()
                )
        );

        seat.setSeatType(
                normalizeSeatType(
                        seat.getSeatType()
                )
        );

        seatRepository.save(seat);

        return seat;
    }

    public Seat updateSeat(Seat seat) {
        validateSeat(seat);

        Seat currentSeat =
                findSeatById(
                        seat.getSeatId()
                );

        Seat seatInTrip =
                seatRepository
                        .findByTripIdAndSeatNumber(
                                seat.getTripId(),
                                seat.getSeatNumber()
                        );

        if (seatInTrip != null
                && !sameText(
                seatInTrip.getSeatId(),
                currentSeat.getSeatId()
        )) {
            throw new IllegalArgumentException(
                    "Số ghế " + seat.getSeatNumber()
                            + " đã tồn tại trong chuyến "
                            + seat.getTripId()
            );
        }

        seat.setStatus(
                normalizeSeatStatus(
                        seat.getStatus()
                )
        );

        seat.setSeatType(
                normalizeSeatType(
                        seat.getSeatType()
                )
        );

        boolean updated =
                seatRepository.update(seat);

        if (!updated) {
            throw new IllegalStateException(
                    "Không thể cập nhật ghế: "
                            + seat.getSeatId()
            );
        }

        return seat;
    }

    public Seat bookSeat(
            String tripId,
            String seatNumber
    ) {
        Seat seat = validateSelectedSeat(
                tripId,
                seatNumber
        );

        boolean updated =
                seatRepository.updateStatus(
                        seat.getSeatId(),
                        STATUS_BOOKED
                );

        if (!updated) {
            throw new IllegalStateException(
                    "Không thể cập nhật trạng thái ghế "
                            + seatNumber
            );
        }

        seat.setStatus(STATUS_BOOKED);

        return seat;
    }

    public Seat releaseSeat(
            String tripId,
            String seatNumber
    ) {
        Seat seat = findSeatInTrip(
                tripId,
                seatNumber
        );

        if (isAvailableStatus(seat.getStatus())) {
            return seat;
        }

        boolean updated =
                seatRepository.updateStatus(
                        seat.getSeatId(),
                        STATUS_AVAILABLE
                );

        if (!updated) {
            throw new IllegalStateException(
                    "Không thể cập nhật trạng thái ghế "
                            + seatNumber
            );
        }

        seat.setStatus(STATUS_AVAILABLE);

        return seat;
    }

    public boolean deleteSeat(String seatId) {
        validateText(
                seatId,
                "Mã ghế"
        );

        if (!seatRepository.exists(
                seatId.trim()
        )) {
            throw new NoSuchElementException(
                    "Không tìm thấy ghế có mã: "
                            + seatId
            );
        }

        return seatRepository.delete(
                seatId.trim()
        );
    }

    public List<Seat> findSeatsByTypeAndTrip(
            String tripId,
            String seatType
    ) {
        validateTripExists(tripId);

        String normalizedType =
                normalizeSeatType(seatType);

        List<Seat> result = new ArrayList<>();

        for (Seat seat
                : seatRepository.findByTripId(tripId.trim())) {

            if (sameText(
                    seat.getSeatType(),
                    normalizedType
            )) {
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

        for (Seat seat
                : seatRepository.findByTripId(tripId.trim())) {

            boolean correctType =
                    sameText(
                            seat.getSeatType(),
                            normalizedType
                    );

            boolean available =
                    isAvailableStatus(
                            seat.getStatus()
                    );

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

        validateText(
                seat.getSeatId(),
                "Mã ghế"
        );

        validateText(
                seat.getTripId(),
                "Mã chuyến xe"
        );

        validateText(
                seat.getSeatNumber(),
                "Số ghế"
        );

        validateText(
                seat.getSeatType(),
                "Loại ghế"
        );

        validateText(
                seat.getStatus(),
                "Trạng thái ghế"
        );

        normalizeSeatType(
                seat.getSeatType()
        );

        normalizeSeatStatus(
                seat.getStatus()
        );
    }

    private void validateTripExists(String tripId) {
        validateText(
                tripId,
                "Mã chuyến xe"
        );

        if (!busTripRepository.exists(
                tripId.trim()
        )) {
            throw new NoSuchElementException(
                    "Chuyến xe không tồn tại: "
                            + tripId
            );
        }
    }

    private String normalizeSeatType(String seatType) {
        validateText(
                seatType,
                "Loại ghế"
        );

        String normalized =
                seatType.trim()
                        .replace(" ", "")
                        .toLowerCase();

        if (normalized.equals("thuong")
                || normalized.equals("normal")) {

            return TYPE_NORMAL;
        }

        if (normalized.equals("vip")) {
            return TYPE_VIP;
        }

        throw new IllegalArgumentException(
                "Loại ghế không hợp lệ: "
                        + seatType
        );
    }

    private String normalizeSeatStatus(String status) {
        validateText(
                status,
                "Trạng thái ghế"
        );

        String normalized =
                status.trim()
                        .replace(" ", "")
                        .replace("_", "")
                        .toLowerCase();

        if (normalized.equals("controng")
                || normalized.equals("available")) {

            return STATUS_AVAILABLE;
        }

        if (normalized.equals("dadat")
                || normalized.equals("booked")) {

            return STATUS_BOOKED;
        }

        throw new IllegalArgumentException(
                "Trạng thái ghế không hợp lệ: "
                        + status
        );
    }

    private boolean isAvailableStatus(String status) {
        return sameText(
                status,
                STATUS_AVAILABLE
        );
    }

    private boolean isBookedStatus(String status) {
        return sameText(
                status,
                STATUS_BOOKED
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