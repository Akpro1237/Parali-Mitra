let emailLogsCache = [];

document.addEventListener("DOMContentLoaded", () => {
  loadAdminKPIs();
  loadEmailSettings();
  loadAppointments();
  loadEmailLogs();

  setupEventListeners();
});

function setupEventListeners() {
  // Toggle SMTP Drawer
  const btnToggleSmtp = document.getElementById("btnToggleSmtpDetails");
  const drawer = document.getElementById("smtpSettingsDrawer");
  if (btnToggleSmtp && drawer) {
    btnToggleSmtp.addEventListener("click", () => {
      drawer.style.display = drawer.style.display === "none" ? "block" : "none";
    });
  }

  // Save quick Admin Email
  const btnSaveAdminEmail = document.getElementById("btnSaveAdminEmail");
  if (btnSaveAdminEmail) {
    btnSaveAdminEmail.addEventListener("click", saveAdminEmailOnly);
  }

  // Save Full SMTP
  const btnSaveFullSmtp = document.getElementById("btnSaveFullSmtp");
  if (btnSaveFullSmtp) {
    btnSaveFullSmtp.addEventListener("click", saveFullSmtpSettings);
  }

  // Send Test Email
  const btnSendTestEmail = document.getElementById("btnSendTestEmail");
  if (btnSendTestEmail) {
    btnSendTestEmail.addEventListener("click", sendTestEmail);
  }

  // Refresh lists
  const btnRefreshList = document.getElementById("btnRefreshList");
  if (btnRefreshList) {
    btnRefreshList.addEventListener("click", () => {
      loadAdminKPIs();
      loadAppointments();
    });
  }

  const btnRefreshEmailLogs = document.getElementById("btnRefreshEmailLogs");
  if (btnRefreshEmailLogs) {
    btnRefreshEmailLogs.addEventListener("click", loadEmailLogs);
  }

  // Filter change
  const filterDistrict = document.getElementById("filterDistrict");
  const filterStatus = document.getElementById("filterStatus");
  if (filterDistrict) filterDistrict.addEventListener("change", loadAppointments);
  if (filterStatus) filterStatus.addEventListener("change", loadAppointments);

  // Baler modal save
  const btnSaveStatusChange = document.getElementById("btnSaveStatusChange");
  if (btnSaveStatusChange) {
    btnSaveStatusChange.addEventListener("click", saveStatusChange);
  }
}

// 1. Load Admin KPI summary
async function loadAdminKPIs() {
  try {
    const res = await fetch("/api/stats");
    if (!res.ok) return;
    const stats = await res.json();

    document.getElementById("kpiBookings").textContent = stats.totalAppointments;
    document.getElementById("kpiTons").textContent = `${stats.totalTons} Tons`;
    document.getElementById("kpiPayout").textContent = `₹${stats.totalPayout.toLocaleString('en-IN')}`;
    document.getElementById("kpiEmails").textContent = stats.totalEmailAlerts;
  } catch (err) {
    console.error("Error loading KPIs", err);
  }
}

// 2. Load Email Configuration
async function loadEmailSettings() {
  try {
    const res = await fetch("/api/settings/email");
    if (!res.ok) return;
    const s = await res.json();

    document.getElementById("settingAdminEmail").value = s.adminEmail || "";
    document.getElementById("smtpHost").value = s.smtpHost || "smtp.gmail.com";
    document.getElementById("smtpPort").value = s.smtpPort || 587;
    document.getElementById("smtpSsl").value = s.enableSsl ? "true" : "false";
    document.getElementById("smtpUser").value = s.smtpUser || "";
    document.getElementById("chkSimulationMode").checked = s.simulationMode;
  } catch (err) {
    console.error("Error loading email settings", err);
  }
}

async function saveAdminEmailOnly() {
  const email = document.getElementById("settingAdminEmail").value.trim();
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  const dto = {
    AdminEmail: email,
    SenderName: "ParaliMitra Stubble Management Alert",
    SmtpHost: document.getElementById("smtpHost").value,
    SmtpPort: parseInt(document.getElementById("smtpPort").value) || 587,
    EnableSsl: document.getElementById("smtpSsl").value === "true",
    SmtpUser: document.getElementById("smtpUser").value,
    SmtpPass: document.getElementById("smtpPass").value,
    SimulationMode: document.getElementById("chkSimulationMode").checked
  };

  await submitEmailSettingsUpdate(dto);
}

