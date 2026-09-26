using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Repositories.Service
{
    public interface IMyServiceRepository
    {
        Task<List<MyService>> GetAllAsync(string? search, int page, int pageSize);
        /*
          <param name="withAsNoTracking">
          <c>true</c> (default) for read-only queries to bypass change tracking and optimize performance; 
          <c>false</c> if the entity will be modified and saved back to the database using SaveChangesAsync().
         */
        Task<MyService?> GetByIdAsync(int id, bool withAsNoTracking = true); 
        Task<int> CountAsync(string? search);
        Task<MyService> CreateAsync(MyService myService);
        Task UpdateAsync(MyService myService); 
    }
}
