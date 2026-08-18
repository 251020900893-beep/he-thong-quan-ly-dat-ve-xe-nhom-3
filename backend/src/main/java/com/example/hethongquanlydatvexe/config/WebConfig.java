package com.example.hethongquanlydatvexe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * File cấu hình CORS chung cho toàn bộ hệ thống backend.
 * Cho phép Frontend (React / Vite) gửi request đến tất cả các API mà không bị chặn bởi trình duyệt.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho tất cả các đường dẫn API (/trips, /seats, /bookings, /tickets,...)
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173",
                        "http://127.0.0.1:3000",
                        "http://127.0.0.1:5173",
                        "*" // Cho phép tất cả các domain hoặc port của Frontend
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Cho phép các phương thức HTTP
                .allowedHeaders("*") // Cho phép tất cả các headers
                .allowCredentials(false) // Đặt false nếu allowedOrigins là "*"
                .maxAge(3600); // Lưu cache cấu hình CORS trong 1 giờ để tối ưu tốc độ
    }
}