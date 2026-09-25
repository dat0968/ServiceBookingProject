using APIBookingServiceProject.DTOs.EmployeeDTO;
using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Services.Empolyee
{
    public interface IEmployeeManager
    {
        Task<List<EmployeeResponseDto>> GetAllAsync();
        Task<EmployeeResponseDto?> GetByIdAsync(int Id);
        Task<EmployeeResponseDto> CreateAsync(EmployeeRequestDto staff);
        Task<EmployeeResponseDto?> UpdateAsync(int Id, EmployeeRequestDto employeeRequestDto);
        Task<bool> ChangeStatusAsync(int Id, bool isActive);
    }
}
