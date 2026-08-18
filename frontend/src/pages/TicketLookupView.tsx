import React, { useState } from 'react';
import {
    Search,
    Ticket as TicketIcon,
    Phone,
    User,
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    AlertCircle,
    QrCode,
    Eye,
    Bus,
    FileText
} from 'lucide-react';

interface TicketLookupViewProps {
    tickets: any[];
    onSelectTicket: (ticket: any) => void;
}

export const TicketLookupView: React.FC<TicketLookupViewProps> = ({
                                                                      tickets,
                                                                      onSelectTicket
                                                                  }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Tìm kiếm vé linh hoạt bằng Mã vé (VE-...), Số điện thoại hoặc Tên hành khách
    const filteredTickets = tickets.filter(ticket => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;

        const ticketId = (ticket.ticketId || ticket.id || '').toLowerCase();
        const phone = (ticket.customerPhone || ticket.customer?.phone || '').toLowerCase();
        const name = (ticket.customerName || ticket.customer?.name || '').toLowerCase();
        const seat = (ticket.seatNumber || ticket.seat?.seatNumber || '').toLowerCase();

        return ticketId.includes(query) || phone.includes(query) || name.includes(query) || seat.includes(query);
    });

    return (
        <div className="space-y-6">
            {/* Banner Tiêu Đề & Ô Tìm Kiếm */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-blue-100 backdrop-blur-md">
            🔍 TRA CỨU VÉ XE ĐIỆN TỬ
          </span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Tra Cứu Vé & Lịch Trình Chuyến Xe
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                        Hành khách có thể chủ động nhập <strong>Mã vé (ví dụ: VE-0001, VE-8999)</strong> hoặc <strong>Số điện thoại</strong> đã đăng ký để kiểm tra tình trạng vé, xem mã QR soát vé và in hóa đơn điện tử.
                    </p>

                    <div className="pt-2">
                        <div className="relative">
                            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Nhập Mã vé (VE-xxxx) hoặc Số điện thoại của bạn..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl font-bold text-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder:text-slate-400 placeholder:font-normal"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-lg"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách vé tìm thấy */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Kết quả tra cứu ({filteredTickets.length} vé)
          </span>
                    {searchQuery && (
                        <span className="text-slate-500">
              Đang lọc theo: &quot;<strong className="text-blue-600">{searchQuery}</strong>&quot;
            </span>
                    )}
                </div>

                {filteredTickets.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
                            <TicketIcon className="w-8 h-8" />
                        </div>
                        <h4 className="text-base font-black text-slate-800">Không tìm thấy vé nào phù hợp</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Vui lòng kiểm tra lại Mã vé (ví dụ: VE-1234) hoặc Số điện thoại đặt vé của bạn.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTickets.map(ticket => {
                            const ticketId = ticket.ticketId || ticket.id || 'VE-0001';
                            const tripCode = ticket.tripCode || ticket.trip?.tripCode || 'HN-HP-0600';
                            const route = ticket.trip?.route || 'Hà Nội ➔ Hải Phòng';
                            const time = ticket.departureTime || ticket.trip?.departureTime || ticket.tripTime || '06:00';
                            const seat = ticket.seatNumber || ticket.seat?.seatNumber || 'B1';
                            const seatType = ticket.seatType || ticket.seat?.seatType || 'VIP';
                            const name = ticket.customerName || ticket.customer?.name || 'Khách hàng';
                            const phone = ticket.customerPhone || ticket.customer?.phone || '0912345678';
                            const price = ticket.finalPrice || 230000;
                            const isPaid = ticket.status === 'PAID';
                            const isHolding = ticket.status === 'HOLDING';

                            return (
                                <div
                                    key={ticketId}
                                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-3">
                                        {/* Header Thẻ Vé */}
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {ticketId}
                        </span>
                                                <span className="text-xs font-bold text-slate-600">{tripCode}</span>
                                            </div>

                                            {isPaid ? (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ĐÃ XÁC NHẬN
                        </span>
                                            ) : isHolding ? (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> ĐANG GIỮ CHỖ
                        </span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> ĐÃ HỦY
                        </span>
                                            )}
                                        </div>

                                        {/* Chi tiết lộ trình & Hành khách */}
                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Tuyến đường:</span>
                                                <strong className="text-slate-900 font-bold">{route}</strong>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Khởi hành:</span>
                                                <strong className="text-blue-700 font-bold">{time}</strong>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Số ghế:</span>
                                                <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {seat} ({seatType})
                        </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Hành khách:</span>
                                                <span className="font-bold text-slate-800">{name} ({phone})</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                                <span className="text-slate-500 font-medium">Tổng tiền vé:</span>
                                                <span className="font-mono font-black text-base text-emerald-600">
                          {price.toLocaleString('vi-VN')} đ
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nút Xem chi tiết vé điện tử */}
                                    <button
                                        type="button"
                                        onClick={() => onSelectTicket(ticket)}
                                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                    >
                                        <Eye className="w-4 h-4 text-blue-400" />
                                        <span>Xem Vé Điện Tử & Mã QR Soát Vé</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};