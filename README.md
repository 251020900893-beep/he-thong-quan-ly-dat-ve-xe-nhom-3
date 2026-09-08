\# Hệ thống quản lý đặt vé xe khách (Tuyến Hà Nội - Hải Phòng)



Dự án BTL cuối kỳ môn Lập trình hướng đối tượng (OOP) - Nhóm 03 - Đại học Phenikaa.



Hệ thống đặt vé xe Limousine cao cấp dạng full-stack local. Frontend React hiển thị giao diện trang chủ, danh sách chuyến xe, sơ đồ ghế ngồi trực quan, cơ chế đếm ngược giữ chỗ 3 phút và dashboard quản trị. Backend Spring Boot cung cấp REST API, xử lý các quy tắc nghiệp vụ hướng đối tượng (OOP), kiểm soát tương tranh chống đặt trùng ghế (Overbooking) và lưu trữ dữ liệu bằng JSON File I/O an toàn.



> \*Lưu ý: Dự án phục vụ mục đích học tập/demo nguyên lý Lập trình hướng đối tượng (OOP), chưa tích hợp Cổng thanh toán thật hay Database production.\*



\---



\## 1. Công nghệ sử dụng

\* \*\*Frontend:\*\* React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.

\* \*\*Backend:\*\* Java 21 (LTS), Spring Boot 3.3.x, Gson 2.13.1, Maven Wrapper.

\* \*\*Dữ liệu:\*\* JSON File IO (Sử dụng cơ chế Atomic Move và Khóa luồng JVM `BookingLock.LOCK` để bảo vệ dữ liệu).

\* \*\*Kiểm thử:\*\* JUnit 5, Mockito.



\---



\## 2. Chức năng nổi bật

\* \*\*Tra cứu chuyến xe:\*\* Tuyến Hà Nội ⇄ Hải Phòng, lọc theo thời gian và dòng xe (Limousine 9 chỗ / 12 chỗ).

\* \*\*Sơ đồ ghế thời gian thực:\*\* Phân biệt trực quan ghế Trống (Available), Đang giữ chỗ (Holding), Đã bán (Booked), Ghế VIP/Thường.

\* \*\*Giữ chỗ tự động 3 phút:\*\* Tự động khóa ghế tạm thời khi khách chọn và tự động giải phóng (rollback) nếu quá hạn thanh toán.

\* \*\*Đa hình (Polymorphism):\*\* Tự động tính phụ phí ghế VIP (+50.000 VNĐ) và chiết khấu linh hoạt theo hạng khách (VIP giảm 20%, Thành viên giảm 10%).

\* \*\*Kiểm soát ngoại lệ:\*\* Hệ thống Custom Exception (`SeatAlreadyBookedException`, `BusinessRuleException`) ngăn chặn triệt để hành vi đặt trùng ghế.

\* \*\*Khu vực Quản trị (Staff Dashboard):\*\* Thống kê tổng doanh thu, số vé đã bán và tỷ lệ lấp đầy ghế.



\---



\## 3. Cấu trúc thư mục dự án

```text

he-thong-quan-ly-dat-ve-xe-nhom-3/

├── backend/                  # Spring Boot REST API, mã nguồn Java và Unit Test

│   ├── data/                 # CSDL JSON: busTrips.json, seats.json, tickets.json, customers.json

│   ├── src/                  # Mã nguồn nghiệp vụ phân tầng (Handler, Service, Repository, Model)

│   └── mvnw.cmd              # Maven Wrapper

├── frontend/                 # Ứng dụng React 18 + TypeScript + Vite

│   ├── src/                  # Components, Pages, Sơ đồ ghế, API client

│   └── package.json

├── scripts/                  # Tập lệnh Batch (.bat) khởi chạy tự động trên Windows

│   ├── chay-du-an.bat        # 1-Click khởi chạy cả Frontend và Backend

│   ├── chay-backend.bat      # Chạy riêng Backend (Port 8080)

│   ├── chay-frontend.bat     # Chạy riêng Frontend (Port 5173)

│   └── kiem-tra-du-an.bat    # Chạy kiểm thử tự động toàn diện

├── bao-cao-do-an/            # Báo cáo, sơ đồ UML, flowchart và minh chứng kiểm thử

└── README.md                 # Tài liệu hướng dẫn dự án

```



