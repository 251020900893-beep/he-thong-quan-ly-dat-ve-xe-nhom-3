package com.example.hethongquanlydatvexe.utils;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.Collection;
import com.example.hethongquanlydatvexe.model.Customer;

public final class IdGenerator {

    private static final AtomicInteger CUSTOMER_SEQ =
            new AtomicInteger(5);

    private static final AtomicInteger BOOKING_SEQ =
            new AtomicInteger(1);

    private static final AtomicInteger TICKET_SEQ =
            new AtomicInteger(1);

    private static final AtomicInteger PAYMENT_SEQ =
            new AtomicInteger(0);

    private IdGenerator() {
    }

    public static String nextCustomerId() {
        return String.format(
                "KH%03d",
                CUSTOMER_SEQ.incrementAndGet()
        );
    }

    public static synchronized String nextCustomerId(Collection<Customer> existingCustomers) {
        int maxExisting = existingCustomers == null ? 0 : existingCustomers.stream()
                .map(Customer::getId)
                .filter(id -> id != null && id.matches("KH\\d+"))
                .mapToInt(id -> Integer.parseInt(id.substring(2)))
                .max()
                .orElse(0);
        CUSTOMER_SEQ.updateAndGet(current -> Math.max(current, maxExisting));
        return nextCustomerId();
    }

    public static String nextBookingId() {
        return String.format(
                "BK%03d",
                BOOKING_SEQ.incrementAndGet()
        );
    }

    public static String nextTicketId() {
        return String.format(
                "T%03d",
                TICKET_SEQ.incrementAndGet()
        );
    }

    public static String nextPaymentId() {
        return String.format(
                "TT%03d",
                PAYMENT_SEQ.incrementAndGet()
        );
    }
}
