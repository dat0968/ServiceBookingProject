using APIBookingServiceProject.DTOs.BookingDTO;
using APIBookingServiceProject.DTOs.EmployeeDTO;
using APIBookingServiceProject.Exceptions;
using APIBookingServiceProject.Helper;
using APIBookingServiceProject.Models;
using APIBookingServiceProject.Repositories.BookingRepo;
using APIBookingServiceProject.Repositories.EmployeeRepo;
using APIBookingServiceProject.Repositories.Service;
using APIBookingServiceProject.Repositories.UserRepo;
using APIBookingServiceProject.Repositories.WorkScheduleRepo;

namespace APIBookingServiceProject.Services.BookingManager
{
    public class BookingManager : IBookingManager
    {
        private readonly IBookingRepository bookingRepository;
        private readonly IMyServiceRepository myServiceRepository;
        private readonly IEmployeeRepository employeeRepository;
        private readonly IWorkScheduleRepository workScheduleRepository;
        private readonly IUserRepository userRepository;

        public BookingManager(
            IBookingRepository bookingRepository,
            IMyServiceRepository myServiceRepository,
            IEmployeeRepository employeeRepository,
            IWorkScheduleRepository workScheduleRepository,
            IUserRepository userRepository)
        {
            this.bookingRepository = bookingRepository;
            this.myServiceRepository = myServiceRepository;
            this.employeeRepository = employeeRepository;
            this.workScheduleRepository = workScheduleRepository;
            this.userRepository = userRepository;
        }

        public async Task<BookingResponseDto> CreateAsync(BookingRequestDto dto, int currentUserId, string currentRole)
        {
            BookingHelper.ValidateCreate(dto);
            var customerId = ResolveCustomerId(dto, currentUserId, currentRole);
            var customer = await userRepository.GetByIdAsync(customerId);
            if (customer == null)
            {
                throw new NotFoundException($"Customer with id {customerId} not found");
            }

            var service = await myServiceRepository.GetByIdAsync(dto.ServiceId);
            if (service == null)
            {
                throw new NotFoundException($"MyService with id {dto.ServiceId} not found");
            }

            if (!service.IsActive)
            {
                throw new BadRequestException("Không được đặt dịch vụ đang bị khóa.");
            }

            var startTime = dto.StartTime;
            var endTime = startTime.AddMinutes(service.DurationMinutes);

            if (startTime < DateTime.Now)
            {
                throw new BadRequestException("Không đặt lịch trong quá khứ.");
            }

            var booking = new Booking
            {
                BookingCode = await GenerateUniqueBookingCodeAsync(),
                CustomerId = customerId,
                ServiceId = dto.ServiceId,
                StaffId = null,
                StartTime = startTime,
                EndTime = endTime,
                StatusBooking = BookingHelper.Pending,
                CustomerNote = string.IsNullOrWhiteSpace(dto.CustomerNote)
                    ? null
                    : dto.CustomerNote.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await bookingRepository.CreateAsync(booking);
            var created = await bookingRepository.GetByIdAsync(booking.Id);
            return BookingHelper.MapToResponseDto(created!);
        }

        public async Task<BookingPagedResponseDto> GetMyBookingsAsync(int customerId, BookingQueryDto query)
        {
            NormalizeQuery(query);
            return await GetPagedInternalAsync(customerId, query);
        }

        public async Task<BookingPagedResponseDto> GetAllAsync(BookingQueryDto query)
        {
            NormalizeQuery(query);
            return await GetPagedInternalAsync(null, query);
        }

        public async Task<BookingResponseDto> GetByIdAsync(int id, int currentUserId, string currentRole)
        {
            var booking = await bookingRepository.GetByIdAsync(id);
            if (booking == null)
            {
                throw new NotFoundException($"Booking with id {id} not found");
            }

            EnsureCanView(booking, currentUserId, currentRole);
            return BookingHelper.MapToResponseDto(booking);
        }

        public async Task<List<AvailableSlotResponseDto>> GetAvailableSlotsAsync(AvailableSlotQueryDto query)
        {
            if (query.StaffId <= 0 || query.ServiceId <= 0)
            {
                throw new BadRequestException("StaffId và ServiceId là bắt buộc.");
            }

            var service = await myServiceRepository.GetByIdAsync(query.ServiceId);
            if (service == null)
            {
                throw new NotFoundException($"MyService with id {query.ServiceId} not found");
            }

            if (!service.IsActive)
            {
                throw new BadRequestException("Không được đặt dịch vụ đang bị khóa.");
            }

            var staff = await employeeRepository.GetByIdAsync(query.StaffId);
            if (staff == null)
            {
                throw new NotFoundException($"Staff with id {query.StaffId} not found");
            }

            if (!staff.IsActive)
            {
                throw new BadRequestException("Không đặt lịch với nhân viên bị khóa.");
            }

            var schedules = await workScheduleRepository.GetByStaffAndDateAsync(query.StaffId, query.Date);
            var existingBookings = await bookingRepository.GetActiveByStaffAndDateAsync(query.StaffId, query.Date);
            var now = DateTime.Now;
            var slots = new List<AvailableSlotResponseDto>();

            foreach (var schedule in schedules)
            {
                var cursor = query.Date.ToDateTime(schedule.StartTime);
                var shiftEnd = query.Date.ToDateTime(schedule.EndTime);

                while (cursor.AddMinutes(service.DurationMinutes) <= shiftEnd)
                {
                    var slotStart = cursor;
                    var slotEnd = cursor.AddMinutes(service.DurationMinutes);
                    var isPast = slotStart < now;
                    var isOverlap = existingBookings.Any(b =>
                        BookingHelper.IsOverlap(slotStart, slotEnd, b.StartTime, b.EndTime));

                    if (!isPast && !isOverlap)
                    {
                        slots.Add(new AvailableSlotResponseDto
                        {
                            StartTime = slotStart,
                            EndTime = slotEnd
                        });
                    }

                    cursor = cursor.AddMinutes(service.DurationMinutes);
                }
            }

            return slots;
        }

        public async Task<BookingResponseDto> UpdateStatusAsync(int id, UpdateBookingStatusDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Status) ||
                !BookingHelper.AdminUpdateStatuses.Contains(dto.Status.Trim(), StringComparer.OrdinalIgnoreCase))
            {
                throw new BadRequestException("Trạng thái hợp lệ khi cập nhật là Confirmed hoặc Completed.");
            }

