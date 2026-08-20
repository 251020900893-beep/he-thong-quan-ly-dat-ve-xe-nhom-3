import { useState, useEffect } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { DynamicHeroBanner } from './components/DynamicHeroBanner';
import { TopHoldingBanner } from './components/TopHoldingBanner';
import { TripList } from './components/TripList';
import { BookingModal } from './components/BookingModal';
import { PaymentModal } from './components/PaymentModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { LoginModal } from './components/LoginModal';
import { OOPDocModal } from './components/OOPDocModal';
import { TicketLookupView } from './pages/TicketLookupView';
import { StaffDashboard } from './pages/StaffDashboard';
import { BusTrip, Seat, Ticket } from './types';
import { tripApi } from './api/tripApi';
import { Bus, Search, Users, Layers, FileText, ShieldCheck } from 'lucide-react';

function MainApp() {
    const [activeTab, setActiveTab] = useState<'BOOKING' | 'LOOKUP' | 'STAFF'>('BOOKING');
    const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
    const [allTickets, setAllTickets] = useState<Ticket[]>([]);

    // State mở Modal Tài Liệu Kiến Trúc OOP
    const [showOOPModal, setShowOOPModal] = useState<boolean>(false);

    // State bộ lọc và chuyến xe đang mở sơ đồ ghế
    const [routeFilter, setRouteFilter] = useState<'ALL' | 'HN_HP' | 'HP_HN'>('ALL');
    const [busTypeFilter, setBusTypeFilter] = useState<'ALL' | '9_SEATS' | '12_SEATS'>('ALL');
    const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

    // State Phân quyền: Quản trị viên
    const [isStaffLoggedIn, setIsStaffLoggedIn] = useState<boolean>(false);
    const [staffAdminName, setStaffAdminName] = useState<string>('Nguyễn Quản Trị (Điều hành xe)');
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

    const { trips, activeHoldingTicket, refreshTrips } = useBooking();

    // Tải danh sách vé từ Backend
    const loadTickets = async () => {
        try {
            const data = await tripApi.lookupTickets('');
            setAllTickets(Array.isArray(data) ? data : []);
        } catch {
            setAllTickets([]);
        }
    };

    useEffect(() => {
        loadTickets();
    }, [showPaymentModal, activeTab]);

    const handleSeatSelect = (trip: BusTrip, seat: Seat) => {
        setSelectedTrip(trip);
        setSelectedSeat(seat);
    };

    const handleStaffTabClick = () => {
        if (!isStaffLoggedIn) {
            setShowLoginModal(true);
        } else {
            setActiveTab('STAFF');
        }
    };

    const handleQuickBook = (
        targetRoute: 'ALL' | 'HN_HP' | 'HP_HN',
        targetBusType: 'ALL' | '9_SEATS' | '12_SEATS'
    ) => {
        setRouteFilter(targetRoute);
        setBusTypeFilter(targetBusType);
        setExpandedTripId('AUTO_FIRST');

        setTimeout(() => {
            const tripSection = document.getElementById('trip-list-section');
            if (tripSection) {
                tripSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleViewSchedule = (
        targetRoute: 'ALL' | 'HN_HP' | 'HP_HN',
        targetBusType: 'ALL' | '9_SEATS' | '12_SEATS' = 'ALL'
    ) => {
        setRouteFilter(targetRoute);
        setBusTypeFilter(targetBusType);
        setExpandedTripId(null);

        setTimeout(() => {
            const tripSection = document.getElementById('trip-list-section');
            if (tripSection) {
                tripSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* 1. Banner Giữ Vé 3 Phút */}
            <TopHoldingBanner onOpenPayment={() => setShowPaymentModal(true)} />

            {/* 2. HEADER ĐIỀU HƯỚNG */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('BOOKING')}>
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
                            <Bus className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-black text-lg text-slate-900 tracking-tight block leading-none">VIP LIMOUSINE</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hà Nội ⇄ Hải Phòng</span>
                        </div>
                    </div>

                    <nav className="flex items-center gap-2 text-xs font-bold">
                        <button
                            onClick={() => setActiveTab('BOOKING')}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                                activeTab === 'BOOKING'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <Bus className="w-4 h-4" />
                            <span>Đặt vé chuyến</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('LOOKUP')}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                                activeTab === 'LOOKUP'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <Search className="w-4 h-4" />
                            <span>Tra cứu vé</span>
                        </button>

                        <button
                            onClick={handleStaffTabClick}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                                activeTab === 'STAFF'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Nhân viên / Báo cáo</span>
                        </button>

                        <button
                            onClick={() => setShowOOPModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white transition-all shadow-md active:scale-95 cursor-pointer ml-1"
                        >
                            <Layers className="w-4 h-4 text-amber-400" />
                            <span>Kiến trúc OOP 3 Tầng</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* 3. NỘI DUNG CHÍNH */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
                {activeTab === 'BOOKING' && (
                    <div className="space-y-6">
                        <DynamicHeroBanner
                            onSelectRouteFilter={(r) => handleViewSchedule(r, 'ALL')}
                            onQuickBookClick={handleQuickBook}
                            onViewScheduleClick={handleViewSchedule}
                            currentRouteFilter={routeFilter}
                        />

                        <TripList
                            onSelectSeat={handleSeatSelect}
                            routeFilter={routeFilter}
                            onRouteFilterChange={setRouteFilter}
                            busTypeFilter={busTypeFilter}
                            onBusTypeFilterChange={setBusTypeFilter}
                            expandedTripId={expandedTripId}
                            onExpandTrip={setExpandedTripId}
                        />
                    </div>
                )}
                {activeTab === 'LOOKUP' && (
                    <TicketLookupView tickets={allTickets} onSelectTicket={setViewingTicket} />
                )}
                {activeTab === 'STAFF' && isStaffLoggedIn && (
                    <StaffDashboard
                        tickets={allTickets}
                        totalSeats={trips.reduce((sum, trip) => sum + trip.totalSeats, 0)}
                        onViewTicketDetail={setViewingTicket}
                        onDataRestored={async () => {
                            await Promise.all([loadTickets(), refreshTrips()]);
                        }}
                        onLogout={() => {
                            setIsStaffLoggedIn(false);
                            setActiveTab('BOOKING');
                        }}
                        currentAdminName={staffAdminName}
                    />
                )}
            </main>

            {/* 4. FOOTER */}
            <footer className="bg-white border-t border-slate-200 mt-12 py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                        <div className="font-black text-slate-900 text-sm">
                            Hệ Thống Đặt Vé Xe Khách Hà Nội - Hải Phòng
                        </div>
                        <div className="text-slate-500">
                            Tuân thủ thiết kế 3 Tầng & 4 Trụ cột Hướng Đối Tượng (OOP) với cơ chế Giữ chỗ 3 phút tự động.
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setShowOOPModal(true)}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
                        >
                            <FileText className="w-4 h-4" />
                            <span>Tài liệu Kiến trúc OOP</span>
                        </button>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Hệ thống hoạt động 24/7</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* MODALS */}
            {selectedTrip && selectedSeat && (
                <BookingModal
                    trip={selectedTrip}
                    selectedSeat={selectedSeat}
                    isOpen={true}
                    onClose={() => {
                        setSelectedTrip(null);
                        setSelectedSeat(null);
                    }}
                    onConfirmBooking={async () => {
                        setSelectedTrip(null);
                        setSelectedSeat(null);
                        setShowPaymentModal(true);
                        await refreshTrips();
                    }}
                />
            )}

            {showPaymentModal && activeHoldingTicket && (
                <PaymentModal
                    ticket={activeHoldingTicket}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccessPayment={async (paidTicket) => {
                        setShowPaymentModal(false);
                        setViewingTicket(paidTicket);
                        await refreshTrips();
                        await loadTickets();
                    }}
                />
            )}

            {viewingTicket && (
                <TicketDetailModal ticket={viewingTicket} onClose={() => setViewingTicket(null)} />
            )}

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={(adminName) => {
                        setIsStaffLoggedIn(true);
                        setStaffAdminName(adminName);
                        setShowLoginModal(false);
                        setActiveTab('STAFF');
                    }}
                />
            )}

            {showOOPModal && (
                <OOPDocModal onClose={() => setShowOOPModal(false)} />
            )}
        </div>
    );
}

export default function App() {
    return (
        <BookingProvider>
            <MainApp />
        </BookingProvider>
    );
}
