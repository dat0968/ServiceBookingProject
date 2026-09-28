namespace APIBookingServiceProject.DTOs.BookingDTO
{
    public class BookingRequestDto
    {
        public int? CustomerId { get; set; }
        public int ServiceId { get; set; }
        public int StaffId { get; set; }
        public DateTime StartTime { get; set; }
        public string? CustomerNote { get; set; }
    }
}
