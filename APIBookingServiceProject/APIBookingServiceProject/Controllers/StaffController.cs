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
            try
            {
                var result = await _service.CreateAsync(employeeRequestDto);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    message = "Internal server error."
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _service.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    message = "Internal server error."
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message = $"MyService with id {id} not found."
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);

                return StatusCode(500, new
                {
                    message = "Internal server error."
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EmployeeRequestDto employeeRequestDto)
        {
            try
            {
                var result = await _service.UpdateAsync(id, employeeRequestDto);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message = $"Employee with id {id} not found"
                    });
                }

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);

                return StatusCode(500, new
                {
                    message = "Internal server error."
                });
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatus(int id, bool isActive)
        {
            try
            {
                var result = await _service.ChangeStatusAsync(id, isActive);
                return Ok(new
                {
                    message = "Update status employee successfully"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);

                return StatusCode(500, new
                {
                    message = "Internal server error."
                });
            }
        }
    }
}
