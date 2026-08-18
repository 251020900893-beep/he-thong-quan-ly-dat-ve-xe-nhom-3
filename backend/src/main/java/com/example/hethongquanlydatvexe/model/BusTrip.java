package com.example.hethongquanlydatvexe.model;

import java.util.List;

public class BusTrip {
    private String tripId;
    private String tripCode;
    private String departure;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private String licensePlate;
    private String busType;
    private double basePrice;
    private int totalSeats;
    private String driverName;
    private List<String> pickupPoints;
    private List<String> dropoffPoints;

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

    public String getTripId() {
        return tripId;
    }

    public void setTripId(String tripId) {
        this.tripId = tripId;
    }

    public String getTripCode() {
        return tripCode;
    }

    public void setTripCode(String tripCode) {
        this.tripCode = tripCode;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getBusType() {
        return busType;
    }

    public void setBusType(String busType) {
        this.busType = busType;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public List<String> getPickupPoints() {
        return pickupPoints;
    }

    public void setPickupPoints(List<String> pickupPoints) {
        this.pickupPoints = pickupPoints;
    }

    public List<String> getDropoffPoints() {
        return dropoffPoints;
    }

    public void setDropoffPoints(List<String> dropoffPoints) {
        this.dropoffPoints = dropoffPoints;
    }
}