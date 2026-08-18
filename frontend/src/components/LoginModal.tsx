import React from 'react';

interface LoginModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-800">Đăng nhập hệ thống</h2>
                <p className="my-4 text-sm text-gray-500">
                    Component đang được phát triển bởi Nhật Anh.
                </p>
                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default LoginModal;