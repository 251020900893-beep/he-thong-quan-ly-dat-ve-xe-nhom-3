import React, { useState } from 'react';
import { Trip } from '../types';
import { Clock, ArrowRight, RotateCw, Sparkles, MapPin, Bus } from 'lucide-react';

interface ExtendedTrip extends Trip {
    tripCode?: string;
    licensePlate?: string;
    driverName?: string;
    driverPhone?: string;
    direction?: 'HN_HP' | 'HP_HN';
    availableSeatsCount?: number;
    totalSeatsCount?: number;
}

interface TripListProps {
    trips: ExtendedTrip[];
    selectedTrip: ExtendedTrip | null;
    onSelectTrip: (trip: ExtendedTrip) => void;
}

export const TripList: React.FC<TripListProps> = ({ trips, selectedTrip, onSelectTrip }) => {
    // Bộ lọc
    const [directionFilter, setDirectionFilter] = useState<'ALL' | 'HN_HP' | 'HP_HN'>('ALL');
    const [busTypeFilter, setBusTypeFilter] = useState<'ALL' | '9' | '12'>('ALL');

    // Lọc chuyến đi
    const filteredTrips = trips.filter(trip => {
        // Lọc theo chiều đi
        if (directionFilter === 'HN_HP' && trip.direction !== 'HN_HP') return false;
        if (directionFilter === 'HP_HN' && trip.direction !== 'HP_HN') return false;

        // Lọc theo loại xe
        if (busTypeFilter === '9' && !trip.busType.includes('9')) return false;
        if (busTypeFilter === '12' && !trip.busType.includes('12')) return false;

        return true;
    });

    return (
        <div className="space-y-6">
            {/* BANNER HERO XANH TÍM ĐẬM (THEO ẢNH 1) */}
            <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 border border-blue-900/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                {/* Glow hiệu ứng nền */}
                <div className="absolute top-0 right-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

                {/* Tags phía trên */}
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5" /> Giữ chỗ tự động 3 phút (Auto-Release)
          </span>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full">
            Cao tốc Hà Nội - Hải Phòng 1h15p
          </span>
                </div>

                {/* Tiêu đề chính */}
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                    Tuyến Xe Limousine VIP Cao Cấp <br className="hidden sm:inline" />
                    Hà Nội ⇄ Hải Phòng
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
                    Trải nghiệm dòng xe DCar VIP Massage đón trả tận nơi. Hệ thống áp dụng chính sách giảm giá thành viên (-10%), VIP (-20%) và giữ chỗ 3 phút trước khi thanh toán.
                </p>

                {/* BỘ LỌC CHIỀU ĐI & LOẠI XE */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    {/* Lọc chiều đi */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1">
              ⇄ Chiều đi:
            </span>
                        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setDirectionFilter('ALL')}
                                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                    directionFilter === 'ALL'
                                        ? 'bg-white text-slate-950 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Tất cả
                            </button>
                            <button
                                type="button"
                                onClick={() => setDirectionFilter('HN_HP')}
                                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                    directionFilter === 'HN_HP'
                                        ? 'bg-white text-slate-950 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Hà Nội ➔ Hải Phòng
                            </button>
                            <button
                                type="button"
                                onClick={() => setDirectionFilter('HP_HN')}
                                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                    directionFilter === 'HP_HN'
                                        ? 'bg-white text-slate-950 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Hải Phòng ➔ Hà Nội
                            </button>
                        </div>
                    </div>

                    {/* Lọc loại xe */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-300 font-bold">
              Loại xe:
            </span>
                        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setBusTypeFilter('ALL')}
                                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                    busTypeFilter === 'ALL'
                                        ? 'bg-white text-slate-950 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Tất cả
                            </button>
                            <button
                                type="button"
                                onClick={() => setBusTypeFilter('9')}
                                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                    busTypeFilter === '9'
                                        ? 'bg-white text-slate-950 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Limousine 9 Chỗ
                            </button>
                            <button
                                type="button"
                                onClick={() => setBusTypeFilter('12')}
                                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                    busTypeFilter === '12'
                                        ? 'bg-white text-slate-950 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Limousine 12 Chỗ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* HEADER DANH SÁCH CHUYẾN XE */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
        <span className="text-sm font-extrabold text-slate-900">
          Danh sách chuyến xe trong ngày ({filteredTrips.length} chuyến)
        </span>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold">
                    <RotateCw className="w-3.5 h-3.5" /> Cập nhật sơ đồ ghế
                </button>
            </div>

            {/* DANH SÁCH CÁC THẺ CHUYẾN XE NGANG (THEO ẢNH 2) */}
            <div className="space-y-3.5">
                {filteredTrips.map(trip => {
                    const isSelected = selectedTrip?.tripId === trip.tripId;
                    const totalSeats = trip.totalSeatsCount || (trip.busType.includes('12') ? 12 : 9);
                    const availableSeats = trip.availableSeatsCount ?? totalSeats;

                    return (
                        <div
                            key={trip.tripId}
                            className={`bg-white border-2 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                isSelected
                                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-blue-500/10'
                                    : 'border-slate-200/80 hover:border-slate-300'
                            }`}
                        >
                            {/* Cột trái: Giờ & Tuyến xe & Thông tin xe/tài xế */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2.5">
                  <span className="text-lg sm:text-xl font-black text-slate-900">
                    {trip.departureTime}
                  </span>
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-600">
                    {trip.arrivalTime}
                  </span>
                                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                    {trip.tripCode || trip.tripId}
                  </span>
                                </div>

                                <div className="text-xs font-bold text-slate-800">
                                    {trip.route}
                                </div>

                                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5">
                                    <span>Xe: <strong className="text-slate-700">{trip.licensePlate || '29B-999.66'}</strong></span>
                                    <span>•</span>
                                    <span>{trip.busType}</span>
                                    <span>•</span>
                                    <span>Bác tài: <strong className="text-slate-700">{trip.driverName || 'Trần Văn Dũng'} ({trip.driverPhone || '0903.456.789'})</strong></span>
                                </div>
                            </div>

                            {/* Cột phải: Giá vé, Tình trạng ghế & Nút chọn */}
                            <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                                {/* Giá vé */}
                                <div className="text-left md:text-right">
                                    <div className="text-[10px] text-slate-400">Giá vé chỉ từ</div>
                                    <div className="text-lg sm:text-xl font-black text-blue-600 leading-tight">
                                        {trip.basePrice.toLocaleString('vi-VN')} đ
                                    </div>
                                    <div className="text-[10px] text-slate-400">Ghế VIP: +50.000 đ</div>
                                </div>

                                {/* Tình trạng ghế */}
                                <div className="text-left md:text-right">
                                    <div className="text-[10px] text-slate-400">Tình trạng ghế</div>
                                    <div className="text-xs font-black text-emerald-600">
                                        Còn {availableSeats}/{totalSeats} chỗ
                                    </div>
                                </div>

                                {/* Nút Chọn ghế & Đặt */}
                                <button
                                    type="button"
                                    onClick={() => onSelectTrip(trip)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-3 rounded-xl transition shadow-md shadow-blue-600/20 active:scale-95 flex-shrink-0"
                                >
                                    Chọn ghế & Đặt ➔
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};