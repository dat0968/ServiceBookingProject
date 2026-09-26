using APIBookingServiceProject.DTOs.EmployeeDTO;
using APIBookingServiceProject.Services.Empolyee;
using Microsoft.AspNetCore.Mvc;

namespace APIBookingServiceProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly IEmployeeManager _service;

        public StaffController(IEmployeeManager service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(EmployeeRequestDto employeeRequestDto)
        {
            var result = await _service.CreateAsync(employeeRequestDto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EmployeeRequestDto employeeRequestDto)
        {
            var result = await _service.UpdateAsync(id, employeeRequestDto);
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatus(int id, bool isActive)
        {
            var result = await _service.ChangeStatusAsync(id, isActive);
            return Ok(new
            {
                message = "Update status employee successfully"
            });
        }
    }
}
