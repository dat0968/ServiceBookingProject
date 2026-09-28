import api from "./api";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`/auth/login`, data)
    return response.data;
}
export const logout = async (): Promise<void> => {
    await api.post("/auth/logout");
} 
export const validateToken = async (token: String) : Promise<boolean> => {
    const response = await api.get(`/auth/validate`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response.status == 200;
}