import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface HoldCountdownTimerProps {
    expireAt?: string | number | null;
    expiresAt?: string | number | null;
    onExpire: () => void;
}

export const HoldCountdownTimer: React.FC<HoldCountdownTimerProps> = ({
                                                                          expireAt,
                                                                          expiresAt,
                                                                          onExpire
                                                                      }) => {
    const targetValue = expireAt || expiresAt;

    const calculateRemaining = () => {
        if (!targetValue) {
            // Mặc định đếm 3 phút (180s) nếu chưa nhận được thời gian từ BE
            return 180;
        }
        let targetMs = 0;
        if (typeof targetValue === 'number') {
            targetMs = targetValue > 10000000000 ? targetValue : targetValue * 1000;
        } else {
            targetMs = new Date(targetValue).getTime();
        }

        if (isNaN(targetMs)) return 180;
        return Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
    };

    const [secondsLeft, setSecondsLeft] = useState<number>(calculateRemaining);

    useEffect(() => {
        setSecondsLeft(calculateRemaining());
        const timer = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onExpire();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetValue]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const isUrgent = secondsLeft <= 30;

    return (
        <div className={`px-3 py-1.5 rounded-xl border flex items-center justify-between gap-3 ${
            isUrgent
                ? 'bg-rose-50 border-rose-400 text-rose-800 animate-pulse'
                : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
            <div className="flex items-center gap-2">
                {isUrgent ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                ) : (
                    <Clock className="w-4 h-4 text-amber-600" />
                )}
                <div>
                    <div className="text-[10px] font-black uppercase tracking-wider">Thời gian giữ chỗ</div>
                    <div className="text-[9px] opacity-80">Tự giải phóng khi hết giờ</div>
                </div>
            </div>

            <div className="font-mono text-base font-black px-2.5 py-0.5 bg-white rounded-lg border border-inherit shadow-2xs">
                {String(isNaN(mins) ? 3 : mins).padStart(2, '0')}:{String(isNaN(secs) ? 0 : secs).padStart(2, '0')}
            </div>
        </div>
    );
};