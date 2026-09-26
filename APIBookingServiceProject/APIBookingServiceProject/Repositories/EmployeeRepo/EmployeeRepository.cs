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

        public async Task<Staff?> GetByIdAsync(int Id, bool withAsNoTracking = true)
        {
            if(withAsNoTracking)
            {
                return await dbContext.Staffs.AsNoTracking().FirstOrDefaultAsync(s => s.Id == Id);
            }
            return await dbContext.Staffs.FirstOrDefaultAsync(s => s.Id == Id);
        }

        public async Task UpdateAsync(Staff staff)
        {
            dbContext.Staffs.Update(staff);
            await dbContext.SaveChangesAsync();
        }
    }
}
