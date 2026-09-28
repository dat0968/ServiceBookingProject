using System.Security.Claims;
using APIBookingServiceProject.DTOs.BookingDTO;
using APIBookingServiceProject.Services.BookingManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIBookingServiceProject.Controllers
{
    [ApiController]
    [Route("api/bookings")]

    public class BookingController : ControllerBase
    {
        private readonly IBookingManager bookingManager;

        public BookingController(IBookingManager bookingManager)
        {
            this.bookingManager = bookingManager;
        }

        [HttpGet("my-bookings")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyBookings([FromQuery] BookingQueryDto query)
        {
            var result = await bookingManager.GetMyBookingsAsync(GetCurrentUserId(), query);
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] BookingQueryDto query)
        {
            var result = await bookingManager.GetAllAsync(query);
            return Ok(result);
        }

        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] AvailableSlotQueryDto query)
        {
            var result = await bookingManager.GetAvailableSlotsAsync(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await bookingManager.GetByIdAsync(id, GetCurrentUserId(), GetCurrentRole());
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Customer,Admin")]
        public async Task<IActionResult> Create(BookingRequestDto dto)
        {
            var result = await bookingManager.CreateAsync(dto, GetCurrentUserId(), GetCurrentRole());
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateBookingStatusDto dto)
        {
            var result = await bookingManager.UpdateStatusAsync(id, dto);
            return Ok(result);
        }

        [HttpPost("{id}/cancel")]
        [Authorize(Roles = "Customer,Admin")]
        public async Task<IActionResult> Cancel(int id, CancelBookingRequestDto dto)
        {
            var result = await bookingManager.CancelAsync(id, dto, GetCurrentUserId(), GetCurrentRole());
            return Ok(result);
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        private string GetCurrentRole()
        {
            return User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        }
    }
}
