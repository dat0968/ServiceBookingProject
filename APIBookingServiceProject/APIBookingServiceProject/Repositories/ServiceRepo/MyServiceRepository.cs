using APIBookingServiceProject.Data;
using APIBookingServiceProject.Models;
using Microsoft.EntityFrameworkCore;

namespace APIBookingServiceProject.Repositories.Service
{
    public class MyServiceRepository : IMyServiceRepository
    {
        private ServiceBookingDbContext dbContext;
        public MyServiceRepository(ServiceBookingDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<MyService> CreateAsync(MyService myService)
        {
            dbContext.MyServices.Add(myService);
            await dbContext.SaveChangesAsync();
            return myService;
        }

        public async Task<bool> ChangeStatusAsync(int id, bool isActive)
        {
            var myService = await dbContext.MyServices.FirstOrDefaultAsync(s => s.Id == id);
            if (myService == null)
            {
                return false;
            }
            myService.IsActive = isActive;
            var result = await dbContext.SaveChangesAsync();
            return result > 0;
        }
       
        public async Task<List<MyService>> GetAllAsync(string? search, int page, int pageSize)
        {
            var query = dbContext.MyServices.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();
                query = query.Where(x =>
                    x.NameService.Contains(search));
            }
            return await query
            .OrderBy(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        }
        public async Task<int> CountAsync(string? search)
        {
            var query = dbContext.MyServices
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();

                query = query.Where(x =>
                    x.NameService.Contains(search));
            }

            return await query.CountAsync();
        }
        public async Task<MyService?> GetByIdAsync(int id){
            return await dbContext.MyServices.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<bool> UpdateAsync(MyService myService)
        {
            dbContext.MyServices.Update(myService);
            var result = await dbContext.SaveChangesAsync();
            return result > 0;
        }
    }
}
