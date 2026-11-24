namespace ParaliMitra.Models;

public class Appointment
{
    public string Id { get; set; } = $"PM-{DateTime.UtcNow:yyMM}-{Random.Shared.Next(1000, 9999)}";
    public string FarmerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string State { get; set; } = "Punjab";
    public string District { get; set; } = string.Empty;
    public string TehsilOrVillage { get; set; } = string.Empty;
    public double LandAreaAcres { get; set; } = 1.0;
    public string CropVariety { get; set; } = "Paddy / Non-Basmati"; // Basmati, Non-Basmati, Sugarcane, Wheat
    public string StubbleCondition { get; set; } = "Loose in Field"; // Loose in Field, Pre-Baled, Cut with Straw Reaper
    public double EstimatedTons { get; set; } = 2.0;
    public double EstimatedPayoutInr { get; set; } = 4000;
    public string PreferredDate { get; set; } = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd");
    public string PreferredTimeSlot { get; set; } = "Morning (08:00 AM - 12:00 PM)";
    public string? FieldLandmark { get; set; }
    public string? PaymentMethod { get; set; } = "Bank Transfer / UPI";
    public string? UpiOrAccount { get; set; }
    public string Status { get; set; } = "Pending Baler Assignment"; // Pending, Baler Assigned, In Transit, Picked Up, Completed, Cancelled
    public string? AssignedBaler { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool EmailNotificationSent { get; set; } = false;
    public string? EmailNotificationStatus { get; set; }
}
