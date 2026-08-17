import React, { useEffect, useState } from 'react';
import { Clock, X, ArrowRight } from 'lucide-react';

interface TopHoldingBannerProps {
    holdingData: {
        seatNumber: string;
        tripCode?: string;
        finalPrice: number;
        holdExpireAt: number;
    };
    onOpenPayment: () => void;
    onCancelHold: () => void;
}

export const TopHoldingBanner: React.FC<TopHoldingBannerProps> = ({
                                                                      holdingData,
                                                                      onOpenPayment,
                                                                      onCancelHold,
                                                                  }) => {
    const calculateRemaining = () => {
        return Math.max(0, Math.floor((holdingData.holdExpireAt - Date.now()) / 1000));
    };

    const [secondsLeft, setSecondsLeft] = useState(calculateRemaining);

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateRemaining();
            setSecondsLeft(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
                onCancelHold();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [holdingData.holdExpireAt]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    return (
        <div className="bg-[#f6b761] text-white px-4 py-2.5 shadow-sm sticky top-0 z-50 flex items-center justify-between text-xs sm:text-sm font-medium animate-in slide-in-from-top duration-300">
            {/* Vế trái: Thông tin ghế + Đếm ngược */}
            <div className="flex items-center gap-2 flex-wrap">
                <Clock className="w-4 h-4 flex-shrink-0 text-white" />
                <span>
          Bạn đang giữ chỗ ghế <strong className="font-black text-white">{holdingData.seatNumber}</strong> ({holdingData.tripCode || 'HN-HP-0700'}) -
        </span>
                <span className="bg-white text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
          <Clock className="w-3 h-3 text-amber-600" /> Giữ chỗ: {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
            </div>

            {/* Vế phải: Nút Thanh toán ngay & Nút Đóng/Hủy */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onOpenPayment}
                    className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition active:scale-95"
                >
                    Thanh toán ngay ({holdingData.finalPrice.toLocaleString('vi-VN')} đ)
                </button>
                <button
                    onClick={onCancelHold}
                    title="Hủy giữ chỗ"
                    className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};