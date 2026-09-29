'use client'
import api from "./api";
import type { BookingRequest } from "@/types/booking";

export const createBooking = async (data: BookingRequest): Promise<void> => {
    await api.post("/bookings", data);
};
