import React, { useState, useEffect } from 'react';
import { BusTrip, Seat } from '../types';
import { SeatMap } from './SeatMap';
import { useBooking } from '../context/BookingContext';
import {
    Bus, ShieldCheck, Filter, ChevronDown, ChevronUp
} from 'lucide-react';

interface TripListProps {
    onSelectSeat: (trip: BusTrip, seat: Seat) => void;
    routeFilter?: 'ALL' | 'HN_HP' | 'HP_HN';
    onRouteFilterChange?: (filter: 'ALL' | 'HN_HP' | 'HP_HN') => void;
    busTypeFilter?: 'ALL' | '9_SEATS' | '12_SEATS';
    onBusTypeFilterChange?: (filter: 'ALL' | '9_SEATS' | '12_SEATS') => void;
    expandedTripId?: string | null;
    onExpandTrip?: (tripId: string | null) => void;
}

export const TripList: React.FC<TripListProps> = ({
                                                      onSelectSeat,
                                                      routeFilter = 'ALL',
                                                      onRouteFilterChange,
                                                      busTypeFilter = 'ALL',
                                                      onBusTypeFilterChange,
                                                      expandedTripId: externalExpandedId,
                                                      onExpandTrip
                                                  }) => {
    // 🚀 LẤY TRỰC TIẾP TRIPS TỪ GLOBAL CONTEXT (KHI CONTEXT ĐỔI THÌ GIAO DIỆN TỰ ĐỔI MÀU TỨC THÌ)
    const { trips, loadingTrips } = useBooking();

    const [internalExpandedId, setInternalExpandedId] = useState<string | null>(null);
    const activeExpandedId = externalExpandedId !== undefined ? externalExpandedId : internalExpandedId;

    const toggleExpand = (tripId: string) => {
        const nextId = activeExpandedId === tripId ? null : tripId;
        if (onExpandTrip) {
            onExpandTrip(nextId);
        } else {
            setInternalExpandedId(nextId);
        }
    };

    const normalize = (str: string = '') =>
        str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const safeTrips = Array.isArray(trips) ? trips : [];

    const filteredTrips = safeTrips.filter((trip) => {
        const dep = normalize(trip.departureLocation || trip.departure || '');
        const dest = normalize(trip.destinationLocation || trip.destination || '');
        const bType = normalize(trip.busType || '');

        let matchRoute = true;
        if (routeFilter === 'HN_HP') {
            matchRoute = dep.includes('ha noi') || dest.includes('hai phong');
        } else if (routeFilter === 'HP_HN') {
            matchRoute = dep.includes('hai phong') || dest.includes('ha noi');
        }

        let matchType = true;
        if (busTypeFilter === '9_SEATS') {
            matchType = trip.totalSeats === 9 || bType.includes('9');
        } else if (busTypeFilter === '12_SEATS') {
            matchType = trip.totalSeats === 12 || bType.includes('12');
        }

        return matchRoute && matchType;
    });

    useEffect(() => {
        if (externalExpandedId === 'AUTO_FIRST' && filteredTrips.length > 0) {
            const firstTripId = filteredTrips[0].id || filteredTrips[0].tripId;
            if (onExpandTrip && firstTripId) {
                onExpandTrip(firstTripId);
            }
        }
    }, [externalExpandedId, filteredTrips, onExpandTrip]);

    return (
        <div id="trip-list-section" className="space-y-4 font-sans">
            {/* Bộ Lọc Tuyến Đường */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onRouteFilterChange && onRouteFilterChange('ALL')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            routeFilter === 'ALL'
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Tất cả chuyến ({safeTrips.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => onRouteFilterChange && onRouteFilterChange('HN_HP')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            routeFilter === 'HN_HP'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Hà Nội ➔ Hải Phòng
                    </button>
                    <button
                        type="button"
                        onClick={() => onRouteFilterChange && onRouteFilterChange('HP_HN')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            routeFilter === 'HP_HN'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Hải Phòng ➔ Hà Nội
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" /> DÒNG XE:
                    </span>
                    <button
                        type="button"
                        onClick={() => onBusTypeFilterChange && onBusTypeFilterChange('ALL')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            busTypeFilter === 'ALL' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Tất cả
                    </button>
                    <button
                        type="button"
                        onClick={() => onBusTypeFilterChange && onBusTypeFilterChange('9_SEATS')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            busTypeFilter === '9_SEATS' ? 'bg-blue-100 text-blue-800' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        9 Chỗ VIP
                    </button>
                    <button
                        type="button"
                        onClick={() => onBusTypeFilterChange && onBusTypeFilterChange('12_SEATS')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            busTypeFilter === '12_SEATS' ? 'bg-blue-100 text-blue-800' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        12 Chỗ Luxury
                    </button>
                </div>
            </div>

            {loadingTrips ? (
                <div className="py-12 text-center text-slate-400 text-sm">Đang tải danh sách chuyến xe VIP...</div>
            ) : filteredTrips.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                    Không tìm thấy chuyến xe nào phù hợp với bộ lọc đã chọn.
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTrips.map((trip) => {
                        const currentId = trip.id || trip.tripId;
                        const isExpanded = activeExpandedId === currentId;
                        const availableSeatsCount = Array.isArray(trip.seats)
                            ? trip.seats.filter((s) => (s?.status || '').toUpperCase() === 'AVAILABLE').length
                            : 0;

                        return (
                            <div
                                key={currentId}
                                id={`trip-card-${currentId}`}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
                                    isExpanded ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-900 text-white rounded-2xl p-3 text-center min-w-[85px]">
                                            <div className="text-lg font-black">{trip.departureTime}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Khởi hành</div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-base font-black text-slate-900">
                                                <span>{trip.departureLocation || trip.departure}</span>
                                                <span className="text-blue-600 font-bold">➔</span>
                                                <span>{trip.destinationLocation || trip.destination}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Bus className="w-3.5 h-3.5 text-blue-600" /> {trip.busType} ({trip.busPlate || trip.licensePlate})
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> Cao tốc 5B (1h15 - 1h30)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 ml-auto">
                                        <div className="text-right">
                                            <div className="text-xs text-slate-400">Giá chỉ từ</div>
                                            <div className="text-lg font-black text-blue-600 font-mono">
                                                {trip.basePrice ? trip.basePrice.toLocaleString('vi-VN') : 0} đ
                                            </div>
                                            <div className="text-[11px] text-emerald-600 font-medium">
                                                Còn trống <strong>{availableSeatsCount}</strong> ghế
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleExpand(currentId!)}
                                            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                                                isExpanded
                                                    ? 'bg-slate-900 text-white shadow-md'
                                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20'
                                            }`}
                                        >
                                            <span>{isExpanded ? 'Đóng sơ đồ' : 'Chọn ghế'}</span>
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="p-5 bg-slate-950 border-t border-slate-800 animate-fadeIn">
                                        <SeatMap
                                            seats={trip.seats || []}
                                            selectedSeatNumber={null}
                                            onSelectSeat={(seat) => onSelectSeat(trip, seat)}
                                            busType={trip.busType}
                                            basePrice={trip.basePrice}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
