import api from "./api";
import { WorkScheduleResponse, WorkScheduleRequest } from "@/types/workSchedule";
export const getWorkSchedule = async () : Promise<WorkScheduleResponse[]> => {
    const response = await api.get<WorkScheduleResponse[]>(`/WorkSchedule`)
    return response.data
}
export const createWorkSchedule = async (data : WorkScheduleRequest) : Promise<WorkScheduleResponse> => {
    const response = await api.post<WorkScheduleResponse>(`/WorkSchedule`, data);
    return response.data
}
export const updateWorkSchedule = async  (id: number, data : WorkScheduleRequest) : Promise<WorkScheduleResponse> => {
    const response = await api.put<WorkScheduleResponse>(`/WorkSchedule/${id}`, data);
    return response.data
}
export const deleteWorkSchedule = async (id: number) : Promise<void> => {
    await api.delete<void>(`/WorkSchedule/${id}`);
}