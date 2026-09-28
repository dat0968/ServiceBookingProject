namespace APIBookingServiceProject.DTOs.BookingDTO
{
    public class BookingResponseDto
    {
        public int Id { get; set; }
        public string BookingCode { get; set; } = null!;
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = null!;
        public int StaffId { get; set; }
        public string StaffName { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string StatusBooking { get; set; } = null!;
        public string? CustomerNote { get; set; }
        public string? CancellationReason { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
