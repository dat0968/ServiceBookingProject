using APIBookingServiceProject.DTOs.EmployeeDTO;
using APIBookingServiceProject.DTOs.WorkScheduleDTO;
using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Services.WorkScheduleManager
{
    public interface IWorkScheduleManager
    {
        Task<List<WorkScheduleResponseDto>> GetAllAsync();
        /*
          <param name="withAsNoTracking">
          <c>true</c> (default) for read-only queries to bypass change tracking and optimize performance; 
          <c>false</c> if the entity will be modified and saved back to the database using SaveChangesAsync().
         */
        Task<WorkScheduleResponseDto?> GetByIdAsync(int Id, bool withAsNoTracking = true);
        Task<WorkScheduleResponseDto> CreateAsync(WorkScheduleRequestDto workScheduleRequestDto);
        Task<WorkScheduleResponseDto> UpdateAsync(int Id, WorkScheduleRequestDto workScheduleRequestDto);
        Task DeleteAsync(int id);
    }
}
