package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.model.Ticket;
import com.example.hethongquanlydatvexe.repository.SeatRepository;
import com.example.hethongquanlydatvexe.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/tickets", "/api/tickets"})
@CrossOrigin(origins = "*")
public class TicketHandler {
    private final TicketRepository ticketRepo = new TicketRepository();
    private final SeatRepository seatRepo = new SeatRepository();

    @GetMapping("/search")
    public ResponseEntity<List<Ticket>> searchTickets(@RequestParam(value = "query", defaultValue = "") String query) {
        List<Ticket> allTickets = ticketRepo.findAll();
        boolean hasChange = false;

        // 🚀 TỰ ĐỘNG QUÉT VÉ HẾT HẠN 3 PHÚT (180s)
        for (Ticket t : allTickets) {
            if ("HOLDING".equalsIgnoreCase(t.getStatus())) {
                boolean isExpired = false;

                // 1. Kiểm tra theo expiresAt của vé
                if (t.getExpiresAt() != null) {
                    try {
                        Instant exp = Instant.parse(t.getExpiresAt());
                        if (Instant.now().isAfter(exp)) {
                            isExpired = true;
                        }
                    } catch (Exception ignored) {}
                }

                // 2. Kiểm tra theo ghế trong seats.json
                if (t.getSeat() != null && t.getTrip() != null) {
                    Seat seat = seatRepo.findByTripIdAndSeatNumber(t.getTrip().getTripId(), t.getSeat().getSeatNumber());
                    if (seat != null) {
                        if (seat.checkAndAutoReleaseHold() || !"HOLDING".equalsIgnoreCase(seat.getStatus())) {
                            isExpired = true;
                            seatRepo.update(seat);
                        }
                    }
                }

                // Chuyển sang CANCELLED nếu hết hạn
                if (isExpired) {
                    t.setStatus("CANCELLED");
                    hasChange = true;
                }
            }
        }

        if (hasChange) {
            for (Ticket t : allTickets) {
                ticketRepo.update(t);
            }
        }

        // Lọc kết quả tìm kiếm
        String q = query.trim().toLowerCase();
        List<Ticket> results = allTickets.stream()
                .filter(t -> q.isEmpty() ||
                        (t.getTicketId() != null && t.getTicketId().toLowerCase().contains(q)) ||
                        (t.getCustomer() != null && t.getCustomer().getPhone() != null && t.getCustomer().getPhone().contains(q)) ||
                        (t.getCustomer() != null && t.getCustomer().getFullName() != null && t.getCustomer().getFullName().toLowerCase().contains(q)))
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id) {
        Ticket ticket = ticketRepo.findById(id);
        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    // POST /tickets/reset-data hoặc /api/tickets/reset-data
    @PostMapping("/reset-data")
    public ResponseEntity<?> resetData() {
        // 1. Reset toàn bộ ghế về trạng thái AVAILABLE (Trống)
        List<Seat> allSeats = seatRepo.findAll();
        for (Seat s : allSeats) {
            s.setStatus("AVAILABLE");
            s.releaseHold(); // Giải phóng ghế nếu có hàm releaseHold
            seatRepo.update(s);
        }

        // 2. Reset danh sách vé về 2 vé mẫu ban đầu
        ticketRepo.initSampleTicketsIfEmpty();

        return ResponseEntity.ok(com.example.hethongquanlydatvexe.dto.ApiResponse.ok(null, "Đã khôi phục dữ liệu gốc thành công!"));
    }
}