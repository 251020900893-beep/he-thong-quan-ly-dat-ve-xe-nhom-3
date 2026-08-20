import React from 'react';
import { Crown, Clock, LockKeyhole } from 'lucide-react';
import { Seat } from '../types';

interface SeatItemProps {
    seat: Seat;
    selected: boolean;
    basePrice?: number;
    onToggle: (seatNumber: string) => void;
}

const statusLabels: Record<Seat['status'], string> = {
    AVAILABLE: 'Còn trống',
    HOLDING: 'Đang giữ chỗ',
    BOOKED: 'Đã đặt'
};

export const SeatItem: React.FC<SeatItemProps> = ({ seat, selected, basePrice, onToggle }) => {
    const isAvailable = seat.status === 'AVAILABLE';
    const isVip = seat.seatType === 'VIP';
    const surcharge = seat.surcharge ?? 0;
    const totalPrice = basePrice !== undefined ? basePrice + surcharge : undefined;
    const priceLabel = totalPrice !== undefined
        ? `${totalPrice.toLocaleString('vi-VN')} đ`
        : `Phụ thu ${surcharge.toLocaleString('vi-VN')} đ`;

    let seatStyle = isVip
        ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/70 text-amber-200 hover:border-amber-300'
        : 'bg-slate-900 border-slate-600 text-slate-200 hover:border-blue-400';

    if (selected) {
        seatStyle = 'bg-gradient-to-b from-blue-600 to-indigo-700 border-blue-300 text-white ring-2 ring-blue-400 shadow-lg shadow-blue-600/40';
    } else if (seat.status === 'HOLDING') {
        seatStyle = 'bg-amber-950/70 border-amber-500/70 text-amber-300 opacity-80 cursor-not-allowed';
    } else if (seat.status === 'BOOKED') {
        seatStyle = 'bg-slate-900/50 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed';
    }

    return (
        <div className="group relative min-w-0">
            <button
                type="button"
                disabled={!isAvailable}
                onClick={() => onToggle(seat.seatNumber)}
                aria-pressed={selected}
                aria-label={`${seat.seatNumber}, ${isVip ? 'ghế VIP' : 'ghế thường'}, ${statusLabels[seat.status]}, ${priceLabel}`}
                className={`relative w-full min-h-[88px] rounded-2xl border-2 p-2.5 transition-all duration-200 flex flex-col items-center justify-between ${seatStyle}`}
            >
                {isVip && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                        <Crown className="w-3.5 h-3.5 fill-current" />
                    </span>
                )}
                <div className="w-10 h-3 rounded-t-lg bg-current opacity-20" />
                <strong className="text-base font-black">{seat.seatNumber}</strong>
                <span className="text-[9px] font-bold uppercase tracking-wide flex items-center gap-1">
                    {seat.status === 'HOLDING' && <Clock className="w-3 h-3" />}
                    {seat.status === 'BOOKED' && <LockKeyhole className="w-3 h-3" />}
                    {selected ? 'Đang chọn' : statusLabels[seat.status]}
                </span>
            </button>

            <div role="tooltip" className="pointer-events-none absolute z-40 bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 hidden group-hover:block group-focus-within:block w-48 rounded-xl border border-slate-700 bg-slate-950 p-3 text-left text-[11px] text-slate-200 shadow-2xl">
                <div className="font-black text-white text-xs mb-1.5">Ghế {seat.seatNumber}</div>
                <div>Loại: {isVip ? 'Ghế VIP' : 'Ghế thường'}</div>
                <div>Trạng thái: {statusLabels[seat.status]}</div>
                {totalPrice !== undefined ? (
                    <>
                        <div>Giá vé: {totalPrice.toLocaleString('vi-VN')} đ</div>
                        <div>Phụ thu: {surcharge.toLocaleString('vi-VN')} đ</div>
                    </>
                ) : <div>Phụ thu: {surcharge.toLocaleString('vi-VN')} đ</div>}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-slate-950" />
            </div>
        </div>
    );
};
