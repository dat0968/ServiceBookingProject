import api from "./api";
import { ServiceResponse, ServiceRequest, ServiceQuery } from "@/types/service";
export const getService = async (data: ServiceQuery): Promise<ServiceResponse> => {
    const response = await api.get<ServiceResponse>(`/MyService`, {
        params: {
            Search: data.search,
            Page: data.page,
            PageSize: data.pageSize
        }
    })
    return response.data;
}
export const createService = async (data: ServiceRequest): Promise<ServiceResponse> => {
    const response = await api.post<ServiceResponse>(`/MyService`, data)
    return response.data;
}
export const updateService = async (id: number, data: ServiceRequest): Promise<ServiceResponse> => {
    const response = await api.put<ServiceResponse>(`/MyService/${id}`, data)
    return response.data;
}

export const updateServiceStatus = async (id: number, isActive: boolean): Promise<void> => {
    await api.patch(`/MyService/${id}/status`, null, {
        params: {
            isActive: isActive,
        },
    });
};