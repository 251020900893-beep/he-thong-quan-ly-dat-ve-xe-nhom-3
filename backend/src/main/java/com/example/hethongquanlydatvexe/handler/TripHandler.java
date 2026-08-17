package com.example.hethongquanlydatvexe.handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class TripHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // 1. Cấu hình Headers (Cho phép React gọi qua CORS và định dạng UTF-8 JSON)
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");

        // Xử lý Preflight CORS OPTIONS
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            // 2. Chuỗi JSON danh sách chuyến xe (DCar Limousine VIP Hà Nội ⇄ Hải Phòng)
            String jsonResponse = "["
                    + "{\"tripId\":\"HN-HP-0830\",\"tripCode\":\"HN-HP-0830\",\"route\":\"Hà Nội ➔ Hải Phòng\",\"departureTime\":\"08:30\",\"arrivalTime\":\"10:00\",\"busType\":\"Limousine Luxury 12 Chỗ\",\"licensePlate\":\"29B-999.66\",\"driverName\":\"Trần Văn Dũng\",\"driverPhone\":\"0903.456.789\",\"direction\":\"HN_HP\",\"basePrice\":240000,\"availableSeatsCount\":12,\"totalSeatsCount\":12},"
                    + "{\"tripId\":\"HN-HP-1000\",\"tripCode\":\"HN-HP-1000\",\"route\":\"Hà Nội ➔ Hải Phòng\",\"departureTime\":\"10:00\",\"arrivalTime\":\"11:30\",\"busType\":\"Limousine VIP 9 Chỗ\",\"licensePlate\":\"15B-077.99\",\"driverName\":\"Hoàng Minh Tuấn\",\"driverPhone\":\"0982.333.555\",\"direction\":\"HN_HP\",\"basePrice\":250000,\"availableSeatsCount\":9,\"totalSeatsCount\":9},"
                    + "{\"tripId\":\"HN-HP-1200\",\"tripCode\":\"HN-HP-1200\",\"route\":\"Hà Nội ➔ Hải Phòng\",\"departureTime\":\"12:00\",\"arrivalTime\":\"13:30\",\"busType\":\"Limousine Luxury 12 Chỗ\",\"licensePlate\":\"29B-833.44\",\"driverName\":\"Phạm Văn Nam\",\"driverPhone\":\"0966.789.123\",\"direction\":\"HN_HP\",\"basePrice\":240000,\"availableSeatsCount\":12,\"totalSeatsCount\":12},"
                    + "{\"tripId\":\"HP-HN-0800\",\"tripCode\":\"HP-HN-0800\",\"route\":\"Hải Phòng ➔ Hà Nội\",\"departureTime\":\"08:00\",\"arrivalTime\":\"09:30\",\"busType\":\"Limousine Luxury 12 Chỗ\",\"licensePlate\":\"15B-888.66\",\"driverName\":\"Bùi Đức Long\",\"driverPhone\":\"0936.555.777\",\"direction\":\"HP_HN\",\"basePrice\":240000,\"availableSeatsCount\":12,\"totalSeatsCount\":12},"
                    + "{\"tripId\":\"HP-HN-0930\",\"tripCode\":\"HP-HN-0930\",\"route\":\"Hải Phòng ➔ Hà Nội\",\"departureTime\":\"09:30\",\"arrivalTime\":\"11:00\",\"busType\":\"Limousine VIP 9 Chỗ\",\"licensePlate\":\"15B-777.33\",\"driverName\":\"Đỗ Hoàng Anh\",\"driverPhone\":\"0979.123.456\",\"direction\":\"HP_HN\",\"basePrice\":250000,\"availableSeatsCount\":9,\"totalSeatsCount\":9}"
                    + "]";

            byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        } else {
            exchange.sendResponseHeaders(405, -1); // Method Not Allowed
        }
    }
}