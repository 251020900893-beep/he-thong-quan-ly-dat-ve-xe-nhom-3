package com.example.hethongquanlydatvexe.service;

public class VipDiscount implements DiscountPolicy {

    private static final double VIP_DISCOUNT_RATE = 0.20; // Giảm 20% cho khách VIP

    @Override
    public double calculateDiscount(double basePrice) {
        if (basePrice <= 0) {
            return 0.0;
        }
        return basePrice * VIP_DISCOUNT_RATE;
    }
}