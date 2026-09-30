export interface WorkScheduleResponse{
    id: number;
    staffId: number;
    staffName: string;
    workDate: string;
    startTime: string;
    endTime: string;
}
export interface WorkScheduleRequest{
    staffId: number;
    workDate: string;
    startTime: string;
    endTime: string;
}
