import React from 'react';

interface PaymentModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    bookingData?: any;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-800">Thanh toán vé xe</h2>
                <p className="my-4 text-sm text-gray-500">
                    Xử lý thông tin thanh toán & tích hợp cổng thanh toán (Nhật Anh).
                </p>
                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;