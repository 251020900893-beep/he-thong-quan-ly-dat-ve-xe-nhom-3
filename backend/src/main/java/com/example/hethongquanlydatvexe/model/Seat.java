package com.example.hethongquanlydatvexe.model;

import com.example.hethongquanlydatvexe.exception.BusinessRuleException;

import java.time.Instant;

/**
 * Class Seat đại diện cho ghế ngồi trên xe.
 *
 * Seat tự quản lý các state transition:
 * AVAILABLE -> HOLDING -> BOOKED
 * HOLDING -> AVAILABLE khi hết hạn / hủy.
 */
public class Seat {

    private String seatId;
    private String tripId;
    private String seatNumber;
    private String seatType;
    private double surcharge;

    /**
     * AVAILABLE / HOLDING / BOOKED
     */
    private String status;

    /**
     * ISO-8601 timestamp.
     */
    private String holdingExpiresAt;

    /**
     * Customer phone/id đang giữ ghế.
     */
    private String holdingCustomerId;

    /**
     * Ticket id sau khi thanh toán.
     */
    private String bookedTicketId;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Seat() {
        this.seatType = "NORMAL";
        this.surcharge = 0.0;
        this.status = "AVAILABLE";
    }

    public Seat(
            String seatId,
            String tripId,
            String seatNumber,
            String seatType,
            double surcharge,
            String status,
            String holdingExpiresAt,
            String holdingCustomerId,
            String bookedTicketId
    ) {
        this.seatId = seatId;
        this.tripId = tripId;
        this.seatNumber = seatNumber;
        this.seatType = seatType != null ? seatType : "NORMAL";
        this.surcharge = surcharge;
        this.status = status != null ? status : "AVAILABLE";
        this.holdingExpiresAt = holdingExpiresAt;
        this.holdingCustomerId = holdingCustomerId;
        this.bookedTicketId = bookedTicketId;
    }

    // =========================================================
    // BUSINESS LOGIC
    // =========================================================

    /**
     * Tự động giải phóng ghế nếu HOLDING đã hết hạn.
     *
     * Boundary:
     * now == expiry -> hết hạn.
     *
     * Timestamp malformed -> fail-closed:
     * ghế trở lại AVAILABLE và clear toàn bộ metadata hold.
     */
    public boolean checkAndAutoReleaseHold() {

        if (!"HOLDING".equalsIgnoreCase(this.status)) {
            return false;
        }

        if (this.holdingExpiresAt == null
                || this.holdingExpiresAt.isBlank()) {

            this.status = "AVAILABLE";
            this.holdingExpiresAt = null;
            this.holdingCustomerId = null;
            this.bookedTicketId = null;

            return true;
        }

        try {
            Instant expireTime = Instant.parse(this.holdingExpiresAt);

            if (!Instant.now().isBefore(expireTime)) {
                this.status = "AVAILABLE";
                this.holdingExpiresAt = null;
                this.holdingCustomerId = null;
                this.bookedTicketId = null;

                return true;
            }

        } catch (Exception ex) {

            // Fail-closed:
            // Timestamp lỗi => không cho giữ ghế "vô thời hạn".
            this.status = "AVAILABLE";
            this.holdingExpiresAt = null;
            this.holdingCustomerId = null;
            this.bookedTicketId = null;

            return true;
        }

        return false;
    }

    /**
     * Giữ ghế trong số giây truyền vào.
     */
    public String holdSeat(
            String customerId,
            int durationSeconds
    ) {

        if (customerId == null || customerId.isBlank()) {
            throw new BusinessRuleException(
                    "Thông tin khách hàng giữ ghế không hợp lệ!"
            );
        }

        if (durationSeconds <= 0) {
            throw new BusinessRuleException(
                    "Thời gian giữ ghế phải lớn hơn 0!"
            );
        }

        checkAndAutoReleaseHold();

        if ("BOOKED".equalsIgnoreCase(this.status)) {
            throw new BusinessRuleException(
                    "Ghế [" + this.seatNumber
                            + "] đã được bán và thanh toán thành công!"
            );
        }

        if ("HOLDING".equalsIgnoreCase(this.status)
                && this.holdingCustomerId != null
                && !this.holdingCustomerId.equals(customerId)) {

            throw new BusinessRuleException(
                    "Ghế [" + this.seatNumber
                            + "] hiện đang được một khách hàng khác giữ chỗ!"
            );
        }

        String expiresAt = Instant.now()
                .plusSeconds(durationSeconds)
                .toString();

        this.status = "HOLDING";
        this.holdingCustomerId = customerId;
        this.holdingExpiresAt = expiresAt;
        this.bookedTicketId = null;

        return expiresAt;
    }

    public String holdSeat(String customerId) {
        return holdSeat(customerId, 180);
    }

    /**
     * Hủy giữ chỗ thủ công.
     */
    public void releaseHold() {

        if ("HOLDING".equalsIgnoreCase(this.status)) {
            this.status = "AVAILABLE";
            this.holdingCustomerId = null;
            this.holdingExpiresAt = null;
            this.bookedTicketId = null;
        }
    }

    /**
     * Xác nhận booking sau khi thanh toán thành công.
     */
    public void confirmBooking(String ticketId) {

        if (ticketId == null || ticketId.isBlank()) {
            throw new BusinessRuleException(
                    "Mã vé không hợp lệ!"
            );
        }

        this.status = "BOOKED";
        this.bookedTicketId = ticketId;
        this.holdingExpiresAt = null;
        this.holdingCustomerId = null;
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public String getSeatId() {
        return seatId;
    }

    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    public String getTripId() {
        return tripId;
    }

    public void setTripId(String tripId) {
        this.tripId = tripId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getSeatType() {
        return seatType;
    }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }

    public double getSurcharge() {
        return surcharge;
    }

    public void setSurcharge(double surcharge) {
        this.surcharge = surcharge;
    }

    public String getStatus() {
        checkAndAutoReleaseHold();
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getHoldingExpiresAt() {
        return holdingExpiresAt;
    }

    public void setHoldingExpiresAt(String holdingExpiresAt) {
        this.holdingExpiresAt = holdingExpiresAt;
    }

    public String getHoldingCustomerId() {
        return holdingCustomerId;
    }

    public void setHoldingCustomerId(String holdingCustomerId) {
        this.holdingCustomerId = holdingCustomerId;
    }

    public String getBookedTicketId() {
        return bookedTicketId;
    }

    public void setBookedTicketId(String bookedTicketId) {
        this.bookedTicketId = bookedTicketId;
    }
}