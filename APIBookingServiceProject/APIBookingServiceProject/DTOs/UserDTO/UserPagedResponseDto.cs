namespace APIBookingServiceProject.DTOs.UserDTO
{
    public class UserPagedResponseDto
    {
        public List<UserResponseDto> Data { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
