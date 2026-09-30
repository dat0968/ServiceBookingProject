export interface StaffResponse {
    id: number;
    fullName: string;
    email: string;
    isActive: boolean;
}
export interface StaffRequest {
    fullName: string;
    email: string;
    isActive: boolean;
}