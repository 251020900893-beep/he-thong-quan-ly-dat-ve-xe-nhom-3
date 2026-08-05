package com.example.hethongquanlydatvexe.model;

public class Seat {
    private String seatId;
    private String tripId;
    private String seatNumber;
    private String seatType;
    private String status;

    public Seat() {
    }

    public Seat(
            String seatId,
            String tripId,
            String seatNumber,
            String seatType,
            String status
    ) {
        this.seatId = seatId;
        this.tripId = tripId;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.status = status;
    }

    public Seat(
            String seatId,
            String seatNumber,
            String seatType,
            String status
    ) {
        this(seatId, null, seatNumber, seatType, status);
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}