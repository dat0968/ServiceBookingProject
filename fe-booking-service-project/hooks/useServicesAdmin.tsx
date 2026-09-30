import { createService, updateService, updateServiceStatus, getService } from "@/services/myService";
import { useState } from "react";
import { ServiceRequest, Service } from "@/types/service";
export default function useServicesAdmin( fetchServices: () => Promise<void>) {
    const initialForm: ServiceRequest = {
        nameService: "",
        descriptionService: "",
        durationMinutes: 45,
        price: 150000,
        isActive: true
    };

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<ServiceRequest>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const handleAdd = () => {
        setIsEditing(false);
        setEditingId(null);
        setForm({ ...initialForm });
        setFormError("");
        setShowModal(true);
    };

    const handleEdit = (service: Service) => {
        setIsEditing(true);
        setEditingId(service.id);

        setForm({
            nameService: service.nameService,
            descriptionService: service.descriptionService ?? "",
            durationMinutes: service.durationMinutes,
            price: service.price,
            isActive: service.isActive,
        });

        setFormError("");
        setShowModal(true);
    };

    const handleClose = () => {
        if (submitting) return;

        setShowModal(false);
        setFormError("");
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "durationMinutes" || name === "price"
                    ? value === "" ? 0 : Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");

        if (!form.nameService.trim()) {
            setFormError("Vui lòng nhập tên dịch vụ.");
            return;
        }

        if (!Number.isInteger(form.durationMinutes) || form.durationMinutes <= 0) {
            setFormError("Thời lượng phải là số nguyên lớn hơn 0.");
            return;
        }

        if (!Number.isFinite(form.price) || form.price < 0) {
            setFormError("Giá dịch vụ không được nhỏ hơn 0.");
            return;
        }

        try {
            setSubmitting(true);

            const request: ServiceRequest = {
                ...form,
                nameService: form.nameService.trim(),
                descriptionService: form.descriptionService?.trim() || "",
            };

            if (isEditing && editingId !== null) {
                await updateService(editingId, request);
            } else {
                await createService(request);
            }
            setShowModal(false);
            await fetchServices();

        } catch (error: any) {
            setFormError(
                error.response.data.message
            );
        } finally {
            setSubmitting(false);
        }
    }

    const handleCancel = async (id: number, isActive: boolean) => {
        await updateServiceStatus(id, isActive);
        await fetchServices();
    }

    
    return {
        showModal,
        isEditing,
        editingId,
        form,
        submitting,
        formError,

        setForm,

        handleAdd,
        handleEdit,
        handleClose,
        handleChange,
        handleSubmit,
        handleCancel
    };
}