import React, { useState, useEffect } from 'react';
import {
  Bus,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronRight,
  Flame,
  Award,
  Coffee,
  Wifi,
  Navigation,
  CheckCircle2,
  Calendar,
  Timer
} from 'lucide-react';

export interface PopularRoute {
  id: string;
  origin: string;
  destination: string;
  originLabel: string;
  destinationLabel: string;
  distance: string;
  duration: string;
  priceFrom: number;
  busType: string;
  image: string;
  highlights: string[];
  filterRoute: 'HN_HP' | 'HP_HN';
  busTypeFilter: 'ALL' | '9_SEATS' | '12_SEATS';
  isHot?: boolean;
  frequency: string;
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'r1',
    origin: 'Hà Nội',
    destination: 'Hải Phòng',
    originLabel: 'Hà Nội (Mỹ Đình / Cầu Giấy / Hoàn Kiếm)',
    destinationLabel: 'Hải Phòng (Vĩnh Niệm / Cầu Rào / TTTP)',
    distance: '100 km',
    duration: '1h15 - 1h30',
    priceFrom: 230000,
    busType: 'Limousine VIP 9 Chỗ',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    highlights: ['Cao tốc 5B 120km/h', 'Đón trả tận nơi nội thành', 'Ghế massage toàn thân', 'Wifi & Nước suối free'],
    filterRoute: 'HN_HP',
    busTypeFilter: '9_SEATS',
    isHot: true,
    frequency: '30 phút / chuyến'
  },
  {
    id: 'r2',
    origin: 'Hải Phòng',
    destination: 'Hà Nội',
    originLabel: 'Hải Phòng (BX Vĩnh Niệm / Nhà Hát Lớn / Lê Hồng Phong)',
    destinationLabel: 'Hà Nội (Mỹ Đình / Giáp Bát / Sân bay Nội Bài)',
    distance: '100 km',
    duration: '1h15 - 1h30',
    priceFrom: 240000,
    busType: 'Limousine Luxury 12 Chỗ',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    highlights: ['Xe mới 2024 chạy êm', 'Có cổng sạc Type-C/USB', 'Đúng giờ không bắt khách dọc đường', 'Miễn phí bảo hiểm hành khách'],
    filterRoute: 'HP_HN',
    busTypeFilter: '12_SEATS',
    isHot: true,
    frequency: '30 phút / chuyến'
  },
  {
    id: 'r3',
    origin: 'Hà Nội',
    destination: 'Hải Phòng (Cát Bi / Cát Bà)',
    originLabel: 'Hà Nội (Trung tâm & Sân bay Nội Bài)',
    destinationLabel: 'Hải Phòng (Sân bay Cát Bi / Cảng Cát Bà)',
    distance: '115 km',
    duration: '1h30',
    priceFrom: 250000,
    busType: 'President VIP 9 Chỗ',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    highlights: ['Kết nối chuyến bay Cát Bi', 'Hỗ trợ hành lý cồng kềnh', 'Xe sang VIP đưa đón chuyên gia', 'Bảo lãnh giờ bay'],
    filterRoute: 'HN_HP',
    busTypeFilter: '9_SEATS',
    isHot: false,
    frequency: '45 phút / chuyến'
  },
  {
    id: 'r4',
    origin: 'Hải Phòng (Đồ Sơn / TTTP)',
    destination: 'Hà Nội (Nội Bài Direct)',
    originLabel: 'Hải Phòng (KDL Đồ Sơn / TT Hải Phòng)',
    destinationLabel: 'Hà Nội (Sảnh T1 - T2 Sân Bay Nội Bài)',
    distance: '125 km',
    duration: '1h45',
    priceFrom: 240000,
    busType: 'Limousine Luxury 12 Chỗ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    highlights: ['Trả tận sảnh bay Nội Bài', 'Cam kết kịp giờ check-in', 'Tài xế chuyên nghiệp lịch sự', 'Có hoá đơn VAT điện tử'],
    filterRoute: 'HP_HN',
    busTypeFilter: '12_SEATS',
    isHot: false,
    frequency: '60 phút / chuyến'
  }
];

interface DynamicHeroBannerProps {
  onSelectRouteFilter: (route: 'ALL' | 'HN_HP' | 'HP_HN') => void;
  onQuickBookClick: (route: 'HN_HP' | 'HP_HN', busTypeFilter: 'ALL' | '9_SEATS' | '12_SEATS') => void;
  currentRouteFilter: 'ALL' | 'HN_HP' | 'HP_HN';
}

