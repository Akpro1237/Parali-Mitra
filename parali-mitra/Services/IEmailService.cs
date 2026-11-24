using ParaliMitra.Models;

namespace ParaliMitra.Services;

public interface IEmailService
{
    Task<(bool Success, string Message)> SendAppointmentNotificationAsync(Appointment appointment);
    Task<(bool Success, string Message)> SendTestEmailAsync(string targetEmail);
}
