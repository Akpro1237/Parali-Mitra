using ParaliMitra.Models;
using ParaliMitra.Services;

var builder = WebApplication.CreateBuilder(args);

// Register application services
builder.Services.AddSingleton<DataStore>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Configure ports / URLs
builder.WebHost.UseUrls("http://*:5000");

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// --- API Endpoints ---

// 1. Submit New Farmer Appointment (Core Stubble Booking + Email Dispatch)
app.MapPost("/api/appointments", async (Appointment input, DataStore store, IEmailService emailService) =>
{
    if (string.IsNullOrWhiteSpace(input.FarmerName) || string.IsNullOrWhiteSpace(input.Phone))
    {
        return Results.BadRequest(new { success = false, message = "Farmer Name and Phone Number are required." });
    }

    if (input.LandAreaAcres <= 0)
    {
        input.LandAreaAcres = 1.0;
    }

    // Rate calculations based on crop type
    double tonsPerAcre = input.CropVariety.Contains("Basmati", StringComparison.OrdinalIgnoreCase) ? 2.0 : 2.2;
    double ratePerTon = 2100; // ₹2,100 per metric ton average market price
    
    input.EstimatedTons = Math.Round(input.LandAreaAcres * tonsPerAcre, 1);
    input.EstimatedPayoutInr = Math.Round(input.EstimatedTons * ratePerTon, 0);

    input.CreatedAt = DateTime.UtcNow;
    input.Status = "Pending Baler Assignment";

    // Save appointment
    var saved = store.AddAppointment(input);

    // Trigger instant email notification to Admin/User
    var emailResult = await emailService.SendAppointmentNotificationAsync(saved);
    saved.EmailNotificationSent = emailResult.Success;
    saved.EmailNotificationStatus = emailResult.Message;

    // Update with final email status
    store.UpdateAppointmentStatus(saved.Id, saved.Status);

    return Results.Ok(new
    {
        success = true,
        message = "Appointment booked successfully! Stubble collection team and admin have been notified via email.",
        appointment = saved,
        emailStatus = emailResult.Message
    });
});

