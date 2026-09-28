using APIBookingServiceProject.DTOs.BookingDTO;

namespace APIBookingServiceProject.Services.BookingManager
{
    public interface IBookingManager
    {
        Task<BookingResponseDto> CreateAsync(BookingRequestDto dto, int currentUserId, string currentRole);
        Task<BookingPagedResponseDto> GetMyBookingsAsync(int customerId, BookingQueryDto query);
        Task<BookingPagedResponseDto> GetAllAsync(BookingQueryDto query);
        Task<BookingResponseDto> GetByIdAsync(int id, int currentUserId, string currentRole);
        Task<List<AvailableSlotResponseDto>> GetAvailableSlotsAsync(AvailableSlotQueryDto query);
        Task<BookingResponseDto> UpdateStatusAsync(int id, UpdateBookingStatusDto dto);
        Task<BookingResponseDto> CancelAsync(int id, CancelBookingRequestDto dto, int currentUserId, string currentRole);
    }
}
