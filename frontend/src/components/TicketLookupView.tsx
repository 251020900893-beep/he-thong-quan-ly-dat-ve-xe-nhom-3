import React, { useState } from 'react';
import { Ticket as TicketIcon, Search, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

interface TicketLookupViewProps {
    tickets: any[]; // Nhận danh sách vé thực tế từ App.tsx
    onSelectTicket: (ticket: any) => void;
}

export const TicketLookupView: React.FC<TicketLookupViewProps> = ({ tickets, onSelectTicket }) => {
    const [keyword, setKeyword] = useState('');
    const [searched, setSearched] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    // Hàm tìm kiếm theo Số điện thoại, Mã vé, hoặc Tên khách
    const handleSearch = (query?: string) => {
        const q = (query !== undefined ? query : keyword).trim().toLowerCase();
        if (!q) return;

        setSearched(true);

        // Lọc trên toàn bộ danh sách vé thực tế (kể cả vé vừa mới đặt)
        const found = tickets.filter(t => {
            const phone = (t.customer?.phone || t.customerPhone || '').toLowerCase();
            const code = (t.ticketId || '').toLowerCase();
            const name = (t.customer?.name || t.customerName || '').toLowerCase();
            return phone.includes(q) || code.includes(q) || name.includes(q);
        });

        setResults(found);
    };

    const handleQuickSearch = (phone: string) => {
        setKeyword(phone);
        handleSearch(phone);
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
            {/* KHUNG TÌM KIẾM TRUNG TÂM */}
            <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                    <TicketIcon className="w-7 h-7" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Tra cứu Vé Xe & Giữ Chỗ Trực Tuyến
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                    Nhập số điện thoại đã đặt hoặc mã vé (VD: <span className="text-blue-600 font-mono font-bold cursor-pointer hover:underline" onClick={() => handleQuickSearch('0912345678')}>0912345678</span> hoặc <span className="text-blue-600 font-mono font-bold cursor-pointer hover:underline" onClick={() => handleQuickSearch('VE-0001')}>VE-0001</span>)
                </p>

                {/* Thanh Search Bar bo tròn */}
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleSearch();
                    }}
                    className="mt-6 flex items-center gap-2 max-w-2xl mx-auto"
                >
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Nhập Số điện thoại hoặc Mã vé..."
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-blue-600/20 transition active:scale-95 flex-shrink-0"
                    >
                        Tra cứu
                    </button>
                </form>

                {/* Gợi ý tìm mẫu */}
                <div className="text-xs text-slate-500 pt-1">
                    Tìm mẫu:{' '}
                    <button
                        type="button"
                        onClick={() => handleQuickSearch('0912345678')}
                        className="text-blue-600 hover:underline font-mono font-medium"
                    >
                        0912345678 (VIP)
                    </button>
                    {' • '}
                    <button
                        type="button"
                        onClick={() => handleQuickSearch('0987654321')}
                        className="text-blue-600 hover:underline font-mono font-medium"
                    >
                        0987654321 (Thành viên)
                    </button>
                </div>
            </div>

            {/* KẾT QUẢ TÌM KIẾM */}
            {searched && (
                <div className="space-y-4 pt-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Kết quả tra cứu ({results.length} vé tìm thấy)
                    </div>

                    {results.length > 0 ? (
                        <div className="space-y-3">
                            {results.map((ticket, idx) => {
                                const isPaid = ticket.status === 'PAID';
                                const isHolding = ticket.status === 'HOLDING';
                                const isCancelled = ticket.status === 'CANCELLED';

                                const routeName = ticket.trip?.route || 'Hà Nội ➔ Hải Phòng';
                                const depTime = ticket.trip?.departureTime || ticket.tripTime || '07:00';
                                const seatNum = ticket.seat?.seatNumber || ticket.seatNumber;
                                const seatType = ticket.seat?.seatType || ticket.seatType || 'VIP';
                                const custName = ticket.customer?.name || ticket.customerName;
                                const custPhone = ticket.customer?.phone || ticket.customerPhone;
                                const price = ticket.finalPrice || 0;

                                return (
                                    <div
                                        key={ticket.ticketId || idx}
                                        className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {ticket.ticketId}
                        </span>

                                                {isPaid && (
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đã thanh toán
                          </span>
                                                )}
                                                {isHolding && (
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" /> Đang giữ chỗ 3p
                          </span>
                                                )}
                                                {isCancelled && (
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Hết hạn / Đã hủy
                          </span>
                                                )}
                                            </div>

                                            <h4 className="text-base font-bold text-slate-900 mt-1">
                                                {routeName} ({depTime})
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                Hành khách: <strong className="text-slate-800">{custName}</strong> • SĐT: <strong className="text-slate-800 font-mono">{custPhone}</strong>
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                            <div className="text-left sm:text-right">
                                                <div className="text-xs text-amber-600 font-black">
                                                    Ghế {seatNum} ({seatType})
                                                </div>
                                                <div className="text-base font-black text-slate-900">
                                                    {price.toLocaleString('vi-VN')} đ
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => onSelectTicket(ticket)}
                                                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-extrabold border border-blue-200 hover:border-blue-600 transition flex items-center gap-1"
                                            >
                                                <span>Xem Chi Tiết</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
                            Không tìm thấy vé xe nào khớp với thông tin "{keyword}". Vui lòng kiểm tra lại số điện thoại!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};