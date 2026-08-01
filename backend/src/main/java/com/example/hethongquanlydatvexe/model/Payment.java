package com.example.hethongquanlydatvexe.model;

public class Payment {
    private String paymentId;
    private String paymentMethod; // VD: TienMat, ChuyenKhoan
    private double amount;
    private String paymentStatus; // VD: ThanhCong, ThatBat

    public Payment() {
    }

    public Payment(String paymentId, String paymentMethod, double amount, String paymentStatus) {
        this.paymentId = paymentId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}