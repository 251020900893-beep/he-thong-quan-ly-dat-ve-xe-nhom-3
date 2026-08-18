import React, { useState, useEffect } from 'react';
import { Trip, Seat, Customer } from '../types';
import {
    X, Sparkles, Star, Gem, User, Phone, Mail,
    MapPin, QrCode, Wallet, Banknote, Clock, ArrowRight
} from 'lucide-react';

interface ExtendedTrip extends Trip {
    tripCode?: string;
    licensePlate?: string;
    driverName?: string;
    direction?: 'HN_HP' | 'HP_HN';
}

interface BookingModalProps {
    trip: ExtendedTrip;
    seat: Seat;
    onClose: () => void;
    onConfirmHold: (bookingData: {
        customer: Customer;
        email: string;
        pickupPoint: string;
        dropoffPoint: string;
        paymentMethod: string;
        finalPrice: number;
    }) => void;
}

// Danh sách các điểm đón/trả chuẩn theo từng thành phố
const HANOI_LOCATIONS = [
    'Bến xe Mỹ Đình',
    'Bến xe Nước Ngầm',
    'Sân bay Nội Bài',
    'Văn phòng 28 Trần Hưng Đạo',
    'Khu đô thị Times City',
];

const HAIPHONG_LOCATIONS = [
    'Bến xe Vĩnh Niệm',
    'Bến xe Cầu Rào',
    'Nhà hát lớn Hải Phòng',
    'Ngã 4 Quán Mau (Lê Hồng Phong)',
    'Cảng Đình Vũ / Cát Hải',
];

