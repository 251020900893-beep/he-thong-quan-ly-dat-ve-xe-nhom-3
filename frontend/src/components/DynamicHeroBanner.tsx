import React, { useState, useEffect } from 'react';
import {
  Flame, Clock, ArrowRight, ShieldCheck,
  Wifi, Zap, ChevronLeft, ChevronRight,
  CheckCircle2, Radio, Award,
  Bus
} from 'lucide-react';

export interface PopularRoute {
  id: string;
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  priceFrom: number;
  busType: string;
  image: string;
  filterRoute: 'HN_HP' | 'HP_HN';
  busTypeFilter: 'ALL' | '9_SEATS' | '12_SEATS';
  isHot?: boolean;
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'r1',
    origin: 'Hà Nội',
    destination: 'Hải Phòng',
    distance: '100 km',
    duration: '1h15 - 1h30',
    priceFrom: 230000,
    busType: 'Limousine DCar VIP 9 Chỗ',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    filterRoute: 'HN_HP',
    busTypeFilter: '9_SEATS',
    isHot: true
  },
  {
    id: 'r2',
    origin: 'Hải Phòng',
    destination: 'Hà Nội',
    distance: '100 km',
    duration: '1h15 - 1h30',
    priceFrom: 240000,
    busType: 'Limousine Luxury 12 Chỗ',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    filterRoute: 'HP_HN',
    busTypeFilter: '12_SEATS',
    isHot: true
  },
  {
    id: 'r3',
    origin: 'Hà Nội',
    destination: 'Hải Phòng (Cát Bi / Cát Bà)',
    distance: '115 km',
    duration: '1h30',
    priceFrom: 250000,
    busType: 'President VIP 9 Chỗ',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    filterRoute: 'HN_HP',
    busTypeFilter: '9_SEATS',
    isHot: false
  },
  {
    id: 'r4',
    origin: 'Hải Phòng (Đồ Sơn / TTTP)',
    destination: 'Hà Nội (Nội Bài Direct)',
    distance: '125 km',
    duration: '1h45',
    priceFrom: 230000,
    busType: 'Limousine VIP 9 Chỗ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    filterRoute: 'HP_HN',
    busTypeFilter: '9_SEATS',
    isHot: false
  }
];

interface DynamicHeroBannerProps {
  onSelectRouteFilter?: (route: 'ALL' | 'HN_HP' | 'HP_HN') => void;
  onQuickBookClick?: (route: 'ALL' | 'HN_HP' | 'HP_HN', busType: 'ALL' | '9_SEATS' | '12_SEATS') => void;
  onViewScheduleClick?: (route: 'ALL' | 'HN_HP' | 'HP_HN', busType: 'ALL' | '9_SEATS' | '12_SEATS') => void;
  currentRouteFilter?: string;
}

