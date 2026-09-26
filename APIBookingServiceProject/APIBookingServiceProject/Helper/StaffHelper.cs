using APIBookingServiceProject.DTOs.EmployeeDTO;
using APIBookingServiceProject.DTOs.MyServiceDTO;
using APIBookingServiceProject.Exceptions;
using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Helper
{
    public class StaffHelper
    {
        public static EmployeeResponseDto MapToResponseDto(Staff staff)
        {
            if (staff == null)
            {
                throw new NotFoundException("Staff not found");
            }
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
                throw new BadRequestException(
                    "Tên nhân viên là bắt buộc.");
            }
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new BadRequestException(
                    "Email là bắt buộc.");
            }
        }
    }
}
