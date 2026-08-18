import React from 'react';
import { X, BookOpen, Layers, ShieldCheck, Cpu } from 'lucide-react';

interface OOPDocModalProps {
    onClose: () => void;
}

export const OOPDocModal: React.FC<OOPDocModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-white">Tài Liệu Thiết Kế Kiến Trúc OOP 3 Lớp</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs text-slate-300 max-h-[75vh] overflow-y-auto">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <h4 className="font-bold text-blue-400 text-sm">1. Tính Đa Hình & Strategy Pattern (Chính Sách Giảm Giá)</h4>
                        <p>Interface <code className="text-amber-400">DiscountPolicy</code> được hiện thực qua các lớp:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong className="text-white">VipCustomerDiscount</strong>: Giảm 20% tổng tiền vé.</li>
                            <li><strong className="text-white">MemberCustomerDiscount</strong>: Giảm 10% tổng tiền vé.</li>
                            <li><strong className="text-white">NormalCustomerDiscount</strong>: Giữ nguyên giá gốc (0%).</li>
                        </ul>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <h4 className="font-bold text-emerald-400 text-sm">2. Khóa Giữ Chỗ Tự Động (Holding Timer 3 Phút)</h4>
                        <p>Khi khách hàng chọn ghế, Backend chuyển trạng thái ghế sang <code className="text-amber-400">HOLDING</code> kèm thời gian hết hạn <code className="text-blue-400">expireAt = now + 3 phút</code> để ngăn chặn đặt trùng ghế đồng thời.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};