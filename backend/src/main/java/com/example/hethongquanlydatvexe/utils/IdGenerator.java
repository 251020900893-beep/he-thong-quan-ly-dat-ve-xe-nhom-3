package com.example.hethongquanlydatvexe.utils;

import java.util.concurrent.atomic.AtomicInteger;

public class IdGenerator {
    private static final AtomicInteger CUSTOMER_SEQ = new AtomicInteger(0);
    private static final AtomicInteger BOOKING_SEQ = new AtomicInteger(0);
    private static final AtomicInteger TICKET_SEQ = new AtomicInteger(0);
    private static final AtomicInteger PAYMENT_SEQ = new AtomicInteger(0);

    private IdGenerator() {}

    public static String nextCustomerId() {
        return String.format("CUS%03d", CUSTOMER_SEQ.incrementAndGet());
    }

    public static String nextBookingId() {
        return String.format("BKG%03d", BOOKING_SEQ.incrementAndGet());
    }

    public static String nextTicketId() {
        return String.format("TIC%03d", TICKET_SEQ.incrementAndGet());
    }

    public static String nextPaymentId() {
        return String.format("PAY%03d", PAYMENT_SEQ.incrementAndGet());
    }
}