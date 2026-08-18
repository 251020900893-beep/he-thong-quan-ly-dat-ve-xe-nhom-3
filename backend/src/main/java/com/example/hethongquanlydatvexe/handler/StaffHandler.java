package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.repository.BookingRepository;
import com.example.hethongquanlydatvexe.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/staff")
@CrossOrigin(origins = "*")
public class StaffHandler {
    private final TicketRepository ticketRepo = new TicketRepository();
    private final BookingRepository bookingRepo = new BookingRepository();

    // GET /staff/dashboard-stats
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        var tickets = ticketRepo.findAll();
        double totalRevenue = tickets.stream().mapToDouble(t -> t.getPrice()).sum();
        int totalTickets = tickets.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalTicketsBooked", totalTickets);
        stats.put("occupancyRate", 85.5); // % tỷ lệ lấp đầy
        return ResponseEntity.ok(stats);
    }
}