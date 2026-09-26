using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Repositories.EmployeeRepo
{
    public interface IEmployeeRepository
    {
        Task<List<Staff>> GetAllAsync();
        /*
          <param name="withAsNoTracking">
          <c>true</c> (default) for read-only queries to bypass change tracking and optimize performance; 
          <c>false</c> if the entity will be modified and saved back to the database using SaveChangesAsync().
         */
        Task<Staff?> GetByIdAsync(int Id, bool withAsNoTracking = true);
        Task<Staff> CreateAsync(Staff staff);
        Task UpdateAsync(Staff staff);
    }
}
