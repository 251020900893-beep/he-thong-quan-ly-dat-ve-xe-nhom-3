import React, { useState } from 'react';
import { X, User, ShieldCheck, Lock, Phone, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginModalProps {
    initialRole?: 'CUSTOMER' | 'STAFF';
    onClose: () => void;
    onLoginSuccess: (user: { role: 'CUSTOMER' | 'STAFF'; name: string; phone?: string; customerType?: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
                                                          initialRole = 'CUSTOMER',
                                                          onClose,
                                                          onLoginSuccess,
                                                      }) => {
    const [role, setRole] = useState<'CUSTOMER' | 'STAFF'>(initialRole);

    // Form Khách hàng
    const [custPhone, setCustPhone] = useState('');
    const [custName, setCustName] = useState('');

    // Form Nhân viên
    const [staffCode, setStaffCode] = useState('');
    const [staffPassword, setStaffPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Điền nhanh mẫu test
    const handleQuickCustomer = (phone: string, name: string, type: string) => {
        onLoginSuccess({
            role: 'CUSTOMER',
            name,
            phone,
            customerType: type,
        });
        onClose();
    };

    const handleQuickStaff = () => {
        onLoginSuccess({
            role: 'STAFF',
            name: 'Nguyễn Quản Trị (Điều hành xe)',
        });
        onClose();
    };

    const handleSubmitCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!custPhone) return;

        let custType = 'NORMAL';
        if (custPhone === '0912345678') custType = 'VIP';
        else if (custPhone === '0987654321') custType = 'MEMBER';

        onLoginSuccess({
            role: 'CUSTOMER',
            name: custName || `Khách hàng ${custPhone.slice(-4)}`,
            phone: custPhone,
            customerType: custType,
        });
        onClose();
    };

    const handleSubmitStaff = (e: React.FormEvent) => {
        e.preventDefault();
        // Mật khẩu mặc định: admin / 123456
        if (staffCode.toLowerCase() === 'admin' && staffPassword === '123456') {
            onLoginSuccess({
                role: 'STAFF',
                name: 'Trần Điều Hành (Admin)',
            });
            onClose();
        } else {
            setErrorMsg('Mã nhân viên hoặc mật khẩu không chính xác! (Gợi ý: admin / 123456)');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">

                {/* Header chuyển Tab Khách / Nhân viên */}
                <div className="p-6 pb-4 bg-slate-50 border-b border-slate-200 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-black tracking-tight text-slate-900 mb-4">
                        Đăng Nhập Cổng Hệ Thống
                    </h3>

                    <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => { setRole('CUSTOMER'); setErrorMsg(''); }}
                            className={`py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                                role === 'CUSTOMER'
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <User className="w-4 h-4" /> Khách Hàng
                        </button>

                        <button
                            type="button"
                            onClick={() => { setRole('STAFF'); setErrorMsg(''); }}
                            className={`py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                                role === 'STAFF'
                                    ? 'bg-white text-purple-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <ShieldCheck className="w-4 h-4" /> Quản Trị / Bác Tài
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-5">
                    {/* CỔNG KHÁCH HÀNG */}
                    {role === 'CUSTOMER' && (
                        <form onSubmit={handleSubmitCustomer} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Số điện thoại nhận diện thành viên <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="VD: 0912345678"
                                        value={custPhone}
                                        onChange={e => setCustPhone(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Họ và tên (Tùy chọn)
                                </label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        value={custName}
                                        onChange={e => setCustName(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Nút Đăng nhập */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2"
                            >
                                <span>Vào Đặt Vé & Nhận Ưu Đãi</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* Đăng nhập nhanh Test OOP */}
                            <div className="pt-3 border-t border-slate-100">
                                <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-500" /> Đăng nhập mẫu nhanh (OOP Test):
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => handleQuickCustomer('0912345678', 'Nguyễn Văn Hùng', 'VIP')}
                                        className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-left hover:bg-amber-100 transition"
                                    >
                                        ⭐ VIP: 0912345678
                                        <div className="text-[10px] text-amber-700 font-normal">Giảm 20% tự động</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickCustomer('0987654321', 'Trần Thị Mai', 'MEMBER')}
                                        className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-bold text-left hover:bg-blue-100 transition"
                                    >
                                        💎 TV: 0987654321
                                        <div className="text-[10px] text-blue-700 font-normal">Giảm 10% tự động</div>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* CỔNG NHÂN VIÊN / BÁC TÀI */}
                    {role === 'STAFF' && (
                        <form onSubmit={handleSubmitStaff} className="space-y-4">
                            {errorMsg && (
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Mã tài khoản Quản trị <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="admin"
                                        value={staffCode}
                                        onChange={e => setStaffCode(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Mật khẩu bảo mật <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••"
                                        value={staffPassword}
                                        onChange={e => setStaffPassword(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm rounded-xl shadow-md shadow-purple-600/30 transition flex items-center justify-center gap-2"
                            >
                                <span>Đăng Nhập Quản Trị</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* Điền nhanh tài khoản Admin */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleQuickStaff}
                                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-200"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Điền nhanh Quyền Quản Trị (admin / 123456)
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};