using System.Net;
using System.Net.Mail;
using ParaliMitra.Models;

namespace ParaliMitra.Services;

public class EmailService : IEmailService
{
    private readonly DataStore _store;
    private readonly ILogger<EmailService> _logger;

    public EmailService(DataStore store, ILogger<EmailService> logger)
    {
        _store = store;
        _logger = logger;
    }

    public async Task<(bool Success, string Message)> SendAppointmentNotificationAsync(Appointment appointment)
    {
        var settings = _store.GetSettings();
        var adminEmail = string.IsNullOrWhiteSpace(settings.AdminEmail) ? "admin@paralimitra.in" : settings.AdminEmail;

        string subject = $"🚨 [NEW STUBBLE PICKUP] {appointment.FarmerName} - {appointment.LandAreaAcres} Acres ({appointment.District}, {appointment.State})";
        string htmlBody = GenerateAppointmentEmailHtml(appointment);

        // If simulation mode is explicitly enabled or SMTP credentials are empty
        bool canAttemptRealSmtp = !settings.SimulationMode &&
                                  !string.IsNullOrWhiteSpace(settings.SmtpHost) &&
                                  !string.IsNullOrWhiteSpace(settings.SmtpUser) &&
                                  !string.IsNullOrWhiteSpace(settings.SmtpPass);

        if (!canAttemptRealSmtp)
        {
            // Log in Simulation / Mock Outbox
            var log = new EmailLog
            {
                ToEmail = adminEmail,
                Subject = subject,
                HtmlBody = htmlBody,
                SentAt = DateTime.UtcNow,
                Success = true,
                Mode = "Simulation / Outbox Ready",
                AppointmentId = appointment.Id,
                ErrorMessage = "Delivered to local Outbox. Real SMTP delivery is paused until you input your SMTP credentials in Admin -> Email Settings."
            };
            _store.AddEmailLog(log);

            string msg = $"Email simulated & stored in Admin Outbox (To: {adminEmail}). To receive direct emails in your inbox, configure your SMTP in the Admin Settings.";
            _logger.LogInformation(msg);
            return (true, msg);
        }

        // Attempt Real SMTP Dispatch
        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(settings.SmtpUser, settings.SenderName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(adminEmail);

            // If farmer gave an email, send CC or confirmation
            if (!string.IsNullOrWhiteSpace(appointment.Email) && appointment.Email.Contains('@'))
            {
                try { message.CC.Add(appointment.Email); } catch { /* ignore invalid farmer email */ }
            }

            using var smtp = new SmtpClient(settings.SmtpHost, settings.SmtpPort)
            {
                Credentials = new NetworkCredential(settings.SmtpUser, settings.SmtpPass),
                EnableSsl = settings.EnableSsl,
                Timeout = 12000
            };

            await smtp.SendMailAsync(message);

            var successLog = new EmailLog
            {
                ToEmail = adminEmail,
                Subject = subject,
                HtmlBody = htmlBody,
                SentAt = DateTime.UtcNow,
                Success = true,
                Mode = "Live SMTP",
                AppointmentId = appointment.Id,
                ErrorMessage = null
            };
            _store.AddEmailLog(successLog);

            return (true, $"Live email successfully sent to {adminEmail} via SMTP.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send real SMTP email for appointment {Id}", appointment.Id);

            // Fallback: save to Outbox so user never loses notification
            var failLog = new EmailLog
            {
                ToEmail = adminEmail,
                Subject = subject,
                HtmlBody = htmlBody,
                SentAt = DateTime.UtcNow,
                Success = false,
                Mode = "Failed Live SMTP (Saved in Outbox)",
                AppointmentId = appointment.Id,
                ErrorMessage = $"SMTP Error: {ex.Message}"
            };
            _store.AddEmailLog(failLog);

            return (false, $"SMTP send error: {ex.Message}. The appointment and email body were saved safely in your Admin Outbox.");
        }
    }

