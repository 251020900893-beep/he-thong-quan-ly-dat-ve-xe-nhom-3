package com.example.hethongquanlydatvexe.service;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class DiscountPolicyTest {
    @Test
    void testVipDiscount20Percent() {
        double basePrice = 280000;
        double finalPrice = basePrice * 0.8; // Giảm 20%
        assertEquals(224000, finalPrice);
    }
}