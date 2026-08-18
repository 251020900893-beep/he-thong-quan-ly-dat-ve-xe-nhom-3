import React from 'react';
import { Seat } from '../types';
import { Crown, Check, X, Clock, ShieldCheck, Sparkles, Navigation, DoorOpen } from 'lucide-react';

interface SeatMapProps {
    seats: Seat[];
    selectedSeatNumber: string | null;
    onSelectSeat: (seat: Seat) => void;
    busType: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({
                                                    seats = [],
                                                    selectedSeatNumber,
                                                    onSelectSeat,
                                                    busType = ''
                                                }) => {
    const safeSeats = Array.isArray(seats) ? seats : [];
    const is9Seats = safeSeats.length <= 9;

    // Phân bổ danh sách ghế theo thực tế sơ đồ xe
    const frontSeats = safeSeats.length >= 2 ? safeSeats.slice(0, 2) : safeSeats; // A1, A2
    const vipCabinSeats = is9Seats
        ? (safeSeats.length > 2 ? safeSeats.slice(2, 6) : [])
        : (safeSeats.length > 2 ? safeSeats.slice(2, 8) : []); // B1-B4 hoặc B1-B6
    const backSeats = is9Seats
        ? (safeSeats.length > 6 ? safeSeats.slice(6, 9) : [])
        : (safeSeats.length > 8 ? safeSeats.slice(8, 12) : []); // C1-C3 hoặc D1-D4

    const availableCount = safeSeats.filter(s => (s?.status || '').toUpperCase() === 'AVAILABLE').length;
    const holdingCount = safeSeats.filter(s => (s?.status || '').toUpperCase() === 'HOLDING').length;
    const bookedCount = safeSeats.filter(s => {
        const st = (s?.status || '').toUpperCase();
        return st === 'BOOKED' || st === 'PAID' || st === 'SOLD';
    }).length;

    return (
        <div id="seat-map-container" className="bg-slate-900 text-slate-100 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 relative overflow-hidden font-sans">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Sơ Đồ Chọn Chỗ Tương Tác
                        </span>
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            {busType}
                        </span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-white mt-1">
                        Chọn Vị Trí Ghế Ngồi Ưng Ý
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Chạm vào ghế trống để bắt đầu quá trình giữ chỗ độc quyền trong 3 phút
                    </p>
                </div>

                {/* Quick Stats Pills */}
                <div className="flex items-center gap-2 text-xs">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-300 font-medium">Trống: <strong className="text-white">{availableCount}</strong></span>
                    </div>
                    {holdingCount > 0 && (
                        <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 font-medium animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Đang giữ: <strong>{holdingCount}</strong></span>
                        </div>
                    )}
                    <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-600" />
                        <span>Đã bán: <strong className="text-slate-300">{bookedCount}</strong></span>
                    </div>
                </div>
            </div>

            {/* Legend guide */}
            <div className="py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    {/* Available Standard */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 text-[10px] font-bold shadow-inner">
                            A
                        </div>
                        <span className="text-slate-300 font-medium">Ghế Tiêu Chuẩn</span>
                    </div>

                    {/* VIP Seat */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-slate-950 text-[10px] font-extrabold shadow-sm">
                            <Crown className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="text-amber-300 font-bold">Ghế VIP (+50k)</span>
                    </div>

                    {/* Selected Seat */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-600 border border-blue-400 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-blue-500/50">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-blue-400 font-bold">Đang Chọn</span>
                    </div>

                    {/* Holding Seat */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500 border border-amber-400 flex items-center justify-center text-slate-950 text-[10px] font-bold animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-amber-400 font-medium">Giữ chỗ 3 phút</span>
                    </div>

                    {/* Booked Seat */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                            <X className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-500">Đã bán</span>
                    </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Khoá chống trùng ghế theo thời gian thực</span>
                </div>
            </div>

            {/* Main Bus Vehicle Graphic Canvas */}
            <div className="mt-8 flex justify-center relative z-10">
                <div className="w-full max-w-lg bg-slate-950/90 border-2 border-slate-700/90 rounded-[40px] p-6 sm:p-8 shadow-2xl relative backdrop-blur-md">
                    {/* Exterior Bus Windshield Front Curve */}
                    <div className="relative mb-8 pt-2 pb-4 border-b-2 border-dashed border-slate-800">
                        <div className="h-10 bg-gradient-to-b from-blue-950/40 to-slate-900/90 rounded-t-3xl border-t-2 border-x-2 border-slate-700/60 flex items-center justify-between px-6 mb-4">
                            <div className="w-8 h-2.5 bg-cyan-400/80 rounded-full shadow-lg shadow-cyan-400/50" />
                            <div className="text-[11px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">
                                <Navigation className="w-3 h-3 text-cyan-400" /> ĐẦU XE (KÍNH TRƯỚC)
                            </div>
                            <div className="w-8 h-2.5 bg-cyan-400/80 rounded-full shadow-lg shadow-cyan-400/50" />
                        </div>

                        {/* Đầu xe: Bác tài & Cửa lên xuống */}
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between shadow-xs">
                                <div>
                                    <div className="text-xs font-bold text-white">Bác Tài (Tài Xế)</div>
                                    <div className="text-[10px] text-slate-400">Vô lăng điều khiển</div>
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-800 shadow-inner">
                                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                                </div>
                            </div>

                            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
                                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <DoorOpen className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white">Cửa Lên Xuống</div>
                                    <div className="text-[10px] text-emerald-400 font-medium">Bậc thang tự động</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cabin Layout */}
                    <div className="space-y-6">
                        {/* Hàng Ghế Trước */}
                        <div>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Hàng Ghế Trước (Cạnh Bác Tài)
                                </span>
                                <span className="text-[10px] text-slate-500">2 Ghế Tiêu Chuẩn</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {frontSeats.map(seat => (
                                    <RealisticSeat
                                        key={seat.seatId || seat.seatNumber}
                                        seat={seat}
                                        isSelected={selectedSeatNumber === seat.seatNumber}
                                        onSelectSeat={onSelectSeat}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Khoang Hạng Thương Gia VIP */}
                        <div className="relative py-4 px-3 sm:px-4 bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30 rounded-3xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30">
                                        <Crown className="w-4 h-4 fill-current" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-amber-300 tracking-wide uppercase">
                                            Khoang Hạng Thương Gia VIP Massage
                                        </div>
                                        <div className="text-[10px] text-amber-400/80">
                                            Ghế đệm da cao cấp • Ngả lưng 140° • Cổng sạc Type-C & Massage
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md">
                                    +50.000 đ
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {vipCabinSeats.map(seat => (
                                    <RealisticSeat
                                        key={seat.seatId || seat.seatNumber}
                                        seat={seat}
                                        isSelected={selectedSeatNumber === seat.seatNumber}
                                        onSelectSeat={onSelectSeat}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Hàng Ghế Cuối */}
                        {backSeats.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Hàng Ghế Cuối
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        {backSeats.length} Ghế Tiêu Chuẩn
                                    </span>
                                </div>

                                <div className={is9Seats ? "grid grid-cols-3 gap-3" : "grid grid-cols-4 gap-2.5"}>
                                    {backSeats.map(seat => (
                                        <RealisticSeat
                                            key={seat.seatId || seat.seatNumber}
                                            seat={seat}
                                            isSelected={selectedSeatNumber === seat.seatNumber}
                                            onSelectSeat={onSelectSeat}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Đuôi xe */}
                    <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-800 flex items-center justify-between px-6">
                        <div className="w-8 h-2 bg-rose-500/80 rounded-full shadow-lg shadow-rose-500/50" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                            ĐUÔI XE (CỐP HÀNH LÝ RỘNG RÃI)
                        </span>
                        <div className="w-8 h-2 bg-rose-500/80 rounded-full shadow-lg shadow-rose-500/50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component Ghế Thực Tế
interface RealisticSeatProps {
    seat: Seat;
    isSelected: boolean;
    onSelectSeat: (seat: Seat) => void;
}

const RealisticSeat: React.FC<RealisticSeatProps> = ({
                                                         seat,
                                                         isSelected,
                                                         onSelectSeat
                                                     }) => {
    const rawStatus = (seat?.status || 'AVAILABLE').toUpperCase();
    const isVip = (seat?.seatType || '').toUpperCase() === 'VIP';

    const isBooked = rawStatus === 'BOOKED' || rawStatus === 'PAID' || rawStatus === 'SOLD';
    const isHolding = rawStatus === 'HOLDING';
    const isAvailable = rawStatus === 'AVAILABLE';

    // Không cho phép click nếu ghế đã bán hoặc đang bị người khác giữ
    const isClickable = isAvailable || isSelected;

    const handleClick = () => {
        if (isClickable) {
            onSelectSeat(seat);
        }
    };

    let seatStyle = 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-slate-500 cursor-pointer';
    let innerGlow = 'bg-slate-950';

    if (isSelected) {
        seatStyle = 'bg-gradient-to-b from-blue-600 to-indigo-700 border-blue-400 text-white shadow-xl shadow-blue-600/40 ring-2 ring-blue-400 scale-[1.03] cursor-pointer';
        innerGlow = 'bg-blue-900/60';
    } else if (isBooked) {
        seatStyle = 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed pointer-events-none';
        innerGlow = 'bg-slate-950/80';
    } else if (isHolding) {
        seatStyle = 'bg-amber-950/60 border-amber-500/80 text-amber-300 animate-pulse cursor-not-allowed pointer-events-none';
        innerGlow = 'bg-amber-900/40';
    } else if (isVip) {
        seatStyle = 'bg-gradient-to-b from-amber-950/30 to-slate-900 border-amber-500/60 text-amber-200 hover:border-amber-400 shadow-md shadow-amber-500/10 cursor-pointer';
        innerGlow = 'bg-amber-950/40';
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={!isClickable}
            className={`group relative w-full rounded-2xl border-2 p-3 transition-all duration-200 flex flex-col items-center justify-between min-h-[96px] ${seatStyle}`}
        >
            {/* VIP Crown */}
            {isVip && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/40 z-20">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                </div>
            )}

            {/* Headrest */}
            <div className="w-12 h-3.5 rounded-t-lg bg-slate-700/80 border border-slate-600/60 mx-auto -mt-1 shadow-inner" />

            {/* Main Seat Cushion */}
            <div className={`w-full py-1.5 rounded-xl flex flex-col items-center justify-center ${innerGlow}`}>
                <span className="text-base font-black tracking-tight">{seat.seatNumber}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {isBooked ? 'ĐÃ BÁN' : isHolding ? 'ĐANG GIỮ' : isVip ? 'VIP' : 'THƯỜNG'}
                </span>
            </div>

            {/* Armrests */}
            <div className="w-full flex items-center justify-between px-1 -mb-1">
                <div className="w-1.5 h-6 rounded-full bg-slate-700/60" />
                <span className="text-[10px] font-mono font-semibold opacity-90">
                    {isBooked ? 'Khóa' : isHolding ? '3 phút' : isVip ? '+50k' : 'Giá gốc'}
                </span>
                <div className="w-1.5 h-6 rounded-full bg-slate-700/60" />
            </div>
        </button>
    );
};