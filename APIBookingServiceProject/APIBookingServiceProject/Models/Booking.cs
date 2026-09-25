using System;
using System.Collections.Generic;

namespace APIBookingServiceProject.Models;

public partial class Booking
{
    public int Id { get; set; }

    public string BookingCode { get; set; } = null!;

    public int CustomerId { get; set; }

    public int ServiceId { get; set; }

    public int StaffId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public string StatusBooking { get; set; } = null!;

    public string? CustomerNote { get; set; }

    public string? CancellationReason { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User Customer { get; set; } = null!;

    public virtual MyService Service { get; set; } = null!;

    public virtual Staff Staff { get; set; } = null!;
}
