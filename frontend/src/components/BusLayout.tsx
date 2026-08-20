import React, { ReactNode } from 'react';
import { DoorOpen, Navigation } from 'lucide-react';

interface BusLayoutProps {
    frontSeats: ReactNode[];
    vipSeats: ReactNode[];
    backSeats: ReactNode[];
}

const SeatSection: React.FC<{ title: string; seats: ReactNode[]; accent?: boolean }> = ({ title, seats, accent = false }) => {
    const rows: ReactNode[][] = [];
    for (let index = 0; index < seats.length; index += 2) rows.push(seats.slice(index, index + 2));
    if (rows.length === 0) return null;

    return (
        <section className={`rounded-3xl p-3 sm:p-4 ${accent ? 'border border-amber-500/30 bg-amber-500/5' : ''}`}>
            <h5 className={`mb-3 text-[11px] font-black uppercase tracking-wider ${accent ? 'text-amber-300' : 'text-slate-400'}`}>{title}</h5>
            <div className="space-y-3">
                {rows.map((row, index) => (
                    <div key={index} className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] items-center gap-2">
                        <div>{row[0]}</div>
                        <div className="h-full min-h-[88px] border-x border-dashed border-slate-700/80 bg-slate-900/40 flex items-center justify-center">
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-slate-600 [writing-mode:vertical-rl]">Lối đi</span>
                        </div>
                        <div>{row[1]}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const BusLayout: React.FC<BusLayoutProps> = ({ frontSeats, vipSeats, backSeats }) => (
    <div className="mt-7 flex justify-center">
        <div className="w-full max-w-lg rounded-[40px] border-2 border-slate-700/90 bg-slate-950/90 p-4 sm:p-7 shadow-2xl">
            <div className="mb-5 rounded-t-3xl border-x-2 border-t-2 border-slate-700/60 bg-gradient-to-b from-blue-950/50 to-slate-900 p-4">
                <div className="mb-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Đầu xe
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3 flex items-center justify-between">
                        <div><div className="text-xs font-bold text-white">Tài xế</div><div className="text-[9px] text-slate-500">Vị trí điều khiển</div></div>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-600 bg-slate-800 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-slate-400" /></div>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-3 flex items-center gap-2">
                        <DoorOpen className="w-5 h-5 text-emerald-400" />
                        <div><div className="text-xs font-bold text-white">Cửa lên/xuống</div><div className="text-[9px] text-emerald-400">Lối vào khoang xe</div></div>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                <SeatSection title="Hàng ghế trước" seats={frontSeats} />
                <SeatSection title="Khoang ghế VIP" seats={vipSeats} accent />
                <SeatSection title="Hàng ghế cuối" seats={backSeats} />
            </div>
            <div className="mt-6 border-t-2 border-dashed border-slate-800 pt-3 text-center text-[9px] font-bold uppercase tracking-widest text-slate-600">Đuôi xe</div>
        </div>
    </div>
);
