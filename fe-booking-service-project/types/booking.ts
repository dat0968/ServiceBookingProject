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