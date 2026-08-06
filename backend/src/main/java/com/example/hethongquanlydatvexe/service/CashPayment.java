package com.example.hethongquanlydatvexe.service;

public class CashPayment implements PaymentMethod {
    @Override
    public boolean pay(double amount) {
        // Logic xử lý thu tiền mặt
        return true;
    }
}