    public async Task<(bool Success, string Message)> SendTestEmailAsync(string targetEmail)
    {
        var settings = _store.GetSettings();
        if (string.IsNullOrWhiteSpace(targetEmail))
        {
            return (false, "Target email cannot be empty.");
        }

        string subject = "✅ ParaliMitra SMTP Test Alert: Stubble Management System";
        string htmlBody = $@"
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #16a34a; border-radius: 8px;'>
            <div style='background: #16a34a; color: white; padding: 15px; border-radius: 6px; text-align: center;'>
                <h2 style='margin:0;'>🌾 ParaliMitra Test Verification</h2>
                <p style='margin: 5px 0 0;'>Kisan Dhan, Swachh Hawa Platform</p>
            </div>
            <div style='padding: 20px 0;'>
                <p>Hello Admin,</p>
                <p>This is a test notification confirming that your <strong>ParaliMitra Stubble Management Email Alert</strong> system is functioning properly.</p>
                <p>Whenever a farmer books a stubble pickup appointment, you will receive full farmer coordinates, crop area, and dispatch schedule instantly in this inbox.</p>
                <div style='background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; margin: 15px 0;'>
                    <strong>Configuration Details:</strong><br/>
                    • SMTP Host: {settings.SmtpHost}:{settings.SmtpPort}<br/>
                    • SSL Enabled: {settings.EnableSsl}<br/>
                    • Sender: {settings.SenderName} &lt;{settings.SmtpUser}&gt;<br/>
                    • Test Timestamp: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC
                </div>
            </div>
            <hr style='border: none; border-top: 1px solid #e5e7eb;' />
            <small style='color: #6b7280; text-align: center; display: block;'>ParaliMitra Initiative • Preventing Stubble Burning • Enabling Green Wealth</small>
        </div>";

        if (settings.SimulationMode || string.IsNullOrWhiteSpace(settings.SmtpUser))
        {
            _store.AddEmailLog(new EmailLog
            {
                ToEmail = targetEmail,
                Subject = subject,
                HtmlBody = htmlBody,
                SentAt = DateTime.UtcNow,
                Success = true,
                Mode = "Simulation Test",
                ErrorMessage = "Test email logged to Outbox. Real delivery was skipped because Simulation Mode is active or SMTP credentials are not filled."
            });
            return (true, "Simulation Test Successful! The email was recorded in the Outbox. Enter SMTP credentials to test real delivery.");
        }

        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(settings.SmtpUser, settings.SenderName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(targetEmail);

            using var smtp = new SmtpClient(settings.SmtpHost, settings.SmtpPort)
            {
                Credentials = new NetworkCredential(settings.SmtpUser, settings.SmtpPass),
                EnableSsl = settings.EnableSsl,
                Timeout = 12000
            };

            await smtp.SendMailAsync(message);

            _store.AddEmailLog(new EmailLog
            {
                ToEmail = targetEmail,
                Subject = subject,
                HtmlBody = htmlBody,
                SentAt = DateTime.UtcNow,
                Success = true,
                Mode = "Live SMTP Test"
            });

            return (true, $"Test email sent successfully to {targetEmail}!");
        }
        catch (Exception ex)
        {
            return (false, $"SMTP connection failed: {ex.Message}");
        }
    }

