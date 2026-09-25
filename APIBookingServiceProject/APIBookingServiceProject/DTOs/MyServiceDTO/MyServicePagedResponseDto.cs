namespace APIBookingServiceProject.DTOs.MyServiceDTO
{
    public class MyServicePagedResponseDto
    {
        public List<MyServiceResponseDto> Data { get; set; } = new();

        public int Page { get; set; }

        public int PageSize { get; set; }

        public int TotalItems { get; set; }

        public int TotalPages { get; set; }
    }
}
