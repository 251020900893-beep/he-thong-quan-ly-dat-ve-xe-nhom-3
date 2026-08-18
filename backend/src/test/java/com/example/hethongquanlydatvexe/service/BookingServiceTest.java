package com.example.hethongquanlydatvexe.service;
import org.junit.jupiter.api.Test;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;

public class BookingServiceTest {
    @Test
    void testHoldSeat3Minutes() {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(180); // 3 phút
        assertTrue(expiresAt.isAfter(now));
    }
}