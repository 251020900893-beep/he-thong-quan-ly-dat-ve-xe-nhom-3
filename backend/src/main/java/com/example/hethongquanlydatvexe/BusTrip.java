package com.example.hethongquanlydatvexe;

import java.util.ArrayList;
import java.util.List;

public class BusTrip {
    private String id;
    private String tripId;
    private String tripCode;
    private String departure;
    private String destination;
    private String departureLocation;
    private String destinationLocation;
    private String departureTime;
    private String arrivalTime;
    private String licensePlate;
    private String busPlate;
    private String busType;
    private double basePrice;
    private int totalSeats;
    private String driverName;
    private List<String> pickupPoints = new ArrayList<>();
    private List<String> dropoffPoints = new ArrayList<>();
    private List<Seat> seats = new ArrayList<>();

    public BusTrip() {}

    public String getId() { return (id != null) ? id : tripId; }
    public void setId(String id) { this.id = id; this.tripId = id; }

    public String getTripId() { return (tripId != null) ? tripId : id; }
    public void setTripId(String tripId) { this.tripId = tripId; this.id = tripId; }

    public String getTripCode() { return tripCode; }
    public void setTripCode(String tripCode) { this.tripCode = tripCode; }

    public String getDeparture() { return departure; }
    public void setDeparture(String departure) {
        this.departure = departure;
        this.departureLocation = departure;
    }

    public String getDestination() { return destination; }
    public void setDestination(String destination) {
        this.destination = destination;
        this.destinationLocation = destination;
    }

    public String getDepartureLocation() { return (departureLocation != null) ? departureLocation : departure; }
    public void setDepartureLocation(String departureLocation) {
        this.departureLocation = departureLocation;
        this.departure = departureLocation;
    }

    public String getDestinationLocation() { return (destinationLocation != null) ? destinationLocation : destination; }
    public void setDestinationLocation(String destinationLocation) {
        this.destinationLocation = destinationLocation;
        this.destination = destinationLocation;
    }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getLicensePlate() { return (licensePlate != null) ? licensePlate : busPlate; }
    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
        this.busPlate = licensePlate;
    }

    public String getBusPlate() { return (busPlate != null) ? busPlate : licensePlate; }
    public void setBusPlate(String busPlate) {
        this.busPlate = busPlate;
        this.licensePlate = busPlate;
    }

    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }

    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }

    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public List<String> getPickupPoints() { return pickupPoints; }
    public void setPickupPoints(List<String> pickupPoints) { this.pickupPoints = pickupPoints; }

    public List<String> getDropoffPoints() { return dropoffPoints; }
    public void setDropoffPoints(List<String> dropoffPoints) { this.dropoffPoints = dropoffPoints; }

    public List<Seat> getSeats() { return seats; }
    public void setSeats(List<Seat> seats) { this.seats = seats; }
}