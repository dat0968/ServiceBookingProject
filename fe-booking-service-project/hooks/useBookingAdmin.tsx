
import { useEffect, useState } from "react";

import {
    getAllBooking,
    changeStatusBooking,
    cancelBooking,
    getSuggestedStaff,
} from "@/services/bookingService";


import type {
    Booking,
    BookingQuery,
    BookingResponse,
    CancelBookingRequest,
    StatusBookingRequest,
} from "@/types/booking";

import type { StaffResponse } from "@/types/staff";

export default function useBookingAdmin() {
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);

    // Detail modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBooking, setSelectedBooking] =
        useState<Booking | null>(null);

    // Staff modal
    const [staffs, setStaffs] = useState<StaffResponse[]>([]);
    const [staffsLoading, setStaffsLoading] = useState(false);

    const [showStaffModal, setShowStaffModal] = useState(false);
    const [staffBooking, setStaffBooking] =
        useState<Booking | null>(null);

    const [selectedStaffId, setSelectedStaffId] = useState<number>(0);
    const [pendingStatus, setPendingStatus] = useState("");
    const [statusSubmitting, setStatusSubmitting] = useState(false);

    // Cancel modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelBookingTarget, setCancelBookingTarget] =
        useState<Booking | null>(null);

    const [cancellationReason, setCancellationReason] = useState("");
    const [cancelSubmitting, setCancelSubmitting] = useState(false);

    // Fetch booking list
    const fetchBookings = async () => {
        try {
            setLoading(true);

            const query: BookingQuery = {
                date,
                status,
                page,
                pageSize,
            };

            const response: BookingResponse = await getAllBooking(query);

            setBookings(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    // Filter
    const handleFilter = () => {
        if (page !== 1) {
            setPage(1);
        } else {
            fetchBookings();
        }
    };

    // Detail
    const handleDetail = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedBooking(null);
    };

    // Update booking status
    const updateBookingStatus = async (
        bookingId: number,
        newStatus: string,
        staffId: number
    ) => {
        try {
            setStatusSubmitting(true);

            const request: StatusBookingRequest = {
                status: newStatus,
                staffId,
            };

            await changeStatusBooking(bookingId, request);
            await fetchBookings();

            return true;
        } catch (error) {


            return false;
        } finally {
            setStatusSubmitting(false);
        }
    };

    // Status selection from table
    const handleStatusChange = async (
        booking: Booking,
        newStatus: string,
        staffId: number
    ) => {
        if (!newStatus || newStatus === booking.statusBooking) {
            return;
        }

        // Pending does not require staff assignment
        if (newStatus === "Pending") {
            await updateBookingStatus(booking.id, newStatus, staffId);
            return;
        }

        // Confirmed / Completed require staff
        if (booking.staffId === null) {
            setStaffBooking(booking);
            setPendingStatus(newStatus);
            setSelectedStaffId(0);

            await fetchSuggestedStaff(booking.id);
            setShowStaffModal(true);
            return;
        }

        await updateBookingStatus(booking.id, newStatus, staffId);
    };

    // Fetch suggested staff for a booking
    const fetchSuggestedStaff = async (bookingId: number) => {
        try {
            setStaffsLoading(true);

            const response = await getSuggestedStaff(bookingId);
            console.log("Suggested staff:", response);

            // API trả về một nhân viên được đề xuất
            if (response.length > 0) {
                setStaffs(response);
                setSelectedStaffId(response[0].id);
            } else {
                setStaffs([]);
                setSelectedStaffId(0);
            }
        } catch (error) {


            setStaffs([]);
            setSelectedStaffId(0);
        } finally {
            setStaffsLoading(false);
        }
    };

    // Assign staff and update status
    const handleAssignStaff = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!staffBooking || !selectedStaffId || !pendingStatus) {
            return;
        }

        const success = await updateBookingStatus(
            staffBooking.id,
            pendingStatus,
            selectedStaffId
        );

        if (success) {
            setShowStaffModal(false);
            setStaffBooking(null);
            setSelectedStaffId(0);
            setPendingStatus("");
        }
    };

    const handleCloseStaffModal = () => {
        if (statusSubmitting) return;

        setShowStaffModal(false);
        setStaffBooking(null);
        setSelectedStaffId(0);
        setPendingStatus("");
    };

    // Cancel booking
    const handleCancelClick = (booking: Booking) => {
        setCancelBookingTarget(booking);
        setCancellationReason("");
        setShowCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        if (cancelSubmitting) return;

        setShowCancelModal(false);
        setCancelBookingTarget(null);
        setCancellationReason("");
    };

    const handleConfirmCancel = async () => {
        if (!cancelBookingTarget || !cancellationReason.trim()) {
            return;
        }

        try {
            setCancelSubmitting(true);
            const request: CancelBookingRequest = {
                cancellationReason: cancellationReason.trim(),
            };

            await cancelBooking(cancelBookingTarget.id, request);

            setShowCancelModal(false);
            setCancelBookingTarget(null);
            setCancellationReason("");

            await fetchBookings();
        } catch (error) {

        } finally {
            setCancelSubmitting(false);
        }
    };

    // Pagination
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) {
            return;
        }

        setPage(newPage);
    };

    // Initial load and page change
    useEffect(() => {
        fetchBookings();
    }, [page]);

    return {
        // Bookings
        bookings,
        loading,
        fetchBookings,

        // Filter
        date,
        setDate,
        status,
        setStatus,
        handleFilter,

        // Pagination
        page,
        pageSize,
        totalPages,
        handlePageChange,

        // Detail
        selectedBooking,
        showDetailModal,
        handleDetail,
        handleCloseDetail,

        // Status
        handleStatusChange,
        statusSubmitting,

        // Staff
        staffs,
        staffsLoading,
        staffBooking,
        selectedStaffId,
        setSelectedStaffId,
        pendingStatus,
        showStaffModal,
        handleAssignStaff,
        handleCloseStaffModal,
        submitting: statusSubmitting,

        // Cancel
        showCancelModal,
        cancellationReason,
        setCancellationReason,
        handleCancelClick,
        handleCloseCancelModal,
        handleConfirmCancel,
        cancelSubmitting,
    };
}
