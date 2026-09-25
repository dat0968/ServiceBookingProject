using System;
using System.Collections.Generic;

namespace APIBookingServiceProject.Models;

public partial class WorkSchedule
{
    public int Id { get; set; }

    public int StaffId { get; set; }

    public DateOnly WorkDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public virtual Staff Staff { get; set; } = null!;
}
