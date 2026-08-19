import { BusTrip, Ticket, CustomerType } from '../types';

const BASE_URL = 'http://localhost:8080/api';

export const tripApi = {
    // 1. Lấy danh sách chuyến xe
    async getTrips(): Promise<BusTrip[]> {
        try {
            const res = await fetch(`${BASE_URL}/trips`);
            const json = await res.json();
            const data = json.data || json;
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('Lỗi API getTrips:', err);
            return [];
        }
    },

    // 2. Giữ chỗ 3 phút (Bắt đúng message lỗi từ Backend)
    async holdBooking(payload: {
        tripId: string;
        seatNumber: string;
        customerName: string;
        customerPhone: string;
        customerType?: CustomerType;
        pickupPoint?: string;
        dropoffPoint?: string;
        paymentMethod?: string;
    }): Promise<Ticket> {
        const res = await fetch(`${BASE_URL}/booking/hold`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
            const errMsg = json?.message || 'Ghế này vừa có người đặt hoặc đang giữ chỗ!';
            throw new Error(errMsg);
        }

        if (!json.success && json.message) {
            throw new Error(json.message);
        }
        return json.data || json;
    },

    // 3. Hủy giữ chỗ
    async cancelHold(ticketId: string): Promise<void> {
        await fetch(`${BASE_URL}/booking/cancel-hold`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticketId })
        }).catch(() => null);
    },

    // 4. Thanh toán
    async processPayment(payload: { ticketId: string; paymentMethod: string }): Promise<{ ticket: Ticket }> {
        const res = await fetch(`${BASE_URL}/payment/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
            const errMsg = json?.message || 'Thanh toán không thành công!';
            throw new Error(errMsg);
        }

        if (!json.success && json.message) {
            throw new Error(json.message);
        }
        return { ticket: json.data || json };
    },

    // 5. Tra cứu vé
    async lookupTickets(query: string): Promise<Ticket[]> {
        try {
            const res = await fetch(`${BASE_URL}/tickets/search?query=${encodeURIComponent(query)}`);
            if (!res.ok) return [];
            const data = await res.json();
            return Array.isArray(data) ? data : (data.data || []);
        } catch {
            return [];
        }
    }
};