            var booking = await bookingRepository.GetByIdAsync(id, false);
            if (booking == null)
            {
                throw new NotFoundException($"Booking with id {id} not found");
            }

            if (booking.StatusBooking == BookingHelper.Cancelled)
            {
                throw new BadRequestException("Không thể cập nhật booking đã hủy.");
            }

            var newStatus = dto.Status.Equals(BookingHelper.Completed, StringComparison.OrdinalIgnoreCase)
                ? BookingHelper.Completed
                : BookingHelper.Confirmed;

            if (newStatus == BookingHelper.Confirmed && booking.StatusBooking != BookingHelper.Pending)
            {
                throw new BadRequestException("Chỉ xác nhận được booking đang ở trạng thái Pending.");
            }

            if (newStatus == BookingHelper.Completed &&
                booking.StatusBooking != BookingHelper.Confirmed &&
                booking.StatusBooking != BookingHelper.Pending)
            {
                throw new BadRequestException("Chỉ hoàn thành được booking chưa bị hủy.");
            }
            booking.StaffId = dto.staffId;
            booking.StatusBooking = newStatus;
            await bookingRepository.UpdateAsync(booking);

            var updated = await bookingRepository.GetByIdAsync(id);
            return BookingHelper.MapToResponseDto(updated!);
        }

        public async Task<BookingResponseDto> CancelAsync(int id,CancelBookingRequestDto dto,
            int currentUserId, string currentRole)
        {
            BookingHelper.ValidateCancelReason(dto.CancellationReason);

            var booking = await bookingRepository.GetByIdAsync(id, false);
            if (booking == null)
            {
                throw new NotFoundException($"Booking with id {id} not found");
            }

            if (!IsAdmin(currentRole) && booking.CustomerId != currentUserId)
            {
                throw new ForbiddenException("Customer chỉ được hủy booking của mình.");
            }

            if (booking.StatusBooking == BookingHelper.Cancelled)
            {
                throw new BadRequestException("Booking đã bị hủy.");
            }

            if (booking.StatusBooking == BookingHelper.Completed)
            {
                throw new BadRequestException("Không hủy booking đã hoàn thành.");
            }

            if (booking.StatusBooking == BookingHelper.Confirmed)
            {
                throw new BadRequestException("Không hủy booking đã bắt đầu.");
            }

            booking.StatusBooking = BookingHelper.Cancelled;
            booking.CancellationReason = dto.CancellationReason.Trim();
            await bookingRepository.UpdateAsync(booking);

            var updated = await bookingRepository.GetByIdAsync(id);
            return BookingHelper.MapToResponseDto(updated!);
        }

