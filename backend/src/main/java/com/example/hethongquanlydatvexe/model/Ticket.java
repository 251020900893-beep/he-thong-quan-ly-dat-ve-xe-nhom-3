package com.example.hethongquanlydatvexe.model;

public class Ticket {
    private String ticketId;
    private Customer customer;
    private BusTrip trip;
    private Seat seat;
    private double price;

    public Ticket() {
    }

    public Ticket(String ticketId, Customer customer, BusTrip trip, Seat seat, double price) {
        this.ticketId = ticketId;
        this.customer = customer;
        this.trip = trip;
        this.seat = seat;
        this.price = price;
    }

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public BusTrip getTrip() { return trip; }
    public void setTrip(BusTrip trip) { this.trip = trip; }

    public Seat getSeat() { return seat; }
    public void setSeat(Seat seat) { this.seat = seat; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}