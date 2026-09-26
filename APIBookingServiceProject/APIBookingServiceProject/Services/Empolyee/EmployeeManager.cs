using APIBookingServiceProject.DTOs.EmployeeDTO;
using APIBookingServiceProject.DTOs.MyServiceDTO;
using APIBookingServiceProject.Exceptions;
using APIBookingServiceProject.Helper;
using APIBookingServiceProject.Models;
using APIBookingServiceProject.Repositories.EmployeeRepo;
using APIBookingServiceProject.Repositories.Service;

namespace APIBookingServiceProject.Services.Empolyee
{
    public class EmployeeManager : IEmployeeManager
    {
        private IEmployeeRepository employeeRepository;
        public EmployeeManager(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }
        public async Task<bool> ChangeStatusAsync(int Id, bool isActive)
        {
            var employee = await employeeRepository.GetByIdAsync(Id, false);
            if(employee == null)
            {
                throw new NotFoundException($"Staff with id {Id} not found");
            }
            employee.IsActive = isActive;
            await employeeRepository.UpdateAsync(employee);
            return true;
        }

        public async Task<EmployeeResponseDto> CreateAsync(EmployeeRequestDto staff)
        {
            StaffHelper.ValidateStaff(staff);
            var myStaff = new Staff
            {
                FullName = staff.FullName.Trim(),
                Email = staff.Email.Trim(),
                IsActive = true,
            };
            var createdStaff = await employeeRepository.CreateAsync(myStaff);
            return StaffHelper.MapToResponseDto(myStaff);
        }

        public async Task<List<EmployeeResponseDto>> GetAllAsync()
        {
            var listStaff = await employeeRepository.GetAllAsync();
            return listStaff.Select(s => StaffHelper.MapToResponseDto(s)).ToList();
        }

        public async Task<EmployeeResponseDto?> GetByIdAsync(int Id)
        {
            var staff = await employeeRepository.GetByIdAsync(Id);
            if (staff == null)
            {
                throw new NotFoundException($"Staff with id {Id} not found");
            }
            return StaffHelper.MapToResponseDto(staff);
        }

        public async Task<EmployeeResponseDto?> UpdateAsync(int Id, EmployeeRequestDto employeeRequestDto)
        {
            StaffHelper.ValidateStaff(employeeRequestDto);
            var staff = await employeeRepository.GetByIdAsync(Id);
            if (staff == null)
            {
                throw new NotFoundException($"Staff with id {Id} not found");
            }
            staff.FullName = employeeRequestDto.FullName.Trim();
            staff.Email = employeeRequestDto.Email;
            staff.IsActive = staff.IsActive;
            await employeeRepository.UpdateAsync(staff);
            return StaffHelper.MapToResponseDto(staff);
        }
    }
}
