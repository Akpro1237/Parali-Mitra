document.addEventListener("DOMContentLoaded", () => {
  loadDemands();
  setupDemandForm();
});

async function loadDemands() {
  const grid = document.getElementById("demandsGrid");
  try {
    const res = await fetch("/api/demands");
    if (!res.ok) return;
    const demands = await res.json();

    if (demands.length === 0) {
      grid.innerHTML = `<p style="color: #64748b;">No active procurement tenders at the moment.</p>`;
      return;
    }

    grid.innerHTML = demands.map(d => {
      return `
        <div class="demand-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
              <span style="font-size: 0.75rem; background: #dcfce7; color: #166534; font-weight: 700; padding: 2px 8px; border-radius: 999px;">
                ${escapeHtml(d.industryType)}
              </span>
              <strong style="color: #15803d; font-size: 0.85rem;">${d.id}</strong>
            </div>

            <h3 style="font-size: 1.15rem; color: #0f172a; margin-bottom: 0.25rem;">${escapeHtml(d.buyerName)}</h3>
            <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 1rem;">📍 ${escapeHtml(d.location)}</p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.85rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; font-size: 0.85rem;">
                <span style="color: #64748b;">Tender Quantity:</span>
                <strong>${d.requiredTons.toLocaleString('en-IN')} Metric Tons</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; font-size: 0.85rem;">
                <span style="color: #64748b;">Offered Price:</span>
                <strong style="color: #b45309;">₹${d.offeredPricePerTon.toLocaleString('en-IN')} / Ton</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span style="color: #64748b;">Residue Form:</span>
                <span>${escapeHtml(d.acceptedForm)}</span>
              </div>
            </div>
          </div>

          <div>
            <a href="tel:${escapeHtml(d.contactPhone)}" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.65rem; font-size: 0.9rem; text-decoration: none;">
              📞 Call Procurement Desk (${escapeHtml(d.contactPhone)})
            </a>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("Error loading demands", err);
  }
}

function setupDemandForm() {
  const form = document.getElementById("demandForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      BuyerName: document.getElementById("buyerName").value.trim(),
      IndustryType: document.getElementById("industryType").value,
      Location: document.getElementById("buyerLocation").value.trim(),
      RequiredTons: parseFloat(document.getElementById("requiredTons").value) || 100,
      OfferedPricePerTon: parseFloat(document.getElementById("offeredPrice").value) || 2000,
      AcceptedForm: document.getElementById("acceptedForm").value,
      ContactPhone: document.getElementById("contactPhone").value.trim()
    };

    try {
      const res = await fetch("/api/demands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Procurement tender published successfully!");
        form.reset();
        loadDemands();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Failed to submit tender.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
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
