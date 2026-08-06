package com.example.hethongquanlydatvexe.service;

public class EWalletPayment implements PaymentMethod {
    @Override
    public boolean pay(double amount) {
        // Logic kết nối Ví MoMo / VNPay / ZaloPay
        return true;
    }
}