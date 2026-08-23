# KỊCH BẢN VÀ KẾT QUẢ KIỂM THỬ ĐẦU-CUỐI (E2E SMOKE TEST)

Kiểm tra toàn bộ luồng tương tác thực tế giữa Frontend React và Backend Spring Boot:

| Bước thực hiện | Thao tác thực tế | Kết quả ghi nhận | Trạng thái |
| :---: | :--- | :--- | :---: |
| **1** | Khởi động hệ thống | Backend mở tại `localhost:8080`, Frontend mở tại `localhost:5173`. | **PASS ✅** |
| **2** | Tra cứu danh sách xe | API `GET /api/trips` nạp danh sách 12 chuyến xe thành công. | **PASS ✅** |
| **3** | Mở sơ đồ ghế | Chọn chuyến `CX001`, sơ đồ 12 ghế hiển thị trực quan các màu trống/bán. | **PASS ✅** |
| **4** | Đặt giữ chỗ ghế VIP | Chọn ghế `B1` (+50k), nhập khách VIP `0912345678`, tự giảm 20% ra 224.000đ. | **PASS ✅** |
| **5** | Đếm ngược 180s | Modal thanh toán mở, ghế B1 chuyển cam, đồng hồ đếm ngược 03:00 chạy. | **PASS ✅** |
| **6** | Test Overbooking | Mở tab ẩn danh chọn đúng ghế B1 $\rightarrow$ Báo lỗi đỏ *"Ghế đang có người giữ!"*. | **PASS ✅** |
| **7** | Thanh toán | Chọn Ví điện tử, bấm xác nhận $\rightarrow$ Vé đổi sang `PAID`, ghế đổi `BOOKED`. | **PASS ✅** |
| **8** | Staff Dashboard | Đăng nhập `admin/123456` $\rightarrow$ Doanh thu và tỷ lệ lấp đầy cập nhật tức thì. | **PASS ✅** |
