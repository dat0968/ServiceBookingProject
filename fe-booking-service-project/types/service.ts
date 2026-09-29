export interface Service {
    id: number;
    nameService: string;
    descriptionService: string;
    durationMinutes: number;
    price: number;
    isActive: boolean
}
export interface ServiceResponse {
    data: Service[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
export interface ServiceRequest {
    nameService: string;
    descriptionService: string;
    durationMinutes: number;
    price: number;
    isActive: boolean
}
export interface ServiceQuery {
    search: string;
    page: number;
    pageSize: number
}