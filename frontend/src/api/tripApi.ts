import { BusTrip, Ticket, CustomerType } from '../types';

// Trỏ thẳng trực tiếp vào Backend Java Spring Boot cổng 8080
const BASE_URL = 'http://localhost:8080/api';
const ROOT_URL = 'http://localhost:8080';

export const tripApi = {
    // 1. Lấy danh sách chuyến xe (Thử cả 2 đường dẫn /api/trips và /trips)
    async getTrips(): Promise<BusTrip[]> {
        try {
            let res = await fetch(`${BASE_URL}/trips`).catch(() => null);
            if (!res || !res.ok) {
                res = await fetch(`${ROOT_URL}/trips`).catch(() => null);
            }
            if (!res || !res.ok) throw new Error('Không thể tải danh sách chuyến xe');
            const json = await res.json();
            const data = json.data || json;
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('Lỗi API getTrips:', err);
            return [];
        }
    },

    // 2. Giữ chỗ 3 phút
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
        let res = await fetch(`${BASE_URL}/booking/hold`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => null);

        if (!res || !res.ok) {
            res = await fetch(`${ROOT_URL}/booking/hold`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(() => null);
        }

        if (!res) throw new Error('Không thể kết nối Backend!');
        const json = await res.json();
        if (!json.success && json.message) throw new Error(json.message);
        return json.data || json;
    },

    // 3. Hủy giữ chỗ
    async cancelHold(ticketId: string): Promise<void> {
        await fetch(`${BASE_URL}/booking/cancel-hold`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticketId })
        }).catch(() => fetch(`${ROOT_URL}/booking/cancel-hold`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticketId })
        }));
    },

    // 4. Thanh toán
    async processPayment(payload: { ticketId: string; paymentMethod: string }): Promise<{ ticket: Ticket }> {
        let res = await fetch(`${BASE_URL}/payment/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => null);

        if (!res || !res.ok) {
            res = await fetch(`${ROOT_URL}/payment/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(() => null);
        }

        if (!res) throw new Error('Không thể kết nối Backend thanh toán!');
        const json = await res.json();
        if (!json.success && json.message) throw new Error(json.message);
        return { ticket: json.data || json };
    },

    // 5. Tra cứu vé
    async lookupTickets(query: string): Promise<Ticket[]> {
        try {
            let res = await fetch(`${BASE_URL}/tickets/search?query=${encodeURIComponent(query)}`).catch(() => null);
            if (!res || !res.ok) {
                res = await fetch(`${ROOT_URL}/tickets/search?query=${encodeURIComponent(query)}`).catch(() => null);
            }
            if (!res) return [];
            const data = await res.json();
            return Array.isArray(data) ? data : (data.data || []);
        } catch {
            return [];
        }
    }
};