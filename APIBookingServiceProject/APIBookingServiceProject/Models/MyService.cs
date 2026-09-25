using System;
using System.Collections.Generic;

namespace APIBookingServiceProject.Models;

public partial class MyService
{
    public int Id { get; set; }

    public string NameService { get; set; } = null!;

    public string? DescriptionService { get; set; }

    public int DurationMinutes { get; set; }

    public decimal Price { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
