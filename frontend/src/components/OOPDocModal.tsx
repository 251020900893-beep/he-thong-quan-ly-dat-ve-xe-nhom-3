import React from 'react';
import {
    X, Layers, Monitor, Server, Database,
    Code2, Clock, ShieldCheck
} from 'lucide-react';

interface OOPDocModalProps {
    onClose: () => void;
}

export const OOPDocModal: React.FC<OOPDocModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
            <div className="bg-white text-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">

                {/* Header Modal Xanh Đen Sang Trọng */}
                <div className="bg-[#0f172a] text-white p-6 flex justify-between items-center relative">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Layers className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                                Kiến Trúc Dự Án 3 Tầng & 4 Trụ Cột OOP (Hệ Thống Đặt Vé Xe)
                            </h3>
                            <p className="text-xs text-slate-300 mt-0.5">
                                Mô hình thiết kế hướng đối tượng chuẩn Enterprise & Cơ chế Giữ chỗ 3 phút
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        title="Đóng modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nội Dung Chi Tiết Trong Modal */}
                <div className="p-6 sm:p-8 space-y-7 max-h-[80vh] overflow-y-auto text-xs sm:text-[13px] leading-relaxed">

                    {/* PHẦN 1: KIẾN TRÚC 3 TẦNG */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-600" />
                            <span>1. Kiến Trúc 3 Tầng (3-Tier Architecture)</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* 1.1 Presentation Tier */}
                            <div className="bg-blue-50/40 border border-blue-200/80 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-blue-700 text-xs sm:text-sm">
                                    <Monitor className="w-4 h-4" />
                                    <span>Presentation Tier (Frontend)</span>
                                </div>
                                <p className="text-slate-600">
                                    Giao diện tương tác trực quan: Sơ đồ ghế Limousine thời gian thực, bảng đếm ngược giữ chỗ 3 phút, chọn phương thức thanh toán QR/Ví/Tiền mặt, tra cứu vé và báo cáo nhân viên.
                                </p>
                            </div>

                            {/* 1.2 Application Tier */}
                            <div className="bg-purple-50/40 border border-purple-200/80 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-purple-700 text-xs sm:text-sm">
                                    <Server className="w-4 h-4" />
                                    <span>Application Tier (OOP Backend)</span>
                                </div>
                                <p className="text-slate-600">
                                    Tầng xử lý nghiệp vụ: Handlers, Services (BookingService, PaymentService), Domain Models (BusTrip, Seat, Customer) và Background Daemon 5s quét dọn vé hết hạn 3 phút.
                                </p>
                            </div>

                            {/* 1.3 Data Tier */}
                            <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-emerald-700 text-xs sm:text-sm">
                                    <Database className="w-4 h-4" />
                                    <span>Data Tier (Repository + Mock JSON)</span>
                                </div>
                                <p className="text-slate-600">
                                    Kho lưu trữ dữ liệu bền vững: <code className="text-emerald-800 bg-emerald-100/80 px-1 py-0.5 rounded font-mono">JsonFileRepository&lt;T&gt;</code> thao tác đọc ghi CRUD các file JSON (<code className="font-mono">trips.json, tickets.json, customers.json, staffs.json</code>).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PHẦN 2: BỐN TRỤ CỘT HƯỚNG ĐỐI TƯỢNG */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-blue-600" />
                            <span>2. Bốn Trụ Cột Hướng Đối Tượng (4 OOP Pillars)</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* A. Encapsulation */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                                <div className="font-bold text-slate-900">A. Tính Đóng Gói (Encapsulation)</div>
                                <p className="text-slate-600">
                                    Tất cả thuộc tính của đối tượng (như <code className="text-slate-800 font-mono">status, holdingExpiresAt</code> của Seat) được bảo vệ (private/protected) và chỉ thay đổi qua các phương thức nghiệp vụ: <code className="text-slate-800 font-mono">hold(customerId, duration), confirmBooked(), releaseHold()</code>.
                                </p>
                            </div>

                            {/* B. Inheritance */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                                <div className="font-bold text-slate-900">B. Tính Kế Thừa (Inheritance)</div>
                                <p className="text-slate-600">
                                    Lớp trừu tượng User được kế thừa bởi Customer và Staff. Lớp cơ sở <code className="text-slate-800 font-mono">JsonFileRepository&lt;T&gt;</code> được kế thừa bởi BusTripRepository, TicketRepository, v.v.
                                </p>
                            </div>

                            {/* C. Polymorphism */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                                <div className="font-bold text-slate-900">C. Tính Đa Hình (Polymorphism)</div>
                                <p className="text-slate-600">
                                    Interface <code className="text-slate-800 font-mono">DiscountPolicy</code> với các hành vi tính giá khác nhau: VipDiscountPolicy (-20%), MemberDiscountPolicy (-10%), NormalDiscountPolicy (0%). Interface PaymentMethod với CashPayment, BankTransferPayment, EWalletPayment.
                                </p>
                            </div>

                            {/* D. Abstraction */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                                <div className="font-bold text-slate-900">D. Tính Trừu Tượng (Abstraction)</div>
                                <p className="text-slate-600">
                                    Tầng Handler chỉ giao tiếp qua các Interface Service; Tầng Service chỉ giao tiếp qua IRepository&lt;T&gt;, tách biệt hoàn toàn cơ chế lưu trữ JSON khỏi logic kinh doanh cốt lõi.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PHẦN 3: CƠ CHẾ GIỮ CHỖ 3 PHÚT */}
                    <div className="bg-amber-50/40 border border-amber-300/70 rounded-2xl p-5 space-y-2.5">
                        <h4 className="text-sm font-black text-amber-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>3. Cơ Chế Giữ Chỗ 3 Phút & Tự Động Giải Phóng (Auto-Release Daemon)</span>
                        </h4>

                        <ul className="space-y-2 text-slate-700 list-disc pl-5">
                            <li>
                                <strong className="text-slate-900">Khi khách bấm Đặt vé:</strong> Ghế chuyển sang trạng thái <code className="font-mono text-amber-800 font-bold">HOLDING</code>, vé tạo ở trạng thái <code className="font-mono text-amber-800 font-bold">HOLDING_UNPAID</code>, gán <code className="font-mono text-blue-700">expiresAt = now + 180s (3 phút)</code>.
                            </li>
                            <li>
                                <strong className="text-slate-900">Trong 3 phút:</strong> Khách khác nhìn thấy ghế có màu vàng cam với biểu tượng đồng hồ cát và không thể chọn đè vào.
                            </li>
                            <li>
                                <strong className="text-slate-900">Background Daemon:</strong> BookingService kích hoạt <code className="font-mono text-slate-800">setInterval(..., 5000)</code> tự động quét toàn bộ vé. Nếu <code className="font-mono text-rose-700">now &gt; expiresAt</code> và chưa thanh toán: Trạng thái vé đổi sang <code className="font-mono text-rose-700 font-bold">EXPIRED_CANCELLED</code>. Ghế tương ứng trên xe được gọi <code className="font-mono text-emerald-700">seat.releaseHold()</code> và trở lại trạng thái <code className="font-mono text-emerald-700 font-bold">AVAILABLE</code> (trống) ngay lập tức.
                            </li>
                            <li>
                                <strong className="text-slate-900">Nếu khách thanh toán trong 3 phút:</strong> Ghế chuyển sang <code className="font-mono text-blue-700 font-bold">BOOKED</code>, vé chuyển sang <code className="font-mono text-emerald-700 font-bold">PAID</code> vĩnh viễn.
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Footer Nút Đóng */}
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
                    >
                        Đã hiểu & Đóng
                    </button>
                </div>

            </div>
        </div>
    );
};