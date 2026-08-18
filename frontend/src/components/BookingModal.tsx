import React, { useState, useId } from 'react';
import { CustomerType, Seat } from '../types';
import { useBooking } from '../context/BookingContext';
import {
    MapPin,
    Clock,
    User,
    Phone,
    Mail,
    CreditCard,
    Wallet,
    Building2,
    X,
    ArrowRight,
    Sparkles
} from 'lucide-react';

interface BookingModalProps {
    trip: any;
    selectedSeat: Seat;
    isOpen: boolean;
    onClose: () => void;
    onConfirmBooking: (ticketData: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
                                                              trip,
                                                              selectedSeat,
                                                              isOpen,
                                                              onClose,
                                                              onConfirmBooking
                                                          }) => {
    const { holdSeat } = useBooking();

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerType, setCustomerType] = useState<CustomerType>('NORMAL');

    // Chặn an toàn bằng Optional Chaining
    const [pickupPoint, setPickupPoint] = useState(
        (trip?.pickupPoints && trip.pickupPoints.length > 0) ? trip.pickupPoints[0] : 'Bến xe Lạc Long'
    );
    const [dropoffPoint, setDropoffPoint] = useState(
        (trip?.dropoffPoints && trip.dropoffPoints.length > 0) ? trip.dropoffPoints[0] : 'Bến xe Nước Ngầm'
    );
    const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'E_WALLET' | 'CASH'>('BANK_TRANSFER');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

    const nameInputId = useId();
    const phoneInputId = useId();
    const emailInputId = useId();

    if (!isOpen || !selectedSeat) return null;

    const handleQuickFill = (name: string, phone: string, email: string, type: CustomerType) => {
        setCustomerName(name);
        setCustomerPhone(phone);
        setCustomerEmail(email);
        setCustomerType(type);
        setErrors({});
    };

    // Khớp chuẩn phụ phí VIP 50.000đ với Backend
    const basePrice = trip?.basePrice || 230000;
    const seatSurcharge = selectedSeat?.seatType === 'VIP' ? 50000 : 0;
    const rawPrice = basePrice + seatSurcharge;

    let discountPercent = 0;
    if (customerType === 'VIP') discountPercent = 20;
    else if (customerType === 'MEMBER') discountPercent = 10;

    const discountAmount = (rawPrice * discountPercent) / 100;
    const finalPrice = rawPrice - discountAmount;

    const validate = () => {
        const errs: { name?: string; phone?: string } = {};
        if (!customerName.trim()) {
            errs.name = 'Vui lòng nhập họ và tên hành khách';
        }
        if (!customerPhone.trim()) {
            errs.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(customerPhone.replace(/\s+/g, ''))) {
            errs.phone = 'Số điện thoại không đúng định dạng VN (VD: 0912345678)';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const tripId = trip?.id || trip?.tripId || 'CX001';

            const ticket = await holdSeat(tripId, selectedSeat.seatNumber, {
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                customerEmail: customerEmail.trim(),
                customerType,
                pickupPoint,
                dropoffPoint,
                paymentMethod
            });

            setLoading(false);
            onConfirmBooking(ticket);
        } catch (err: any) {
            setLoading(false);
            alert(err.message || 'Ghế này vừa có người khác chọn hoặc giữ chỗ!');
        }
    };

    const depName = trip?.departureLocation || trip?.departure || 'Hải Phòng';
    const desName = trip?.destinationLocation || trip?.destination || 'Hà Nội';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto">
                <div className="bg-blue-600 p-5 sm:p-6 text-white flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="bg-white/20 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                                Bước 1 / 2: Xác nhận thông tin vé
                            </span>
                            <span className="bg-emerald-400 text-slate-950 text-[11px] px-2.5 py-0.5 rounded-full font-extrabold">
                                Đặt vé nhanh 24/7
                            </span>
                        </div>
                        <h3 className="text-xl font-black mt-2 text-white">
                            Đặt vé: {depName.split('(')[0].trim()} ➔ {desName.split('(')[0].trim()}
                        </h3>
                        <p className="text-blue-100 text-xs mt-0.5">
                            Khởi hành: {trip?.departureTime} | Xe: {trip?.licensePlate || trip?.busPlate || '15B-678.90'} ({trip?.busType || 'Limousine Luxury 12 Chỗ'})
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(88vh-110px)] overflow-y-auto text-xs sm:text-sm">
                    <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 space-y-2.5">
                        <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>Điền nhanh mẫu khách hàng (OOP Test):</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <button
                                type="button"
                                onClick={() => handleQuickFill('Nguyễn Văn Hùng', '0912345678', 'hung.nguyen@gmail.com', 'VIP')}
                                className="px-3 py-1.5 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-amber-950 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                                <span>⭐ Nguyễn Văn Hùng (VIP - Giảm 20%)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill('Trần Thị Mai', '0987654321', 'mai.tran@gmail.com', 'MEMBER')}
                                className="px-3 py-1.5 bg-blue-100/80 hover:bg-blue-200 border border-blue-300 text-blue-950 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                                <span>💎 Trần Thị Mai (Thành viên - Giảm 10%)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill('Lê Hoàng Nam', '0905123456', 'nam.le@gmail.com', 'NORMAL')}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                                <span>👤 Lê Hoàng Nam (Khách thường - 0%)</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor={nameInputId} className="block text-xs font-bold text-slate-700 mb-1">
                                Họ và tên hành khách <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id={nameInputId}
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={customerName}
                                    onChange={e => {
                                        setCustomerName(e.target.value);
                                        if (errors.name) setErrors({ ...errors, name: undefined });
                                    }}
                                    className={`w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm font-semibold ${
                                        errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                    }`}
                                />
                            </div>
                            {errors.name && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor={phoneInputId} className="block text-xs font-bold text-slate-700 mb-1">
                                Số điện thoại (Nhận vé SMS / Zalo) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id={phoneInputId}
                                    type="tel"
                                    placeholder="0912345678"
                                    value={customerPhone}
                                    onChange={e => {
                                        setCustomerPhone(e.target.value);
                                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                                    }}
                                    className={`w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm font-semibold ${
                                        errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                    }`}
                                />
                            </div>
                            {errors.phone && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor={emailInputId} className="block text-xs font-bold text-slate-700 mb-1">
                                Email nhận vé điện tử
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id={emailInputId}
                                    type="email"
                                    placeholder="example@gmail.com"
                                    value={customerEmail}
                                    onChange={e => setCustomerEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Hạng khách hàng (Chính sách ưu đãi OOP)
                            </label>
                            <select
                                value={customerType}
                                onChange={e => setCustomerType(e.target.value as CustomerType)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm font-semibold"
                            >
                                <option value="NORMAL">Khách thường (Giá gốc)</option>
                                <option value="MEMBER">Khách Thành viên (Giảm 10%)</option>
                                <option value="VIP">Khách VIP (Giảm 20%)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                Điểm đón ({depName.split('(')[0].trim()})
                            </label>
                            <select
                                value={pickupPoint}
                                onChange={e => setPickupPoint(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-semibold"
                            >
                                {(trip?.pickupPoints && trip.pickupPoints.length > 0 ? trip.pickupPoints : ['Bến xe Lạc Long', 'Nhà hát Lớn Hải Phòng', 'Cầu Bính']).map((p: string) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                Điểm trả ({desName.split('(')[0].trim()})
                            </label>
                            <select
                                value={dropoffPoint}
                                onChange={e => setDropoffPoint(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-semibold"
                            >
                                {(trip?.dropoffPoints && trip.dropoffPoints.length > 0 ? trip.dropoffPoints : ['Bến xe Nước Ngầm', 'Bến xe Mỹ Đình', 'Hoàn Kiếm']).map((d: string) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">
                            Hình thức thanh toán dự kiến
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                                    paymentMethod === 'BANK_TRANSFER'
                                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm ring-1 ring-blue-600'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <Building2 className="w-5 h-5 text-blue-600" />
                                <span>Chuyển khoản QR</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('E_WALLET')}
                                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                                    paymentMethod === 'E_WALLET'
                                        ? 'bg-pink-50 border-pink-600 text-pink-700 shadow-sm ring-1 ring-pink-600'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <Wallet className="w-5 h-5 text-pink-600" />
                                <span>Ví MoMo / VNPay</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('CASH')}
                                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                                    paymentMethod === 'CASH'
                                        ? 'bg-emerald-50 border-emerald-600 text-emerald-700 shadow-sm ring-1 ring-emerald-600'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                                <span>Tiền mặt</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                        <div className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1">
                            CHI TIẾT GIÁ VÉ TÍNH THEO BUSINESS RULES
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>Giá vé cơ bản tuyến:</span>
                            <span className="font-mono">{basePrice.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>Ghế {selectedSeat.seatNumber} ({selectedSeat.seatType === 'VIP' ? 'Ghế VIP' : 'Ghế Thường'}):</span>
                            <span className="font-mono">{seatSurcharge > 0 ? `+${seatSurcharge.toLocaleString('vi-VN')} đ` : '+0 đ'}</span>
                        </div>
                        {discountPercent > 0 && (
                            <div className="flex justify-between text-xs font-bold text-emerald-600">
                                <span>Ưu đãi {customerType} (-{discountPercent}%):</span>
                                <span className="font-mono">-{discountAmount.toLocaleString('vi-VN')} đ</span>
                            </div>
                        )}
                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-black text-sm sm:text-base text-slate-900">
                            <span>Tổng tiền thanh toán:</span>
                            <span className="text-blue-600 text-xl font-mono">{finalPrice.toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>

                    <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl text-[11px] text-blue-950 flex items-start gap-2">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <strong>Quy định đặt vé:</strong> Sau khi bấm <strong>Xác nhận đặt vé</strong>, hệ thống sẽ tự động tạo mã vé điện tử và tạm khóa ghế <strong>{selectedSeat.seatNumber}</strong> trong 3 phút để bạn tiến hành thanh toán xuất vé.
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                        >
                            Quay lại chọn ghế
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <span>Đang xử lý giữ chỗ...</span>
                            ) : (
                                <>
                                    <span>Xác nhận đặt vé</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};