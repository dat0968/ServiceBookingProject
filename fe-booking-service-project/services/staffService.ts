import api from './api'
import { StaffResponse } from '@/types/staff'
export const getStaff = async (search?: string | null) : Promise<StaffResponse[]> => {
    const response = await api.get<StaffResponse[]>(`/Staff`, {
        params: {
            search: search
        }
    })
    return response.data;
}