export const DynamicHeroBanner: React.FC<DynamicHeroBannerProps> = ({
                                                                      onSelectRouteFilter,
                                                                      onQuickBookClick,
                                                                      currentRouteFilter
                                                                    }) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % POPULAR_ROUTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentRoute = POPULAR_ROUTES[activeSlide];

  return (
      <div className="space-y-6">
        {/* 1. Large Dynamic Hero Banner */}
        <div
            className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute inset-0 z-0">
            <img
                src={currentRoute.image}
                alt={currentRoute.origin + ' - ' + currentRoute.destination}
                className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[360px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600/90 text-white border border-blue-400/30 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                LIMOUSINE VIP 5 SAO
              </span>
                {currentRoute.isHot && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600/90 text-white border border-rose-400/30 flex items-center gap-1 shadow-lg animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-amber-200" />
                  TUYẾN HOT TRONG NGÀY
                </span>
                )}
              </div>

              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-2xl text-xs text-slate-300 font-medium">
                <Timer className="w-4 h-4 text-blue-400" />
                <span>Tần suất: <strong className="text-white">{currentRoute.frequency}</strong></span>
              </div>
            </div>

            <div className="my-6 space-y-4 max-w-2xl">
              <div className="flex items-center gap-3 text-sm font-bold text-blue-400">
                <span>{currentRoute.origin}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span>{currentRoute.destination}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-normal">{currentRoute.distance}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-normal flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {currentRoute.duration}
              </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Tuyến {currentRoute.origin} ➔ {currentRoute.destination}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 line-clamp-2 leading-relaxed">
                Trải nghiệm di chuyển êm ái trên cao tốc 5B hiện đại. Đón trả tận nơi, ghế massage cao cấp, wifi 5G tốc độ cao và giữ chỗ 3 phút trực tuyến.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {currentRoute.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-200 bg-white/5 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-white/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                ))}
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={() => {
                      onSelectRouteFilter(currentRoute.filterRoute);
                      onQuickBookClick(currentRoute.filterRoute, currentRoute.busTypeFilter);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-sm shadow-xl shadow-blue-600/40 flex items-center gap-2 transform active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  <span>Xem Ghế Trống & Đặt Vé Ngay</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs">
                  <span className="text-slate-400">Giá chỉ từ: </span>
                  <strong className="text-amber-400 font-mono text-base font-extrabold">
                    {currentRoute.priceFrom.toLocaleString('vi-VN')} đ
                  </strong>
                  <span className="text-slate-400"> / ghế</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
              <div className="flex items-center gap-2">
                {POPULAR_ROUTES.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            activeSlide === idx ? 'w-8 bg-blue-500 shadow-md shadow-blue-500/50' : 'w-2 bg-slate-700 hover:bg-slate-500'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
              </div>

              <div className="text-[11px] text-slate-400">
                Tự động đổi tuyến sau mỗi 6s • Rê chuột để giữ xem
              </div>
            </div>
          </div>
        </div>

        {/* 2. Grid 4 Thẻ Lộ Trình Trọng Điểm */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Lộ Trình Phổ Biến & Tuyến Trọng Điểm
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Cao Tốc 5B
            </span>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
            Chọn nhanh lộ trình để lọc danh sách chuyến và xem tình trạng ghế theo thời gian thực
          </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_ROUTES.map(item => {
              const isSelected = currentRouteFilter === item.filterRoute;

              return (
                  <div
                      key={item.id}
                      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden hover:shadow-lg flex flex-col justify-between ${
                          isSelected ? 'border-blue-600 ring-2 ring-blue-600/10 shadow-md' : 'border-slate-200'
                      }`}
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                      <img
                          src={item.image}
                          alt={item.origin + ' - ' + item.destination}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      {item.isHot && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs flex items-center gap-1">
                      <Flame className="w-3 h-3" /> HOT
                    </span>
                      )}

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-300" /> {item.duration}
                    </span>
                        <span className="font-semibold text-slate-300 text-[11px]">
                      {item.distance}
                    </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="space-y-1.5 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-blue-600 bg-white" />
                              <span className="text-xs font-bold text-slate-800 truncate">{item.origin}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="absolute left-0 bottom-1 w-3 h-3 rounded-full bg-blue-600" />
                              <span className="text-xs font-bold text-slate-900 truncate">{item.destination}</span>
                            </div>
                            <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          Từ {item.priceFrom.toLocaleString('vi-VN')} đ
                        </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                          <Bus className="w-3.5 h-3.5 text-blue-600" />
                          <span>{item.busType}</span>
                        </div>
                      </div>

                      <button
                          type="button"
                          onClick={() => {
                            onSelectRouteFilter(item.filterRoute);
                            onQuickBookClick(item.filterRoute, item.busTypeFilter);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Đặt vé tuyến này</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
  );
};