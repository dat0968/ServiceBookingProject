export interface BookingForm {
    serviceId: number | "";
    bookingDate: string;
    startTime: string;
    customerNote: string;
}

export interface BookingRequest {
    serviceId: number;
    startTime: string;
    customerNote?: string;
}

export interface Booking {
    id: number;
    bookingCode: string;
    customerId: number;
    customerName: string;
    customerEmail: string;
    serviceId: number;
    serviceName: string;
    staffId: number | null;
    staffName: string | null;
    startTime: string;
    endTime: string;
    statusBooking: string;
    customerNote: string | null;
    cancellationReason: string | null;
    createdAt: string;
}
export interface BookingResponse {
    data: Booking[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
export interface BookingQuery {
    date: string;
    status: string;
    page: number;
    pageSize: number
}
export interface CancelBookingRequest {
    cancellationReason: string;
}
export interface StatusBookingRequest {
    staffId: number;
    status: string;
}