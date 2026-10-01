import { useEffect, useState } from "react";
import {
    getStaff,
    createStaff,
    updateStaff,
    changeStatus,
} from "@/services/staffService";

import type {
    StaffResponse,
    StaffRequest,
} from "@/types/staff";

export default function useStaffAdmin() {
    const [staffs, setStaffs] = useState<StaffResponse[]>([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    // Modal
    const [showModal, setShowModal] = useState(false);

    const [editingStaff, setEditingStaff] =
        useState<StaffResponse | null>(null);

    // Form
    const [form, setForm] = useState<StaffRequest>({
        fullName: "",
        email: "",
        isActive: true,
    });

    const [formError, setFormError] = useState("");


    const fetchStaffs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getStaff(search);

            setStaffs(response);
        } catch (error: any) {
            setError(
                error.response?.data?.message ??
                "Không thể tải danh sách nhân viên."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = async () => {
        await fetchStaffs();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleCreate = () => {
        setEditingStaff(null);

        setForm({
            fullName: "",
            email: "",
            isActive: true,
        });

        setFormError("");
        setShowModal(true);
    };

    const handleEdit = (staff: StaffResponse) => {
        setEditingStaff(staff);

        setForm({
            fullName: staff.fullName,
            email: staff.email,
            isActive: staff.isActive,
        });

        setFormError("");
        setShowModal(true);
    };

    const handleCloseModal = () => {
        if (submitting) return;

        setShowModal(false);
        setEditingStaff(null);
        setFormError("");
    };
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!form.fullName.trim()) {
            setFormError("Vui lòng nhập họ tên.");
            return;
        }

        if (!form.email.trim()) {
            setFormError("Vui lòng nhập email.");
            return;
        }

        try {
            setSubmitting(true);
            setFormError("");

            const request: StaffRequest = {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                isActive: form.isActive,
            };

            if (editingStaff) {
                await updateStaff(
                    editingStaff.id,
                    request
                );
            } else {
                await createStaff(request);
            }

            setShowModal(false);
            setEditingStaff(null);

            await fetchStaffs();
        } catch (error: any) {
            setFormError(
                error.response?.data?.message ??
                "Không thể lưu nhân viên."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangeStatus = async (staff: StaffResponse) => {
        try {
            setError("");

            const newStatus = !staff.isActive;

            await changeStatus(staff.id, newStatus);

            setStaffs((prev) =>
                prev.map((item) =>
                    item.id === staff.id
                        ? {
                            ...item,
                            isActive: newStatus,
                        }
                        : item
                )
            );
        } catch (error: any) {
            setError(
                error.response?.data?.message ??
                "Không thể thay đổi trạng thái nhân viên."
            );
        }
    };

    useEffect(() => {
        fetchStaffs();
    }, []);

    return {
        staffs,
        search,
        setSearch,

        loading,
        submitting,
        error,

        showModal,
        editingStaff,

        form,
        setForm,
        formError,

        handleSearch,
        handleChange,

        handleCreate,
        handleEdit,
        handleCloseModal,
        handleSubmit,

        handleChangeStatus,
    };
}