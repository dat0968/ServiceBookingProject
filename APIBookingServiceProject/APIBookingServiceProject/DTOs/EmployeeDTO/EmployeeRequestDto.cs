using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.DTOs.EmployeeDTO
{
    public class EmployeeRequestDto
    {
        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public bool IsActive { get; set; }
    }
}
