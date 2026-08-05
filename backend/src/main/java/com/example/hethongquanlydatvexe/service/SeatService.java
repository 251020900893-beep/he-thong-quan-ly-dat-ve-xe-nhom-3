package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.repository.SeatRepository;

import java.util.ArrayList;
import java.util.List;

public class SeatService {

    private static final String STATUS_AVAILABLE = "ConTrong";
    private static final String STATUS_BOOKED = "DaDat";

    private final SeatRepository seatRepository;

    public SeatService() {
        this.seatRepository = new SeatRepository();
    }

    public SeatService(SeatRepository seatRepository) {
        if (seatRepository == null) {
            throw new IllegalArgumentException(
                    "SeatRepository không được để trống"
            );
        }

        this.seatRepository = seatRepository;
    }

    // Lấy toàn bộ danh sách ghế
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    // Tìm ghế theo mã
    public Seat findSeatById(String seatId) throws Exception {
        validateText(seatId, "Mã ghế");

        Seat seat = seatRepository.findById(seatId.trim());

        if (seat == null) {
            throw new Exception(
                    "Không tìm thấy ghế có mã: " + seatId
            );
        }

        return seat;
    }

    // Lấy danh sách ghế còn trống
    public List<Seat> getAvailableSeats() {
        List<Seat> availableSeats = new ArrayList<>();

        for (Seat seat : seatRepository.findAll()) {
            if (isAvailableStatus(seat.getStatus())) {
                availableSeats.add(seat);
            }
        }

        return availableSeats;
    }

    // Lấy danh sách ghế đã đặt
    public List<Seat> getBookedSeats() {
        List<Seat> bookedSeats = new ArrayList<>();

        for (Seat seat : seatRepository.findAll()) {
            if (isBookedStatus(seat.getStatus())) {
                bookedSeats.add(seat);
            }
        }

        return bookedSeats;
    }

    // Đếm số ghế còn trống
    public int countAvailableSeats() {
        int count = 0;

        for (Seat seat : seatRepository.findAll()) {
            if (isAvailableStatus(seat.getStatus())) {
                count++;
            }
        }

        return count;
    }

    // Đếm số ghế đã đặt
    public int countBookedSeats() {
        int count = 0;

        for (Seat seat : seatRepository.findAll()) {
            if (isBookedStatus(seat.getStatus())) {
                count++;
            }
        }

        return count;
    }

    // Kiểm tra ghế có tồn tại
    public boolean seatExists(String seatId) {
        if (seatId == null || seatId.trim().isEmpty()) {
            return false;
        }

        return seatRepository.exists(seatId.trim());
    }

    // Kiểm tra ghế còn trống hay không
    public boolean isSeatAvailable(String seatId) throws Exception {
        Seat seat = findSeatById(seatId);

        return isAvailableStatus(seat.getStatus());
    }

    // Kiểm tra ghế khách chọn có hợp lệ không
    public Seat validateSelectedSeat(String seatId) throws Exception {
        Seat seat = findSeatById(seatId);

        if (!isAvailableStatus(seat.getStatus())) {
            throw new Exception(
                    "Ghế " + seat.getSeatNumber()
                            + " đã được đặt, vui lòng chọn ghế khác"
            );
        }

        return seat;
    }

    // Đặt ghế
    public Seat bookSeat(String seatId) throws Exception {
        Seat seat = validateSelectedSeat(seatId);

        boolean updated = seatRepository.updateStatus(
                seat.getSeatId(),
                STATUS_BOOKED
        );

        if (!updated) {
            throw new Exception(
                    "Không thể cập nhật trạng thái ghế: " + seatId
            );
        }

        seat.setStatus(STATUS_BOOKED);

        return seat;
    }

    // Hủy trạng thái đặt ghế
    public Seat releaseSeat(String seatId) throws Exception {
        Seat seat = findSeatById(seatId);

        boolean updated = seatRepository.updateStatus(
                seat.getSeatId(),
                STATUS_AVAILABLE
        );

        if (!updated) {
            throw new Exception(
                    "Không thể cập nhật trạng thái ghế: " + seatId
            );
        }

        seat.setStatus(STATUS_AVAILABLE);

        return seat;
    }

    // Lọc ghế theo loại
    public List<Seat> findSeatsByType(String seatType) {
        validateText(seatType, "Loại ghế");

        List<Seat> result = new ArrayList<>();

        for (Seat seat : seatRepository.findAll()) {
            if (sameText(seat.getSeatType(), seatType)) {
                result.add(seat);
            }
        }

        return result;
    }

    // Lọc ghế còn trống theo loại ghế
    public List<Seat> findAvailableSeatsByType(String seatType) {
        validateText(seatType, "Loại ghế");

        List<Seat> result = new ArrayList<>();

        for (Seat seat : seatRepository.findAll()) {
            boolean sameSeatType =
                    sameText(seat.getSeatType(), seatType);

            boolean available =
                    isAvailableStatus(seat.getStatus());

            if (sameSeatType && available) {
                result.add(seat);
            }
        }

        return result;
    }

    // Kiểm tra trạng thái còn trống
    private boolean isAvailableStatus(String status) {
        return sameText(status, STATUS_AVAILABLE);
    }

    // Kiểm tra trạng thái đã đặt
    private boolean isBookedStatus(String status) {
        return sameText(status, STATUS_BOOKED);
    }

    // So sánh chuỗi không phân biệt hoa thường và khoảng trắng
    private boolean sameText(
            String firstValue,
            String secondValue
    ) {
        if (firstValue == null || secondValue == null) {
            return false;
        }

        return firstValue.trim()
                .equalsIgnoreCase(secondValue.trim());
    }

    // Kiểm tra chuỗi đầu vào
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