using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.DTOs.WorkScheduleDTO
{
    public class WorkScheduleRequestDto
    {
        public int StaffId { get; set; }

        public DateOnly WorkDate { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }
    }
}
