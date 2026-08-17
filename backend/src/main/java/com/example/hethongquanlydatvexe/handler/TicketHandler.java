package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Ticket;
import com.example.hethongquanlydatvexe.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketHandler {
    private final TicketRepository ticketRepo = new TicketRepository();

    // GET /tickets/search?query=0901234567 hoặc GET /tickets/search?query=T001
    @GetMapping("/search")
    public ResponseEntity<List<Ticket>> searchTickets(@RequestParam("query") String query) {
        String q = query.trim().toLowerCase();
        List<Ticket> results = ticketRepo.findAll().stream()
                .filter(t -> t.getTicketId().toLowerCase().contains(q) ||
                        (t.getCustomer() != null && t.getCustomer().getPhone().contains(q)) ||
                        (t.getCustomer() != null && t.getCustomer().getFullName().toLowerCase().contains(q)))
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    // GET /tickets/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id) {
        Ticket ticket = ticketRepo.findById(id);
        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}