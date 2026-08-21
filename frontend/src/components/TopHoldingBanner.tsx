import React from 'react';
import { useBooking } from '../context/BookingContext';
import { HoldCountdownTimer } from './HoldCountdownTimer';
import { CreditCard, X, AlertCircle } from 'lucide-react';

interface TopHoldingBannerProps {
    onOpenPayment: () => void;
}

export const TopHoldingBanner: React.FC<TopHoldingBannerProps> = ({ onOpenPayment }) => {
    const { activeHoldingTicket, releaseHold, setActiveHoldingTicket } = useBooking();

    if (!activeHoldingTicket) return null;

    // Chuẩn hóa dữ liệu ghế và tuyến xe
    const seatName = activeHoldingTicket.seatNumber
        || (activeHoldingTicket.seat && activeHoldingTicket.seat.seatNumber)
        || 'A1';

    const routeName = activeHoldingTicket.route
        || (activeHoldingTicket.trip && activeHoldingTicket.trip.route)
        || (activeHoldingTicket.trip && `${activeHoldingTicket.trip.departure} ➔ ${activeHoldingTicket.trip.destination}`)
        || activeHoldingTicket.tripCode
        || 'Hà Nội ➔ Hải Phòng';

    const expireTime = (activeHoldingTicket as any).holdExpiresAt
        || (activeHoldingTicket as any).expiresAt
        || (activeHoldingTicket.seat && (activeHoldingTicket.seat as any).holdingExpiresAt)
        || (Date.now() + 180 * 1000);

    // Khi hết giờ: Tự động gọi hàm giải phóng ghế và ẩn banner ngay lập tức
    const handleTimeExpire = async () => {
        try {
            await releaseHold();
        } finally {
            setActiveHoldingTicket(null);
        }
    };

    // Khi bấm nút X: Giải phóng ghế và tắt banner
    const handleClose = async () => {
        try {
            await releaseHold();
        } finally {
            setActiveHoldingTicket(null);
        }
    };

    return (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-2 shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-white/20 rounded-full animate-pulse">
                        <AlertCircle className="w-4 h-4" />
                    </span>
                    <div>
                        <p className="text-xs sm:text-sm font-semibold">
                            Bạn đang giữ ghế <span className="font-mono font-black text-amber-200 text-sm bg-black/20 px-1.5 py-0.5 rounded">{seatName}</span> - Chuyến{' '}
                            <span className="font-bold text-white underline">{routeName}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <HoldCountdownTimer
                        expiresAt={expireTime}
                        onExpire={handleTimeExpire}
                    />
                    <button
                        type="button"
                        onClick={onOpenPayment}
                        className="flex items-center gap-1.5 bg-white text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-xl text-xs font-black shadow transition-all hover:scale-105 cursor-pointer"
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        Thanh toán ngay
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 hover:bg-black/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                        title="Hủy giữ ghế"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};