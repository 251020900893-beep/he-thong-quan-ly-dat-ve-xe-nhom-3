export interface Trip {
    tripId: string;
    route: string;
    departureTime: string;
    arrivalTime: string;
    busType: string;
    basePrice: number;
}

export interface Seat {
    seatId: string;
    seatNumber: string;
    seatType: 'VIP' | 'STANDARD';
    surcharge: number;
    status: 'AVAILABLE' | 'HOLDING' | 'BOOKED';
}

export interface Customer {
    name: string;
    phone: string;
    customerType: 'NORMAL' | 'MEMBER' | 'VIP';
}

export interface BookingResponse {
    id?: string;
    ticketId?: string;
    customer?: Customer;
    trip?: Trip;
    seat?: Seat;
    finalPrice?: number;
    status?: string;
}