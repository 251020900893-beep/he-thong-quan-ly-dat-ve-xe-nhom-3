import React, { useEffect, useMemo, useState } from 'react';
import { Check, Clock, Crown, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Seat } from '../types';
import { BusLayout } from './BusLayout';
import { SeatItem } from './SeatItem';

interface SeatMapProps {
    seats: Seat[];
    selectedSeatNumber: string | null;
    onSelectSeat: (seat: Seat) => void;
    busType: string;
    basePrice?: number;
}

export const SeatMap: React.FC<SeatMapProps> = ({ seats = [], selectedSeatNumber, onSelectSeat, busType = '', basePrice }) => {
    const safeSeats = useMemo(() => {
        if (!Array.isArray(seats)) return [];

        return seats.map(seat => {
            const rawStatus = String(seat.status || '').toUpperCase();
            const status: Seat['status'] = rawStatus === 'AVAILABLE'
                ? 'AVAILABLE'
                : rawStatus === 'HOLDING'
                    ? 'HOLDING'
                    : 'BOOKED';

            return seat.status === status ? seat : { ...seat, status };
        });
    }, [seats]);
    const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>(selectedSeatNumber ? [selectedSeatNumber] : []);

    useEffect(() => {
        setSelectedSeatNumbers(current => {
            const validSelection = current.filter(seatNumber =>
                safeSeats.some(seat => seat.seatNumber === seatNumber && seat.status === 'AVAILABLE')
            );
            const externalSeatIsAvailable = selectedSeatNumber
                ? safeSeats.some(seat => seat.seatNumber === selectedSeatNumber && seat.status === 'AVAILABLE')
                : false;

            return externalSeatIsAvailable && selectedSeatNumber && !validSelection.includes(selectedSeatNumber)
                ? [...validSelection, selectedSeatNumber]
                : validSelection;
        });
    }, [safeSeats, selectedSeatNumber]);

    const normalSeats = safeSeats.filter(seat => seat.seatType !== 'VIP');
    const frontSeats = normalSeats.slice(0, 2);
    const vipCabinSeats = safeSeats.filter(seat => seat.seatType === 'VIP');
    const backSeats = normalSeats.slice(2);
    const counts = useMemo(() => ({
        available: safeSeats.filter(seat => seat.status === 'AVAILABLE').length,
        holding: safeSeats.filter(seat => seat.status === 'HOLDING').length,
        booked: safeSeats.filter(seat => seat.status === 'BOOKED').length
    }), [safeSeats]);

    const toggleSeat = (seatNumber: string) => {
        const seat = safeSeats.find(item => item.seatNumber === seatNumber);
        if (!seat) {
            window.alert('Ghế được chọn không tồn tại trong chuyến xe này.');
            return;
        }
        if (seat.status !== 'AVAILABLE') {
            window.alert(`Ghế ${seat.seatNumber} hiện không còn trống và không thể chọn.`);
            return;
        }
        setSelectedSeatNumbers(current => current.includes(seatNumber)
            ? current.filter(item => item !== seatNumber)
            : [...current, seatNumber]);
    };

    const continueWithSeat = (seatNumber: string) => {
        const seat = safeSeats.find(item => item.seatNumber === seatNumber);
        if (!seat || seat.status !== 'AVAILABLE') {
            window.alert('Ghế này không còn hợp lệ để tiếp tục đặt vé. Vui lòng chọn ghế khác.');
            setSelectedSeatNumbers(current => current.filter(item => item !== seatNumber));
            return;
        }
        onSelectSeat(seat);
    };

    const renderSeat = (seat: Seat) => (
        <SeatItem key={seat.seatId || seat.seatNumber} seat={seat} selected={selectedSeatNumbers.includes(seat.seatNumber)} basePrice={basePrice} onToggle={toggleSeat} />
    );

    return (
        <div id="seat-map-container" className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-2xl sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400"><Sparkles className="w-3.5 h-3.5" /> Sơ đồ chọn chỗ tương tác <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-2.5 py-0.5 text-[10px] text-blue-300">{busType}</span></div>
                    <h4 className="mt-1 text-lg font-black text-white sm:text-xl">Chọn vị trí ghế ngồi</h4>
                    <p className="mt-1 text-xs text-slate-400">Có thể chọn nhiều ghế trống; luồng đặt vé hiện xử lý từng ghế.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">Trống: {counts.available}</span>
                    <span className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-300">Đang giữ: {counts.holding}</span>
                    <span className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-400">Đã đặt: {counts.booked}</span>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-800 py-4 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded border border-slate-500 bg-slate-800" /> Ghế thường</span>
                <span className="flex items-center gap-1.5 text-amber-300"><Crown className="w-4 h-4" /> Ghế VIP</span>
                <span className="flex items-center gap-1.5 text-blue-300"><Check className="w-4 h-4" /> Đang chọn</span>
                <span className="flex items-center gap-1.5 text-amber-400"><Clock className="w-4 h-4" /> Đang giữ</span>
                <span className="flex items-center gap-1.5 text-slate-500"><X className="w-4 h-4" /> Đã đặt</span>
                <span className="ml-auto flex items-center gap-1 text-slate-500"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Chỉ ghế trống mới chọn được</span>
            </div>
            <BusLayout frontSeats={frontSeats.map(renderSeat)} vipSeats={vipCabinSeats.map(renderSeat)} backSeats={backSeats.map(renderSeat)} />
            <div className="mt-5 rounded-2xl border border-blue-500/25 bg-blue-500/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><div className="text-xs font-black text-white">Đã chọn {selectedSeatNumbers.length} ghế</div><div className="mt-1 text-[11px] text-slate-400">{selectedSeatNumbers.length > 0 ? selectedSeatNumbers.join(', ') : 'Chưa chọn ghế nào'}</div></div>
                    <div className="flex flex-wrap gap-2">
                        {selectedSeatNumbers.map(seatNumber => <button key={seatNumber} type="button" onClick={() => continueWithSeat(seatNumber)} className="rounded-xl bg-blue-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-blue-500">Đặt ghế {seatNumber}</button>)}
                    </div>
                </div>
            </div>
        </div>
    );
};
