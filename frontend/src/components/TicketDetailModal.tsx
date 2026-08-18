import React from 'react';

interface TicketDetailModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    ticketData?: any;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-800">Chi tiết Vé xe điện tử (E-Ticket)</h2>
                <p className="my-4 text-sm text-gray-500">
                    Hiển thị mã QR, thông tin vé & in/tải PDF (Nhật Anh).
                </p>
                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-900 transition"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default TicketDetailModal;