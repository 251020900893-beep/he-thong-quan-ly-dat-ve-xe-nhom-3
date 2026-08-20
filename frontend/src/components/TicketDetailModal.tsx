import React, { useState } from 'react';
import {
    X,
    CheckCircle2,
    Clock,
    XCircle,
    Printer,
    MapPin,
    Bus,
    QrCode
} from 'lucide-react';

interface TicketDetailModalProps {
    ticket: any;
    onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose }) => {
    // Chuẩn hóa dữ liệu hiển thị từ object Ticket
    const ticketId = ticket.ticketId || ticket.id || 'VE-HNHP0700-B4-5977';
    const route = ticket.trip?.route
        || ticket.route
        || (ticket.trip ? `${ticket.trip.departure || 'Hà Nội'} ⇄ ${ticket.trip.destination || 'Hải Phòng'}` : 'Hà Nội ⇄ Hải Phòng');

    const departureTime = ticket.departureTime
        || ticket.trip?.departureTime
        || ticket.tripTime
        || '07:00';

    const seatNumber = ticket.seatNumber
        || ticket.seat?.seatNumber
        || 'B4';

    const seatType = ticket.seatType
        || ticket.seat?.seatType
        || 'VIP';

    const customerName = ticket.customerName
        || ticket.customer?.fullName
        || ticket.customer?.name
        || 'Trần Thị Mai';

    const customerPhone = ticket.customerPhone
        || ticket.customer?.phone
        || '0987654321';

    const busPlate = ticket.busPlate
        || ticket.trip?.licensePlate
        || ticket.trip?.busPlate
        || '29B-688.88';

    const pickupPoint = ticket.pickupPoint
        || (ticket.trip?.pickupPoints && ticket.trip.pickupPoints[0])
        || 'Bến xe Mỹ Đình';

    const dropoffPoint = ticket.dropoffPoint
        || (ticket.trip?.dropoffPoints && ticket.trip.dropoffPoints[0])
        || 'Bến xe Vĩnh Niệm';

    const price = Number(ticket.finalPrice || ticket.price || 252000);

    const paymentMethodLabel = (() => {
        const m = (ticket.paymentMethod || '').toUpperCase();
        if (m.includes('BANK') || m.includes('QR') || m.includes('VIETQR')) return 'Chuyển khoản VietQR';
        if (m.includes('WALLET') || m.includes('MOMO') || m.includes('VNPAY')) return 'Ví MoMo / VNPay';
        return 'Tiền mặt tại quầy / xe';
    })();

    const isPaid = ticket.status === 'PAID' || ticket.status === 'Đã thanh toán' || !ticket.status;
    const isHolding = ticket.status === 'HOLDING' || ticket.status === 'Đang giữ 3p';
    const isCancelled = ticket.status === 'CANCELLED' || ticket.status === 'Đã hủy/Hết hạn';

    // Tạo các mảnh Confetti pháo hoa giấy ngẫu nhiên
    const [confettiPieces] = useState(() => {
        const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
        return Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 96 + 2}%`,
            top: `${Math.random() * 90 + 5}%`,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 6,
            rotate: Math.random() * 360,
            opacity: Math.random() * 0.7 + 0.3,
            shape: Math.random() > 0.4 ? 'rect' : 'circle'
        }));
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto text-slate-900">

                {/* 1. Header Xanh Đen Sang Trọng */}
                <div className="bg-slate-950 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <Bus className="w-5 h-5 text-blue-400" />
                        <h3 className="text-base font-black tracking-tight text-white">
                            Vé Xe Khách Điện Tử (E-Ticket)
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 2. Thẻ Vé Chính Với Hiệu Ứng Pháo Hoa (Confetti) */}
                <div className="p-6 relative overflow-hidden bg-white">
                    {/* Hiệu ứng pháo hoa giấy Confetti rơi khi Đã thanh toán */}
                    {isPaid && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                            {confettiPieces.map(piece => (
                                <div
                                    key={piece.id}
                                    className="absolute animate-pulse"
                                    style={{
                                        left: piece.left,
                                        top: piece.top,
                                        width: `${piece.size}px`,
                                        height: piece.shape === 'rect' ? `${piece.size * 1.6}px` : `${piece.size}px`,
                                        backgroundColor: piece.color,
                                        borderRadius: piece.shape === 'circle' ? '50%' : '2px',
                                        transform: `rotate(${piece.rotate}deg)`,
                                        opacity: piece.opacity,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Khung viền thẻ E-Ticket bo góc mềm mại */}
                    <div className="relative z-10 bg-white/95 backdrop-blur-md border-2 border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">

                        {/* Hàng 1: Tuyến đường & Badge Trạng thái */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    TUYẾN ĐƯỜNG
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                                    {route}
                                </h2>
                            </div>

                            <div>
                                {isPaid && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>ĐÃ THANH TOÁN</span>
                                    </span>
                                )}
                                {isHolding && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-300 animate-pulse">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                        <span>ĐANG GIỮ 3P</span>
                                    </span>
                                )}
                                {isCancelled && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-300">
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                        <span>ĐÃ HỦY / HẾT HẠN</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Hàng 2: Lưới 3 Cột Chi Tiết Vé */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs border-t border-slate-100 pt-4">
                            <div>
                                <div className="text-slate-400 font-medium">Mã vé:</div>
                                <div className="font-mono font-black text-slate-900 text-sm mt-0.5">
                                    {ticketId}
                                </div>
                            </div>

                            <div>
                                <div className="text-slate-400 font-medium">Giờ khởi hành:</div>
                                <div className="font-bold text-blue-600 text-sm mt-0.5">
                                    {departureTime}
                                </div>
                            </div>

                            <div>
                                <div className="text-slate-400 font-medium">Số ghế ngồi:</div>
                                <div className="font-mono font-black text-blue-700 text-sm mt-0.5">
                                    {seatNumber} ({seatType})
                                </div>
                            </div>

                            <div>
                                <div className="text-slate-400 font-medium">Hành khách:</div>
                                <div className="font-bold text-slate-900 text-sm mt-0.5">
                                    {customerName}
                                </div>
                            </div>

                            <div>
                                <div className="text-slate-400 font-medium">Số điện thoại:</div>
                                <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5">
                                    {customerPhone}
                                </div>
                            </div>

                            <div>
                                <div className="text-slate-400 font-medium">Biển số xe:</div>
                                <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
                                    {busPlate}
                                </div>
                            </div>
                        </div>

                        {/* Hàng 3: Điểm đón / Điểm trả */}
                        <div className="space-y-2 text-xs border-t border-dashed border-slate-200 pt-4 text-slate-700">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Điểm đón: <strong className="text-slate-900 font-bold">{pickupPoint}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Điểm trả: <strong className="text-slate-900 font-bold">{dropoffPoint}</strong></span>
                            </div>
                        </div>

                        {/* Hàng 4: Tổng tiền & QR Code góc phải */}
                        <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                            <div className="space-y-1">
                                <div className="text-xs text-slate-400 font-medium">Tổng tiền vé:</div>
                                <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                                    {price.toLocaleString('vi-VN')} <span className="text-xl">đ</span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">
                                    Hình thức: {paymentMethodLabel}
                                </div>
                            </div>

                            {/* Khung Mã QR Soát Vé */}
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center shadow-2xs">
                                <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-300 flex items-center justify-center mx-auto">
                                    <QrCode className="w-full h-full text-slate-900" />
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                                    Mã soát vé
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Footer Nút Thao Tác */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-bold text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                        <Printer className="w-4 h-4" />
                        <span>In vé / Lưu PDF</span>
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-7 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs transition cursor-pointer shadow-sm"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
