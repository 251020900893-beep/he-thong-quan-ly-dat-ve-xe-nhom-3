package com.example.hethongquanlydatvexe;

public class Payment {

    private String paymentId;
    private String bookingId;
    private String paymentMethod;
    private double amount;
    private String paymentStatus;

    public Payment() {
    }
    public Payment(
            String paymentId,
            String bookingId,
            String paymentMethod,
            double amount,
            String paymentStatus
    ) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
    }

    public Payment(
            String paymentId,
            String paymentMethod,
            double amount,
            String paymentStatus
    ) {
        this(
                paymentId,
                null,
                paymentMethod,
                amount,
                paymentStatus
        );
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}