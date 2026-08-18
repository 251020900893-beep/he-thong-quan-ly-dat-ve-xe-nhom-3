import React from 'react';

interface OOPDocModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const OOPDocModal: React.FC<OOPDocModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-800">Tài liệu kiến trúc OOP</h2>
                <p className="my-4 text-sm text-gray-500">
                    Tài liệu & giải thích mô hình hướng đối tượng của hệ thống (Nhật Anh).
                </p>
                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default OOPDocModal;