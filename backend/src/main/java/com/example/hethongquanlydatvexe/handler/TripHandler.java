package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
public class TripHandler {

    private final TripService tripService =
            new TripService();

    @GetMapping
    public ResponseEntity<List<BusTrip>> getAllTrips() {

        List<BusTrip> trips =
                tripService.getAllTrips();

        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(
            @PathVariable String id) {

        try {

            BusTrip trip =
                    tripService.findTripById(id);

            return ResponseEntity.ok(trip);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTrips(
            @RequestParam String departure,
            @RequestParam String destination) {

        try {

            List<BusTrip> trips =
                    tripService.findTrips(
                            departure,
                            destination
                    );

            return ResponseEntity.ok(trips);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    @PostMapping
    public ResponseEntity<?> createTrip(
            @RequestBody BusTrip trip) {

        try {

            tripService.createTrip(trip);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Thêm chuyến xe thành công.");

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(
            @PathVariable String id,
            @RequestBody BusTrip trip) {

        try {

            trip.setTripId(id);

            tripService.updateTrip(trip);

            return ResponseEntity.ok(
                    "Cập nhật chuyến xe thành công."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(
            @PathVariable String id) {

        try {

            tripService.deleteTrip(id);

            return ResponseEntity.ok(
                    "Xóa chuyến xe thành công."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

}