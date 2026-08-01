package com.example.hethongquanlydatvexe.model;

public class Seat {
    private String seatId;
    private String seatNumber; // Số ghế (VD: A1, A2...)
    private String seatType;   // Loại ghế (VD: Thuong, VIP)
    private String status;     // Trạng thái (VD: ConTrong, DaDat)

    public Seat() {
    }

    public Seat(String seatId, String seatNumber, String seatType, String status) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.status = status;
    }

    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}