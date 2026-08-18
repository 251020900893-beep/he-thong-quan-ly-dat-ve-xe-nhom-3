package com.example.hethongquanlydatvexe.service;

public class MemberDiscount implements DiscountPolicy {

    private static final double DISCOUNT_RATE = 0.10; // Giảm 10% cho thành viên

    @Override
    public double calculateDiscount(double basePrice) {
        if (basePrice <= 0) {
            return 0.0;
        }
        return basePrice * DISCOUNT_RATE;
    }
}