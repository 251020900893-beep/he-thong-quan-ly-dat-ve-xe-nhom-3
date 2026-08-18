package com.example.hethongquanlydatvexe.model;

import java.util.List;

public class Booking {
    private String bookingId;
    private Customer customer;
    private List<Ticket> tickets;
    private double totalAmount;
    private String bookingTime;

    public Booking() {
    }

    public Booking(String bookingId, Customer customer, List<Ticket> tickets, double totalAmount, String bookingTime) {
        this.bookingId = bookingId;
        this.customer = customer;
        this.tickets = tickets;
        this.totalAmount = totalAmount;
        this.bookingTime = bookingTime;
    }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public List<Ticket> getTickets() { return tickets; }
    public void setTickets(List<Ticket> tickets) { this.tickets = tickets; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getBookingTime() { return bookingTime; }
    public void setBookingTime(String bookingTime) { this.bookingTime = bookingTime; }
}