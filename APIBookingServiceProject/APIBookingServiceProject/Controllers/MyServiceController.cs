using APIBookingServiceProject.DTOs.MyServiceDTO;
using APIBookingServiceProject.Services.Service;
using Microsoft.AspNetCore.Http;
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
            try
            {
                var result = await _service.CreateAsync(myServiceRequestDto);
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
        public async Task<IActionResult> GetAll([FromQuery] MyServiceQueryDto query)
        {
            try
            {
                var result = await _service.GetAllAsync(query);
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
        public async Task<IActionResult> Update(int id, MyServiceRequestDto myServiceRequestDto)
        {
            try
            {
                var result = await _service.UpdateAsync(id, myServiceRequestDto);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message = $"MyService with id {id} not found"
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
                    message = "Update status MyService successfully"
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
