using APIBookingServiceProject.Data;
using APIBookingServiceProject.Models;
using Microsoft.EntityFrameworkCore;

namespace APIBookingServiceProject.Repositories.WorkScheduleRepo
{
    public class WorkScheduleRepository : IWorkScheduleRepository
    {
        private readonly ServiceBookingDbContext dbContext;

        public WorkScheduleRepository(
            ServiceBookingDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<WorkSchedule> CreateAsync(WorkSchedule workSchedule)
        {
            await dbContext.WorkSchedules.AddAsync(workSchedule);
            await dbContext.SaveChangesAsync();
            return workSchedule;
        }

        public async Task DeleteAsync(int id)
        {
            var workSchedule = await dbContext.WorkSchedules.FirstOrDefaultAsync(x => x.Id == id);

            if (workSchedule != null)
            {
                dbContext.WorkSchedules.Remove(workSchedule);
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task<List<WorkSchedule>> GetAllAsync()
        {
            return await dbContext.WorkSchedules.Include(x => x.Staff).AsNoTracking().OrderBy(x => x.Id).ToListAsync();
        }

        public async Task<WorkSchedule?> GetByIdAsync(int id, bool withAsNoTracking = true)
        {
            var query = dbContext.WorkSchedules.Include(x => x.Staff).AsQueryable();

            if (withAsNoTracking)
            {
                query = query.AsNoTracking();
            }

            return await query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> IsOverlappingAsync(int staffId, DateOnly workDate, TimeOnly startTime, TimeOnly endTime, int? excludeId = null)
        {
            var query = dbContext.WorkSchedules.Where(x => x.StaffId == staffId && x.WorkDate == workDate && startTime < x.EndTime && endTime > x.StartTime);
            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }
            return await query.AnyAsync();
        }

        public async Task UpdateAsync( WorkSchedule workSchedule)
        {
            dbContext.WorkSchedules.Update(workSchedule);
            await dbContext.SaveChangesAsync();
        }

        public async Task<List<WorkSchedule>> GetByStaffAndDateAsync(int staffId, DateOnly workDate)
        {
            return await dbContext.WorkSchedules
                .AsNoTracking()
                .Where(x => x.StaffId == staffId && x.WorkDate == workDate)
                .OrderBy(x => x.StartTime)
                .ToListAsync();
        }
    }
}