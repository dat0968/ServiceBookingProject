using APIBookingServiceProject.DTOs.WorkScheduleDTO;
using APIBookingServiceProject.Exceptions;
using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Helper
{
    public class WorkScheduleHelper
    {
        public static WorkScheduleResponseDto MapToResponseDto(WorkSchedule workSchedule)
        {
            if (workSchedule == null)
            {
                throw new NotFoundException("WorkSchedule not found");
            }
            return new WorkScheduleResponseDto
            {
                Id = workSchedule.Id,
                StaffId = workSchedule.StaffId,
                StaffName = $"{workSchedule.Staff.FullName} - ID: {workSchedule.StaffId}",
                WorkDate = workSchedule.WorkDate,
                StartTime = workSchedule.StartTime,
                EndTime = workSchedule.EndTime,
            };
        }
        public static void ValidateWorkSchedule(TimeOnly startTime, TimeOnly endTime)
        {
            if (startTime >= endTime)
            {
                throw new BadRequestException("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
            }
        }
    }
}
