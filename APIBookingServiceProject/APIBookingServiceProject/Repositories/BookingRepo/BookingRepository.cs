using APIBookingServiceProject.Data;
using APIBookingServiceProject.Helper;
using APIBookingServiceProject.Models;
using Microsoft.EntityFrameworkCore;

namespace APIBookingServiceProject.Repositories.BookingRepo
{
    public class BookingRepository : IBookingRepository
    {
        private readonly ServiceBookingDbContext dbContext;

        public BookingRepository(ServiceBookingDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Booking> CreateAsync(Booking booking)
        {
            await dbContext.Bookings.AddAsync(booking);
            await dbContext.SaveChangesAsync();
            return booking;
        }

        public async Task UpdateAsync(Booking booking)
        {
            dbContext.Bookings.Update(booking);
            await dbContext.SaveChangesAsync();
        }

        public async Task<Booking?> GetByIdAsync(int id, bool withAsNoTracking = true)
        {
            var query = dbContext.Bookings
                .Include(x => x.Customer)
                .Include(x => x.Service)
                .Include(x => x.Staff)
                .AsQueryable();

            if (withAsNoTracking)
            {
                query = query.AsNoTracking();
            }

            return await query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Booking>> GetPagedAsync(int? customerId, DateOnly? date, string? status, int page,int pageSize)
        {
            var query = BuildFilterQuery(customerId, date, status);
            return await query
                .OrderByDescending(x => x.StartTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountAsync(int? customerId, DateOnly? date, string? status)
        {
            return await BuildFilterQuery(customerId, date, status).CountAsync();
        }

        public async Task<bool> IsOverlappingAsync(
            int staffId,
            DateTime startTime,
            DateTime endTime,
            int? excludeId = null)
        {
            var query = dbContext.Bookings.Where(x =>
                x.StaffId == staffId &&
                x.StatusBooking != BookingHelper.Cancelled &&
                startTime < x.EndTime &&
                endTime > x.StartTime);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<List<Booking>> GetActiveByStaffAndDateAsync(int staffId, DateOnly date)
        {
            var startOfDay = date.ToDateTime(TimeOnly.MinValue);
            var startOfNextDay = date.AddDays(1).ToDateTime(TimeOnly.MinValue);

            return await dbContext.Bookings
                .AsNoTracking()
                .Where(x =>
                    x.StaffId == staffId &&
                    x.StatusBooking != BookingHelper.Cancelled &&
                    x.StartTime >= startOfDay &&
                    x.StartTime < startOfNextDay)
                .ToListAsync();
        }

        public async Task<bool> ExistsBookingCodeAsync(string bookingCode)
        {
            return await dbContext.Bookings.AsNoTracking().AnyAsync(x => x.BookingCode == bookingCode);
        }

        private IQueryable<Booking> BuildFilterQuery(int? customerId, DateOnly? date, string? status)
        {
            var query = dbContext.Bookings
                .Include(x => x.Customer)
                .Include(x => x.Service)
                .Include(x => x.Staff)
                .AsNoTracking()
                .AsQueryable();

            if (customerId.HasValue)
            {
                query = query.Where(x => x.CustomerId == customerId.Value);
            }

            if (date.HasValue)
            {
                var startOfDay = date.Value.ToDateTime(TimeOnly.MinValue);
                var startOfNextDay = date.Value.AddDays(1).ToDateTime(TimeOnly.MinValue);
                query = query.Where(x => x.StartTime >= startOfDay && x.StartTime < startOfNextDay);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(x => x.StatusBooking == status.Trim());
            }

            return query;
        }
    }
}
