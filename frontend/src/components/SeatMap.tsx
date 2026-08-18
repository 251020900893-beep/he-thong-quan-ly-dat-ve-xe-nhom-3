import React from 'react';
import { Crown, Check, X, Clock, ShieldCheck, Sparkles, Navigation, DoorOpen } from 'lucide-react';
import { Seat } from '../types';

interface SeatMapProps {
    seats: Seat[];
    selectedSeat: Seat | null;
    onSelectSeat: (seat: Seat) => void;
    busType: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({
                                                    seats,
                                                    selectedSeat,
                                                    onSelectSeat,
                                                    busType,
                                                }) => {
    const is9Seats = seats.length <= 9;

    // Phân chia layout ghế theo 9 chỗ hoặc 12 chỗ
    const frontSeats = seats.slice(0, 2); // A1, A2
    const vipSeats = is9Seats ? seats.slice(2, 6) : seats.slice(2, 8); // B1-B4 hoặc B1-B6
    const backSeats = is9Seats ? seats.slice(6, 9) : seats.slice(8, 12); // C1-C3 hoặc C1-C4

    const availableCount = seats.filter(s => s.status === 'AVAILABLE').length;
    const holdingCount = seats.filter(s => s.status === 'HOLDING').length;
    const bookedCount = seats.filter(s => s.status === 'BOOKED').length;

    return (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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

            {/* Chú thích màu sắc */}
            <div className="py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 text-[10px] font-bold">A</div>
                        <span className="text-slate-300">Ghế Thường</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                            <Crown className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-amber-300 font-bold">Ghế VIP (+50k)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
                            <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-blue-400 font-bold">Đang Chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-600 flex items-center justify-center">
                            <X className="w-3 h-3" />
                        </div>
                        <span className="text-slate-500">Đã bán</span>
                    </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Khoá chống trùng ghế tự động</span>
                </div>
            </div>

            {/* Main Bus Graphic */}
            <div className="mt-6 flex justify-center relative z-10">
                <div className="w-full max-w-md bg-slate-950 border-2 border-slate-700 rounded-[36px] p-5 sm:p-6 shadow-2xl relative">
                    {/* Đầu xe & Kính chắn gió */}
                    <div className="relative mb-6 pt-1 pb-3 border-b-2 border-dashed border-slate-800">
                        <div className="h-8 bg-gradient-to-b from-blue-950/40 to-slate-900/90 rounded-t-2xl border-t-2 border-x-2 border-slate-700/60 flex items-center justify-between px-5 mb-3">
                            <div className="w-6 h-2 bg-cyan-400/80 rounded-full shadow-lg shadow-cyan-400/50" />
                            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">
                                <Navigation className="w-3 h-3 text-cyan-400" /> ĐẦU XE (KÍNH TRƯỚC)
                            </div>
                            <div className="w-6 h-2 bg-cyan-400/80 rounded-full shadow-lg shadow-cyan-400/50" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 items-center">
                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <DoorOpen className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white">Cửa Lên</div>
                                    <div className="text-[9px] text-emerald-400 font-medium">Bậc tự động</div>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-white">Bác Tài</div>
                                    <div className="text-[9px] text-slate-400">Vô lăng lái xe</div>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-800">
                                    <div className="w-2 h-2 rounded-full bg-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sơ đồ ghế thực tế */}
                    <div className="space-y-5">
                        {/* Hàng ghế đầu */}
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                                <span>Hàng Ghế Trước (Cạnh Tài Xế)</span>
                                <span>2 Ghế Thường</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {frontSeats.map(seat => (
                                    <RealisticSeat
                                        key={seat.seatId}
                                        seat={seat}
                                        isSelected={selectedSeat?.seatNumber === seat.seatNumber}
                                        onSelectSeat={onSelectSeat}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Khoang VIP */}
                        <div className="p-3.5 bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5">
                                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                    <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                    Khoang VIP Massage Hạng Thương Gia
                  </span>
                                </div>
                                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md">
                  +50k
                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {vipSeats.map(seat => (
                                    <RealisticSeat
                                        key={seat.seatId}
                                        seat={seat}
                                        isSelected={selectedSeat?.seatNumber === seat.seatNumber}
                                        onSelectSeat={onSelectSeat}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Hàng ghế cuối */}
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                                <span>Hàng Ghế Cuối</span>
                                <span>{backSeats.length} Ghế Thường</span>
                            </div>
                            <div className={is9Seats ? "grid grid-cols-3 gap-2.5" : "grid grid-cols-4 gap-2"}>
                                {backSeats.map(seat => (
                                    <RealisticSeat
                                        key={seat.seatId}
                                        seat={seat}
                                        isSelected={selectedSeat?.seatNumber === seat.seatNumber}
                                        onSelectSeat={onSelectSeat}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-3 border-t-2 border-dashed border-slate-800 text-center">
                        <div className="h-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 rounded-full w-1/2 mx-auto shadow-md" />
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1.5 inline-block">
              ĐUÔI XE & KHOANG HÀNH LÝ
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component Ghế Xe Bọc Da Chân Thực
const RealisticSeat: React.FC<{
    seat: Seat;
    isSelected: boolean;
    onSelectSeat: (seat: Seat) => void;
}> = ({ seat, isSelected, onSelectSeat }) => {
    const isAvailable = seat.status === 'AVAILABLE';
    const isBooked = seat.status === 'BOOKED';
    const isHolding = seat.status === 'HOLDING';
    const isVip = seat.seatType === 'VIP';

    let containerStyle = '';
    let headrestStyle = '';
    let cushionStyle = '';
    let armrestStyle = '';

    if (isSelected) {
        containerStyle = 'bg-blue-600 border-blue-400 text-white shadow-lg ring-4 ring-blue-400/50 scale-[1.02]';
        headrestStyle = 'bg-blue-500 border-blue-300';
        cushionStyle = 'bg-blue-700/80 border-blue-400/60';
        armrestStyle = 'bg-blue-500 border-blue-400';
    } else if (isBooked) {
        containerStyle = 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-60';
        headrestStyle = 'bg-slate-800 border-slate-700';
        cushionStyle = 'bg-slate-900 border-slate-800';
        armrestStyle = 'bg-slate-800 border-slate-700';
    } else if (isHolding) {
        containerStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 cursor-not-allowed shadow-md animate-pulse';
        headrestStyle = 'bg-amber-500 text-slate-950 font-bold';
        cushionStyle = 'bg-amber-600/30 border-amber-500/50';
        armrestStyle = 'bg-amber-500/40 border-amber-400/40';
    } else if (isVip) {
        containerStyle = 'bg-slate-900 border-amber-500/50 hover:border-amber-400 text-amber-200 hover:scale-[1.02] cursor-pointer';
        headrestStyle = 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300';
        cushionStyle = 'bg-amber-950/40 border-amber-600/40';
        armrestStyle = 'bg-amber-600/30 border-amber-500/40';
    } else {
        containerStyle = 'bg-slate-900 border-slate-700 hover:border-blue-400 text-slate-200 hover:scale-[1.02] cursor-pointer';
        headrestStyle = 'bg-slate-800 border-slate-600';
        cushionStyle = 'bg-slate-950 border-slate-800';
        armrestStyle = 'bg-slate-800 border-slate-700';
    }

    return (
        <button
            type="button"
            disabled={!isAvailable}
            onClick={() => isAvailable && onSelectSeat(seat)}
            className={`group relative flex flex-col items-center justify-between p-2 rounded-xl border-2 transition-all select-none ${containerStyle}`}
        >
            {/* Tựa đầu */}
            <div className={`w-10 sm:w-12 h-3 rounded-t-md border flex items-center justify-center ${headrestStyle}`}>
                {isVip && !isSelected && !isBooked && (
                    <Crown className="w-2.5 h-2.5 fill-current" />
                )}
            </div>

            {/* Đệm ngồi và tay vịn */}
            <div className="w-full flex items-center justify-between gap-1 my-1">
                <div className={`w-1.5 h-6 rounded-xs border ${armrestStyle}`} />
                <div className={`flex-1 h-8 rounded-lg border flex flex-col items-center justify-center ${cushionStyle}`}>
                    <span className="text-sm font-black font-mono leading-none">{seat.seatNumber}</span>
                    <span className="text-[8px] font-bold uppercase opacity-80 mt-0.5">
            {isBooked ? 'ĐÃ BÁN' : isVip ? 'VIP' : 'THƯỜNG'}
          </span>
                </div>
                <div className={`w-1.5 h-6 rounded-xs border ${armrestStyle}`} />
            </div>

            {/* Giá hoặc trạng thái */}
            <div className="w-full text-center text-[9px] font-bold">
                {isSelected ? (
                    <span className="text-white flex items-center justify-center gap-0.5"><Check className="w-2.5 h-2.5 stroke-[3]" /> Chọn</span>
                ) : isBooked ? (
                    <span className="text-slate-500">Khóa</span>
                ) : isVip ? (
                    <span className="text-amber-400">+50k</span>
                ) : (
                    <span className="text-slate-400">Gốc</span>
                )}
            </div>
        </button>
    );
};