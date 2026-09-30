using APIBookingServiceProject.DTOs.EmployeeDTO;
using APIBookingServiceProject.DTOs.WorkScheduleDTO;
using APIBookingServiceProject.Exceptions;
using APIBookingServiceProject.Helper;
using APIBookingServiceProject.Models;
using APIBookingServiceProject.Repositories.BookingRepo;
using APIBookingServiceProject.Repositories.EmployeeRepo;
using APIBookingServiceProject.Repositories.WorkScheduleRepo;
namespace APIBookingServiceProject.Services.WorkScheduleManager
{
    public class WorkScheduleManager : IWorkScheduleManager
    {
        private readonly IWorkScheduleRepository _workScheduleRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IBookingRepository _bookingRepository;
        public WorkScheduleManager(IWorkScheduleRepository _workScheduleRepository, IEmployeeRepository _employeeRepository, IBookingRepository _bookingRepository)
        {
            this._workScheduleRepository = _workScheduleRepository;
            this._employeeRepository = _employeeRepository;
            this._bookingRepository = _bookingRepository;
        }
        public async Task<WorkScheduleResponseDto> CreateAsync(WorkScheduleRequestDto workScheduleRequestDto)
        {
            WorkScheduleHelper.ValidateWorkSchedule(workScheduleRequestDto.StartTime, workScheduleRequestDto.EndTime);
            // Check for duplicate tasks.
            var isOverlapping = await _workScheduleRepository.IsOverlappingAsync(
                workScheduleRequestDto.StaffId, workScheduleRequestDto.WorkDate, 
                workScheduleRequestDto.StartTime, workScheduleRequestDto.EndTime);
            if (isOverlapping)
            {
                throw new ConflictException(
                    "Nhân viên đã có ca làm việc bị trùng trong khoảng thời gian này."
                );
            }
            // Check if the Staff account exists and if it is locked.
            bool ExistStaff = await isExistStaff(workScheduleRequestDto);
            if (!ExistStaff)
            {
                throw new ConflictException(
                    $"Staff with id {workScheduleRequestDto.StaffId} is locked or not found"
                );
            }

            var newWorkSchedule = new WorkSchedule
            {
                StaffId = workScheduleRequestDto.StaffId,
                WorkDate = workScheduleRequestDto.WorkDate,
                StartTime = workScheduleRequestDto.StartTime,
                EndTime = workScheduleRequestDto.EndTime,
            };
            await _workScheduleRepository.CreateAsync(newWorkSchedule);

            var result = await _workScheduleRepository.GetByIdAsync(
                newWorkSchedule.Id
            );

            if (result == null)
            {
                throw new NotFoundException(
                    $"WorkSchedule with id {newWorkSchedule.Id} not found."
                );
            }
            return WorkScheduleHelper.MapToResponseDto(result);
        }

        public async Task DeleteAsync(int id)
        {
            var workSchedule =await _workScheduleRepository.GetByIdAsync(id);
            if (workSchedule == null)
            {
                throw new NotFoundException($"WorkSchedule with id {id} not found.");
            }
            await _workScheduleRepository.DeleteAsync(id);
        }

        public async Task<List<WorkScheduleResponseDto>> GetAllAsync()
        {
            var workSchedules = await _workScheduleRepository.GetAllAsync();

            return workSchedules
                .Select(WorkScheduleHelper.MapToResponseDto)
                .ToList();
        }

        public async Task<WorkScheduleResponseDto?> GetByIdAsync(int Id, bool withAsNoTracking = true)
        {

            var workSchedule =await _workScheduleRepository.GetByIdAsync(Id, withAsNoTracking);

            if (workSchedule == null)
            {
                throw new NotFoundException($"WorkSchedule with id {Id} not found.");
            }

            return WorkScheduleHelper.MapToResponseDto(workSchedule);
        }

        public async Task<WorkScheduleResponseDto> UpdateAsync(int Id, WorkScheduleRequestDto workScheduleRequestDto)
        {
            // validate StartTime and EndTime
            WorkScheduleHelper.ValidateWorkSchedule(workScheduleRequestDto.StartTime, workScheduleRequestDto.EndTime);
            var workSchedule = await _workScheduleRepository.GetByIdAsync(Id, false);

            if (workSchedule == null)
            {
                throw new NotFoundException(
                    $"WorkSchedule with id {Id} not found."
                );
            }

            var isOverlapping = await _workScheduleRepository.IsOverlappingAsync(
                workScheduleRequestDto.StaffId, workScheduleRequestDto.WorkDate,
                workScheduleRequestDto.StartTime, workScheduleRequestDto.EndTime, Id);

            if (isOverlapping)
            {
                throw new ConflictException("Nhân viên đã có ca làm việc bị trùng trong khoảng thời gian này.");
            }
            // Check if the Staff account exists and if it is locked.
            bool ExistStaff = await isExistStaff(workScheduleRequestDto);
            if (!ExistStaff)
            {
                throw new ConflictException(
                    $"Staff with id {workScheduleRequestDto.StaffId} is locked or not found"
                );
            }

            workSchedule.StaffId = workScheduleRequestDto.StaffId;
            workSchedule.WorkDate = workScheduleRequestDto.WorkDate;
            workSchedule.StartTime = workScheduleRequestDto.StartTime;
            workSchedule.EndTime = workScheduleRequestDto.EndTime;

            await _workScheduleRepository.UpdateAsync(workSchedule);
            return WorkScheduleHelper.MapToResponseDto(workSchedule);
        }
        public async Task<bool> isExistStaff(WorkScheduleRequestDto workScheduleRequestDto)
        {
            var existingStaff = await _employeeRepository.GetByIdAsync(workScheduleRequestDto.StaffId);

            if (existingStaff == null)
            {
                return false;
            }

            // 2. Check Staff có bị khóa không
            if (!existingStaff.IsActive)
            {
                return false;
            }
            return true;
        }
    }
}
