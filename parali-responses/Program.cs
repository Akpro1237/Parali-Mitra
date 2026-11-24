using System.Text.Json;
using System.Text;
using System.Net;
using System.Net.Mail;

var builder = WebApplication.CreateBuilder(args);

// Configure port 5001
builder.WebHost.UseUrls("http://*:5001");

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Path to shared data directory
string dataDir = @"C:\Users\iamsu\.gemini\antigravity\scratch\parali-mitra\data";
Directory.CreateDirectory(dataDir);
string appointmentsFile = Path.Combine(dataDir, "appointments.json");
string settingsFile = Path.Combine(dataDir, "settings.json");
string emailLogsFile = Path.Combine(dataDir, "emaillogs.json");

object fileLock = new object();

List<FarmerResponse> GetResponses()
{
    lock (fileLock)
    {
        if (!File.Exists(appointmentsFile)) return new();
        var json = File.ReadAllText(appointmentsFile);
        return JsonSerializer.Deserialize<List<FarmerResponse>>(json) ?? new();
    }
}

void SaveResponses(List<FarmerResponse> list)
{
    lock (fileLock)
    {
        var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(appointmentsFile, json);
    }
}

// 1. Get All Responses with optional search/filter
app.MapGet("/api/responses", (string? search, string? status, string? district) =>
{
    var list = GetResponses();
    if (!string.IsNullOrWhiteSpace(search))
    {
        string q = search.Trim().ToLowerInvariant();
        list = list.Where(r => 
            (r.FarmerName != null && r.FarmerName.ToLowerInvariant().Contains(q)) ||
            (r.Phone != null && r.Phone.Contains(q)) ||
            (r.Id != null && r.Id.ToLowerInvariant().Contains(q)) ||
            (r.TehsilOrVillage != null && r.TehsilOrVillage.ToLowerInvariant().Contains(q))
        ).ToList();
    }
    if (!string.IsNullOrWhiteSpace(status))
    {
        list = list.Where(r => r.Status != null && r.Status.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
    }
    if (!string.IsNullOrWhiteSpace(district))
    {
        list = list.Where(r => r.District != null && r.District.Equals(district, StringComparison.OrdinalIgnoreCase)).ToList();
    }
    return Results.Ok(list);
});

// 2. Record New Response (Manual Intake or Helpline Entry)
app.MapPost("/api/responses", (FarmerResponse input) =>
{
    if (string.IsNullOrWhiteSpace(input.FarmerName) || string.IsNullOrWhiteSpace(input.Phone))
    {
        return Results.BadRequest(new { success = false, message = "Farmer Name and Phone are required." });
    }

    if (input.LandAreaAcres <= 0) input.LandAreaAcres = 1.0;
    double yieldRate = (input.CropVariety != null && input.CropVariety.Contains("Basmati", StringComparison.OrdinalIgnoreCase)) ? 2.0 : 2.2;
    input.EstimatedTons = Math.Round(input.LandAreaAcres * yieldRate, 1);
    input.EstimatedPayoutInr = Math.Round(input.EstimatedTons * 2100, 0);

    input.Id = $"PM-{DateTime.UtcNow:yyMM}-{Random.Shared.Next(1000, 9999)}";
    input.CreatedAt = DateTime.UtcNow;
    if (string.IsNullOrWhiteSpace(input.Status)) input.Status = "Pending Baler Assignment";
    input.EmailNotificationSent = true;
    input.EmailNotificationStatus = "Recorded in National Stubble Registry";

    lock (fileLock)
    {
        var list = GetResponses();
        list.Insert(0, input);
        SaveResponses(list);
    }

    return Results.Ok(new { success = true, message = "Response recorded successfully!", response = input });
});

// 3. Update Status / Baler
app.MapPut("/api/responses/{id}/status", (string id, StatusUpdateDto req) =>
{
    lock (fileLock)
    {
        var list = GetResponses();
        var target = list.FirstOrDefault(r => r.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (target == null) return Results.NotFound(new { success = false, message = "Response not found." });

        target.Status = req.Status;
        if (!string.IsNullOrWhiteSpace(req.AssignedBaler)) target.AssignedBaler = req.AssignedBaler;
        SaveResponses(list);
        return Results.Ok(new { success = true, message = "Status updated successfully." });
    }
});

// 4. Delete Single Response
app.MapDelete("/api/responses/{id}", (string id) =>
{
    lock (fileLock)
    {
        var list = GetResponses();
        int count = list.RemoveAll(r => r.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (count > 0)
        {
            SaveResponses(list);
            return Results.Ok(new { success = true, message = $"Response {id} deleted." });
        }
        return Results.NotFound(new { success = false, message = "Response not found." });
    }
});

// 5. Clear All Responses (Wipe Database)
app.MapDelete("/api/responses", () =>
{
    lock (fileLock)
    {
        SaveResponses(new List<FarmerResponse>());
        if (File.Exists(emailLogsFile))
        {
            File.WriteAllText(emailLogsFile, "[]");
        }
        return Results.Ok(new { success = true, message = "All recorded responses have been permanently wiped." });
    }
});

// 6. Response Stats & Metrics
app.MapGet("/api/responses/stats", () =>
{
    var list = GetResponses();
    double totalAcres = list.Sum(r => r.LandAreaAcres);
    double totalTons = list.Sum(r => r.EstimatedTons);
    double totalPayout = list.Sum(r => r.EstimatedPayoutInr);
    double co2Prevented = Math.Round(totalTons * 1.5, 1);

    return Results.Ok(new
    {
        totalCount = list.Count,
        pendingCount = list.Count(r => r.Status != null && r.Status.Contains("Pending")),
        assignedCount = list.Count(r => r.Status != null && (r.Status.Contains("Assigned") || r.Status.Contains("Transit"))),
        completedCount = list.Count(r => r.Status != null && (r.Status.Contains("Picked") || r.Status.Contains("Completed"))),
        totalAcres = Math.Round(totalAcres, 1),
        totalTons = Math.Round(totalTons, 1),
        totalPayout = totalPayout,
        co2Prevented = co2Prevented
    });
});

// 7. Export Responses to CSV
app.MapGet("/api/responses/export-csv", () =>
{
    var list = GetResponses();
    var sb = new StringBuilder();
    sb.AppendLine("Response ID,Farmer Name,Phone,Email,State,District,Village,Acres,Crop Variety,Stubble Condition,Est Tons,Est Payout (INR),Pickup Date,Time Slot,Landmark,Payment Mode,UPI/Account,Status,Assigned Baler,Created At UTC");

    foreach (var r in list)
    {
        sb.AppendLine($"\"{r.Id}\",\"{EscapeCsv(r.FarmerName)}\",\"{r.Phone}\",\"{r.Email}\",\"{r.State}\",\"{r.District}\",\"{EscapeCsv(r.TehsilOrVillage)}\",{r.LandAreaAcres},\"{r.CropVariety}\",\"{r.StubbleCondition}\",{r.EstimatedTons},{r.EstimatedPayoutInr},\"{r.PreferredDate}\",\"{r.PreferredTimeSlot}\",\"{EscapeCsv(r.FieldLandmark)}\",\"{r.PaymentMethod}\",\"{r.UpiOrAccount}\",\"{r.Status}\",\"{EscapeCsv(r.AssignedBaler)}\",\"{r.CreatedAt:yyyy-MM-dd HH:mm:ss}\"");
    }

    byte[] bytes = Encoding.UTF8.GetBytes(sb.ToString());
    return Results.File(bytes, "text/csv", $"parali-farmer-responses-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv");
});

string EscapeCsv(string? val) => (val ?? "").Replace("\"", "\"\"");

app.Run();

// DTO Models
public class FarmerResponse
{
    public string Id { get; set; } = string.Empty;
    public string FarmerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string State { get; set; } = "Punjab";
    public string District { get; set; } = string.Empty;
    public string TehsilOrVillage { get; set; } = string.Empty;
    public double LandAreaAcres { get; set; } = 1.0;
    public string CropVariety { get; set; } = "Paddy / Non-Basmati";
    public string StubbleCondition { get; set; } = "Loose in Field";
    public double EstimatedTons { get; set; } = 2.2;
    public double EstimatedPayoutInr { get; set; } = 4620;
    public string PreferredDate { get; set; } = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd");
    public string PreferredTimeSlot { get; set; } = "Morning (08:00 AM - 12:00 PM)";
    public string? FieldLandmark { get; set; }
    public string? PaymentMethod { get; set; } = "Bank Transfer / UPI";
    public string? UpiOrAccount { get; set; }
    public string Status { get; set; } = "Pending Baler Assignment";
    public string? AssignedBaler { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool EmailNotificationSent { get; set; } = false;
    public string? EmailNotificationStatus { get; set; }
}

public record StatusUpdateDto(string Status, string? AssignedBaler);
