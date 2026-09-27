using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Repositories.WorkScheduleRepo
{
    public interface IWorkScheduleRepository
    {
        Task<List<WorkSchedule>> GetAllAsync();
        /*
          <param name="withAsNoTracking">
          <c>true</c> (default) for read-only queries to bypass change tracking and optimize performance; 
          <c>false</c> if the entity will be modified and saved back to the database using SaveChangesAsync().
         */
        Task<WorkSchedule?> GetByIdAsync(int Id, bool withAsNoTracking = true);
        Task<WorkSchedule> CreateAsync(WorkSchedule staff);
        Task UpdateAsync(WorkSchedule staff);
        Task DeleteAsync(int id);
        Task<bool> IsOverlappingAsync(int staffId, DateOnly workDate,TimeOnly startTime, 
            TimeOnly endTime,int? excludeId = null);
    }
}
