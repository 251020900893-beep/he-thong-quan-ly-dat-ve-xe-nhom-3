package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Booking;

import java.util.ArrayList;
import java.util.List;

public class BookingRepository {

    private static final String FILE_PATH = "data/bookings.json";

    private final FileManager fileManager = new FileManager();

    public List<Booking> findAll() {
        return fileManager.readList(
                FILE_PATH,
                FileManager.getListType(Booking.class)
        );
    }

    public Booking findById(String bookingId) {
        if (bookingId == null || bookingId.trim().isEmpty()) {
            return null;
        }

        List<Booking> bookings = findAll();

        for (Booking booking : bookings) {
            if (booking.getBookingId() != null
                    && booking.getBookingId()
                    .equalsIgnoreCase(bookingId.trim())) {

                return booking;
            }
        }

        return null;
    }

    public List<Booking> findByCustomerId(String customerId) {
        List<Booking> result = new ArrayList<>();

        if (customerId == null || customerId.trim().isEmpty()) {
            return result;
        }

        List<Booking> bookings = findAll();

        for (Booking booking : bookings) {
            if (booking.getCustomer() != null
                    && booking.getCustomer().getId() != null
                    && booking.getCustomer().getId()
                    .equalsIgnoreCase(customerId.trim())) {

                result.add(booking);
            }
        }

        return result;
    }

    public void save(Booking booking) {
        List<Booking> bookings = findAll();

        bookings.add(booking);

        fileManager.writeList(
                FILE_PATH,
                bookings
        );
    }

    public boolean update(Booking booking) {
        if (booking == null
                || booking.getBookingId() == null
                || booking.getBookingId().trim().isEmpty()) {

            return false;
        }

        List<Booking> bookings = findAll();

        for (int i = 0; i < bookings.size(); i++) {
            Booking currentBooking = bookings.get(i);

            if (currentBooking.getBookingId() != null
                    && currentBooking.getBookingId()
                    .equalsIgnoreCase(
                            booking.getBookingId().trim()
                    )) {

                bookings.set(i, booking);

                fileManager.writeList(
                        FILE_PATH,
                        bookings
                );

                return true;
            }
        }

        return false;
    }

    public boolean delete(String bookingId) {
        if (bookingId == null || bookingId.trim().isEmpty()) {
            return false;
        }

        List<Booking> bookings = findAll();

        boolean removed = bookings.removeIf(
                booking -> booking.getBookingId() != null
                        && booking.getBookingId()
                        .equalsIgnoreCase(bookingId.trim())
        );

        if (removed) {
            fileManager.writeList(
                    FILE_PATH,
                    bookings
            );
        }

        return removed;
    }

    public boolean exists(String bookingId) {
        return findById(bookingId) != null;
    }

    public int count() {
        return findAll().size();
    }
}