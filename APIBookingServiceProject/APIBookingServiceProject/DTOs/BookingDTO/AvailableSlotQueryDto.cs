namespace APIBookingServiceProject.DTOs.BookingDTO
{
    public class AvailableSlotQueryDto
    {
        public int StaffId { get; set; }
        public int ServiceId { get; set; }
        public DateOnly Date { get; set; }
    }
}
