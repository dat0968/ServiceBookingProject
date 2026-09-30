namespace APIBookingServiceProject.DTOs.BookingDTO
{
    public class UpdateBookingStatusDto
    {
        public int? staffId { get; set; }
        public string Status { get; set; } = null!;
    }
}