export const DynamicHeroBanner: React.FC<DynamicHeroBannerProps> = ({
                                                                      onSelectRouteFilter,
                                                                      onQuickBookClick,
                                                                      onViewScheduleClick
                                                                    }) => {
  const tickerMessages = [
    { icon: '🔥', text: 'Hơn 1.250 vé đã được đặt thành công trong hôm nay' },
    { icon: '⚡', text: 'Giữ chỗ 3 phút tự động không lo trùng ghế - Bảo mật 100%' },
    { icon: '✨', text: 'Dòng xe Limousine DCar trang bị cổng sạc điện thoại & Ghế Massage chuẩn Hàng không' },
    { icon: '👑', text: 'Ưu đãi giảm 20% giá vé dành riêng cho khách hàng VIP & Thành viên' }
  ];

  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerMessages.length);
    }, 4000);
    return () => clearInterval(tickerTimer);
  }, [tickerMessages.length]);

  const slides: Array<{
    badge: string;
    badgeBg: string;
    routeTag: string;
    departure: string;
    destination: string;
    direction: string;
    time: string;
    distance: string;
    vehicle: string;
    price: string;
    frequency: string;
    tags: string[];
    filterKey: 'HN_HP' | 'HP_HN';
    busTypeFilter: 'ALL' | '9_SEATS' | '12_SEATS';
  }> = [
    {
      badge: 'TUYẾN HOT NHẤT',
      badgeBg: 'bg-rose-600 text-white',
      routeTag: 'TRẢI NGHIỆM HÀNH TRÌNH SANG TRỌNG',
      departure: 'Hà Nội',
      destination: 'Hải Phòng',
      direction: '→',
      time: '1h15 - 1h30',
      distance: '100 km',
      vehicle: 'Limousine VIP 9 Chỗ',
      price: '230.000 đ',
      frequency: 'Tần suất: 30 phút / chuyến',
      tags: [
        'Cao tốc 5B 120km/h',
        'Đón trả tận nơi nội thành',
        'Ghế massage toàn thân',
        'Wifi & Nước suối free'
      ],
      filterKey: 'HN_HP',
      busTypeFilter: '9_SEATS'
    },
    {
      badge: 'CHIỀU VỀ TIỆN LỢI',
      badgeBg: 'bg-blue-600 text-white',
      routeTag: 'XE CHẠY CAO TỐC LIÊN TỤC',
      departure: 'Hải Phòng',
      destination: 'Hà Nội',
      direction: '→',
      time: '1h15 - 1h30',
      distance: '100 km',
      vehicle: 'Limousine Luxury 12 Chỗ',
      price: '240.000 đ',
      frequency: 'Tần suất: 30 phút / chuyến',
      tags: [
        'Về BX Mỹ Đình / Giáp Bát',
        'Đón tận nơi tại Hải Phòng',
        'Không bắt khách dọc đường',
        'Cổng sạc Type-C từng ghế'
      ],
      filterKey: 'HP_HN',
      busTypeFilter: '12_SEATS'
    },
    {
      badge: 'ƯU ĐÃI THÀNH VIÊN',
      badgeBg: 'bg-amber-500 text-slate-950 font-black',
      routeTag: 'CHÍNH SÁCH ĐA HÌNH OOP (POLYMORPHISM)',
      departure: 'Hà Nội',
      destination: 'Hải Phòng',
      direction: '⇄',
      time: 'Nhanh chóng',
      distance: '100 km',
      vehicle: 'DCar VIP 9-12 Chỗ',
      price: '184.000 đ',
      frequency: 'Giảm 20% khách VIP',
      tags: [
        'VIP giảm 20% giá vé',
        'Thành viên giảm 10% giá vé',
        'Giữ chỗ tự động 3 phút',
        'Xuất vé QR Code tức thì'
      ],
      filterKey: 'HN_HP',
      busTypeFilter: 'ALL'
    },
    {
      badge: 'CHUYÊN CƠ MẶT ĐẤT',
      badgeBg: 'bg-purple-600 text-white',
      routeTag: 'DỊCH VỤ ĐẲNG CẤP 5 SAO',
      departure: 'Hải Phòng',
      destination: 'Hà Nội',
      direction: '→',
      time: 'Êm ái',
      distance: '100 km',
      vehicle: 'Limousine President 9 Chỗ',
      price: '230.000 đ',
      frequency: 'Đưa đón tận sân bay Cát Bi',
      tags: [
        'Bảo hiểm hành khách 100%',
        'Khăn lạnh & nước suối cao cấp',
        'Tài xế chuyên nghiệp, lịch sự',
        'Thanh toán VietQR tiện lợi'
      ],
      filterKey: 'HP_HN',
      busTypeFilter: '9_SEATS'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  const handleQuickBook = () => {
    if (onQuickBookClick) {
      onQuickBookClick(current.filterKey, current.busTypeFilter);
    }
  };

  const handleViewSchedule = () => {
    if (onViewScheduleClick) {
      // Truyền cả tuyến đường và dòng xe của slide hiện tại
      onViewScheduleClick(current.filterKey, current.busTypeFilter);
    } else if (onSelectRouteFilter) {
      onSelectRouteFilter(current.filterKey);
    }
  };

  return (
      <div className="space-y-8 font-sans">
        {/* 1. HERO BANNER */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-950 via-[#0a1128] to-[#040817] text-white border border-slate-800/80">

          {/* TICKER THÔNG BÁO */}
          <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
            <div className="flex items-center gap-2.5 font-medium overflow-hidden">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-sm shadow-amber-400/50"></span>
              </span>
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>

              <div className="text-slate-200 flex items-center gap-1.5 transition-all duration-500 font-medium">
                <span className="text-sm">{tickerMessages[tickerIndex].icon}</span>
                <span className="truncate">{tickerMessages[tickerIndex].text}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400 shrink-0">
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3.5 h-3.5" /> Wifi 5G Tốc Độ Cao
            </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400">
              <Zap className="w-3.5 h-3.5" /> Sạc Nhanh Type-C
            </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-blue-400">
              <Award className="w-3.5 h-3.5" /> Chuẩn Limousine VIP
            </span>
            </div>
          </div>

          {/* NỘI DUNG BANNER */}
          <div className="relative p-6 sm:p-10 z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md ${current.badgeBg}`}>
              <Flame className="w-3.5 h-3.5 fill-current" />
              {current.badge}
            </span>
              <span className="bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Giữ chỗ tự động 3 phút
            </span>
              <span className="bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium px-3 py-1 rounded-full">
              {current.frequency}
            </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-black tracking-widest uppercase text-blue-400 flex items-center gap-2">
                <span>{current.routeTag}</span>
                <div className="h-[2px] w-8 bg-blue-500 rounded-full"></div>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                <span>{current.departure}</span>
                <span className="text-amber-400 font-bold">{current.direction}</span>
                <span>{current.destination}</span>
              </h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-xs">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> Thời gian
                </div>
                <div className="text-sm sm:text-base font-black text-white mt-1">
                  {current.time}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-xs">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Khoảng cách
                </div>
                <div className="text-sm sm:text-base font-black text-white mt-1">
                  {current.distance}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-xs">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Phương tiện
                </div>
                <div className="text-sm sm:text-base font-black text-white mt-1">
                  {current.vehicle}
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-950/50 to-amber-900/30 border border-amber-500/50 rounded-2xl p-3.5 backdrop-blur-xs">
                <div className="text-[11px] text-amber-300 font-medium">
                  🏷️ Giá chỉ từ
                </div>
                <div className="text-base sm:text-lg font-black text-amber-400 mt-0.5 font-mono">
                  {current.price}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {current.tags.map((tag, idx) => (
                  <span
                      key={idx}
                      className="bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium"
                  >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {tag}
              </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                  type="button"
                  onClick={handleQuickBook}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Xem Ghế Trống & Đặt Vé Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                  type="button"
                  onClick={handleViewSchedule}
                  className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Xem tất cả giờ chạy tuyến này</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="px-6 sm:px-10 py-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                  <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx
                              ? 'w-8 bg-amber-400'
                              : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                  />
              ))}
              <span className="text-xs text-slate-400 font-mono ml-2">
              {currentSlide + 1} / {slides.length}
            </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                  title="Tuyến trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                  title="Tuyến tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. LỘ TRÌNH PHỔ BIẾN */}
        <div className="space-y-4 pt-2">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Lộ Trình Phổ Biến & Tuyến Trọng Điểm
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
              Cao Tốc 5B
            </span>
            </div>
            <p className="text-xs text-slate-500">
              Chọn nhanh lộ trình để lọc danh sách chuyến và xem tình trạng ghế theo thời gian thực
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_ROUTES.map((route) => (
                <div
                    key={route.id}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                        src={route.image}
                        alt={route.origin + ' đi ' + route.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {route.isHot && (
                        <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <Flame className="w-3 h-3 fill-current" /> HOT
                        </div>
                    )}

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {route.duration}
                  </span>
                      <span>{route.distance}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <div className="w-2 h-2 rounded-full border-2 border-blue-600" />
                          <span>{route.origin}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-black text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            <span>{route.destination}</span>
                          </div>
                          <span className="text-blue-700 font-mono text-[11px] bg-blue-50 px-2 py-0.5 rounded">
                        Từ {route.priceFrom.toLocaleString('vi-VN')} đ
                      </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <Bus className="w-3.5 h-3.5 text-blue-600" />
                        <span>{route.busType}</span>
                      </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                          if (onQuickBookClick) {
                            onQuickBookClick(route.filterRoute, route.busTypeFilter);
                          }
                        }}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Đặt vé tuyến này</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};
