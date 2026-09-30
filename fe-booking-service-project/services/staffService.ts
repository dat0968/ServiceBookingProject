import api from './api'
import { StaffResponse, StaffRequest } from '@/types/staff'
export const getStaff = async (search?: string | null): Promise<StaffResponse[]> => {
    const response = await api.get<StaffResponse[]>(`/Staff`, {
        params: {
            search: search
        }
    })
    return response.data;
}

export const createStaff = async (data: StaffRequest): Promise<void> => {
    await api.post("/staff", data);
};

export const changeStatus = async (
    id: number,
    isActive: boolean
): Promise<StaffResponse> => {
    const response = await api.patch<StaffResponse>(`/staff/${id}/status`, {
        params: {
            isActive: isActive
        }
    });
    return response.data
};
export const updateStaff = async (id: number, data: StaffRequest): Promise<StaffResponse> => {
    const response = await api.put<StaffResponse>(`/staff/${id}`, data)
    return response.data
}