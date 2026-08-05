package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Booking;
import com.example.hethongquanlydatvexe.model.Ticket;

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
        if (isBlank(bookingId)) {
            return null;
        }

        for (Booking booking : findAll()) {
            if (sameText(
                    booking.getBookingId(),
                    bookingId
            )) {
                return booking;
            }
        }

        return null;
    }

    public List<Booking> findByCustomerId(
            String customerId
    ) {
        List<Booking> result = new ArrayList<>();

        if (isBlank(customerId)) {
            return result;
        }

        for (Booking booking : findAll()) {
            if (booking.getCustomer() != null
                    && sameText(
                    booking.getCustomer().getId(),
                    customerId
            )) {
                result.add(booking);
            }
        }

        return result;
    }

    public Booking findByTicketId(String ticketId) {
        if (isBlank(ticketId)) {
            return null;
        }

        for (Booking booking : findAll()) {
            List<Ticket> tickets = booking.getTickets();

            if (tickets == null) {
                continue;
            }

            for (Ticket ticket : tickets) {
                if (ticket != null
                        && sameText(
                        ticket.getTicketId(),
                        ticketId
                )) {
                    return booking;
                }
            }
        }

        return null;
    }

    public List<Booking> findByTripId(String tripId) {
        List<Booking> result = new ArrayList<>();

        if (isBlank(tripId)) {
            return result;
        }

        for (Booking booking : findAll()) {
            if (containsTrip(
                    booking,
                    tripId
            )) {
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
                || isBlank(booking.getBookingId())) {

            return false;
        }

        List<Booking> bookings = findAll();

        for (int i = 0; i < bookings.size(); i++) {
            Booking currentBooking = bookings.get(i);

            if (sameText(
                    currentBooking.getBookingId(),
                    booking.getBookingId()
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
        if (isBlank(bookingId)) {
            return false;
        }

        List<Booking> bookings = findAll();

        boolean removed = bookings.removeIf(
                booking -> sameText(
                        booking.getBookingId(),
                        bookingId
                )
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

    public boolean ticketExistsInBooking(
            String ticketId
    ) {
        return findByTicketId(ticketId) != null;
    }

    public int count() {
        return findAll().size();
    }

    public int countByCustomerId(
            String customerId
    ) {
        return findByCustomerId(
                customerId
        ).size();
    }

    public int countByTripId(
            String tripId
    ) {
        return findByTripId(
                tripId
        ).size();
    }

    private boolean containsTrip(
            Booking booking,
            String tripId
    ) {
        if (booking == null
                || booking.getTickets() == null) {

            return false;
        }

        for (Ticket ticket : booking.getTickets()) {
            if (ticket != null
                    && ticket.getTrip() != null
                    && sameText(
                    ticket.getTrip().getTripId(),
                    tripId
            )) {
                return true;
            }
        }

        return false;
    }

    private boolean sameText(
            String firstValue,
            String secondValue
    ) {
        return firstValue != null
                && secondValue != null
                && firstValue.trim()
                .equalsIgnoreCase(secondValue.trim());
    }

    private boolean isBlank(String value) {
        return value == null
                || value.trim().isEmpty();
    }
}