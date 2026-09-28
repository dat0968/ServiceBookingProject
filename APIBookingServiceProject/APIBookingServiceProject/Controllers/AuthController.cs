using System.Security.Claims;
using APIBookingServiceProject.DTOs.UserDTO;
using APIBookingServiceProject.Services.UserManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIBookingServiceProject.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserManager userManager;

        public AuthController(IUserManager userManager)
        {
            this.userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto dto)
        {
            var result = await userManager.LoginAsync(dto);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await userManager.GetMeAsync(userId);
            return Ok(result);
        }
    }
}
