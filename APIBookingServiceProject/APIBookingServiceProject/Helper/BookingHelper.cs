using APIBookingServiceProject.DTOs.BookingDTO;
using APIBookingServiceProject.Exceptions;
using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Helper
{
    public static class BookingHelper
    {
        public const string Pending = "Pending";
        public const string Confirmed = "Confirmed";
        public const string Completed = "Completed";
        public const string Cancelled = "Cancelled";

        public static readonly string[] ActiveStatuses = { Pending, Confirmed, Completed };
        public static readonly string[] AdminUpdateStatuses = { Confirmed, Completed };

        public static BookingResponseDto MapToResponseDto(Booking booking)
        {
            if (booking == null)
            {
                throw new NotFoundException("Booking not found");
            }

            return new BookingResponseDto
            {
                Id = booking.Id,
                BookingCode = booking.BookingCode,
                CustomerId = booking.CustomerId,
                CustomerName = booking.Customer?.FullName ?? string.Empty,
                CustomerEmail = booking.Customer?.Email ?? string.Empty,
                ServiceId = booking.ServiceId,
                ServiceName = booking.Service?.NameService ?? string.Empty,
                StaffId = booking.StaffId,
                StaffName = booking.Staff?.FullName ?? string.Empty,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                StatusBooking = booking.StatusBooking,
                CustomerNote = booking.CustomerNote,
                CancellationReason = booking.CancellationReason,
                CreatedAt = booking.CreatedAt
            };
        }

        public static void ValidateCreate(BookingRequestDto dto)
        {
            if (dto.ServiceId <= 0)
            {
                throw new BadRequestException("ServiceId không hợp lệ.");
            }

            if (dto.StaffId <= 0)
            {
                throw new BadRequestException("StaffId không hợp lệ.");
            }

            if (dto.StartTime == default)
            {
                throw new BadRequestException("Thời gian bắt đầu là bắt buộc.");
            }
        }

        public static void ValidateCancelReason(string? reason)
        {
            if (string.IsNullOrWhiteSpace(reason))
            {
                throw new BadRequestException("Khi hủy booking phải nhập lý do.");
            }
        }

        public static bool IsOverlap(DateTime newStart, DateTime newEnd, DateTime existingStart, DateTime existingEnd)
        {
            return newStart < existingEnd && newEnd > existingStart;
        }

        public static bool IsWithinWorkSchedule(DateTime startTime, DateTime endTime, WorkSchedule schedule)
        {
            var workDate = DateOnly.FromDateTime(startTime);
            if (schedule.WorkDate != workDate)
            {
                return false;
            }

            var start = TimeOnly.FromDateTime(startTime);
            var end = TimeOnly.FromDateTime(endTime);
            return start >= schedule.StartTime && end <= schedule.EndTime;
        }

        public static string GenerateBookingCode()
        {
            return $"BK{DateTime.Now:yyyyMMddHHmmss}{Random.Shared.Next(10, 99)}";
        }
    }
}
