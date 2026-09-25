using APIBookingServiceProject.Data;
using APIBookingServiceProject.Models;
using Microsoft.EntityFrameworkCore;

namespace APIBookingServiceProject.Repositories.EmployeeRepo
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private ServiceBookingDbContext dbContext;
        public EmployeeRepository(ServiceBookingDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<bool> ChangeStatusAsync(int Id, bool isActive)
        {
            var findStaff = await dbContext.Staffs.FirstOrDefaultAsync(s => s.Id == Id);
            if (findStaff == null) return false;
            findStaff.IsActive = isActive;
            var result = await dbContext.SaveChangesAsync();
            return result > 0;
        }

        public async Task<Staff> CreateAsync(Staff staff)
        {
            dbContext.Staffs.Add(staff);
            await dbContext.SaveChangesAsync();
            return staff;
        }

        public async Task<List<Staff>> GetAllAsync()
        {
            return await dbContext.Staffs.AsNoTracking().ToListAsync();
        }

        public async Task<Staff?> GetByIdAsync(int Id)
        {
            return await dbContext.Staffs.AsNoTracking().FirstOrDefaultAsync(s => s.Id == Id);
        }

        public async Task<bool> UpdateAsync(Staff staff)
        {
            dbContext.Staffs.Update(staff);
            var result = await dbContext.SaveChangesAsync();
            return result > 0;
        }
    }
}
