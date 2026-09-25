using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Repositories.EmployeeRepo
{
    public interface IEmployeeRepository
    {
        Task<List<Staff>> GetAllAsync();
        Task<Staff?> GetByIdAsync(int Id);
        Task<Staff> CreateAsync(Staff staff);
        Task<bool> UpdateAsync(Staff staff);
        Task<bool> ChangeStatusAsync(int Id, bool isActive);
    }
}
