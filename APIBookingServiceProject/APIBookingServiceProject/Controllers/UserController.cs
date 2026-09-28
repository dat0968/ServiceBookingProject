using APIBookingServiceProject.DTOs.UserDTO;
using APIBookingServiceProject.Services.UserManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIBookingServiceProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly IUserManager userManager;

        public UserController(IUserManager userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] UserQueryDto query)
        {
            var result = await userManager.GetAllAsync(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await userManager.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(UserRequestDto dto)
        {
            var result = await userManager.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserUpdateRequestDto dto)
        {
            var result = await userManager.UpdateAsync(id, dto);
            return Ok(result);
        }
    }
}
