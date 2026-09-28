using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using APIBookingServiceProject.DTOs.UserDTO;
using APIBookingServiceProject.Exceptions;
using APIBookingServiceProject.Helper;
using APIBookingServiceProject.Models;
using APIBookingServiceProject.Repositories.UserRepo;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace APIBookingServiceProject.Services.UserManager
{
    public class UserManager : IUserManager
    {
        private readonly IUserRepository userRepository;
        private readonly IPasswordHasher<User> passwordHasher;
        private readonly IConfiguration configuration;

        public UserManager(IUserRepository userRepository, IPasswordHasher<User> passwordHasher,IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.passwordHasher = passwordHasher;
            this.configuration = configuration;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
        {
            UserHelper.ValidateLogin(dto);
            var email = dto.Email.Trim();
            var user = await userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new UnauthorizedException("Email hoặc mật khẩu không đúng.");
            }

            var verifyResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (verifyResult == PasswordVerificationResult.Failed)
            {
                throw new UnauthorizedException("Email hoặc mật khẩu không đúng.");
            }

            return new LoginResponseDto
            {
                Token = GenerateJwtToken(user),
                User = UserHelper.MapToResponseDto(user)
            };
        }

        public async Task<UserResponseDto> GetMeAsync(int userId)
        {
            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new NotFoundException($"User with id {userId} not found");
            }

            return UserHelper.MapToResponseDto(user);
        }

        public async Task<UserPagedResponseDto> GetAllAsync(UserQueryDto query)
        {
            NormalizePaging(query);
            var users = await userRepository.GetAllAsync(query.Search, query.Page, query.PageSize);
            var totalItems = await userRepository.CountAsync(query.Search);
            var totalPages = (int)Math.Ceiling((double)totalItems / query.PageSize);

            return new UserPagedResponseDto
            {
                Data = users.Select(UserHelper.MapToResponseDto).ToList(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };
        }

        public async Task<UserResponseDto> GetByIdAsync(int id)
        {
            var user = await userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new NotFoundException($"User with id {id} not found");
            }

            return UserHelper.MapToResponseDto(user);
        }

        public async Task<UserResponseDto> CreateAsync(UserRequestDto dto)
        {
            UserHelper.ValidateCreate(dto);
            var email = dto.Email.Trim();
            if (await userRepository.ExistsEmailAsync(email))
            {
                throw new ConflictException("Email đã tồn tại.");
            }

            var user = new User
            {
                Email = email,
                FullName = dto.FullName.Trim(),
                Role = UserHelper.NormalizeRole(dto.Role),
                CreatedAt = DateTime.UtcNow
            };
            user.PasswordHash = passwordHasher.HashPassword(user, dto.Password);

            var created = await userRepository.CreateAsync(user);
            return UserHelper.MapToResponseDto(created);
        }

        public async Task<UserResponseDto> UpdateAsync(int id, UserUpdateRequestDto dto)
        {
            UserHelper.ValidateUpdate(dto);
            var user = await userRepository.GetByIdAsync(id, false);
            if (user == null)
            {
                throw new NotFoundException($"User with id {id} not found");
            }

            var email = dto.Email.Trim();
            if (await userRepository.ExistsEmailAsync(email, id))
            {
                throw new ConflictException("Email đã tồn tại.");
            }

            user.Email = email;
            user.FullName = dto.FullName.Trim();
            user.Role = UserHelper.NormalizeRole(dto.Role);
            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.PasswordHash = passwordHasher.HashPassword(user, dto.Password);
            }

            await userRepository.UpdateAsync(user);
            return UserHelper.MapToResponseDto(user);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSection = configuration.GetSection("Jwt");
            var key = jwtSection["Key"] ?? throw new InvalidOperationException("Jwt:Key is missing.");
            var expiresMinutes = int.TryParse(jwtSection["ExpiresInMinutes"], out var minutes) ? minutes : 120;

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Name, user.FullName),
                new(ClaimTypes.Role, user.Role)
            };

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static void NormalizePaging(UserQueryDto query)
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
    }
}
