using APIBookingServiceProject.DTOs.EmployeeDTO;
using APIBookingServiceProject.DTOs.MyServiceDTO;
using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Helper
{
    public class StaffHelper
    {
        public static EmployeeResponseDto MapToResponseDto(Staff staff)
        {
            return new EmployeeResponseDto
            {
                Id = staff.Id,
                FullName = staff.FullName,
                Email = staff.Email,
                IsActive = staff.IsActive
            };
        }
        public static void ValidateStaff(EmployeeRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
            {
                throw new ArgumentException(
                    "Tên nhân viên là bắt buộc.");
            }
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new ArgumentException(
                    "Email là bắt buộc.");
            }
        }
    }
}
