using APIBookingServiceProject.Data;
using APIBookingServiceProject.DTOs.MyServiceDTO;
using APIBookingServiceProject.Helper;
using APIBookingServiceProject.Models;
using APIBookingServiceProject.Repositories.Service;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
namespace APIBookingServiceProject.Services.Service
{
    public class MyServiceManager : IMyServiceManager
    {
        private IMyServiceRepository myServiceRepository;
        public MyServiceManager(IMyServiceRepository myServiceRepository)
        {
            this.myServiceRepository = myServiceRepository;
        }
        Task<bool> IMyServiceManager.ChangeStatusAsync(int id, bool isActive)
        {
            return myServiceRepository.ChangeStatusAsync(id, isActive);
        }

        async Task<MyServiceResponseDto> IMyServiceManager.CreateAsync(MyServiceRequestDto myServiceRequestDto)
        {
            MyServiceHelper.ValidateService(myServiceRequestDto);
            var myService = new MyService
            {
                NameService = myServiceRequestDto.NameService.Trim(),
                Price = myServiceRequestDto.Price,
                DescriptionService = myServiceRequestDto.DescriptionService,
                DurationMinutes = myServiceRequestDto.DurationMinutes,
                IsActive = true
            };
            var createdService = await myServiceRepository.CreateAsync(myService);
            return MyServiceHelper.MapToResponseDto(createdService);
        }

        async Task<MyServicePagedResponseDto> IMyServiceManager.GetAllAsync(MyServiceQueryDto query)
        {
            var myServices = await myServiceRepository.GetAllAsync(query.Search, query.Page, query.PageSize);
            var totalItems = await myServiceRepository.CountAsync(query.Search);
            var totalPages =(int)Math.Ceiling((double)totalItems / query.PageSize);
            return new MyServicePagedResponseDto
            {
                Data = myServices.Select(x => MyServiceHelper.MapToResponseDto(x)).ToList(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalPages = totalPages,
                TotalItems = totalItems
            };
        }

        async Task<MyServiceResponseDto?> IMyServiceManager.GetByIdAsync(int id)
        {
            var myServices = await myServiceRepository.GetByIdAsync(id);
            if (myServices == null)
            {
                return null;
            }
            return MyServiceHelper.MapToResponseDto(myServices);
        }

        async Task<MyServiceResponseDto?> IMyServiceManager.UpdateAsync(int id, MyServiceRequestDto myServiceRequestDto)
        {
            // Validate
            MyServiceHelper.ValidateService(myServiceRequestDto);
            var myService = await myServiceRepository.GetByIdAsync(id);
            if(myService == null)
            {
                return null;
            }
            myService.NameService = myServiceRequestDto.NameService.Trim();
            myService.Price = myServiceRequestDto.Price;
            myService.DescriptionService = myServiceRequestDto.DescriptionService;
            myService.DurationMinutes = myServiceRequestDto.DurationMinutes;

            var result = await myServiceRepository.UpdateAsync(myService);
            return result ? MyServiceHelper.MapToResponseDto(myService) : null;
        }
    }
}
