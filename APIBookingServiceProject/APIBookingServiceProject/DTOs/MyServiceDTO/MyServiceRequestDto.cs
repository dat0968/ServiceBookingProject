using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.DTOs.MyServiceDTO
{
    public class MyServiceRequestDto
    {

        public string NameService { get; set; } = null!;

        public string? DescriptionService { get; set; }

        public int DurationMinutes { get; set; }

        public decimal Price { get; set; }
    }
}