// 2. List all Appointments
app.MapGet("/api/appointments", (string? status, string? district, DataStore store) =>
{
    var list = store.GetAppointments();
    if (!string.IsNullOrWhiteSpace(status))
    {
        list = list.Where(a => a.Status.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
    }
    if (!string.IsNullOrWhiteSpace(district))
    {
        list = list.Where(a => a.District.Equals(district, StringComparison.OrdinalIgnoreCase)).ToList();
    }
    return Results.Ok(list);
});

// 3. Update Appointment Status / Assign Baler
app.MapPut("/api/appointments/{id}/status", (string id, StatusUpdateRequest request, DataStore store) =>
{
    bool updated = store.UpdateAppointmentStatus(id, request.Status, request.AssignedBaler);
    if (!updated)
    {
        return Results.NotFound(new { success = false, message = "Appointment not found." });
    }
    return Results.Ok(new { success = true, message = $"Status updated to '{request.Status}' successfully." });
});

// Delete individual appointment
app.MapDelete("/api/appointments/{id}", (string id, DataStore store) =>
{
    bool deleted = store.DeleteAppointment(id);
    if (!deleted)
    {
        return Results.NotFound(new { success = false, message = "Response not found." });
    }
    return Results.Ok(new { success = true, message = "Response deleted successfully." });
});

// Clear all appointments / responses
app.MapDelete("/api/appointments", (DataStore store) =>
{
    store.ClearAllAppointments();
    return Results.Ok(new { success = true, message = "All recorded responses have been cleared." });
});

// Clear all email outbox logs
app.MapDelete("/api/email-logs", (DataStore store) =>
{
    store.ClearAllEmailLogs();
    return Results.Ok(new { success = true, message = "Email outbox logs cleared." });
});

// 4. Platform Metrics & Impact Stats
app.MapGet("/api/stats", (DataStore store) =>
{
    var list = store.GetAppointments();
    double totalAcres = list.Sum(a => a.LandAreaAcres);
    double totalTons = list.Sum(a => a.EstimatedTons);
    double totalPayout = list.Sum(a => a.EstimatedPayoutInr);
    double co2PreventedTons = Math.Round(totalTons * 1.5, 1);
    int totalAlerts = store.GetEmailLogs().Count;

    return Results.Ok(new
    {
        totalAppointments = list.Count,
        pendingCount = list.Count(a => a.Status.Contains("Pending")),
        assignedCount = list.Count(a => a.Status.Contains("Assigned") || a.Status.Contains("Transit")),
        completedCount = list.Count(a => a.Status.Contains("Picked") || a.Status.Contains("Completed")),
        totalAcres = Math.Round(totalAcres, 1),
        totalTons = Math.Round(totalTons, 1),
        totalPayout = totalPayout,
        co2PreventedTons = co2PreventedTons,
        totalEmailAlerts = totalAlerts
    });
});

// 5. Industry Marketplace Demands
app.MapGet("/api/demands", (DataStore store) =>
{
    return Results.Ok(store.GetDemands());
});

app.MapPost("/api/demands", (MarketDemand demand, DataStore store) =>
{
    if (string.IsNullOrWhiteSpace(demand.BuyerName) || string.IsNullOrWhiteSpace(demand.Location))
    {
        return Results.BadRequest(new { success = false, message = "Buyer Name and Location are required." });
    }
    store.AddDemand(demand);
    return Results.Ok(new { success = true, demand });
});

// 6. Email Settings & Outbox Management
app.MapGet("/api/settings/email", (DataStore store) =>
{
    var s = store.GetSettings();
    return Results.Ok(new
    {
        adminEmail = s.AdminEmail,
        senderName = s.SenderName,
        smtpHost = s.SmtpHost,
        smtpPort = s.SmtpPort,
        enableSsl = s.EnableSsl,
        smtpUser = s.SmtpUser,
        hasPassword = !string.IsNullOrWhiteSpace(s.SmtpPass),
        simulationMode = s.SimulationMode,
        lastUpdated = s.LastUpdated
    });
});

app.MapPost("/api/settings/email", (EmailSettingsUpdateDto dto, DataStore store) =>
{
    var current = store.GetSettings();
    current.AdminEmail = string.IsNullOrWhiteSpace(dto.AdminEmail) ? current.AdminEmail : dto.AdminEmail.Trim();
    current.SenderName = string.IsNullOrWhiteSpace(dto.SenderName) ? current.SenderName : dto.SenderName.Trim();
    current.SmtpHost = string.IsNullOrWhiteSpace(dto.SmtpHost) ? current.SmtpHost : dto.SmtpHost.Trim();
    current.SmtpPort = dto.SmtpPort > 0 ? dto.SmtpPort : current.SmtpPort;
    current.EnableSsl = dto.EnableSsl;
    current.SmtpUser = string.IsNullOrWhiteSpace(dto.SmtpUser) ? current.SmtpUser : dto.SmtpUser.Trim();
    if (!string.IsNullOrWhiteSpace(dto.SmtpPass))
    {
        current.SmtpPass = dto.SmtpPass.Trim();
    }
    current.SimulationMode = dto.SimulationMode;

    store.SaveSettings(current);
    return Results.Ok(new { success = true, message = "Email settings saved successfully." });
});

app.MapPost("/api/settings/test-email", async (TestEmailRequest req, IEmailService emailService) =>
{
    var result = await emailService.SendTestEmailAsync(req.TargetEmail);
    return Results.Ok(new { success = result.Success, message = result.Message });
});

app.MapGet("/api/email-logs", (DataStore store) =>
{
    return Results.Ok(store.GetEmailLogs());
});

app.Run();

// DTO helper records
public record StatusUpdateRequest(string Status, string? AssignedBaler);
public record EmailSettingsUpdateDto(string AdminEmail, string SenderName, string SmtpHost, int SmtpPort, bool EnableSsl, string SmtpUser, string? SmtpPass, bool SimulationMode);
public record TestEmailRequest(string TargetEmail);
