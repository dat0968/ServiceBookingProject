using APIBookingServiceProject.DTOs.UserDTO;

namespace APIBookingServiceProject.Services.UserManager
{
    public interface IUserManager
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
        Task<UserResponseDto> GetMeAsync(int userId);
        Task<UserPagedResponseDto> GetAllAsync(UserQueryDto query);
        Task<UserResponseDto> GetByIdAsync(int id);
        Task<UserResponseDto> CreateAsync(UserRequestDto dto);
        Task<UserResponseDto> UpdateAsync(int id, UserUpdateRequestDto dto);
    }
}
