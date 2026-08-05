package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.BusTrip;

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

        boolean removed = trips.removeIf(
                trip -> trip.getTripId().equals(tripId)
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

}