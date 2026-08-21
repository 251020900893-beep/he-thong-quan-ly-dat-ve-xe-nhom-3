// frontend/src/context/BookingContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { BusTrip, Ticket } from '../types';
import { tripApi } from '../api/tripApi';

interface BookingContextType {
    trips: BusTrip[];
    loadingTrips: boolean;
    activeHoldingTicket: (Ticket & { holdExpiresAt?: number }) | null;
    refreshTrips: () => Promise<void>;
    holdSeat: (tripId: string, seatNumber: string, customerData: any) => Promise<Ticket>;
    releaseHold: () => Promise<void>;
    confirmPayment: (ticketId: string, paymentMethod: any, extraData?: any) => Promise<Ticket>;
    setActiveHoldingTicket: (ticket: (Ticket & { holdExpiresAt?: number }) | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [trips, setTrips] = useState<BusTrip[]>([]);
    const [loadingTrips, setLoadingTrips] = useState<boolean>(true);
    const [activeHoldingTicket, setActiveHoldingTicket] = useState<(Ticket & { holdExpiresAt?: number }) | null>(null);
    const latestTripsRequest = useRef(0);

    const refreshTrips = async () => {
        const requestId = ++latestTripsRequest.current;
        try {
            const data = await tripApi.getTrips();
            if (requestId === latestTripsRequest.current && Array.isArray(data)) {
                setTrips([...data]);
            }
        } catch (err) {
            console.error('Lỗi refresh danh sách chuyến:', err);
        } finally {
            setLoadingTrips(false);
        }
    };

    // Polling tự động mỗi 3 giây để cập nhật trạng thái ghế thời gian thực
    useEffect(() => {
        refreshTrips();
        const interval = setInterval(refreshTrips, 3000);
        return () => clearInterval(interval);
    }, []);

    const holdSeat = async (tripId: string, seatNumber: string, customerData: any) => {
        // Tự động giải phóng ghế cũ nếu khách hàng đang giữ ghế trước đó
        if (activeHoldingTicket) {
            try {
                const oldTicketId = (activeHoldingTicket as any).ticketId || activeHoldingTicket.id;
                if (oldTicketId) {
                    await tripApi.cancelHold(oldTicketId);
                }
            } catch (err) {
                console.warn('Lỗi khi tự động hủy ghế cũ:', err);
            }
        }

        const ticket = await tripApi.holdBooking({
            tripId,
            seatNumber,
            ...customerData
        });

        // TÍNH MỐC HẾT HẠN CỐ ĐỊNH TẠI ĐÂY (Hiện tại + 3 phút)
        const holdExpiresAt = Date.now() + 3 * 60 * 1000;
        const ticketWithExpiry = {
            ...ticket,
            holdExpiresAt
        };

        setActiveHoldingTicket(ticketWithExpiry);

        // Optimistic UI Update: Khóa tạm thời ghế trên UI ngay lập tức
        setTrips(prevTrips =>
            prevTrips.map(trip => {
                const curTripId = trip.id || trip.tripId;
                if (curTripId === tripId && trip.seats) {
                    return {
                        ...trip,
                        seats: trip.seats.map(s =>
                            s.seatNumber === seatNumber ? { ...s, status: 'HOLDING' as const } : s
                        )
                    };
                }
                return trip;
            })
        );

        await refreshTrips();
        return ticketWithExpiry;
    };

    const releaseHold = async () => {
        if (activeHoldingTicket) {
            try {
                const targetTicketId = (activeHoldingTicket as any).ticketId || activeHoldingTicket.id;
                if (targetTicketId) {
                    await tripApi.cancelHold(targetTicketId);
                }
            } catch (err) {
                console.error('Lỗi khi hủy giữ chỗ:', err);
                await refreshTrips();
                return;
            }
        }
        setActiveHoldingTicket(null);
        await refreshTrips();
    };

    const confirmPayment = async (ticketId: string, paymentMethod: any, extraData?: any) => {
        const result = await tripApi.processPayment({
            ticketId,
            paymentMethod,
            ...extraData
        });

        // Optimistic UI Update: Chuyển ghế sang trạng thái BOOKED ngay lập tức
        const paidTicket = result.ticket || (result as any);
        if (paidTicket && paidTicket.tripId && paidTicket.seatNumber) {
            setTrips(prevTrips =>
                prevTrips.map(trip => {
                    const curTripId = trip.id || trip.tripId;
                    if (curTripId === paidTicket.tripId && trip.seats) {
                        return {
                            ...trip,
                            seats: trip.seats.map(s =>
                                s.seatNumber === paidTicket.seatNumber ? { ...s, status: 'BOOKED' as const } : s
                            )
                        };
                    }
                    return trip;
                })
            );
        }

        setActiveHoldingTicket(null);
        await refreshTrips();
        return paidTicket;
    };

    return (
        <BookingContext.Provider
            value={{
                trips,
                loadingTrips,
                activeHoldingTicket,
                refreshTrips,
                holdSeat,
                releaseHold,
                confirmPayment,
                setActiveHoldingTicket
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking phải được sử dụng bên trong BookingProvider');
    }
    return context;
};