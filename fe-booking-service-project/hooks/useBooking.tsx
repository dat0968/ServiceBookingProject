import { useEffect, useState } from "react";
import type { BookingForm, BookingRequest } from "@/types/booking";
import type { Service } from "@/types/service";
import { getService } from "@/services/myService";
import { createBooking } from "@/services/bookingService";
import { useRouter } from "next/navigation";
export default function useBooking() {
    // Data
    const [services, setServices] = useState<Service[]>([]);
    // Router
    const router = useRouter();
    // Form
    const [form, setForm] = useState<BookingForm>({
        serviceId: "",
        bookingDate: "",
        startTime: "",
        customerNote: "",
    });
    // Toast
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "danger",
    });
    // Error
    const [error, setError] = useState("");

    // Loading
    const [loadingServices, setLoadingServices] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // GET Service
    const fetchServices = async () => {
        try {
            setLoadingServices(true);
            setError("");

            const result = await getService({
                search: "",
                page: 1,
                pageSize: 100,
            });

            setServices(result.data.filter((service) => service.isActive));
        } catch {
            setError("Không thể tải danh sách dịch vụ.");
        } finally {
            setLoadingServices(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [])

    // Select Service
    const handleServiceChange = (serviceId: number | "") => {
        setForm((prev) => ({
            ...prev,
            serviceId,
        }));

        setError("");
    };

    // Select date
    const handleDateChange = (bookingDate: string) => {
        setForm((prev) => ({
            ...prev,
            bookingDate,
        }));

        setError("");
    };

    // Select time
    const handleTimeChange = (startTime: string) => {
        setForm((prev) => ({
            ...prev,
            startTime,
        }));

        setError("");
    };

    // Select note
    const handleNoteChange = (customerNote: string) => {
        setForm((prev) => ({
            ...prev,
            customerNote,
        }));
    };

    // Submit booking
    const handleSubmit = async () => {
        if (!form.serviceId) {
            setError("Vui lòng chọn dịch vụ.");
            return;
        }

        if (!form.bookingDate) {
            setError("Vui lòng chọn ngày.");
            return;
        }

        if (!form.startTime) {
            setError("Vui lòng chọn thời gian.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const bookingRequest: BookingRequest = {
                serviceId: Number(form.serviceId),
                startTime: `${form.bookingDate}T${form.startTime}:00`,
                customerNote: form.customerNote.trim() || undefined,
            };
            await createBooking(bookingRequest);
            setToast({
                show: true,
                message: "Đặt lịch thành công!",
                type: "success",
            });
            setTimeout(() => {
                router.push("/services");
            }, 2000)
        } catch (error: any) {
            if (error.response?.status !== 401) {
                setError(error.response.data.message);
            }
            console.log("AXIOS ERROR");
            console.log("URL:", error.config?.url);
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    // Selected Service
    const selectedService = services.find(
        (service) => service.id === Number(form.serviceId)
    );

    return {
        // Data
        services,

        // Selected
        selectedService,

        // Form
        form,

        // Loading
        loadingServices,
        submitting,

        // Error
        error,

        // Handlers
        handleServiceChange,
        handleDateChange,
        handleTimeChange,
        handleNoteChange,
        handleSubmit,
        toast,
        setToast
    };
}