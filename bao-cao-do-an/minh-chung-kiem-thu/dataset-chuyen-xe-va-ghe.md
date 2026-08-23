# BÁO CÁO BỘ DỮ LIỆU CHUẨN (BASELINE DATASET)

## 1. Dữ liệu Chuyến xe (busTrips.json)
* **Quy mô:** 12 chuyến xe Limousine hoạt động liên tục từ 06:30 đến 18:00 hàng ngày.
* **Lộ trình:** Hà Nội (BX Mỹ Đình / Nước Ngầm) ⇄ Hải Phòng (BX Vĩnh Niệm / Lạc Long).
* **Giá vé cơ bản:** 230.000 VNĐ - 240.000 VNĐ / vé.
* **Phương tiện:** Limousine DCar VIP 9 chỗ và Limousine Luxury 12 chỗ.

## 2. Dữ liệu Sơ đồ ghế (seats.json)
* **Tổng số ghế quản lý:** 126 ghế trên toàn bộ 12 chuyến xe.
* **Phân loại ghế:**
  * **Ghế thường (A1, A2, C1, C2, C3, C4):** Phụ phí +0 VNĐ.
  * **Ghế VIP thương gia (B1 đến B6):** Phụ phí +50.000 VNĐ.
* **Trạng thái ban đầu:** 24 ghế BOOKED (đã bán), 102 ghế AVAILABLE (còn trống), 0 ghế HOLDING.

## 3. Dữ liệu Khách hàng mẫu (customers.json)
* **KH001 (VIP):** Nguyễn Văn Hùng - SĐT: `0912345678` (Hưởng ưu đãi giảm 20%).
* **KH002 (MEMBER):** Trần Thị Mai - SĐT: `0987654321` (Hưởng ưu đãi giảm 10%).
* **KH003 (NORMAL):** Lê Hoàng Nam - SĐT: `0905123456` (Giá nguyên bản 0%).
