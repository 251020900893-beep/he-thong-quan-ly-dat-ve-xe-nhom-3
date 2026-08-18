import React, { useState } from 'react';
import { Lock, User, X, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: (adminName: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
                                                          onClose,
                                                          onLoginSuccess
                                                      }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Điền nhanh tài khoản mẫu Quản Trị (OOP Demo)
    const handleQuickFill = () => {
        setUsername('admin');
        setPassword('123456');
        setError(null);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Xác thực tài khoản Quản Trị Viên
        if (username.trim() === 'admin' && (password === '123456' || password === 'admin')) {
            onLoginSuccess('Nguyễn Quản Trị (Điều hành xe)');
        } else {
            setError('Sai tên đăng nhập hoặc mật khẩu! (Gợi ý tài khoản: admin / 123456)');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in">

                {/* Header Tím Đậm Sang Trọng */}
                <div className="bg-slate-950 p-6 text-white flex items-start justify-between border-b border-slate-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Xác Thực Bảo Mật
                            </span>
                        </div>
                        <h3 className="text-xl font-black mt-2 text-white">
                            Đăng Nhập Quản Trị Viên
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5">
                            Khu vực dành riêng cho Quản lý & Điều hành xe Limousine
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs sm:text-sm">
                    {/* Khung Điền Nhanh Tài Khoản Mẫu OOP */}
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-2">
                        <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600" />
                            <span>Tài khoản Demo Quản Trị:</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleQuickFill}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-purple-600/20"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Điền nhanh: admin / 123456</span>
                        </button>
                    </div>

                    {/* Form Input */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Tên tài khoản Quản trị <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    placeholder="admin"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-xs sm:text-sm font-semibold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Mật khẩu <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-xs sm:text-sm font-semibold"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                            >
                                Đóng
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 font-bold text-white text-xs transition cursor-pointer shadow-md"
                            >
                                Đăng Nhập Quản Trị
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};