import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import {
    X,
    Clock,
    Copy,
    Check,
    Building,
    ShieldCheck,
    Wallet,
    Banknote
} from 'lucide-react';

interface PaymentModalProps {
    trip?: any;
    seat?: any;
    customer?: any;
    finalPrice?: number;
    paymentMethod?: string;
    holdExpireAt?: number;
    onClose: () => void;
    onExpire?: () => void;
    onSuccessPayment: (ticketData: any) => void;
    ticket?: any;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
                                                              trip,
                                                              seat,
                                                              customer,
                                                              finalPrice = 224000,
                                                              paymentMethod = 'E_WALLET',
                                                              holdExpireAt,
                                                              onClose,
                                                              onExpire,
                                                              onSuccessPayment,
                                                              ticket: propTicket
                                                          }) => {
    const { confirmPayment, releaseHold, activeHoldingTicket } = useBooking();

    const ticketData = propTicket || {
        ticketId: `VE-HPHN0800-B2-${Math.floor(1000 + Math.random() * 9000)}`,
        trip: trip || { tripCode: 'HP-HN-0800', departureTime: '08:00' },
        seat: seat || { seatNumber: 'B2', seatType: 'VIP' },
        customer: customer || { fullName: 'Nguyễn Văn Hùng', phone: '0912345678' },
        finalPrice: finalPrice,
        paymentMethod: paymentMethod,
        status: 'HOLDING'
    };

    const ticketId = ticketData.ticketId || ticketData.id || `VE-HPHN0800-B2-3523`;
    const tripCode = ticketData.trip?.tripCode || ticketData.tripCode || 'HP-HN-0800';
    const departureTime = ticketData.trip?.departureTime || ticketData.departureTime || '08:00';
    const seatNumber = ticketData.seat?.seatNumber || ticketData.seatNumber || 'B2';
    const seatType = ticketData.seat?.seatType || ticketData.seatType || 'VIP';
    const customerName = ticketData.customer?.fullName || ticketData.customer?.name || ticketData.customerName || 'Nguyễn Văn Hùng';
    const customerPhone = ticketData.customer?.phone || ticketData.customerPhone || '0912345678';
    const price = ticketData.finalPrice || ticketData.price || finalPrice;

    // Lấy mốc thời gian hết hạn cố định từ props hoặc Context chung
    const targetExpireAt = holdExpireAt || (activeHoldingTicket as any)?.holdExpiresAt;

    const [timeLeft, setTimeLeft] = useState<number>(() => {
        if (targetExpireAt) {
            return Math.max(0, Math.floor((targetExpireAt - Date.now()) / 1000));
        }
        return 180;
    });

    const [mainMethod, setMainMethod] = useState<'BANKING' | 'E_WALLET' | 'CASH'>('E_WALLET');
    const [walletSubMethod, setWalletSubMethod] = useState<'MOMO' | 'VNPAY' | 'ZALOPAY'>('MOMO');
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        if (!targetExpireAt) return;

        const updateTimer = () => {
            const remaining = Math.max(0, Math.floor((targetExpireAt - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0) {
                if (onExpire) onExpire();
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [targetExpireAt, onExpire]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const progressPercent = Math.min(100, (timeLeft / 180) * 100);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleCancelHoldClick = async () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy giữ chỗ và nhường lại ghế này không?')) {
            await releaseHold();
            onClose();
        }
    };

    const handleCompletePayment = async () => {
        setIsProcessing(true);
        try {
            const ticketIdToPay = ticketData?.ticketId || ticketData?.id;
            if (!ticketIdToPay) {
                throw new Error('Không xác định được mã vé để thanh toán.');
            }

            const paidTicket = await confirmPayment(ticketIdToPay, mainMethod);
            setIsProcessing(false);
            onSuccessPayment(paidTicket);
        } catch (err: any) {
            setIsProcessing(false);
            alert(err?.message || 'Thanh toán thất bại hoặc vé đã hết thời gian giữ chỗ.');
        }
    };

    const bankAccount = {
        bankName: 'MB Bank (Ngân hàng Quân Đội)',
        accountNumber: '0912345678',
        accountName: 'DCAR LIMOUSINE VIP',
        amount: price,
        content: `${ticketId} ${seatNumber}`
    };

    const vietQrUrl = `https://api.vietqr.io/image/970422-0912345678-qPqgC8v.jpg?accountName=DCAR%20LIMOUSINE%20VIP&amount=${price}&addInfo=${encodeURIComponent(bankAccount.content)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto text-slate-900">
                <div className="bg-slate-950 p-5 sm:p-6 text-white flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                                Bước 2 / 2: Thanh toán
                            </span>
                            <span className="text-xs text-slate-400 font-mono">Mã vé: {ticketId}</span>
                        </div>
                        <h3 className="text-xl font-black mt-2 text-white">
                            Thanh toán vé xe Hà Nội ➔ Hải Phòng
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[calc(88vh-110px)] overflow-y-auto text-xs sm:text-sm">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-amber-950 uppercase tracking-wide">
                                        THỜI GIAN GIỮ CHỖ TỰ ĐỘNG (3 PHÚT)
                                    </div>
                                    <div className="text-[11px] text-amber-800">
                                        Vui lòng hoàn tất thanh toán để nhận vé chính thức.
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-2xl font-black text-amber-600 leading-none">
                                    {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                                </div>
                                <div className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mt-1">
                                    PHÚT : GIÂY
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-1.5 bg-amber-200/80 rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50/40 border-2 border-blue-200 rounded-3xl p-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                    MÃ VÉ ĐIỆN TỬ CỦA BẠN:
                                </span>
                                <span className="font-mono font-black text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-300 text-sm shadow-2xs">
                                    {ticketId}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(ticketId, 'ticket-id')}
                                    className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                    {copiedField === 'ticket-id' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedField === 'ticket-id' ? 'Đã chép!' : 'Sao chép mã'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100/70 text-blue-800">
                            🔍 Dùng mã này để tra cứu vé mọi lúc
                        </div>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-blue-100">
                            <div>
                                <div className="font-bold text-slate-900">
                                    Hành khách: {customerName} • SĐT: <span className="font-mono font-bold text-blue-700">{customerPhone}</span>
                                </div>
                                <div className="text-slate-600 mt-0.5">
                                    Chuyến: <strong>{tripCode}</strong> ({departureTime}) | Ghế: <strong className="text-blue-700 font-black">{seatNumber}</strong> ({seatType})
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[11px] text-slate-400 font-medium">Tổng tiền thanh toán</div>
                                <div className="text-2xl font-black text-blue-600 font-mono">
                                    {price.toLocaleString('vi-VN')} đ
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-slate-800 uppercase tracking-wide">
                            CHỌN PHƯƠNG THỨC THANH TOÁN:
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setMainMethod('BANKING')}
                                className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                    mainMethod === 'BANKING'
                                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                            >
                                <Building className="w-5 h-5 text-blue-600" />
                                <div className="text-xs font-bold text-slate-900 mt-1">Chuyển khoản QR</div>
                                <div className="text-[10px] text-slate-400">VietQR 24/7 tức thì</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMainMethod('E_WALLET')}
                                className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                    mainMethod === 'E_WALLET'
                                        ? 'border-pink-500 bg-pink-50/30 shadow-sm ring-1 ring-pink-400'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                            >
                                <Wallet className="w-5 h-5 text-pink-600" />
                                <div className="text-xs font-bold text-pink-600 mt-1">Ví điện tử</div>
                                <div className="text-[10px] text-slate-400">MoMo, VNPay, ZaloPay</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMainMethod('CASH')}
                                className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                    mainMethod === 'CASH'
                                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                            >
                                <Banknote className="w-5 h-5 text-emerald-600" />
                                <div className="text-xs font-bold text-slate-900 mt-1">Tiền mặt</div>
                                <div className="text-[10px] text-slate-400">Tại quầy / Lúc lên xe</div>
                            </button>
                        </div>
                    </div>

                    {mainMethod === 'E_WALLET' && (
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4.5 space-y-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setWalletSubMethod('MOMO')}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                                        walletSubMethod === 'MOMO'
                                            ? 'bg-pink-600 text-white shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-700'
                                    }`}
                                >
                                    MoMo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setWalletSubMethod('VNPAY')}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                                        walletSubMethod === 'VNPAY'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-700'
                                    }`}
                                >
                                    VNPay
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setWalletSubMethod('ZALOPAY')}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                                        walletSubMethod === 'ZALOPAY'
                                            ? 'bg-sky-500 text-white shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-700'
                                    }`}
                                >
                                    ZaloPay
                                </button>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-slate-800">
                                        Ví thanh toán: {walletSubMethod === 'MOMO' ? 'MoMo' : walletSubMethod === 'VNPAY' ? 'VNPay' : 'ZaloPay'}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                        Hệ thống liên kết thanh toán tức thì
                                    </div>
                                </div>
                                <div className="text-base font-black text-pink-600 font-mono">
                                    {price.toLocaleString('vi-VN')} đ
                                </div>
                            </div>
                        </div>
                    )}

                    {mainMethod === 'BANKING' && (
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4.5 space-y-4 text-center">
                            <div className="inline-block p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <img
                                    src={vietQrUrl}
                                    alt="VietQR Code"
                                    className="w-44 h-44 mx-auto object-contain rounded-lg"
                                />
                            </div>
                            <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-slate-200 text-left">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Ngân hàng:</span>
                                    <span className="font-bold">{bankAccount.bankName}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Số tài khoản:</span>
                                    <span className="font-mono font-bold text-blue-700">{bankAccount.accountNumber}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-slate-500">Nội dung chuyển:</span>
                                    <span className="font-mono font-bold text-slate-800">{bankAccount.content}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {mainMethod === 'CASH' && (
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 text-center text-xs text-emerald-950 space-y-1">
                            <p className="font-bold">Thanh toán trực tiếp bằng tiền mặt</p>
                            <p className="text-slate-600">Vui lòng thanh toán số tiền <strong className="font-mono text-emerald-700 font-black">{price.toLocaleString('vi-VN')} đ</strong> cho nhân viên soát vé / bác tài khi lên xe.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={handleCancelHoldClick}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                    >
                        Hủy giữ chỗ này (Nhường lại ghế)
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            disabled={isProcessing}
                            onClick={handleCompletePayment}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Xác nhận đã thanh toán ({price.toLocaleString('vi-VN')} đ)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};