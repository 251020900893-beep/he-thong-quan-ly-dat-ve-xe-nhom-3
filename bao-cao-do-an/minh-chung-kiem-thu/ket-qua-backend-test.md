# KẾT QUẢ KIỂM THỬ TỰ ĐỘNG BACKEND (UNIT TEST)

* **Framework:** JUnit 5, Mockito, Spring Boot Test.
* **Lệnh thực thi:** `mvn clean test` (qua Maven Wrapper `mvnw.cmd` hoặc `scripts/kiem-tra-du-an.bat`).

```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.example.hethongquanlydatvexe.model.BusTripTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.083 s -- in com.example.hethongquanlydatvexe.model.BusTripTest

[INFO] Running com.example.hethongquanlydatvexe.model.SeatTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.014 s -- in com.example.hethongquanlydatvexe.model.SeatTest

[INFO] Running com.example.hethongquanlydatvexe.repository.BusTripRepositoryTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.006 s -- in com.example.hethongquanlydatvexe.repository.BusTripRepositoryTest

[INFO] Running com.example.hethongquanlydatvexe.repository.DefaultDataRepositoryTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.150 s -- in com.example.hethongquanlydatvexe.repository.DefaultDataRepositoryTest

[INFO] Running com.example.hethongquanlydatvexe.repository.TicketRepositoryTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.004 s -- in com.example.hethongquanlydatvexe.repository.TicketRepositoryTest

[INFO] Running com.example.hethongquanlydatvexe.service.BookingServiceTest
[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.065 s -- in com.example.hethongquanlydatvexe.service.BookingServiceTest
  [PASS] testHoldSeatSuccess - Khách giữ chỗ thành công trong 3 phút (180s)
  [PASS] testPreventDuplicateHold - Chặn khách thứ 2 đặt trùng ghế đang giữ chỗ
  [PASS] testPolymorphismDiscount - Kiểm tra tính Đa hình giảm giá VIP 20% và Member 10%
  [PASS] testSeatNotFound - Bắt ngoại lệ khi chọn mã ghế ảo không tồn tại
  [PASS] testProcessPaymentSuccess - Thanh toán vé thành công qua E-Wallet
  [PASS] testPreventSameCustomerDuplicateHold - Chặn giữ trùng lặp cùng 1 khách
  [PASS] oldTicketCannotAffectNewHold - Vé cũ không tác động lượt giữ mới
  [PASS] customerIdContinuesAfterExistingMaximum - Sinh ID khách hàng tăng tiến an toàn
  [PASS] testAutoReleaseOldHoldWhenBookingNewSeat - Tự động hủy lượt giữ chỗ cũ khi khách đặt giữ ghế mới

[INFO] Running com.example.hethongquanlydatvexe.service.DiscountPolicyTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.003 s -- in com.example.hethongquanlydatvexe.service.DiscountPolicyTest

[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

* **Kết luận:** Toàn bộ **15/15 ca kiểm thử** trên 7 lớp test đều vượt qua thành công (**PASS 100%**).