    private static string GenerateAppointmentEmailHtml(Appointment a)
    {
        return $@"
        <div style='font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);'>
            <!-- Header -->
            <div style='background: linear-gradient(135deg, #15803d 0%, #16a34a 100%); color: #ffffff; padding: 24px; text-align: left;'>
                <div style='display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;'>
                    🚨 New Stubble Collection Appointment
                </div>
                <h1 style='margin: 4px 0 6px; font-size: 22px; font-weight: 700;'>New Paddy Stubble Booking Received!</h1>
                <p style='margin: 0; font-size: 14px; opacity: 0.9;'>A farmer has registered their crop residue to prevent stubble burning.</p>
            </div>

            <!-- Key Metric Highlights -->
            <div style='background: #f0fdf4; padding: 16px 24px; border-bottom: 1px solid #dcfce7; display: flex;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse: collapse;'>
                    <tr>
                        <td style='width: 33%; text-align: center; border-right: 1px solid #bbf7d0; padding: 8px;'>
                            <span style='font-size: 11px; color: #166534; font-weight: 600; text-transform: uppercase;'>Booking ID</span><br/>
                            <strong style='font-size: 16px; color: #14532d;'>{a.Id}</strong>
                        </td>
                        <td style='width: 33%; text-align: center; border-right: 1px solid #bbf7d0; padding: 8px;'>
                            <span style='font-size: 11px; color: #166534; font-weight: 600; text-transform: uppercase;'>Land Area</span><br/>
                            <strong style='font-size: 16px; color: #15803d;'>{a.LandAreaAcres} Acres</strong>
                        </td>
                        <td style='width: 34%; text-align: center; padding: 8px;'>
                            <span style='font-size: 11px; color: #166534; font-weight: 600; text-transform: uppercase;'>Est. Payout</span><br/>
                            <strong style='font-size: 16px; color: #b45309;'>₹{a.EstimatedPayoutInr:N0}</strong>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Details Body -->
            <div style='padding: 24px;'>
                <h3 style='margin: 0 0 16px; font-size: 16px; color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;'>
                    🌾 Farmer & Farm Information
                </h3>
                
                <table width='100%' cellpadding='6' cellspacing='0' style='font-size: 14px; color: #374151;'>
                    <tr>
                        <td style='width: 35%; color: #6b7280; font-weight: 500;'>Farmer Name:</td>
                        <td style='font-weight: 700; color: #111827;'>{a.FarmerName}</td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Phone Number:</td>
                        <td>
                            <a href='tel:{a.Phone}' style='color: #15803d; text-decoration: none; font-weight: 700;'>📞 {a.Phone}</a>
                            &nbsp;|&nbsp;
                            <a href='https://wa.me/91{a.Phone.Replace(" ", "").Replace("-", "")}?text=Hello+{Uri.EscapeDataString(a.FarmerName)},+we+received+your+ParaliMitra+stubble+collection+booking+{a.Id}.' style='color: #059669; text-decoration: none; font-weight: 600;' target='_blank'>💬 WhatsApp</a>
                        </td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Farmer Email:</td>
                        <td>{(string.IsNullOrWhiteSpace(a.Email) ? "Not provided" : a.Email)}</td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Location / Address:</td>
                        <td style='font-weight: 600;'>{a.TehsilOrVillage}, {a.District}, {a.State}</td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Landmark / Field Location:</td>
                        <td>{(string.IsNullOrWhiteSpace(a.FieldLandmark) ? "Direct field location" : a.FieldLandmark)}</td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Crop Variety:</td>
                        <td>{a.CropVariety}</td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Stubble Condition:</td>
                        <td><span style='background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;'>{a.StubbleCondition}</span></td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Estimated Biomass Yield:</td>
                        <td><strong>~{a.EstimatedTons} Metric Tons</strong></td>
                    </tr>
                </table>

                <h3 style='margin: 24px 0 16px; font-size: 16px; color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;'>
                    📅 Pickup Schedule & Payment
                </h3>
                <table width='100%' cellpadding='6' cellspacing='0' style='font-size: 14px; color: #374151;'>
                    <tr>
                        <td style='width: 35%; color: #6b7280; font-weight: 500;'>Requested Pickup Date:</td>
                        <td style='font-weight: 700; color: #15803d;'>🗓️ {a.PreferredDate}</td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Time Slot:</td>
                        <td style='font-weight: 600;'>⏰ {a.PreferredTimeSlot}</td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>Payment Mode:</td>
                        <td>{a.PaymentMethod}</td>
                    </tr>
                    <tr>
                        <td style='color: #6b7280; font-weight: 500;'>UPI / Account:</td>
                        <td><code>{(string.IsNullOrWhiteSpace(a.UpiOrAccount) ? "Pay on verification" : a.UpiOrAccount)}</code></td>
                    </tr>
                </table>

                <!-- Action Button -->
                <div style='margin-top: 28px; text-align: center; background: #f9fafb; padding: 18px; border-radius: 8px; border: 1px solid #e5e7eb;'>
                    <p style='margin: 0 0 12px; font-size: 13px; color: #4b5563;'>Next Step: Assign a baler tractor or contact the farmer to confirm road accessibility.</p>
                    <a href='tel:{a.Phone}' style='display: inline-block; background: #16a34a; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-right: 8px;'>📞 Call Farmer Now</a>
                    <a href='https://wa.me/91{a.Phone.Replace(" ", "").Replace("-", "")}' style='display: inline-block; background: #25d366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px;'>💬 Message on WhatsApp</a>
                </div>

                <!-- Green Impact Badge -->
                <div style='margin-top: 20px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; font-size: 12px; color: #065f46;'>
                    <strong>🌱 Environmental Victory:</strong> By picking up this {a.EstimatedTons} tons of stubble, you prevent approx <strong>{(a.EstimatedTons * 1.5):N1} Tons of CO2</strong> and harmful particulate matter (PM2.5) from polluting India's air!
                </div>
            </div>

            <!-- Footer -->
            <div style='background: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;'>
                Sent automatically by <strong>ParaliMitra Stubble Management Dispatcher</strong> • {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC<br/>
                Empowering Indian Farmers &bull; Eradicating Stubble Burning &bull; Boosting Rural Economy
            </div>
        </div>";
    }
}
