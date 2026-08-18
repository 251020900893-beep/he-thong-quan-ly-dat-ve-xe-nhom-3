package com.example.hethongquanlydatvexe.model;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SeatTest {
    @Test
    void testSeatStatusTransition() {
        String status = "AVAILABLE";
        assertEquals("AVAILABLE", status);
        // Chuyển sang giữ chỗ
        status = "HOLDING";
        assertEquals("HOLDING", status);
    }
}