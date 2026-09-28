using APIBookingServiceProject.Data;
using APIBookingServiceProject.Models;
using Microsoft.EntityFrameworkCore;

namespace APIBookingServiceProject.Repositories.UserRepo
{
    public class UserRepository : IUserRepository
    {
        private readonly ServiceBookingDbContext dbContext;

        public UserRepository(ServiceBookingDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<User>> GetAllAsync(string? search, int page, int pageSize)
        {
            var query = BuildSearchQuery(search);
            return await query
                .OrderBy(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountAsync(string? search)
        {
            return await BuildSearchQuery(search).CountAsync();
        }

        public async Task<User?> GetByIdAsync(int id, bool withAsNoTracking = true)
        {
            var query = dbContext.Users.AsQueryable();
            if (withAsNoTracking)
            {
                query = query.AsNoTracking();
            }

            return await query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await dbContext.Users.FirstOrDefaultAsync(x => x.Email == email.Trim());
        }

        public async Task<bool> ExistsEmailAsync(string email, int? excludeId = null)
        {
            var query = dbContext.Users.AsNoTracking().Where(x => x.Email == email);
            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<bool> HasBookingsAsync(int userId)
        {
            return await dbContext.Bookings.AsNoTracking().AnyAsync(x => x.CustomerId == userId);
        }

        public async Task<User> CreateAsync(User user)
        {
            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();
            return user;
        }

        public async Task UpdateAsync(User user)
        {
            dbContext.Users.Update(user);
            await dbContext.SaveChangesAsync();
        }
        private IQueryable<User> BuildSearchQuery(string? search)
        {
            var query = dbContext.Users.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();
                query = query.Where(x =>
                    x.Email.Contains(search) || x.FullName.Contains(search));
            }

            return query;
        }
    }
}
