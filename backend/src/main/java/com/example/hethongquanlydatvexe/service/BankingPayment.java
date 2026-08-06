package com.example.hethongquanlydatvexe.service;

public class BankingPayment implements PaymentMethod {
    @Override
    public boolean pay(double amount) {
        // Logic kết nối cổng ngân hàng / QR Code
        return true;
    }
}