export const BookingModal: React.FC<BookingModalProps> = ({
                                                              trip,
                                                              seat,
                                                              onClose,
                                                              onConfirmHold,
                                                          }) => {
    // Xác định chiều đi dựa trên thuộc tính direction hoặc chuỗi route
    const isFromHaiPhong = trip.direction === 'HP_HN' || trip.route.includes('Hải Phòng ➔ Hà Nội') || trip.route.includes('Hải Phòng -> Hà Nội');

    // Danh sách điểm đón và trả tự động đảo ngược theo chiều đi
    const pickupList = isFromHaiPhong ? HAIPHONG_LOCATIONS : HANOI_LOCATIONS;
    const dropoffList = isFromHaiPhong ? HANOI_LOCATIONS : HAIPHONG_LOCATIONS;

    const pickupCity = isFromHaiPhong ? 'Hải Phòng' : 'Hà Nội';
    const dropoffCity = isFromHaiPhong ? 'Hà Nội' : 'Hải Phòng';

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [customerType, setCustomerType] = useState<'NORMAL' | 'MEMBER' | 'VIP'>('NORMAL');

    // Điểm đón và trả mặc định phù hợp với chiều đi
    const [pickupPoint, setPickupPoint] = useState(pickupList[0]);
    const [dropoffPoint, setDropoffPoint] = useState(dropoffList[0]);
    const [paymentMethod, setPaymentMethod] = useState<'BANKING' | 'MOMO' | 'CASH'>('BANKING');

    useEffect(() => {
        setPickupPoint(pickupList[0]);
        setDropoffPoint(dropoffList[0]);
    }, [trip.tripId, isFromHaiPhong]);

    // Điền nhanh mẫu test OOP
    const fillSampleCustomer = (type: 'VIP' | 'MEMBER' | 'NORMAL') => {
        if (type === 'VIP') {
            setName('Nguyễn Văn Hùng');
            setPhone('0912888999');
            setEmail('hung.nguyen.vip@gmail.com');
            setCustomerType('VIP');
        } else if (type === 'MEMBER') {
            setName('Trần Thị Mai');
            setPhone('0987654321');
            setEmail('mai.tran@gmail.com');
            setCustomerType('MEMBER');
        } else {
            setName('Lê Hoàng Nam');
            setPhone('0903112233');
            setEmail('nam.le@gmail.com');
            setCustomerType('NORMAL');
        }
    };

    // Tính giá theo Business Rules (Strategy Pattern)
    const basePrice = trip.basePrice;
    const seatSurcharge = seat.surcharge || 0;
    const grossPrice = basePrice + seatSurcharge;

    let discountPercent = 0;
    let policyName = 'Khách thường (0%)';
    if (customerType === 'VIP') {
        discountPercent = 0.20;
        policyName = 'VIP Member (-20%)';
    } else if (customerType === 'MEMBER') {
        discountPercent = 0.10;
        policyName = 'Thành viên (-10%)';
    }

    const discountAmount = grossPrice * discountPercent;
    const finalPrice = grossPrice - discountAmount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            alert('Vui lòng điền họ tên và số điện thoại!');
            return;
        }

        onConfirmHold({
            customer: { name, phone, customerType },
            email,
            pickupPoint,
            dropoffPoint,
            paymentMethod,
            finalPrice,
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">

                {/* Header xanh tím */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 sm:p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500/30 border border-blue-400/40 text-blue-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Bước 1 / 2: Xác nhận đặt chỗ
            </span>
                        <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3" /> Giữ chỗ 3 phút
            </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                        Đặt vé: {trip.route}
                    </h2>
                    <p className="text-xs text-blue-100 mt-1">
                        Khởi hành: <strong className="text-white">{trip.departureTime}</strong> | Xe: <strong className="text-white">{trip.licensePlate || '29B-688.88'}</strong> ({trip.busType})
                    </p>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">

                    {/* Quick Fill Sample Data */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                        <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Điền nhanh mẫu khách hàng (OOP Test):
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => fillSampleCustomer('VIP')}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition flex items-center gap-1.5 shadow-2xs"
                            >
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Nguyễn Văn Hùng (VIP - Giảm 20%)
                            </button>
                            <button
                                type="button"
                                onClick={() => fillSampleCustomer('MEMBER')}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100 transition flex items-center gap-1.5 shadow-2xs"
                            >
                                <Gem className="w-3.5 h-3.5 text-blue-600" /> Trần Thị Mai (Thành viên - Giảm 10%)
                            </button>
                            <button
                                type="button"
                                onClick={() => fillSampleCustomer('NORMAL')}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 transition flex items-center gap-1.5 shadow-2xs"
                            >
                                <User className="w-3.5 h-3.5 text-slate-600" /> Lê Hoàng Nam (Khách thường - 0%)
                            </button>
                        </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Họ và tên hành khách <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Nguyễn Văn A"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Số điện thoại (Nhận vé SMS / Zalo) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="tel"
                                    required
                                    placeholder="0912345678"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Email nhận vé điện tử
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Hạng khách hàng (Chính sách ưu đãi OOP)
                            </label>
                            <select
                                value={customerType}
                                onChange={e => setCustomerType(e.target.value as any)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                            >
                                <option value="NORMAL">Khách thường (Giá gốc)</option>
                                <option value="MEMBER">Khách thành viên (Giảm 10%)</option>
                                <option value="VIP">Khách VIP (Giảm 20%)</option>
                            </select>
                        </div>

                        {/* ĐIỂM ĐÓN (TỰ ĐỘNG ĐẢO THEO CHIỀU ĐI) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Điểm đón tại {pickupCity}
                            </label>
                            <select
                                value={pickupPoint}
                                onChange={e => setPickupPoint(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                            >
                                {pickupList.map((loc, idx) => (
                                    <option key={idx} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ĐIỂM TRẢ (TỰ ĐỘNG ĐẢO THEO CHIỀU ĐI) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Điểm trả tại {dropoffCity}
                            </label>
                            <select
                                value={dropoffPoint}
                                onChange={e => setDropoffPoint(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                            >
                                {dropoffList.map((loc, idx) => (
                                    <option key={idx} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">
                            Hình thức thanh toán dự kiến
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('BANKING')}
                                className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1.5 transition ${
                                    paymentMethod === 'BANKING'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                            >
                                <QrCode className="w-5 h-5 text-blue-600" />
                                <span>Chuyển khoản QR</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('MOMO')}
                                className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1.5 transition ${
                                    paymentMethod === 'MOMO'
                                        ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                            >
                                <Wallet className="w-5 h-5 text-pink-600" />
                                <span>Ví MoMo / VNPay</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('CASH')}
                                className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1.5 transition ${
                                    paymentMethod === 'CASH'
                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                            >
                                <Banknote className="w-5 h-5 text-emerald-600" />
                                <span>Tiền mặt</span>
                            </button>
                        </div>
                    </div>

                    {/* Chi tiết giá vé tính theo Business Rules */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                        <div className="font-extrabold uppercase tracking-wider text-slate-600 pb-1 border-b border-slate-200">
                            Chi Tiết Giá Vé Tính Theo Business Rules
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Giá vé cơ bản tuyến {trip.route}:</span>
                            <span className="font-semibold text-slate-800">{basePrice.toLocaleString('vi-VN')} đ</span>
                        </div>
                        {seatSurcharge > 0 && (
                            <div className="flex justify-between text-amber-700 font-medium">
                                <span>Ghế {seat.seatNumber} (Ghế VIP):</span>
                                <span>+{seatSurcharge.toLocaleString('vi-VN')} đ</span>
                            </div>
                        )}
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-emerald-700 font-bold">
                                <span>Ưu đãi {policyName}:</span>
                                <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-sm font-black">
                            <span className="text-slate-900 text-base">Tổng tiền thanh toán:</span>
                            <span className="text-blue-600 text-xl">{finalPrice.toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>

                    {/* Cảnh báo giữ chỗ 3 phút */}
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong>Quy định giữ chỗ 3 phút:</strong> Khi bạn bấm xác nhận, hệ thống sẽ khoá giữ ghế <strong>{seat.seatNumber}</strong> trong đúng <strong>3 phút</strong> để bạn thanh toán. Sau 3 phút nếu chưa thanh toán, hệ thống tự động huỷ vé và mở lại ghế cho hành khách khác.
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition"
                        >
                            Quay lại chọn ghế
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                        >
                            <span>Xác nhận Giữ Chỗ (3 phút)</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};