let responsesCache = [];

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadResponses();

  // Setup event listeners
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.addEventListener("input", debounce(loadResponses, 250));

  const filterStatus = document.getElementById("filterStatus");
  if (filterStatus) filterStatus.addEventListener("change", loadResponses);

  const filterDistrict = document.getElementById("filterDistrict");
  if (filterDistrict) filterDistrict.addEventListener("change", loadResponses);

  const btnRecordNew = document.getElementById("btnRecordNew");
  if (btnRecordNew) btnRecordNew.addEventListener("click", openRecordModal);

  const btnClearAll = document.getElementById("btnClearAllResponses");
  if (btnClearAll) btnClearAll.addEventListener("click", confirmClearAllResponses);

  const intakeForm = document.getElementById("intakeForm");
  if (intakeForm) intakeForm.addEventListener("submit", submitNewResponse);

  const statusForm = document.getElementById("statusUpdateForm");
  if (statusForm) statusForm.addEventListener("submit", submitStatusUpdate);

  // Auto-refresh every 6 seconds to capture live farmer submissions
  setInterval(() => {
    loadStats();
    loadResponses(true);
  }, 6000);
});

// Load KPI Stats
async function loadStats() {
  try {
    const res = await fetch("/api/responses/stats");
    if (!res.ok) return;
    const s = await res.json();

    document.getElementById("kpiTotal").textContent = s.totalCount;
    document.getElementById("kpiAcres").textContent = `${s.totalAcres} Acres`;
    document.getElementById("kpiTons").textContent = `${s.totalTons} Tons`;
    document.getElementById("kpiPayout").textContent = `₹${s.totalPayout.toLocaleString('en-IN')}`;
  } catch (err) {
    console.error("Error loading stats", err);
  }
}

// Load Responses Table
async function loadResponses(isBackground = false) {
  const search = document.getElementById("searchInput") ? document.getElementById("searchInput").value.trim() : "";
  const status = document.getElementById("filterStatus") ? document.getElementById("filterStatus").value : "";
  const district = document.getElementById("filterDistrict") ? document.getElementById("filterDistrict").value : "";

  let url = `/api/responses?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&district=${encodeURIComponent(district)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const list = await res.json();
    responsesCache = list;

    populateDistrictOptions(list);

    const tbody = document.getElementById("responseTableBody");
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 3rem 1.5rem; color: #64748b;">
            <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📋</div>
            <strong style="font-size: 1.1rem; color: #1e293b;">No farmer responses recorded yet.</strong>
            <p style="font-size: 0.85rem; margin-top: 4px;">Bookings submitted by farmers on the main website (http://localhost:5000/) will appear here instantly, or you can click <strong>"+ Record Offline / Phone Response"</strong> above.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(r => {
      let badgeClass = "badge-pending";
      if (r.status.includes("Assigned") || r.status.includes("Transit")) badgeClass = "badge-assigned";
      if (r.status.includes("Picked") || r.status.includes("Completed")) badgeClass = "badge-completed";

      const phoneClean = r.phone.replace(/[^0-9]/g, '');

      return `
        <tr>
          <td><strong style="color: #15803d; font-family: monospace; font-size: 0.95rem;">${r.id}</strong></td>
          <td>
            <strong style="color: #0f172a; font-size: 0.95rem;">${escapeHtml(r.farmerName)}</strong><br/>
            <span style="font-size: 0.82rem;">
              <a href="tel:${phoneClean}" style="color: #15803d; text-decoration: none; font-weight: 600;">📞 ${r.phone}</a> | 
              <a href="https://wa.me/91${phoneClean}?text=Hello+${encodeURIComponent(r.farmerName)}+regarding+your+stubble+collection+appointment+${r.id}" target="_blank" style="color: #059669; text-decoration: none; font-weight: 600;">💬 WA</a>
            </span>
          </td>
          <td>
            <strong>${escapeHtml(r.district || '')}, ${escapeHtml(r.state || '')}</strong><br/>
            <small style="color: #64748b;">${escapeHtml(r.tehsilOrVillage || '')}</small>
          </td>
          <td>
            <strong>${r.landAreaAcres} Acres</strong><br/>
            <small style="color: #64748b;">${escapeHtml(r.cropVariety || '')}</small>
          </td>
          <td>
            <strong>~${r.estimatedTons} Tons</strong><br/>
            <span style="color: #b45309; font-weight: 700; font-size: 0.85rem;">₹${r.estimatedPayoutInr.toLocaleString('en-IN')}</span>
          </td>
          <td>
            <span style="font-weight: 600;">${r.preferredDate}</span><br/>
            <small style="color: #64748b;">${escapeHtml(r.preferredTimeSlot || '')}</small>
          </td>
          <td>
            <span class="status-badge ${badgeClass}">${escapeHtml(r.status)}</span>
            ${r.assignedBaler ? `<br/><small style="color: #334155; font-size: 0.78rem;">🚜 ${escapeHtml(r.assignedBaler)}</small>` : ''}
          </td>
          <td>
            <span style="font-size: 0.8rem; color: #166534; font-weight: 600;">
              ${r.emailNotificationSent ? '✉️ Admin Alert Dispatched' : '⚠️ Unsent'}
            </span>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" onclick="openDetailsModal('${r.id}')" title="View Dossier">👁️ View</button>
              <button class="btn btn-primary btn-sm" onclick="openStatusModal('${r.id}', '${escapeHtml(r.status)}', '${escapeHtml(r.assignedBaler || '')}')" title="Update Status">🚜 Status</button>
              <button class="btn btn-danger btn-sm" onclick="deleteSingleResponse('${r.id}')" title="Delete">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    if (!isBackground) console.error("Error loading responses", err);
  }
}

