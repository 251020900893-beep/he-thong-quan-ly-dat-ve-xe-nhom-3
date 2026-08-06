package com.example.hethongquanlydatvexe.service;

public class StandardDiscount implements DiscountPolicy {
    private double discountPercentage;

    public StandardDiscount(double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    @Override
    public double calculateDiscount(double basePrice) {
        return basePrice * (discountPercentage / 100);
    }
}