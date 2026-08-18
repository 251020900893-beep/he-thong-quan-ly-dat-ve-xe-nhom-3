package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.BusTrip;
import com.example.hethongquanlydatvexe.Customer;
import com.example.hethongquanlydatvexe.Seat;

public class BookingRequest {

    private Customer customer;
    private BusTrip trip;
    private Seat seat;
    private double basePrice;
    private String paymentMethod;
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public BusTrip getTrip() {
        return trip;
    }

    public void setTrip(BusTrip trip) {
        this.trip = trip;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}