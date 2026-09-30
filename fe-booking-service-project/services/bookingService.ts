import { StaffResponse } from "@/types/staff";
import api from "./api";
import type { Booking, BookingQuery, BookingRequest, BookingResponse, CancelBookingRequest, StatusBookingRequest } from "@/types/booking";

export const createBooking = async (data: BookingRequest): Promise<void> => {
    await api.post("/bookings", data);
};
export const getMyBookings = async (data: BookingQuery): Promise<BookingResponse> => {
    const response = await api.get(`/bookings/my-bookings`, {
        params: {
            Date: data.date,
            Status: data.status,
            Page: data.page,
            PageSize: data.pageSize
        }
    })
    return response.data;
}
export const cancelBooking = async (
    id: number,
    data: CancelBookingRequest
): Promise<void> => {
    await api.post(`/bookings/${id}/cancel`, data);
};
export const getAllBooking = async (data: BookingQuery): Promise<BookingResponse> => {
    const response = await api.get<BookingResponse>(`/bookings`, {
        params: {
            Date: data.date,
            Status: data.status,
            Page: data.page,
            PageSize: data.pageSize
        }
    })
    return response.data
}
export const changeStatusBooking = async (id: number, data: StatusBookingRequest): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/status`, data)
    return response.data
}
export const getSuggestedStaff = async (id: number): Promise<StaffResponse[]> => {
    const response = await api.get<StaffResponse[]>(`/bookings/${id}/suggested-staff`);
    return response.data
}