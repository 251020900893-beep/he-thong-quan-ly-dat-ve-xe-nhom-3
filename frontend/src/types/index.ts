// frontend/src/types/index.ts

export type CustomerType = 'NORMAL' | 'MEMBER' | 'VIP';

export type SeatType = 'NORMAL' | 'VIP';

export type SeatStatus = 'AVAILABLE' | 'HOLDING' | 'BOOKED';

export type PaymentStatus =
    | 'HOLDING_UNPAID'
    | 'PAID'
    | 'EXPIRED_CANCELLED';

export type PaymentMethodType =
    | 'CASH'
    | 'BANK_TRANSFER'
    | 'E_WALLET';

export interface Seat {
    seatId: string;
    tripId?: string;

    seatNumber: string;

    seatType: SeatType;

    surcharge: number;

    status: SeatStatus;

    holdingExpiresAt?: string | null;

    holdingCustomerId?: string | null;

    bookedTicketId?: string | null;
}

export interface BusTrip {
    id?: string;
    tripId: string;

    tripCode?: string;
    route?: string;

    departure?: string;
    destination?: string;

    departureLocation?: string;
    destinationLocation?: string;

    departureTime: string;
    arrivalTime?: string;

    licensePlate?: string;
    busPlate?: string;

    busType: string;

    basePrice: number;

    totalSeats: number;

    driverName?: string;

    pickupPoints?: string[];

    dropoffPoints?: string[];

    seats?: Seat[];
}

export interface Customer {
    id: string;

    fullName: string;

    name?: string;

    phone: string;

    email?: string;

    customerType: CustomerType;

    createdAt?: string;
}

export interface Ticket {
    ticketId?: string;
    id?: string;

    customer?: Customer;

    trip?: BusTrip;

    seat?: Seat;

    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;

    customerType?: CustomerType;

    tripId?: string;
    tripCode?: string;

    seatId?: string;
    seatNumber?: string;
    seatType?: SeatType;

    route?: string;
    departureTime?: string;
    busPlate?: string;

    pickupPoint?: string;
    dropoffPoint?: string;

    basePrice?: number;
    seatSurcharge?: number;

    discountPercent?: number;
    discountAmount?: number;

    price?: number;
    finalPrice?: number;

    paymentMethod?: PaymentMethodType | string;

    status?: 'HOLDING' | 'PAID' | 'CANCELLED';

    paymentStatus?: PaymentStatus;

    createdAt?: string;

    expiresAt?: string | null;

    paidAt?: string | null;
}

export interface DailyReport {
    totalTickets: number;

    paidTicketsCount: number;

    holdingTicketsCount: number;

    cancelledExpiredCount: number;

    totalRevenue: number;

    revenueByPaymentMethod: {
        cash: number;
        bankTransfer: number;
        eWallet: number;
    };

    tickets: Ticket[];

    occupancyRatePercent: number;
}

export interface BookingResponse {
    id?: string;
    ticketId?: string;

    customer?: Customer;
    trip?: BusTrip;
    seat?: Seat;

    finalPrice?: number;

    status?: string;
}
