"use client";

import { useEffect, useState } from "react";
import { cancelBooking } from "@/services/bookingService";
import type {
    BookingQuery,
    BookingResponse,
} from "@/types/booking";
import { getMyBookings } from "@/services/bookingService";

export default function useMyBookings() {
    const [bookings, setBookings] = useState<BookingResponse | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "danger",
    });

    const [query, setQuery] = useState<BookingQuery>({
        date: "",
        status: "",
        page: 1,
        pageSize: 10,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getMyBookings(query);

            setBookings(result);
        } catch {
            setError("Không thể tải danh sách lịch đặt.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, [
        query.date,
        query.status,
        query.page,
        query.pageSize,
    ]);

    const handleDateChange = (date: string) => {
        setQuery((prev) => ({
            ...prev,
            date,
            page: 1,
        }));
    };

    const handleStatusChange = (status: string) => {
        setQuery((prev) => ({
            ...prev,
            status,
            page: 1,
        }));
    };

    const handlePageChange = (page: number) => {
        setQuery((prev) => ({
            ...prev,
            page,
        }));
    };
    const handleOpenCancelModal = (bookingId: number) => {
        setSelectedBookingId(bookingId);
        setCancelReason("");
        setShowCancelModal(true);
    };
    const handleCloseCancelModal = () => {
        if (cancelling) return;

        setShowCancelModal(false);
        setSelectedBookingId(null);
        setCancelReason("");
    };
    const handleCancelBooking = async () => {
        if (!selectedBookingId) return;

        if (!cancelReason.trim()) {
            setToast({
                show: true,
                message: "Vui lòng nhập lý do hủy lịch.",
                type: "danger",
            });
            return;
        }

        try {
            setCancelling(true);
            setError("");

            await cancelBooking(selectedBookingId, {
                cancellationReason: cancelReason.trim(),
            });

            handleCloseCancelModal();
            await fetchMyBookings();

            setToast({
                show: true,
                message: "Hủy lịch hẹn thành công.",
                type: "success",
            });
        } catch {
            setToast({
                show: true,
                message: "Không thể hủy lịch hẹn.",
                type: "danger",
            });
        } finally {
            setCancelling(false);
        }
    };
    return {
        bookings,
        query,
        loading,
        error,

        toast,
        setToast,

        showCancelModal,
        cancelReason,
        cancelling,

        handleDateChange,
        handleStatusChange,
        handlePageChange,
        handleOpenCancelModal,
        handleCloseCancelModal,
        handleCancelBooking,
        setCancelReason,
    };
}