using APIBookingServiceProject.DTOs.MyServiceDTO;
using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Helper
{
    public class MyServiceHelper
    {
        public static MyServiceResponseDto MapToResponseDto(MyService myService)
        {
            return new MyServiceResponseDto
            {
                Id = myService.Id,
                NameService = myService.NameService,
                Price = myService.Price,
                DescriptionService = myService.DescriptionService,
                DurationMinutes = myService.DurationMinutes,
                IsActive = myService.IsActive
            };
        }
        public static void ValidateService(MyServiceRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NameService))
            {
                throw new ArgumentException(
                    "Tên dịch vụ là bắt buộc.");
            }

            if (dto.DurationMinutes <= 0)
            {
                throw new ArgumentException(
                    "Thời lượng phải lớn hơn 0.");
            }

            if (dto.Price < 0)
            {
                throw new ArgumentException(
                    "Giá không được âm.");
            }
        }
    }
}
