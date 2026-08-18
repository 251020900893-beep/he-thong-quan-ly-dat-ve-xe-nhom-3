package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.dto.ApiResponse;
import com.example.hethongquanlydatvexe.service.SeatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/seats", "/api/seats"})
@CrossOrigin(origins = "*")
public class SeatHandler {

    private final SeatService seatService = new SeatService();

    @GetMapping
    public ResponseEntity<ApiResponse<List<Seat>>> getAllSeats() {
        List<Seat> seats = seatService.getAllSeats();
        return ResponseEntity.ok(ApiResponse.ok(seats, "Lấy danh sách tất cả các ghế thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Seat>> getSeatById(@PathVariable String id) {
        Seat seat = seatService.findSeatById(id);
        return ResponseEntity.ok(ApiResponse.ok(seat, "Tìm thấy thông tin ghế"));
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<ApiResponse<List<Seat>>> getSeatsByTrip(@PathVariable String tripId) {
        List<Seat> seats = seatService.getSeatsByTrip(tripId);
        return ResponseEntity.ok(ApiResponse.ok(seats, "Lấy danh sách ghế theo chuyến xe thành công"));
    }

    @GetMapping("/trip/{tripId}/available")
    public ResponseEntity<ApiResponse<List<Seat>>> getAvailableSeats(@PathVariable String tripId) {
        List<Seat> seats = seatService.getAvailableSeatsByTrip(tripId);
        return ResponseEntity.ok(ApiResponse.ok(seats, "Lấy danh sách ghế còn trống thành công"));
    }

    @GetMapping("/trip/{tripId}/{seatNumber}")
    public ResponseEntity<ApiResponse<Seat>> getSeat(
            @PathVariable String tripId,
            @PathVariable String seatNumber) {
        Seat seat = seatService.findSeatInTrip(tripId, seatNumber);
        return ResponseEntity.ok(ApiResponse.ok(seat, "Tìm thấy thông tin vị trí ghế"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createSeat(@RequestBody Seat seat) {
        seatService.createSeat(seat);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(null, "Thêm ghế thành công."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateSeat(
            @PathVariable String id,
            @RequestBody Seat seat) {
        seat.setSeatId(id);
        seatService.updateSeat(seat);
        return ResponseEntity.ok(ApiResponse.ok(null, "Cập nhật thông tin ghế thành công."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSeat(@PathVariable String id) {
        seatService.deleteSeat(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa ghế thành công."));
    }
}