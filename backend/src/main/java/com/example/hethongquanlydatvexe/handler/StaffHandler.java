package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.dto.ApiResponse;
import com.example.hethongquanlydatvexe.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/staff", "/api/staff"})
@CrossOrigin(origins = "*")
public class StaffHandler {

    private final TicketService ticketService = new TicketService();

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = ticketService.getStaffDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats, "Lấy thống kê doanh thu thành công"));
    }
}