\---



\## 4. Hướng dẫn cài đặt và chạy dự án



\### Yêu cầu môi trường:

\* \*\*Hệ điều hành:\*\* Windows 10/11.

\* \*\*JDK:\*\* Java 21 trở lên.

\* \*\*Node.js:\*\* Phiên bản 18.x trở lên (kèm npm).

\* \*\*Git:\*\* Đã cài đặt trên máy.

\*(Không cần cài đặt Maven riêng vì dự án đã tích hợp sẵn Maven Wrapper).\*



\### Bước 1: Clone dự án về máy

Mở Terminal / Git Bash và chạy lệnh:

```bash

git clone https://github.com/251020900893-beep/he-thong-quan-ly-dat-ve-xe-nhom-3.git

cd he-thong-quan-ly-dat-ve-xe-nhom-3

```

\*(Khuyến nghị: Clone vào thư mục có đường dẫn ngắn, không chứa dấu tiếng Việt hoặc khoảng trắng).\*



\### Bước 2: Khởi chạy toàn bộ hệ thống bằng 1 click

Tại thư mục gốc của dự án, nhấp đúp file hoặc chạy qua Terminal:

```bash

.\\scripts\\chay-du-an.bat

```

Script sẽ tự động:

1\. Cài đặt các gói `node\_modules` (nếu chưa có).

2\. Khởi động Backend Spring Boot tại: `http://localhost:8080/api`

3\. Khởi động Frontend React và tự mở trình duyệt tại: `http://localhost:5173`



\### Bước 3: Chạy riêng lẻ từng phần (Tùy chọn khi debug)

Mở 2 cửa sổ Terminal tại thư mục gốc:

\* \*\*Terminal 1 (Backend):\*\*

```bash

.\\scripts\\chay-backend.bat

```

\* \*\*Terminal 2 (Frontend):\*\*

```bash

.\\scripts\\chay-frontend.bat

```



\### Bước 4: Chạy kiểm thử tự động (Unit Test)

```bash

.\\scripts\\kiem-tra-du-an.bat

```



\---



\## 5. Kịch bản dữ liệu dùng thử (Demo)



\### Khách hàng đặt vé (Kiểm tra tính Đa hình OOP):

Khi mở form đặt vé, tại ô \*\*"Hạng khách hàng"\*\*, bạn có thể chọn thủ công ở thanh thả xuống hoặc bấm các nút \*\*"Điền nhanh mẫu khách hàng (OOP Test)"\*\* để kiểm tra việc tính giá tự động:

\* \*\*Khách hàng VIP:\*\* Chọn loại VIP (hoặc chọn mẫu Nguyễn Văn Hùng) -> Hệ thống tự động giảm \*\*20%\*\* tổng tiền.

\* \*\*Khách hàng Thành viên:\*\* Chọn loại MEMBER (hoặc chọn mẫu Trần Thị Mai) -> Hệ thống tự động giảm \*\*10%\*\* tổng tiền.

\* \*\*Khách hàng thường:\*\* Chọn loại NORMAL (hoặc chọn mẫu Lê Hoàng Nam) -> Giữ nguyên giá gốc (\*\*0%\*\*).



\### Đăng nhập Quản trị viên (Staff Dashboard):

\* \*\*Tài khoản:\*\* `admin`

\* \*\*Mật khẩu:\*\* `123456`



\---



\## 6. Lưu ý kỹ thuật

\* Dữ liệu được lưu trữ dạng file tại `backend/data/\*.json`.

\* Cơ chế kiểm soát tương tranh: Sử dụng khóa luồng tĩnh `BookingLock.LOCK` trong JVM kết hợp ghi đĩa nguyên tử `StandardCopyOption.ATOMIC\_MOVE` để ngăn chặn hoàn toàn việc mất mát dữ liệu hoặc lỗi ghi đè file.

\* Các cổng thanh toán (MoMo, Chuyển khoản VietQR, Tiền mặt) hoạt động ở chế độ mô phỏng nghiệp vụ (Mock), cho phép xuất vé ngay lập tức phục vụ mục đích kiểm thử.

