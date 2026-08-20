package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Ticket;
import com.example.hethongquanlydatvexe.dto.ApiResponse;
import com.example.hethongquanlydatvexe.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/tickets", "/api/tickets"})
@CrossOrigin(origins = "*")
public class TicketHandler {

    // Handler chỉ phụ thuộc vào Service (Đảm bảo chuẩn Kiến trúc 3 Tầng)
    private final TicketService ticketService = new TicketService();

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Ticket>>> searchTickets(
            @RequestParam(value = "query", defaultValue = "") String query) {
        List<Ticket> results = ticketService.searchTickets(query);
        return ResponseEntity.ok(ApiResponse.ok(results, "Tra cứu danh sách vé thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> getTicketById(@PathVariable String id) {
        Ticket ticket = ticketService.getTicketById(id);
        if (ticket != null) {
            return ResponseEntity.ok(ApiResponse.ok(ticket, "Tìm thấy thông tin vé"));
        }
        return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy mã vé: " + id));
    }

    @PostMapping("/reset-data")
    public ResponseEntity<ApiResponse<Void>> resetData(
            @RequestHeader(value = "X-Reset-Confirm", required = false) String confirmation) {
        if (!"RESET-DEMO-DATA".equals(confirmation)) {
            throw new IllegalArgumentException("Thiếu xác nhận reset dữ liệu hợp lệ");
        }
        ticketService.resetAllData();
        return ResponseEntity.ok(ApiResponse.ok(null, "Đã khôi phục dữ liệu gốc thành công!"));
    }
}
