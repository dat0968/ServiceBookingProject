using APIBookingServiceProject.DTOs.MyServiceDTO;

namespace APIBookingServiceProject.Services.Service
{
    public interface IMyServiceManager
    {
        Task<MyServicePagedResponseDto> GetAllAsync(MyServiceQueryDto query);

        Task<MyServiceResponseDto?> GetByIdAsync(int id);

        Task<MyServiceResponseDto> CreateAsync(MyServiceRequestDto myServiceRequestDto);

        Task<MyServiceResponseDto?> UpdateAsync(int id, MyServiceRequestDto myServiceRequestDto);

        Task<bool> ChangeStatusAsync(int id, bool isActive);
    }
}
