namespace APIBookingServiceProject.DTOs.BookingDTO
{
    public class BookingPagedResponseDto
    {
        public List<BookingResponseDto> Data { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
