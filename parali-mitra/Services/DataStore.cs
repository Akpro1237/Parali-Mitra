using System.Text.Json;
using ParaliMitra.Models;

namespace ParaliMitra.Services;

public class DataStore
{
    private readonly string _dataDir;
    private readonly string _appointmentsFile;
    private readonly string _settingsFile;
    private readonly string _emailLogsFile;
    private readonly string _demandsFile;
    private readonly object _lock = new();

    public DataStore(IWebHostEnvironment env)
    {
        _dataDir = Path.Combine(env.ContentRootPath, "data");
        Directory.CreateDirectory(_dataDir);

        _appointmentsFile = Path.Combine(_dataDir, "appointments.json");
        _settingsFile = Path.Combine(_dataDir, "settings.json");
        _emailLogsFile = Path.Combine(_dataDir, "emaillogs.json");
        _demandsFile = Path.Combine(_dataDir, "demands.json");

        InitSeedData();
    }

    private void InitSeedData()
    {
        lock (_lock)
        {
            if (!File.Exists(_settingsFile))
            {
                var defaultSettings = new EmailSettings
                {
                    AdminEmail = "kisan-support@paralimitra.gov.in",
                    SenderName = "ParaliMitra Stubble Alert Dispatcher",
                    SmtpHost = "smtp.gmail.com",
                    SmtpPort = 587,
                    EnableSsl = true,
                    SimulationMode = true
                };
                SaveSettings(defaultSettings);
            }

            if (!File.Exists(_appointmentsFile))
            {
                SaveAppointments(new List<Appointment>());
            }

            if (!File.Exists(_emailLogsFile))
            {
                SaveEmailLogs(new List<EmailLog>());
            }
        }
    }

    public List<Appointment> GetAppointments()
    {
        lock (_lock)
        {
            if (!File.Exists(_appointmentsFile)) return new();
            var json = File.ReadAllText(_appointmentsFile);
            return JsonSerializer.Deserialize<List<Appointment>>(json) ?? new();
        }
    }

    public void SaveAppointments(List<Appointment> list)
    {
        lock (_lock)
        {
            var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_appointmentsFile, json);
        }
    }

    public Appointment AddAppointment(Appointment appt)
    {
        lock (_lock)
        {
            var list = GetAppointments();
            list.Insert(0, appt);
            SaveAppointments(list);
            return appt;
        }
    }

    public bool UpdateAppointmentStatus(string id, string status, string? baler = null)
    {
        lock (_lock)
        {
            var list = GetAppointments();
            var target = list.FirstOrDefault(a => a.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (target == null) return false;

            target.Status = status;
            if (!string.IsNullOrWhiteSpace(baler))
            {
                target.AssignedBaler = baler;
            }
            SaveAppointments(list);
            return true;
        }
    }

    public EmailSettings GetSettings()
    {
        lock (_lock)
        {
            if (!File.Exists(_settingsFile)) return new EmailSettings();
            var json = File.ReadAllText(_settingsFile);
            return JsonSerializer.Deserialize<EmailSettings>(json) ?? new EmailSettings();
        }
    }

    public void SaveSettings(EmailSettings settings)
    {
        lock (_lock)
        {
            settings.LastUpdated = DateTime.UtcNow;
            var json = JsonSerializer.Serialize(settings, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_settingsFile, json);
        }
    }

    public List<EmailLog> GetEmailLogs()
    {
        lock (_lock)
        {
            if (!File.Exists(_emailLogsFile)) return new();
            var json = File.ReadAllText(_emailLogsFile);
            return JsonSerializer.Deserialize<List<EmailLog>>(json) ?? new();
        }
    }

    public void AddEmailLog(EmailLog log)
    {
        lock (_lock)
        {
            var list = GetEmailLogs();
            list.Insert(0, log);
            // keep latest 100 logs
            if (list.Count > 100) list = list.Take(100).ToList();
            SaveEmailLogs(list);
        }
    }

    private void SaveEmailLogs(List<EmailLog> list)
    {
        var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(_emailLogsFile, json);
    }

    public List<MarketDemand> GetDemands()
    {
        lock (_lock)
        {
            if (!File.Exists(_demandsFile)) return new();
            var json = File.ReadAllText(_demandsFile);
            return JsonSerializer.Deserialize<List<MarketDemand>>(json) ?? new();
        }
    }

    public void SaveDemands(List<MarketDemand> list)
    {
        lock (_lock)
        {
            var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_demandsFile, json);
        }
    }

    public void AddDemand(MarketDemand demand)
    {
        lock (_lock)
        {
            var list = GetDemands();
            list.Insert(0, demand);
            SaveDemands(list);
        }
    }

    public void ClearAllAppointments()
    {
        lock (_lock)
        {
            SaveAppointments(new List<Appointment>());
        }
    }

    public bool DeleteAppointment(string id)
    {
        lock (_lock)
        {
            var list = GetAppointments();
            var count = list.RemoveAll(a => a.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (count > 0)
            {
                SaveAppointments(list);
                return true;
            }
            return false;
        }
    }

    public void ClearAllEmailLogs()
    {
        lock (_lock)
        {
            SaveEmailLogs(new List<EmailLog>());
        }
    }
}
