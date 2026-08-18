package com.example.hethongquanlydatvexe.model;

public class Ticket {
    private String ticketId;
    private Customer customer;
    private BusTrip trip;
    private Seat seat;
    private double price;
    private String status;           // "HOLDING", "PAID", "CANCELLED"
    private String paymentMethod;    // "BANKING", "E_WALLET", "CASH"
    private String createdAt;
    private String expiresAt;
    private String paidAt;

    public Ticket() {
        this.status = "HOLDING";
        this.paymentMethod = "BANKING";
    }

    public Ticket(String ticketId, Customer customer, BusTrip trip, Seat seat, double price) {
        this.ticketId = ticketId;
        this.customer = customer;
        this.trip = trip;
        this.seat = seat;
        this.price = price;
        this.status = "HOLDING";
        this.paymentMethod = "BANKING";
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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }

    public String getPaidAt() { return paidAt; }
    public void setPaidAt(String paidAt) { this.paidAt = paidAt; }
}