package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.BusTrip;
import com.example.hethongquanlydatvexe.dto.ApiResponse;
import com.example.hethongquanlydatvexe.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/trips", "/api/trips"})
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TripHandler {

    private final TripService tripService = new TripService();

    @GetMapping
    public ResponseEntity<ApiResponse<List<BusTrip>>> getAllTrips() {
        List<BusTrip> trips = tripService.getAllTrips();
        return ResponseEntity.ok(ApiResponse.ok(trips, "Lấy danh sách chuyến xe thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusTrip>> getTripById(@PathVariable String id) {
        BusTrip trip = tripService.findTripById(id);
        return ResponseEntity.ok(ApiResponse.ok(trip, "Tìm thấy chuyến xe"));
    }
}