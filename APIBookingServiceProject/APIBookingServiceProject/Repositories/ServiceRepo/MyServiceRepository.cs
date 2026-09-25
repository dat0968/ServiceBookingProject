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
        public async Task<MyService?> GetByIdAsync(int id, bool withAsNoTracking = true){
            if (withAsNoTracking)
            {
                return await dbContext.MyServices.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            }
            return await dbContext.MyServices.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task UpdateAsync(MyService myService)
        {
            dbContext.MyServices.Update(myService);
            await dbContext.SaveChangesAsync();
        }
    }
}
