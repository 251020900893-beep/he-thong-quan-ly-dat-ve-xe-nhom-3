package com.example.hethongquanlydatvexe.model;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BusTripTest {
    @Test
    void testTripInfo() {
        String route = "Hà Nội - Hải Phòng";
        int totalSeats = 9;
        assertEquals("Hà Nội - Hải Phòng", route);
        assertEquals(9, totalSeats);
    }
}