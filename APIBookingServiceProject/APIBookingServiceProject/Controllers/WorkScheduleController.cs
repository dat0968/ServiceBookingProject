using APIBookingServiceProject.DTOs.WorkScheduleDTO;
using APIBookingServiceProject.Services.WorkScheduleManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIBookingServiceProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class WorkScheduleController : ControllerBase
    {
        private readonly IWorkScheduleManager _workScheduleManager;

        public WorkScheduleController(IWorkScheduleManager workScheduleManager)
        {
            _workScheduleManager = workScheduleManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _workScheduleManager.GetAllAsync();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _workScheduleManager.GetByIdAsync(id);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            WorkScheduleRequestDto workScheduleRequestDto)
        {
            var result = await _workScheduleManager.CreateAsync(
                workScheduleRequestDto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Id },
                result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            WorkScheduleRequestDto workScheduleRequestDto)
        {
            var result = await _workScheduleManager.UpdateAsync(
                id,
                workScheduleRequestDto);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _workScheduleManager.DeleteAsync(id);

            return NoContent();
        }
    }
}