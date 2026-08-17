import React, { useState } from 'react';
import {
    RotateCw, DollarSign, CheckCircle2, Clock, XCircle,
    Landmark, Wallet, Banknote, Search, Eye, TrendingUp, RefreshCw
} from 'lucide-react';

interface StaffDashboardProps {
    tickets: any[]; // Nhận danh sách vé thực tế từ App.tsx
    onViewTicketDetail?: (ticket: any) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ tickets, onViewTicketDetail }) => {
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'HOLDING' | 'CANCELLED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // 1. TÍNH TOÁN CÁC CHỈ SỐ THỐNG KÊ TỪ DANH SÁCH VÉ THỰC TẾ
    const paidTickets = tickets.filter(t => t.status === 'PAID');
    const holdingTickets = tickets.filter(t => t.status === 'HOLDING');
    const cancelledTickets = tickets.filter(t => t.status === 'CANCELLED');

    // Tổng doanh thu thực thu
    const totalRevenue = paidTickets.reduce((sum, t) => sum + (t.finalPrice || 0), 0);

    // Doanh thu theo từng phương thức (Polymorphism)
    const vietQrRevenue = paidTickets
        .filter(t => t.paymentMethod === 'BANKING' || t.paymentMethod?.includes('VietQR') || t.paymentMethod?.includes('Chuyển khoản'))
        .reduce((sum, t) => sum + (t.finalPrice || 0), 0);

    const momoRevenue = paidTickets
        .filter(t => t.paymentMethod === 'MOMO' || t.paymentMethod?.includes('MoMo') || t.paymentMethod?.includes('Ví'))
        .reduce((sum, t) => sum + (t.finalPrice || 0), 0);

    const cashRevenue = paidTickets
        .filter(t => t.paymentMethod === 'CASH' || t.paymentMethod?.includes('Tiền mặt'))
        .reduce((sum, t) => sum + (t.finalPrice || 0), 0);

    // Lọc bảng
    const filteredTickets = tickets.filter(t => {
        if (filterStatus === 'PAID' && t.status !== 'PAID') return false;
        if (filterStatus === 'HOLDING' && t.status !== 'HOLDING') return false;
        if (filterStatus === 'CANCELLED' && t.status !== 'CANCELLED') return false;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                t.ticketId?.toLowerCase().includes(q) ||
                t.customer?.name?.toLowerCase().includes(q) ||
                t.customer?.phone?.includes(q) ||
                t.customerName?.toLowerCase().includes(q) ||
                t.customerPhone?.includes(q)
            );
        }
        return true;
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto py-4">
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
            <span className="bg-purple-100 text-purple-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              Cổng Quản Lý & Điều Hành
            </span>
                        <span className="text-xs text-slate-400">
              Cập nhật tự động mỗi 10s
            </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Báo Cáo Doanh Thu Tuyến Hà Nội - Hải Phòng
                    </h2>
                </div>

                <button
                    onClick={() => {}}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5"
                >
                    <RotateCw className="w-3.5 h-3.5" /> Làm mới dữ liệu
                </button>
            </div>

            {/* 4 THẺ THỐNG KÊ DOANH THU & VÉ (TỰ ĐỘNG ĐỒNG BỘ) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Tổng doanh thu */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            TỔNG DOANH THU
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-2">
                            {totalRevenue.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3.5 h-3.5" /> Doanh thu vé đã thực thu
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        $
                    </div>
                </div>

                {/* Card 2: Vé đã thanh toán */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            VÉ ĐÃ THANH TOÁN
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-2">
                            {paidTickets.length} vé
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                            Tỷ lệ lấp đầy ghế: <strong className="text-slate-600">{Math.round((paidTickets.length / 80) * 100)}%</strong>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>

                {/* Card 3: Đang giữ chỗ (3P) - SỐ SẼ NHẢY ĐỘNG KHI GIỮ CHỖ */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            ĐANG GIỮ CHỖ (3P)
                        </div>
                        <div className="text-2xl font-black text-amber-600 mt-2">
                            {holdingTickets.length} vé
                        </div>
                        <div className="text-xs text-amber-700 mt-2 font-medium">
                            {holdingTickets.length > 0 ? 'Đang có khách giữ ghế thanh toán' : 'Đang chờ khách thanh toán'}
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                {/* Card 4: Hủy / Hết hạn 3P */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            HỦY / HẾT HẠN 3P
                        </div>
                        <div className="text-2xl font-black text-rose-600 mt-2">
                            {cancelledTickets.length} vé
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                            Ghế đã tự động giải phóng
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <XCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* CƠ CẤU DOANH THU THEO PHƯƠNG THỨC (POLYMORPHISM) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    CƠ CẤU DOANH THU THEO PHƯƠNG THỨC THANH TOÁN (POLYMORPHISM)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* VietQR */}
                    <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                            <Landmark className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-600">Chuyển khoản VietQR</div>
                            <div className="text-lg font-black text-blue-700 leading-tight mt-0.5">
                                {vietQrRevenue.toLocaleString('vi-VN')} đ
                            </div>
                        </div>
                    </div>

                    {/* MoMo / VNPay */}
                    <div className="bg-pink-50/60 border border-pink-200/80 rounded-2xl p-4 flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-600/20">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-600">Ví điện tử (MoMo/VNPay)</div>
                            <div className="text-lg font-black text-pink-700 leading-tight mt-0.5">
                                {momoRevenue.toLocaleString('vi-VN')} đ
                            </div>
                        </div>
                    </div>

                    {/* Tiền mặt */}
                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-600">Tiền mặt tại quầy / xe</div>
                            <div className="text-lg font-black text-emerald-700 leading-tight mt-0.5">
                                {cashRevenue.toLocaleString('vi-VN')} đ
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BẢNG QUẢN LÝ DANH SÁCH VÉ XE CHI TIẾT */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span className="text-slate-600 mr-1">Trạng thái:</span>
                        <button
                            onClick={() => setFilterStatus('ALL')}
                            className={`px-3 py-1.5 rounded-lg transition ${
                                filterStatus === 'ALL'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Tất cả ({tickets.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('PAID')}
                            className={`px-3 py-1.5 rounded-lg transition ${
                                filterStatus === 'PAID'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Đã thanh toán ({paidTickets.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('HOLDING')}
                            className={`px-3 py-1.5 rounded-lg transition ${
                                filterStatus === 'HOLDING'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Đang giữ 3p ({holdingTickets.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('CANCELLED')}
                            className={`px-3 py-1.5 rounded-lg transition ${
                                filterStatus === 'CANCELLED'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Hủy/Hết hạn ({cancelledTickets.length})
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, sđt, mã vé..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-y border-slate-200">
                        <tr>
                            <th className="py-3 px-3">MÃ VÉ</th>
                            <th className="py-3 px-3">CHUYẾN XE</th>
                            <th className="py-3 px-3">SỐ GHẾ</th>
                            <th className="py-3 px-3">KHÁCH HÀNG</th>
                            <th className="py-3 px-3">HẠNG KH</th>
                            <th className="py-3 px-3">THÀNH TIỀN</th>
                            <th className="py-3 px-3">PHƯƠNG THỨC</th>
                            <th className="py-3 px-3">TRẠNG THÁI</th>
                            <th className="py-3 px-3 text-center">THAO TÁC</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredTickets.map((t, idx) => {
                            const isPaid = t.status === 'PAID';
                            const isHolding = t.status === 'HOLDING';
                            const isCancelled = t.status === 'CANCELLED';

                            return (
                                <tr key={t.ticketId || idx} className="hover:bg-slate-50/80 transition">
                                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{t.ticketId}</td>
                                    <td className="py-3.5 px-3">{t.trip?.tripCode || t.tripCode || 'HN-HP'} ({t.trip?.departureTime || t.tripTime})</td>
                                    <td className="py-3.5 px-3 font-bold text-blue-600">
                                        {t.seat?.seatNumber || t.seatNumber} ({t.seat?.seatType || t.seatType})
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <div className="font-bold text-slate-900">{t.customer?.name || t.customerName}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">{t.customer?.phone || t.customerPhone}</div>
                                    </td>
                                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          (t.customer?.customerType || t.customerType) === 'VIP'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                      }`}>
                        {t.customer?.customerType || t.customerType || 'NORMAL'}
                      </span>
                                    </td>
                                    <td className="py-3.5 px-3 font-bold text-slate-900">
                                        {(t.finalPrice || 0).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="py-3.5 px-3 text-slate-600">
                                        {t.paymentMethod === 'BANKING' ? 'Chuyển khoản VietQR' : t.paymentMethod === 'MOMO' ? 'Ví MoMo' : t.paymentMethod || 'Tiền mặt'}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        {isPaid && (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Đã thanh toán
                        </span>
                                        )}
                                        {isHolding && (
                                            <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                          <Clock className="w-3 h-3" /> Đang giữ 3p
                        </span>
                                        )}
                                        {isCancelled && (
                                            <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[11px]">
                          <XCircle className="w-3 h-3" /> Đã hủy / Hết hạn
                        </span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-3 text-center">
                                        <button
                                            onClick={() => onViewTicketDetail && onViewTicketDetail(t)}
                                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg font-bold text-xs border border-slate-200 transition inline-flex items-center gap-1"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Xem
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};