using APIBookingServiceProject.DTOs.UserDTO;
using APIBookingServiceProject.Exceptions;
using APIBookingServiceProject.Models;

namespace APIBookingServiceProject.Helper
{
    public static class UserHelper
    {
        public static readonly string[] AllowedRoles = { "Admin", "Customer" };

        public static UserResponseDto MapToResponseDto(User user)
        {
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }

            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public static void ValidateCreate(UserRequestDto dto)
        {
            ValidateCommon(dto.Email, dto.FullName, dto.Role);
            ValidatePassword(dto.Password, required: true);
        }

        public static void ValidateUpdate(UserUpdateRequestDto dto)
        {
            ValidateCommon(dto.Email, dto.FullName, dto.Role);
            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                ValidatePassword(dto.Password, required: false);
            }
        }

        public static void ValidateLogin(LoginRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                throw new BadRequestException("Email và mật khẩu là bắt buộc.");
            }
        }

        private static void ValidateCommon(string email, string fullName, string role)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new BadRequestException("Email là bắt buộc.");
            }

            if (string.IsNullOrWhiteSpace(fullName))
            {
                throw new BadRequestException("Họ tên là bắt buộc.");
            }

            if (string.IsNullOrWhiteSpace(role) ||
                !AllowedRoles.Contains(role.Trim(), StringComparer.OrdinalIgnoreCase))
            {
                throw new BadRequestException("Role phải là Admin hoặc Customer.");
            }
        }

        private static void ValidatePassword(string? password, bool required)
        {
            if (required && string.IsNullOrWhiteSpace(password))
            {
                throw new BadRequestException("Mật khẩu là bắt buộc.");
            }

            if (!string.IsNullOrWhiteSpace(password) && password.Length < 6)
            {
                throw new BadRequestException("Mật khẩu phải có ít nhất 6 ký tự.");
            }
        }

        public static string NormalizeRole(string role)
        {
            return AllowedRoles.First(x =>
                x.Equals(role.Trim(), StringComparison.OrdinalIgnoreCase));
        }
    }
}