async function saveFullSmtpSettings() {
  const dto = {
    AdminEmail: document.getElementById("settingAdminEmail").value.trim(),
    SenderName: "ParaliMitra Stubble Management Alert",
    SmtpHost: document.getElementById("smtpHost").value.trim(),
    SmtpPort: parseInt(document.getElementById("smtpPort").value) || 587,
    EnableSsl: document.getElementById("smtpSsl").value === "true",
    SmtpUser: document.getElementById("smtpUser").value.trim(),
    SmtpPass: document.getElementById("smtpPass").value,
    SimulationMode: document.getElementById("chkSimulationMode").checked
  };

  await submitEmailSettingsUpdate(dto);
}

async function submitEmailSettingsUpdate(dto) {
  const feedback = document.getElementById("smtpStatusFeedback");
  try {
    const res = await fetch("/api/settings/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });
    const data = await res.json();

    feedback.style.display = "block";
    feedback.style.background = "#dcfce7";
    feedback.style.color = "#15803d";
    feedback.textContent = "✅ " + data.message;
    setTimeout(() => { feedback.style.display = "none"; }, 5000);
  } catch (e) {
    feedback.style.display = "block";
    feedback.style.background = "#fee2e2";
    feedback.style.color = "#991b1b";
    feedback.textContent = "❌ Failed to save settings: " + e.message;
  }
}

async function sendTestEmail() {
  const targetEmail = document.getElementById("settingAdminEmail").value.trim();
  if (!targetEmail || !targetEmail.includes("@")) {
    alert("Please enter your admin email above first.");
    return;
  }

  const btn = document.getElementById("btnSendTestEmail");
  const feedback = document.getElementById("smtpStatusFeedback");
  btn.disabled = true;
  btn.textContent = "⏳ Dispatching Test Email...";

  try {
    const res = await fetch("/api/settings/test-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TargetEmail: targetEmail })
    });
    const data = await res.json();

    feedback.style.display = "block";
    feedback.style.background = data.success ? "#dcfce7" : "#fee2e2";
    feedback.style.color = data.success ? "#15803d" : "#991b1b";
    feedback.textContent = (data.success ? "✅ " : "⚠️ ") + data.message;

    loadEmailLogs();
    loadAdminKPIs();
  } catch (err) {
    alert("Failed to trigger test email: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "🚀 Send Test Email";
  }
}

// 3. Load Appointments
async function loadAppointments() {
  const tbody = document.getElementById("appointmentTableBody");
  const distFilter = document.getElementById("filterDistrict").value;
  const statusFilter = document.getElementById("filterStatus").value;

  let url = "/api/appointments?";
  if (distFilter) url += `district=${encodeURIComponent(distFilter)}&`;
  if (statusFilter) url += `status=${encodeURIComponent(statusFilter)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const appointments = await res.json();

    // Populate districts filter dynamically if not already populated
    populateDistrictFilterOptions(appointments);

    if (appointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #64748b;">No appointments found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = appointments.map(a => {
      let badgeClass = "badge-pending";
      if (a.status.includes("Assigned")) badgeClass = "badge-assigned";
      if (a.status.includes("Picked") || a.status.includes("Completed")) badgeClass = "badge-picked";

      const phoneClean = a.phone.replace(/[^0-9]/g, '');

      return `
        <tr>
          <td><strong style="color: #15803d;">${a.id}</strong></td>
          <td>
            <strong>${escapeHtml(a.farmerName)}</strong><br/>
            <a href="tel:${phoneClean}" style="color: #15803d; text-decoration: none; font-size: 0.82rem;">📞 ${a.phone}</a> | 
            <a href="https://wa.me/91${phoneClean}?text=Hello+${encodeURIComponent(a.farmerName)}+regarding+your+stubble+collection+appointment+${a.id}" target="_blank" style="color: #059669; text-decoration: none; font-size: 0.82rem;">💬 WA</a>
          </td>
          <td>
            <span style="font-weight: 600;">${escapeHtml(a.district)}, ${escapeHtml(a.state)}</span><br/>
            <small style="color: #64748b;">${escapeHtml(a.tehsilOrVillage)}</small>
          </td>
          <td>
            <strong>${a.landAreaAcres} Acres</strong><br/>
            <small style="color: #64748b;">${escapeHtml(a.cropVariety)}</small>
          </td>
          <td>~${a.estimatedTons} Tons</td>
          <td><strong style="color: #b45309;">₹${a.estimatedPayoutInr.toLocaleString('en-IN')}</strong></td>
          <td>
            <span>${a.preferredDate}</span><br/>
            <small style="color: #64748b;">${a.preferredTimeSlot.split(' ')[0]}</small>
          </td>
          <td>
            <span class="badge-status ${badgeClass}">${a.status}</span>
            ${a.assignedBaler ? `<br/><small style="color: #475569;">🚜 ${escapeHtml(a.assignedBaler)}</small>` : ''}
          </td>
          <td>
            <span style="font-size: 0.8rem; color: ${a.emailNotificationSent ? '#15803d' : '#d97706'}; font-weight: 600;">
              ${a.emailNotificationSent ? '✉️ Alert Sent' : '⚠️ Pending'}
            </span>
          </td>
          <td>
            <button class="btn-action-sm" onclick="openAssignModal('${a.id}', '${a.status}', '${escapeHtml(a.assignedBaler || '')}')">
              🚜 Assign / Update
            </button>
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    console.error("Error loading appointments", err);
  }
}

