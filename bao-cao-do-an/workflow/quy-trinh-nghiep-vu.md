# Quy trình Đặt vé và Vận hành Hệ thống (Workflow)

1. **Khách hàng tra cứu chuyến:** Xem 12 chuyến xe Hà Nội ⇄ Hải Phòng từ 06:30 đến 18:00 (`GET /api/trips`).
2. **Chọn ghế & Tự động tính giá:** Chọn vị trí ghế trên sơ đồ xe Limousine (VIP phụ thu +50k), hệ thống áp dụng đa hình chiết khấu (`VIP -20%`, `MEMBER -10%`, `NORMAL 0%`).
3. **Kích hoạt giữ chỗ 3 phút:** Gửi request `POST /api/booking/hold`, khóa luồng `BookingLock.LOCK`, ghế chuyển `HOLDING`, đồng hồ đếm ngược 180s hiển thị.
4. **Chặn đặt trùng (Overbooking):** Mọi request khác cùng chọn ghế này trong 180s bị chặn lại với ngoại lệ `BusinessRuleException`.
5. **Thanh toán & Xuất vé:** Khách chọn VietQR / MoMo / Tiền mặt (`POST /api/payment/process`) $\rightarrow$ Vé đổi sang `PAID`, ghế sang `BOOKED`.
6. **Thống kê Quản trị:** Doanh thu và tỷ lệ lấp đầy ghế tự động cập nhật lên `StaffDashboard` (`GET /api/staff/dashboard-stats`).