function populateDistrictOptions(list) {
  const sel = document.getElementById("filterDistrict");
  if (!sel || sel.children.length > 1) return;
  const districts = [...new Set(list.map(r => r.district).filter(Boolean))].sort();
  districts.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    sel.appendChild(opt);
  });
}

// Intake New Response Modal
function openRecordModal() {
  const modal = document.getElementById("recordModal");
  if (modal) modal.classList.add("active");
}
function closeRecordModal() {
  const modal = document.getElementById("recordModal");
  if (modal) modal.classList.remove("active");
}

async function submitNewResponse(e) {
  e.preventDefault();
  const btn = document.getElementById("btnSubmitIntake");
  btn.disabled = true;
  btn.textContent = "Saving Response...";

  const payload = {
    FarmerName: document.getElementById("intakeName").value.trim(),
    Phone: document.getElementById("intakePhone").value.trim(),
    Email: document.getElementById("intakeEmail").value.trim(),
    State: document.getElementById("intakeState").value,
    District: document.getElementById("intakeDistrict").value.trim(),
    TehsilOrVillage: document.getElementById("intakeVillage").value.trim(),
    LandAreaAcres: parseFloat(document.getElementById("intakeAcres").value) || 1,
    CropVariety: document.getElementById("intakeCrop").value,
    StubbleCondition: document.getElementById("intakeCondition").value,
    PreferredDate: document.getElementById("intakeDate").value,
    PreferredTimeSlot: document.getElementById("intakeSlot").value,
    FieldLandmark: document.getElementById("intakeLandmark").value.trim(),
    PaymentMethod: document.getElementById("intakePayment").value,
    UpiOrAccount: document.getElementById("intakeUpi").value.trim()
  };

  try {
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      closeRecordModal();
      document.getElementById("intakeForm").reset();
      loadStats();
      loadResponses();
      alert("Farmer response recorded successfully into registry!");
    } else {
      alert("Error: " + (data.message || "Failed to record"));
    }
  } catch (err) {
    alert("Connection error: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Farmer Response";
  }
}

// Status Update Modal
function openStatusModal(id, currentStatus, currentBaler) {
  document.getElementById("statusApptId").value = id;
  document.getElementById("statusSelect").value = currentStatus;
  document.getElementById("statusBaler").value = currentBaler || "";
  document.getElementById("statusModal").classList.add("active");
}
function closeStatusModal() {
  document.getElementById("statusModal").classList.remove("active");
}

