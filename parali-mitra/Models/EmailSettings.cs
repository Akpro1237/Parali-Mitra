namespace ParaliMitra.Models;

public class EmailSettings
{
    public string AdminEmail { get; set; } = "admin@paralimitra.in";
    public string SenderName { get; set; } = "ParaliMitra Stubble Management Alert";
    public string SmtpHost { get; set; } = "smtp.gmail.com";
    public int SmtpPort { get; set; } = 587;
    public bool EnableSsl { get; set; } = true;
    public string SmtpUser { get; set; } = "";
    public string SmtpPass { get; set; } = "";
    public bool SimulationMode { get; set; } = true; // True if real SMTP credentials aren't provided yet
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

public class EmailLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string ToEmail { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string HtmlBody { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool Success { get; set; }
    public string Mode { get; set; } = "Simulation"; // Real or Simulation
    public string? ErrorMessage { get; set; }
    public string AppointmentId { get; set; } = string.Empty;
}
