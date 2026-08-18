import React, { useState } from 'react';
import { Trip, Seat, Customer } from '../types';
import { HoldCountdownTimer } from './HoldCountdownTimer';
import {
    X, QrCode, CheckCircle2, ShieldCheck, Copy,
    Check, ArrowLeft, Loader2, Landmark, Wallet, Banknote
} from 'lucide-react';

interface PaymentModalProps {
    trip: Trip;
    seat: Seat;
    customer: Customer;
    finalPrice: number;
    paymentMethod: string;
    holdExpireAt: number;
    onClose: () => void;
    onExpire: () => void;
    onSuccessPayment: (ticketData: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
                                                              trip,
                                                              seat,
                                                              customer,
                                                              finalPrice,
                                                              paymentMethod,
                                                              holdExpireAt,
                                                              onClose,
                                                              onExpire,
                                                              onSuccessPayment,
                                                          }) => {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Sinh mã chuyển khoản VietQR tự động
    const transferContent = `VEXEVIP ${seat.seatNumber} ${customer.phone.slice(-4)}`;
    const qrUrl = `https://api.vietqr.io/image/970422-0912345678-compact2.jpg?amount=${finalPrice}&addInfo=${encodeURIComponent(transferContent)}&accountName=NHA%20XE%20LIMOUSINE%20VIP`;

    const handleCopyContent = () => {
        navigator.clipboard.writeText(transferContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmPay = async () => {
        setLoading(true);
        try {
            // Giả lập hoặc gọi API xác nhận thanh toán Backend
            await new Promise(r => setTimeout(r, 1200));
            onSuccessPayment({
                ticketId: `TICKET-${Math.floor(100000 + Math.random() * 900000)}`,
                trip,
                seat,
                customer,
                finalPrice,
                paymentMethod,
                bookingTime: new Date().toISOString(),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Bước 2 / 2: Thanh toán giữ chỗ
            </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black">Xác Nhận & Thanh Toán Vé</h2>
                    <p className="text-xs text-emerald-100 mt-0.5">Tự động kích hoạt xuất vé điện tử sau khi thanh toán</p>
                </div>

                <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    {/* Đồng hồ đếm ngược */}
                    <HoldCountdownTimer expireAt={holdExpireAt} onExpire={onExpire} />

                    {/* Khung chuyển khoản QR */}
                    {paymentMethod === 'BANKING' && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3">
                            <div className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                                <Landmark className="w-4 h-4 text-blue-600" /> Quét mã VietQR chuyển khoản 24/7
                            </div>

                            {/* QR Image */}
                            <div className="inline-block p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
                                <img
                                    src={qrUrl}
                                    alt="VietQR"
                                    className="w-44 h-44 object-contain mx-auto"
                                />
                            </div>

                            <div className="text-left bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                                <div className="flex justify-between">
                                    <span>Ngân hàng:</span>
                                    <strong className="text-slate-900">MB Bank (Quân Đội)</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Số tài khoản:</span>
                                    <strong className="text-slate-900 font-mono">0912345678</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Số tiền:</span>
                                    <strong className="text-emerald-600 text-sm font-black">{finalPrice.toLocaleString('vi-VN')} đ</strong>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                                    <span>Nội dung CK:</span>
                                    <div className="flex items-center gap-1">
                                        <strong className="text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded">{transferContent}</strong>
                                        <button
                                            onClick={handleCopyContent}
                                            className="p-1 text-slate-500 hover:text-blue-600"
                                        >
                                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ví MoMo */}
                    {paymentMethod === 'MOMO' && (
                        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 text-center space-y-3">
                            <Wallet className="w-10 h-10 text-pink-600 mx-auto" />
                            <h4 className="font-bold text-pink-900">Thanh toán qua Ví MoMo</h4>
                            <p className="text-xs text-pink-700">Mở ứng dụng MoMo và xác nhận thanh toán số tiền <strong>{finalPrice.toLocaleString('vi-VN')} đ</strong></p>
                        </div>
                    )}

                    {/* Tiền mặt */}
                    {paymentMethod === 'CASH' && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
                            <Banknote className="w-10 h-10 text-emerald-600 mx-auto" />
                            <h4 className="font-bold text-emerald-900">Thanh toán trực tiếp tại nhà xe</h4>
                            <p className="text-xs text-emerald-700">Vui lòng có mặt tại điểm đón trước 15 phút để thanh toán <strong>{finalPrice.toLocaleString('vi-VN')} đ</strong> cho nhân viên.</p>
                        </div>
                    )}

                    {/* Nút hành động */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                        >
                            <ArrowLeft className="w-4 h-4" /> Quay lại
                        </button>

                        <button
                            disabled={loading}
                            onClick={handleConfirmPay}
                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Đang kiểm tra giao dịch...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" /> Tôi Đã Chuyển Khoản / Hoàn Tất
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};