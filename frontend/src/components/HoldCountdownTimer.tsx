import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface HoldCountdownTimerProps {
    expireAt: string | number; // Timestamp hoặc ISO String
    onExpire: () => void;
}

export const HoldCountdownTimer: React.FC<HoldCountdownTimerProps> = ({ expireAt, onExpire }) => {
    const calculateRemaining = () => {
        const target = typeof expireAt === 'string' ? new Date(expireAt).getTime() : expireAt;
        const diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
        return diff;
    };

    const [secondsLeft, setSecondsLeft] = useState(calculateRemaining);

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateRemaining();
            setSecondsLeft(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
                onExpire();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expireAt, onExpire]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const isUrgent = secondsLeft <= 30;

    return (
        <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
            isUrgent
                ? 'bg-rose-50 border-rose-400 text-rose-800 animate-pulse'
                : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
            <div className="flex items-center gap-2.5">
                {isUrgent ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
                ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                )}
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider">Thời gian giữ chỗ</div>
                    <div className="text-[11px] opacity-80">Ghế sẽ tự giải phóng nếu hết hạn</div>
                </div>
            </div>

            <div className="font-mono text-2xl font-black px-3 py-1 bg-white rounded-xl border border-inherit shadow-xs">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
        </div>
    );
};