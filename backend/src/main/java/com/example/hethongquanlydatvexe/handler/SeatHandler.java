package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.service.SeatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
public class SeatHandler {

    private final SeatService seatService =
            new SeatService();

    @GetMapping
    public ResponseEntity<List<Seat>> getAllSeats() {

        List<Seat> seats =
                seatService.getAllSeats();

        return ResponseEntity.ok(seats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSeatById(
            @PathVariable String id) {

        try {

            Seat seat =
                    seatService.findSeatById(id);

            return ResponseEntity.ok(seat);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        }
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getSeatsByTrip(
            @PathVariable String tripId) {

        try {

            List<Seat> seats =
                    seatService.getSeatsByTrip(tripId);

            return ResponseEntity.ok(seats);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    @GetMapping("/trip/{tripId}/available")
    public ResponseEntity<?> getAvailableSeats(
            @PathVariable String tripId) {

        try {

            List<Seat> seats =
                    seatService.getAvailableSeatsByTrip(tripId);

            return ResponseEntity.ok(seats);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    @GetMapping("/trip/{tripId}/{seatNumber}")
    public ResponseEntity<?> getSeat(
            @PathVariable String tripId,
            @PathVariable String seatNumber) {

        try {

            Seat seat =
                    seatService.findSeatInTrip(
                            tripId,
                            seatNumber
                    );

            return ResponseEntity.ok(seat);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    @PostMapping
    public ResponseEntity<?> createSeat(
            @RequestBody Seat seat) {

        try {

            seatService.createSeat(seat);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Thêm ghế thành công.");

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSeat(
            @PathVariable String id,
            @RequestBody Seat seat) {

        try {

            seat.setSeatId(id);

            seatService.updateSeat(seat);

            return ResponseEntity.ok(
                    "Cập nhật ghế thành công."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSeat(
            @PathVariable String id) {

        try {

            seatService.deleteSeat(id);

            return ResponseEntity.ok(
                    "Xóa ghế thành công."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

}