package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.BusTrip;

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
        List<BusTrip> trips = findAll();

        for (BusTrip trip : trips) {
            if (trip.getTripId().equals(tripId)) {
                return trip;
            }
        }

        return null;
    }

    public List<BusTrip> findByRoute(
            String departure,
            String destination
    ) {
        List<BusTrip> result = new ArrayList<>();
        List<BusTrip> trips = findAll();

        for (BusTrip trip : trips) {
            if (trip.getDeparture().equals(departure)
                    && trip.getDestination().equals(destination)) {
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
        List<BusTrip> trips = findAll();

        for (int i = 0; i < trips.size(); i++) {
            if (trips.get(i).getTripId().equals(trip.getTripId())) {
                trips.set(i, trip);
                fileManager.writeList(FILE_PATH, trips);
                return true;
            }
        }

        return false;
    }

    public boolean delete(String tripId) {
        List<BusTrip> trips = findAll();

        for (int i = 0; i < trips.size(); i++) {
            if (trips.get(i).getTripId().equals(tripId)) {
                trips.remove(i);
                fileManager.writeList(FILE_PATH, trips);
                return true;
            }
        }

        return false;
    }

    public boolean exists(String tripId) {
        return findById(tripId) != null;
    }
}