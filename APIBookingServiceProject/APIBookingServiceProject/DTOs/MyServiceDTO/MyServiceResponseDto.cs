using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.DTOs.MyServiceDTO
{
    public class MyServiceResponseDto
    {
        public int Id { get; set; }

        public string? NameService { get; set; }

        public string? DescriptionService { get; set; }

        public int DurationMinutes { get; set; }

        public decimal Price { get; set; }

        public bool IsActive { get; set; }
    }
}
