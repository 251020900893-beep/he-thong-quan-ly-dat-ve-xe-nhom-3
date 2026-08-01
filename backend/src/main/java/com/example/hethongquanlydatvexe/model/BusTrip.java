package com.example.hethongquanlydatvexe.model;

public class BusTrip {
    private String tripId;
    private String departure;     // Điểm đi
    private String destination;   // Điểm đến
    private String departureTime; // Thời gian khởi hành
    private String licensePlate;  // Biển số xe
    private int totalSeats;       // Tổng số ghế

    public BusTrip() {
    }

    public BusTrip(String tripId, String departure, String destination, String departureTime, String licensePlate, int totalSeats) {
        this.tripId = tripId;
        this.departure = departure;
        this.destination = destination;
        this.departureTime = departureTime;
        this.licensePlate = licensePlate;
        this.totalSeats = totalSeats;
    }

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }

    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
}