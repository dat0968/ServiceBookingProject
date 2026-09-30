import { createWorkSchedule, updateWorkSchedule, getWorkSchedule, deleteWorkSchedule } from "@/services/workScheduleService";
import { useState, useEffect } from "react";
import type { WorkScheduleRequest, WorkScheduleResponse } from "@/types/workSchedule";
import { getStaff } from "@/services/staffService";
import { StaffResponse } from "@/types/staff";
export default function useWorkScheduleAdmin() {
    const initialForm: WorkScheduleRequest = {
        staffId: 0,
        workDate: "",
        startTime: "08:00",
        endTime: "12:00",
    };
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "danger",
    }); 

    const [schedules, setSchedules] = useState<WorkScheduleResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [staffs, setStaffs] = useState<StaffResponse[]>([]);
    const [staffsLoading, setStaffsLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState<WorkScheduleRequest>(initialForm);

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getWorkSchedule();
            setSchedules(response);
        } catch {
            setError("Không thể tải danh sách lịch làm việc.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleAdd = () => {
        setIsEditing(false);
        setEditingId(null);
        setForm({ ...initialForm });
        setFormError("");
        setShowModal(true);
    };

    const handleEdit = (schedule: WorkScheduleResponse) => {
        setIsEditing(true);
        setEditingId(schedule.id);

        setForm({
            staffId: schedule.staffId,
            workDate: schedule.workDate,
            startTime: schedule.startTime.slice(0, 5),
        endTime: schedule.endTime.slice(0, 5),
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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "staffId" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setFormError("");

        if (!form.staffId || form.staffId <= 0) {
            setFormError("Vui lòng chọn nhân viên.");
            return;
        }

        if (!form.workDate) {
            setFormError("Vui lòng chọn ngày làm.");
            return;
        }

        if (form.startTime >= form.endTime) {
            setFormError(
                "Giờ bắt đầu phải nhỏ hơn giờ kết thúc."
            );
            return;
        }

        try {
            setSubmitting(true);

            const request: WorkScheduleRequest = {
                staffId: form.staffId,
                workDate: form.workDate,
                startTime: `${form.startTime}:00`,
                endTime: `${form.endTime}:00`,
            };

            if (isEditing && editingId !== null) {
                await updateWorkSchedule(
                    editingId,
                    request
                );
                console.log(request);
            } else {
                await createWorkSchedule(request);
            }
            setShowModal(false);
            setToast({
                show: true,
                message: "Cập nhật thành công",
                type: "success",
            });
            await fetchSchedules();
        } catch (error: any) {
            setFormError(error.response.data.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa lịch làm việc này không?"
        );

        if (!isConfirmed) return;

        try {
            await deleteWorkSchedule(id);
            await fetchSchedules();
        } catch {
            setError("Không thể xóa lịch làm việc. Vui lòng thử lại.");
        }
    };

    const fetchStaffs = async () => {
        try {
            setStaffsLoading(true);

            const response = await getStaff(null);
            setStaffs(response);
        } catch {
            setError("Không thể tải danh sách nhân viên.");
        } finally {
            setStaffsLoading(false);
        }
    };
    useEffect(() => {
        fetchSchedules();
        fetchStaffs();
    }, []);

    return {
        schedules,
        loading,
        error,
        fetchSchedules,

        staffs,
        staffsLoading,
        fetchStaffs,

        showModal,
        isEditing,
        editingId,
        form,
        submitting,
        formError,

        handleAdd,
        handleEdit,
        handleClose,
        handleChange,
        handleSubmit,
        handleDelete,

        toast,
        setToast
    };
}