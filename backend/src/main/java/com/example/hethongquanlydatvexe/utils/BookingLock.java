package com.example.hethongquanlydatvexe.utils;

public final class BookingLock {

    private BookingLock() {
    }

    /**
     * Shared JVM lock cho toàn bộ state transition liên quan:
     * Seat + Ticket + Booking.
     *
     * Các Service có khả năng đọc/sửa trạng thái booking
     * phải dùng cùng LOCK này.
     */
    public static final Object LOCK = new Object();
}