namespace APIBookingServiceProject.DTOs.BookingDTO
{
    public class BookingQueryDto
    {
        public DateOnly? Date { get; set; }
        public string? Status { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
