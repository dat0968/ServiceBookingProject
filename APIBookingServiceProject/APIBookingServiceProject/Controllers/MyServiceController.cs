using APIBookingServiceProject.DTOs.MyServiceDTO;
using APIBookingServiceProject.Services.Service;
using Microsoft.AspNetCore.Mvc;

namespace APIBookingServiceProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MyServiceController : ControllerBase
    {
        private readonly IMyServiceManager _service;

        public MyServiceController(IMyServiceManager service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(MyServiceRequestDto myServiceRequestDto)
        {
            var result = await _service.CreateAsync(myServiceRequestDto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] MyServiceQueryDto query)
        {
            var result = await _service.GetAllAsync(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, MyServiceRequestDto myServiceRequestDto)
        {
            var result = await _service.UpdateAsync(id, myServiceRequestDto);
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatus(int id, bool isActive)
        {
            var result = await _service.ChangeStatusAsync(id, isActive);
            return Ok(new
            {
                message = "Update status MyService successfully"
            });
        }
    }
}
