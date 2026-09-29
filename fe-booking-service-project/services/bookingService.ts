import api from "./api";
import type { BookingQuery, BookingRequest, BookingResponse, CancelBookingRequest} from "@/types/booking";

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