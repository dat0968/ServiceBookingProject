using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Repositories.BookingRepo
{
    public interface IBookingRepository
    {
        Task<Booking> CreateAsync(Booking booking);
        Task UpdateAsync(Booking booking);
        Task<Booking?> GetByIdAsync(int id, bool withAsNoTracking = true);
        Task<List<Booking>> GetPagedAsync(
            int? customerId,
            DateOnly? date,
            string? status,
            int page,
            int pageSize);
        Task<int> CountAsync(int? customerId, DateOnly? date, string? status);
        Task<bool> IsOverlappingAsync(int? staffId, DateTime startTime, DateTime endTime, int? excludeId = null);
        Task<List<Booking>> GetActiveByStaffAndDateAsync(int staffId, DateOnly date);
        Task<bool> ExistsBookingCodeAsync(string bookingCode);
        Task<List<Staff>> GetSuggestedStaffAsync(Booking booking);
        Task<bool> IsCustomerBookingOverlappingAsync(int customerId, DateTime startTime, DateTime endTime);
    }
}
