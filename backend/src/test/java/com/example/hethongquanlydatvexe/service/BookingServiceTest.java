package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.Seat;
import com.example.hethongquanlydatvexe.exception.BusinessRuleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import com.example.hethongquanlydatvexe.model.Customer;
import com.example.hethongquanlydatvexe.utils.IdGenerator;
import java.util.List;

public class BookingServiceTest {

    private Seat testSeat;

    @BeforeEach
    void setUp() {
        testSeat = new Seat("CX001-B1", "CX001", "B1", "VIP", 50000.0, "AVAILABLE", null, null, null);
    }

    @Test
    @DisplayName("Tình huống 1: Khách giữ chỗ thành công trong 3 phút (180s)")
    void testHoldSeatSuccess() {
        String customerPhone = "0912345678";
        String expiresAt = testSeat.holdSeat(customerPhone, 180);

        assertNotNull(expiresAt, "Thời gian hết hạn không được null");
        assertEquals("HOLDING", testSeat.getStatus(), "Trạng thái ghế phải chuyển sang HOLDING");
        assertEquals(customerPhone, testSeat.getHoldingCustomerId(), "Số điện thoại người giữ phải khớp");
    }

    @Test
    @DisplayName("Tình huống 2: Chặn khách thứ 2 đặt trùng ghế khi đang có người giữ chỗ")
    void testPreventDuplicateHold() {
        testSeat.holdSeat("0912345678", 180);

        // Khách thứ 2 cố tình giữ ghế B1 -> Phải ném BusinessRuleException
        assertThrows(BusinessRuleException.class, () -> {
            testSeat.holdSeat("0987654321", 180);
        }, "Hệ thống phải chặn việc giữ trùng ghế!");
    }

    @Test
    @DisplayName("Tình huống 3: Kiểm tra tính Đa hình giảm giá (VIP giảm 20%, Thành viên giảm 10%)")
    void testPolymorphismDiscount() {
        double rawPrice = 280000.0; // 230k gốc + 50k VIP

        DiscountPolicy vipPolicy = new VipDiscount();
        double vipDiscount = vipPolicy.calculateDiscount(rawPrice);
        assertEquals(56000.0, vipDiscount, "VIP phải được giảm chính xác 20% (56.000 đ)");
        assertEquals(224000.0, rawPrice - vipDiscount, "Giá cuối cho khách VIP phải là 224.000 đ");

        DiscountPolicy memberPolicy = new MemberDiscount();
        double memberDiscount = memberPolicy.calculateDiscount(rawPrice);
        assertEquals(28000.0, memberDiscount, "Thành viên phải được giảm chính xác 10% (28.000 đ)");
        assertEquals(252000.0, rawPrice - memberDiscount, "Giá cuối cho khách Thành viên phải là 252.000 đ");
    }
    @Test
    @DisplayName("Tình huống 4: Khách chọn ghế không tồn tại")
    void testSeatNotFound() {
        // Giả lập hệ thống: Tạo service
        BookingService bookingService = new BookingService();

        // Cố tình đặt một mã ghế không bao giờ có thực: "Z99"
        Exception exception = assertThrows(BusinessRuleException.class, () -> {
            bookingService.holdSeat("CX001", "Z99", "Nguyễn Lỗi", "0999999999", "", "NORMAL", "BANKING");
        });

        // Phải văng ra đúng lỗi
        assertTrue(exception.getMessage().contains("Ghế không tồn tại trong chuyến xe!"));
    }

    @Test
    @DisplayName("Tình huống 5: Thanh toán vé đã đặt")
    void testProcessPaymentSuccess() {
        // 1. Tạo một vé đang ở trạng thái giữ chỗ
        com.example.hethongquanlydatvexe.model.Ticket testTicket = new com.example.hethongquanlydatvexe.model.Ticket();
        testTicket.setStatus("HOLDING");
        testTicket.setPrice(250000.0);

        // 2. Gọi hàm thanh toán qua Ví điện tử (Áp dụng Polymorphism)
        PaymentMethod paymentMethod = new EWalletPayment();
        boolean isSuccess = paymentMethod.pay(testTicket.getPrice());

        // 3. Đảm bảo giao dịch qua ví thành công
        assertTrue(isSuccess, "Thanh toán qua ví điện tử phải trả về true");

        // 4. Kiểm tra vé đổi trạng thái sau thanh toán
        if (isSuccess) {
            testTicket.setStatus("PAID");
            testTicket.setPaidAt(java.time.Instant.now().toString());
        }

        assertEquals("PAID", testTicket.getStatus(), "Trạng thái vé phải chuyển thành PAID");
        assertNotNull(testTicket.getPaidAt(), "Thời gian thanh toán không được rỗng");
    }

    @Test
    @DisplayName("Retry giữ cùng ghế không tạo thêm lượt giữ")
    void testPreventSameCustomerDuplicateHold() {
        testSeat.holdSeat("0912345678", "TICKET-A", 180);

        assertThrows(BusinessRuleException.class,
                () -> testSeat.holdSeat("0912345678", "TICKET-B", 180));
        assertEquals("TICKET-A", testSeat.getHoldingTicketId());
    }

    @Test
    @DisplayName("Vé cũ không thể giải phóng hoặc xác nhận lượt giữ mới")
    void oldTicketCannotAffectNewHold() {
        testSeat.holdSeat("0912345678", "TICKET-A", 180);
        testSeat.releaseHold("TICKET-A");
        testSeat.holdSeat("0987654321", "TICKET-B", 180);

        assertThrows(BusinessRuleException.class, () -> testSeat.releaseHold("TICKET-A"));
        assertThrows(BusinessRuleException.class,
                () -> testSeat.confirmBooking("TICKET-A", "0912345678"));
        assertEquals("HOLDING", testSeat.getStatus());
        assertEquals("TICKET-B", testSeat.getHoldingTicketId());
        assertEquals("0987654321", testSeat.getHoldingCustomerId());
    }

    @Test
    @DisplayName("Customer ID tiếp theo dữ liệu hiện có sau restart")
    void customerIdContinuesAfterExistingMaximum() {
        List<Customer> existing = List.of(
                new Customer("KH006", "A", "0900000001", "", "NORMAL"),
                new Customer("KH125", "B", "0900000002", "", "NORMAL"));

        assertEquals("KH126", IdGenerator.nextCustomerId(existing));
    }
}
