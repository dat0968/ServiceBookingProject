using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Repositories.UserRepo
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync(string? search, int page, int pageSize);
        Task<int> CountAsync(string? search);
        Task<User?> GetByIdAsync(int id, bool withAsNoTracking = true);
        Task<User?> GetByEmailAsync(string email);
        Task<bool> ExistsEmailAsync(string email, int? excludeId = null);
        Task<bool> HasBookingsAsync(int userId);
        Task<User> CreateAsync(User user);
        Task UpdateAsync(User user);
    }
}