        private async Task<BookingPagedResponseDto> GetPagedInternalAsync(int? customerId, BookingQueryDto query)
        {
            var bookings = await bookingRepository.GetPagedAsync(customerId,query.Date, query.Status, query.Page, query.PageSize);
            var totalItems = await bookingRepository.CountAsync(customerId, query.Date, query.Status);
            var totalPages = (int)Math.Ceiling((double)totalItems / query.PageSize);

            return new BookingPagedResponseDto
            {
                Data = bookings.Select(BookingHelper.MapToResponseDto).ToList(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };
        }

        private static int ResolveCustomerId(BookingRequestDto dto, int currentUserId, string currentRole)
        {
            if (IsAdmin(currentRole))
            {
                if (!dto.CustomerId.HasValue || dto.CustomerId.Value <= 0)
                {
                    throw new BadRequestException("Admin phải truyền CustomerId khi tạo booking.");
                }

                return dto.CustomerId.Value;
            }

            return currentUserId;
        }

        //private async Task<List<EmployeeResponseDto>> EnsureWithinWorkScheduleAsync(int? staffId, DateTime startTime, DateTime endTime)
        //{
        //    //var workDate = DateOnly.FromDateTime(startTime);
        //    //if (DateOnly.FromDateTime(endTime) != workDate)
        //    //{
        //    //    throw new BadRequestException("Booking phải nằm trong cùng một ngày làm việc.");
        //    //}

        //    var schedules = await workScheduleRepository.GetAllAsync();
        //    var filterScheduleByTime = schedules.Where(s => BookingHelper.IsWithinWorkSchedule(startTime, endTime, s));
            
        //    //if (!isInside)
        //    //{
        //    //    throw new BadRequestException("Booking phải nằm hoàn toàn trong giờ làm việc.");
        //    //}
        //}

        private async Task EnsureNoOverlapAsync(int? staffId, DateTime startTime, DateTime endTime)
        {
            var isOverlapping = await bookingRepository.IsOverlappingAsync(staffId, startTime, endTime);
            if (isOverlapping)
            {
                throw new ConflictException("Khung giờ này đã được đặt. Vui lòng chọn thời gian khác.");
            }
        }

        private async Task<string> GenerateUniqueBookingCodeAsync()
        {
            for (var i = 0; i < 10; i++)
            {
                var code = BookingHelper.GenerateBookingCode();
                if (!await bookingRepository.ExistsBookingCodeAsync(code))
                {
                    return code;
                }
            }

            return $"BK{Guid.NewGuid():N}"[..20];
        }

        private static void EnsureCanView(Booking booking, int currentUserId, string currentRole)
        {
            if (!IsAdmin(currentRole) && booking.CustomerId != currentUserId)
            {
                throw new ForbiddenException("Customer chỉ được xem booking của mình.");
            }
        }

        private static bool IsAdmin(string role)
        {
            return role.Equals("Admin", StringComparison.OrdinalIgnoreCase);
        }

        private static void NormalizeQuery(BookingQueryDto query)
        {
            if (query.Page < 1)
            {
                query.Page = 1;
            }

            if (query.PageSize < 1)
            {
                query.PageSize = 10;
            }
        }

        public async Task<List<EmployeeResponseDto>> GetSuggestedStaffAsync(int bookingId)
        {
            var existingBooking = await bookingRepository.GetByIdAsync(bookingId);
            if(existingBooking == null)
            {
                throw new NotFoundException(
                    $"Booking with id {bookingId} not found."
                );
            }
            var listStaff = await bookingRepository.GetSuggestedStaffAsync(existingBooking);
            return listStaff.Select(staff => StaffHelper.MapToResponseDto(staff)).ToList();
        }
    }
}
