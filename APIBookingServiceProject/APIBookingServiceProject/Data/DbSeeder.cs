using APIBookingServiceProject.Data;
using APIBookingServiceProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace APIBookingServiceProject.Data
{
    public static class DbSeeder
    {
        public static async Task SeedUsersAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ServiceBookingDbContext>();
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

            if (await dbContext.Users.AnyAsync())
            {
                return;
            }

            var users = new List<User>
            {
                CreateUser(passwordHasher, "admin@demo.com", "Admin Demo", "Admin", "Admin@123"),
                CreateUser(passwordHasher, "customer1@demo.com", "Customer One", "Customer", "Customer@123"),
                CreateUser(passwordHasher, "customer2@demo.com", "Customer Two", "Customer", "Customer@123")
            };

            await dbContext.Users.AddRangeAsync(users);
            await dbContext.SaveChangesAsync();
        }

        private static User CreateUser(
            IPasswordHasher<User> passwordHasher,
            string email,
            string fullName,
            string role,
            string password)
        {
            var user = new User
            {
                Email = email,
                FullName = fullName,
                Role = role,
                CreatedAt = DateTime.UtcNow
            };
            user.PasswordHash = passwordHasher.HashPassword(user, password);
            return user;
        }
    }
}
