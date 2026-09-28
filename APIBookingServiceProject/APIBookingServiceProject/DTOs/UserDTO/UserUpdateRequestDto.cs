namespace APIBookingServiceProject.DTOs.UserDTO
{
    public class UserUpdateRequestDto
    {
        public string Email { get; set; } = null!;
        public string? Password { get; set; }
        public string FullName { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
