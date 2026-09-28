namespace APIBookingServiceProject.DTOs.UserDTO
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = null!;
        public UserResponseDto User { get; set; } = null!;
    }
}
