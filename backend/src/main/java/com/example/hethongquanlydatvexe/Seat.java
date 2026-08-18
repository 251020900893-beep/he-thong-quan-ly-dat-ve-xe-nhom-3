package com.example.hethongquanlydatvexe;

import com.example.hethongquanlydatvexe.exception.BusinessRuleException;
import java.time.Instant;

/**
 * Class Seat đại diện cho ghế ngồi trên xe
 * Áp dụng tính Encapsulation & Logic giữ chỗ 3-5 phút
 */
public class Seat {
    private String seatId;
    private String tripId;             // <-- Mã chuyến xe của ghế
    private String seatNumber;
    private String seatType;           // "NORMAL" hoặc "VIP"
    private double surcharge;          // Phụ phí ghế VIP
    private String status;             // "AVAILABLE", "HOLDING", "BOOKED"
    private String holdingExpiresAt;   // ISO-8601 String thời điểm hết hạn
    private String holdingCustomerId;  // ID khách hàng đang giữ ghế
    private String bookedTicketId;     // ID vé sau khi đã mua thành công

    // Constructor mặc định cho Gson / Jackson
    public Seat() {
        this.seatType = "NORMAL";
        this.surcharge = 0.0;
        this.status = "AVAILABLE";
    }

    public Seat(String seatId, String tripId, String seatNumber, String seatType, double surcharge,
                String status, String holdingExpiresAt, String holdingCustomerId, String bookedTicketId) {
        this.seatId = seatId;
        this.tripId = tripId;
        this.seatNumber = seatNumber;
        this.seatType = (seatType != null) ? seatType : "NORMAL";
        this.surcharge = surcharge;
        this.status = (status != null) ? status : "AVAILABLE";
        this.holdingExpiresAt = holdingExpiresAt;
        this.holdingCustomerId = holdingCustomerId;
        this.bookedTicketId = bookedTicketId;
    }

    /**
     * Kiểm tra và tự động giải phóng ghế nếu hết thời gian giữ chỗ
     */
    public boolean checkAndAutoReleaseHold() {
        if ("HOLDING".equalsIgnoreCase(this.status) && this.holdingExpiresAt != null) {
            try {
                Instant expireTime = Instant.parse(this.holdingExpiresAt);
                if (Instant.now().isAfter(expireTime)) {
                    this.status = "AVAILABLE";
                    this.holdingExpiresAt = null;
                    this.holdingCustomerId = null;
                    this.bookedTicketId = null;
                    return true;
                }
            } catch (Exception e) {
                this.status = "AVAILABLE";
                this.holdingExpiresAt = null;
            }
        }
        return false;
    }

    /**
     * Thực hiện giữ chỗ (mặc định 180 giây)
     */
    public String holdSeat(String customerId, int durationSeconds) {
        checkAndAutoReleaseHold();

        if ("BOOKED".equalsIgnoreCase(this.status)) {
            throw new BusinessRuleException("Ghế [" + this.seatNumber + "] đã được bán và thanh toán thành công!");
        }

        if ("HOLDING".equalsIgnoreCase(this.status) && this.holdingCustomerId != null
                && !this.holdingCustomerId.equals(customerId)) {
            throw new BusinessRuleException("Ghế [" + this.seatNumber + "] hiện đang được một khách hàng khác giữ chỗ!");
        }

        String expiresAt = Instant.now().plusSeconds(durationSeconds).toString();
        this.status = "HOLDING";
        this.holdingCustomerId = customerId;
        this.holdingExpiresAt = expiresAt;
        return expiresAt;
    }

    public String holdSeat(String customerId) {
        return holdSeat(customerId, 180);
    }

    /**
     * Hủy giữ chỗ thủ công
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
     * Xác nhận đặt vé thành công (Đã thanh toán)
     */
    public void confirmBooking(String ticketId) {
        this.status = "BOOKED";
        this.bookedTicketId = ticketId;
        this.holdingExpiresAt = null;
    }

    // Getters & Setters
    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }

    public double getSurcharge() { return surcharge; }
    public void setSurcharge(double surcharge) { this.surcharge = surcharge; }

    public String getStatus() {
        checkAndAutoReleaseHold();
        return status;
    }
    public void setStatus(String status) { this.status = status; }

    public String getHoldingExpiresAt() { return holdingExpiresAt; }
    public void setHoldingExpiresAt(String holdingExpiresAt) { this.holdingExpiresAt = holdingExpiresAt; }

    public String getHoldingCustomerId() { return holdingCustomerId; }
    public void setHoldingCustomerId(String holdingCustomerId) { this.holdingCustomerId = holdingCustomerId; }

    public String getBookedTicketId() { return bookedTicketId; }
    public void setBookedTicketId(String bookedTicketId) { this.bookedTicketId = bookedTicketId; }
}