function populateDistrictFilterOptions(list) {
  const select = document.getElementById("filterDistrict");
  if (select.children.length > 1) return; // already populated

  const districts = [...new Set(list.map(a => a.district).filter(Boolean))].sort();
  districts.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
  });
}

// 4. Baler Assignment Modal
function openAssignModal(id, currentStatus, currentBaler) {
  document.getElementById("modalAssignApptId").value = id;
  document.getElementById("modalSelectStatus").value = currentStatus;
  document.getElementById("modalInputBaler").value = currentBaler || "";
  document.getElementById("assignBalerModal").classList.add("active");
}

function closeAssignModal() {
  document.getElementById("assignBalerModal").classList.remove("active");
}

async function saveStatusChange() {
  const id = document.getElementById("modalAssignApptId").value;
  const status = document.getElementById("modalSelectStatus").value;
  const baler = document.getElementById("modalInputBaler").value.trim();

  try {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Status: status, AssignedBaler: baler })
    });
    if (res.ok) {
      closeAssignModal();
      loadAppointments();
      loadAdminKPIs();
    } else {
      alert("Failed to update status.");
    }
  } catch (e) {
    alert("Error updating status: " + e.message);
  }
}

// 5. Load Email Logs & Outbox
async function loadEmailLogs() {
  const container = document.getElementById("emailLogsContainer");
  try {
    const res = await fetch("/api/email-logs");
    if (!res.ok) return;
    const logs = await res.json();
    emailLogsCache = logs;

    if (logs.length === 0) {
      container.innerHTML = `<p style="color: #64748b; font-size: 0.9rem;">No emails dispatched yet.</p>`;
      return;
    }

    container.innerHTML = logs.map(l => {
      const dateFormatted = new Date(l.sentAt).toLocaleString('en-IN');
      return `
        <div class="email-log-item">
          <div class="email-log-header">
            <div>
              <strong style="color: #0f172a; font-size: 0.95rem;">${escapeHtml(l.subject)}</strong><br/>
              <span style="font-size: 0.8rem; color: #64748b;">To: <strong>${escapeHtml(l.toEmail)}</strong> &bull; Mode: <span style="background: #f1f5f9; padding: 1px 6px; border-radius: 4px;">${escapeHtml(l.mode)}</span> &bull; ${dateFormatted}</span>
            </div>
            <div>
              <button class="btn-action-sm" onclick="previewEmail('${l.id}')">
                👁️ View Email HTML
              </button>
            </div>
          </div>
          ${l.errorMessage ? `<div style="font-size: 0.78rem; color: #b45309; background: #fffbeb; padding: 4px 8px; border-radius: 4px; margin-top: 4px;">ℹ️ ${escapeHtml(l.errorMessage)}</div>` : ''}
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("Error loading email logs", err);
  }
}

function previewEmail(logId) {
  const log = emailLogsCache.find(x => x.id === logId);
  if (!log) return;

  document.getElementById("previewEmailSubject").textContent = log.subject;
  document.getElementById("previewEmailMeta").textContent = `Recipient: ${log.toEmail} | Mode: ${log.mode} | Sent: ${new Date(log.sentAt).toLocaleString('en-IN')}`;
  document.getElementById("previewEmailBody").innerHTML = log.htmlBody;

  document.getElementById("emailPreviewModal").classList.add("active");
}

function closeEmailPreviewModal() {
  document.getElementById("emailPreviewModal").classList.remove("active");
}

function escapeHtml(text) {
  if (!text) return "";
  return text.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