async function submitStatusUpdate(e) {
  e.preventDefault();
  const id = document.getElementById("statusApptId").value;
  const status = document.getElementById("statusSelect").value;
  const baler = document.getElementById("statusBaler").value.trim();

  try {
    const res = await fetch(`/api/responses/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Status: status, AssignedBaler: baler })
    });
    if (res.ok) {
      closeStatusModal();
      loadStats();
      loadResponses();
    } else {
      alert("Failed to update status.");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// View Details Modal
function openDetailsModal(id) {
  const r = responsesCache.find(x => x.id === id);
  if (!r) return;

  const content = document.getElementById("detailsContent");
  content.innerHTML = `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-size: 1.2rem; font-weight: 800; color: #15803d;">${r.id}</span>
        <span class="status-badge badge-pending">${r.status}</span>
      </div>
      <table width="100%" cellpadding="6" style="font-size: 0.9rem;">
        <tr><td style="color: #64748b; width: 35%;">Farmer Name:</td><td><strong>${escapeHtml(r.farmerName)}</strong></td></tr>
        <tr><td style="color: #64748b;">Phone:</td><td><a href="tel:${r.phone}">${r.phone}</a></td></tr>
        <tr><td style="color: #64748b;">Email:</td><td>${r.email || 'Not provided'}</td></tr>
        <tr><td style="color: #64748b;">Location:</td><td>${escapeHtml(r.tehsilOrVillage)}, ${escapeHtml(r.district)}, ${escapeHtml(r.state)}</td></tr>
        <tr><td style="color: #64748b;">Landmark:</td><td>${escapeHtml(r.fieldLandmark || 'Direct field access')}</td></tr>
        <tr><td style="color: #64748b;">Land Area:</td><td><strong>${r.landAreaAcres} Acres</strong></td></tr>
        <tr><td style="color: #64748b;">Crop:</td><td>${escapeHtml(r.cropVariety)}</td></tr>
        <tr><td style="color: #64748b;">Stubble Condition:</td><td>${escapeHtml(r.stubbleCondition)}</td></tr>
        <tr><td style="color: #64748b;">Biomass Yield:</td><td><strong>~${r.estimatedTons} Metric Tons</strong></td></tr>
        <tr><td style="color: #64748b;">Estimated Payout:</td><td><strong style="color: #b45309;">₹${r.estimatedPayoutInr.toLocaleString('en-IN')}</strong></td></tr>
        <tr><td style="color: #64748b;">Pickup Slot:</td><td>🗓️ ${r.preferredDate} (${escapeHtml(r.preferredTimeSlot)})</td></tr>
        <tr><td style="color: #64748b;">Payment Method:</td><td>${r.paymentMethod}</td></tr>
        <tr><td style="color: #64748b;">Account / UPI:</td><td><code>${r.upiOrAccount || 'Direct cash upon weighment'}</code></td></tr>
        <tr><td style="color: #64748b;">Assigned Baler:</td><td>${r.assignedBaler || 'Not assigned yet'}</td></tr>
        <tr><td style="color: #64748b;">Email Alert:</td><td><span style="color: #15803d; font-weight: 600;">${r.emailNotificationStatus || 'Alert recorded'}</span></td></tr>
      </table>
    </div>
  `;
  document.getElementById("detailsModal").classList.add("active");
}
function closeDetailsModal() {
  document.getElementById("detailsModal").classList.remove("active");
}

// Single Delete
async function deleteSingleResponse(id) {
  if (!confirm(`Are you sure you want to permanently delete response ${id}?`)) return;

  try {
    const res = await fetch(`/api/responses/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadStats();
      loadResponses();
    } else {
      alert("Failed to delete response.");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Clear All Responses (Wipe Database)
async function confirmClearAllResponses() {
  const code = prompt("⚠️ PERMANENT WIPE: This will remove ALL recorded responses and clear the database.\n\nType 'CLEAR' to confirm:");
  if (code !== "CLEAR") {
    alert("Action cancelled. Responses were kept safe.");
    return;
  }

  try {
    const res = await fetch("/api/responses", { method: "DELETE" });
    if (res.ok) {
      loadStats();
      loadResponses();
      alert("✅ All existing responses have been successfully removed! The database is now completely clean.");
    } else {
      alert("Failed to wipe responses.");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
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
