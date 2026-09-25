using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Repositories.Service
{
    public interface IMyServiceRepository
    {
        Task<List<MyService>> GetAllAsync(string? search, int page, int pageSize);
        Task<MyService?> GetByIdAsync(int id, bool withAsNoTracking = true); 
        Task<int> CountAsync(string? search);
        Task<MyService> CreateAsync(MyService myService);
        Task UpdateAsync(MyService myService); 
    }
}
