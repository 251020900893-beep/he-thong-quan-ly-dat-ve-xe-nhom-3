package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.BusTrip;

import java.util.ArrayList;
import java.util.List;

public class BusTripRepository {

    private static final String FILE_PATH = "data/busTrips.json";

    private final FileManager fileManager = new FileManager();

    public List<BusTrip> findAll() {
        return fileManager.readList(
                FILE_PATH,
                FileManager.getListType(BusTrip.class)
        );
    }

    public BusTrip findById(String tripId) {
        if (isBlank(tripId)) {
            return null;
        }

        for (BusTrip trip : findAll()) {
            if (sameText(trip.getTripId(), tripId)) {
                return trip;
            }
        }

        return null;
    }

    public List<BusTrip> findByDeparture(String departure) {
        List<BusTrip> result = new ArrayList<>();

        if (isBlank(departure)) {
            return result;
        }

        for (BusTrip trip : findAll()) {
            if (sameText(trip.getDeparture(), departure)) {
                result.add(trip);
            }
        }

        return result;
    }

    public List<BusTrip> findByDestination(String destination) {
        List<BusTrip> result = new ArrayList<>();

        if (isBlank(destination)) {
            return result;
        }

        for (BusTrip trip : findAll()) {
            if (sameText(trip.getDestination(), destination)) {
                result.add(trip);
            }
        }

        return result;
    }

    public List<BusTrip> findByRoute(
            String departure,
            String destination
    ) {
        List<BusTrip> result = new ArrayList<>();

        if (isBlank(departure) || isBlank(destination)) {
            return result;
        }

        for (BusTrip trip : findAll()) {
            boolean correctDeparture =
                    sameText(trip.getDeparture(), departure);

            boolean correctDestination =
                    sameText(trip.getDestination(), destination);

            if (correctDeparture && correctDestination) {
                result.add(trip);
            }
        }

        return result;
    }

    public void save(BusTrip trip) {
        List<BusTrip> trips = findAll();

        trips.add(trip);

        fileManager.writeList(FILE_PATH, trips);
    }

    public boolean update(BusTrip trip) {
        if (trip == null || isBlank(trip.getTripId())) {
            return false;
        }

        List<BusTrip> trips = findAll();

        for (int i = 0; i < trips.size(); i++) {
            BusTrip currentTrip = trips.get(i);

            if (sameText(
                    currentTrip.getTripId(),
                    trip.getTripId()
            )) {
                trips.set(i, trip);

                fileManager.writeList(FILE_PATH, trips);

                return true;
            }
        }

        return false;
    }

    public boolean delete(String tripId) {
        if (isBlank(tripId)) {
            return false;
        }

        List<BusTrip> trips = findAll();

        boolean removed = trips.removeIf(
                trip -> sameText(trip.getTripId(), tripId)
        );

        if (removed) {
            fileManager.writeList(FILE_PATH, trips);
        }

        return removed;
    }

    public boolean exists(String tripId) {
        return findById(tripId) != null;
    }

    public int count() {
        return findAll().size();
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