import React from 'react';
import { X, CheckCircle2, QrCode, Printer, MapPin, Clock, Calendar, User, Phone, Bus } from 'lucide-react';

interface TicketDetailModalProps {
    ticket: any;
    onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">

                {/* Top Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">VÉ ĐIỆN TỬ HỢP LỆ</h3>
                    <p className="text-xs text-blue-100 font-mono mt-0.5">MÃ VÉ: {ticket.ticketId || ticket.id}</p>
                </div>

                {/* Nội dung vé */}
                <div className="p-6 space-y-4 text-xs">
                    {/* QR Code */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-32 bg-white p-2 border-2 border-slate-800 rounded-xl flex items-center justify-center shadow-inner">
                            <QrCode className="w-full h-full text-slate-900" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase mt-2">
              Xuất trình mã này cho tài xế khi lên xe
            </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-slate-700">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Hành khách:</span>
                            <strong className="text-slate-900">{ticket.customer?.name} ({ticket.customer?.customerType || 'NORMAL'})</strong>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Số điện thoại:</span>
                            <strong className="text-slate-900">{ticket.customer?.phone}</strong>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Tuyến đường:</span>
                            <strong className="text-blue-600">{ticket.trip?.route}</strong>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Vị trí ghế:</span>
                            <strong className="text-amber-600 text-sm font-black">{ticket.seat?.seatNumber} ({ticket.seat?.seatType})</strong>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                            <span className="font-bold text-slate-900">Tổng thanh toán:</span>
                            <span className="font-black text-emerald-600 text-base">{ticket.finalPrice?.toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
                        >
                            <Printer className="w-4 h-4" /> In Vé Ra Giấy
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-extrabold text-white transition"
                        >
                            Hoàn Tất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};