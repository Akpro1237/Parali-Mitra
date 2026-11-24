// Multilingual Dictionary
const translations = {
  en: {
    heroTag: "🌾 Zero Stubble Burning Initiative (India)",
    heroTitle: "Don't Burn Parali, <span class='highlight'>Sell It for Cash</span>",
    heroDesc: "Prevent air pollution, enrich your farmland, and earn guaranteed ₹2,000–₹2,500 per ton. Book a free doorstep baler pickup today!",
    calcTitle: "⚡ Stubble Value & Carbon Calculator",
    calcSubtitle: "Calculate how much you earn and how much pollution you prevent",
    acresLabel: "Land Area (in Acres):",
    cropLabel: "Crop Variety:",
    estYieldLabel: "Estimated Stubble Yield",
    estPayoutLabel: "Estimated Farmer Payout",
    smogLabel: "Toxic Smoke Prevented",
    co2Label: "CO2 Offset",
    btnCalculateAndBook: "Book Free Pickup For This Land",
    formTitle: "Book Doorstep Stubble Pickup",
    formSubtitle: "Free Baler & Truck arrives directly at your field. Zero burning, instant bank/UPI payment.",
    fullName: "Farmer Full Name",
    phone: "Mobile Phone (10 Digits)",
    email: "Email (Optional - for receipt)",
    state: "State",
    district: "District",
    village: "Village / Tehsil & Landmark",
    condition: "Stubble Condition",
    pickupDate: "Preferred Pickup Date",
    timeSlot: "Preferred Time Slot",
    paymentMode: "Payment Receiving Mode",
    upiOrAccount: "UPI ID or Bank Account No",
    submitBtn: "🌾 Confirm Stubble Pickup Appointment",
    noticeEmail: "🚜 <strong>Free Doorstep Baling:</strong> Once submitted, our local agricultural coordinator receives your appointment and schedules your tractor baler."
  },
  hi: {
    heroTag: "🌾 स्वच्छ भारत - पराली से कमाई मिशन",
    heroTitle: "पराली जलाओ मत, <span class='highlight'>सम्मान से बेचो</span>",
    heroDesc: "हवा को जहरीला होने से बचाएं, जमीन की ताकत बढ़ाएं और प्रति टन ₹2,000 - ₹2,500 तक सीधा लाभ पाएं। आज ही अपने खेत से फ्री बेलर पिकअप बुक करें!",
    calcTitle: "⚡ पराली मूल्य एवं प्रदूषण निवारण कैलकुलेटर",
    calcSubtitle: "जानें आपके खेत से कितनी पराली निकलेगी और कितना रुपया आपको मिलेगा",
    acresLabel: "खेत का रकबा (एकड़ में):",
    cropLabel: "धान/फसल की किस्म:",
    estYieldLabel: "अनुमानित पराली पैदावार",
    estPayoutLabel: "किसान को अनुमानित भुगतान",
    smogLabel: "जहरीले धुएं से बचाव",
    co2Label: "कार्बन उत्सर्जन की बचत",
    btnCalculateAndBook: "इस खेत के लिए फ्री पिकअप बुक करें",
    formTitle: "खेत से पराली उठान अपॉइंटमेंट बुक करें",
    formSubtitle: "बेलर और ट्रैक्टर सीधा आपके खेत पर आएगा। पराली की तुलाई के तुरंत बाद बैंक/UPI में भुगतान।",
    fullName: "किसान का पूरा नाम",
    phone: "मोबाइल नंबर (10 अंक)",
    email: "ईमेल (वैकल्पिक)",
    state: "राज्य",
    district: "जिला",
    village: "गांव / तहसील एवं खेत का मुख्य निशान",
    condition: "पराली की स्थिति",
    pickupDate: "पिकअप की पसंदीदा तारीख",
    timeSlot: "पिकअप का समय",
    paymentMode: "भुगतान का माध्यम",
    upiOrAccount: "UPI आईडी या बैंक खाता संख्या",
    submitBtn: "🌾 पराली उठान अपॉइंटमेंट पक्का करें",
    noticeEmail: "🚜 <strong>फ्री बेलर सुविधा:</strong> फॉर्म भरने के बाद हमारी स्थानीय टीम तुरंत आपके खेत पर बेलर और ट्रैक्टर का समय निर्धारित करेगी।"
  },
  pa: {
    heroTag: "🌾 ਪਰਾਲੀ ਮੁਕਤ ਪੰਜਾਬ ਤੇ ਭਾਰਤ ਮਿਸ਼ਨ",
    heroTitle: "ਪਰਾਲੀ ਨੂੰ ਅੱਗ ਨਾ ਲਾਓ, <span class='highlight'>ਸਿੱਧਾ ਵੇਚੋ ਤੇ ਕਮਾਓ</span>",
    heroDesc: "ਹਵਾ ਨੂੰ ਜ਼ਹਿਰੀਲੀ ਹੋਣ ਤੋਂ ਬਚਾਓ, ਆਪਣੀ ਜ਼ਮੀਨ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਧਾਓ ਅਤੇ ₹2,000-₹2,500 ਪ੍ਰਤੀ ਟਨ ਸਿੱਧੀ ਕਮਾਈ ਕਰੋ। ਅੱਜ ਹੀ ਮੁਫਤ ਬੇਲਰ ਬੁੱਕ ਕਰੋ!",
    calcTitle: "⚡ ਪਰਾਲੀ ਕਮਾਈ ਅਤੇ ਪ੍ਰਦੂਸ਼ਣ ਰੋਕਥਾਮ ਕੈਲਕੁਲੇਟਰ",
    calcSubtitle: "ਦੇਖੋ ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚੋਂ ਕਿੰਨੀ ਪਰਾਲੀ ਨਿਕਲੇਗੀ ਅਤੇ ਕਿੰਨੇ ਪੈਸੇ ਮਿਲਣਗੇ",
    acresLabel: "ਖੇਤ ਦਾ ਰਕਬਾ (ਏਕੜ ਵਿੱਚ):",
    cropLabel: "ਝੋਨੇ / ਫ਼ਸਲ ਦੀ ਕਿਸਮ:",
    estYieldLabel: "ਅਨੁਮਾਨਿਤ ਪਰਾਲੀ ਮਾਤਰਾ",
    estPayoutLabel: "ਕਿਸਾਨ ਨੂੰ ਮਿਲਣ ਵਾਲੀ ਰਕਮ",
    smogLabel: "ਜ਼ਹਿਰੀਲੇ ਧੂੰਏਂ ਤੋਂ ਬਚਾਅ",
    co2Label: "ਕਾਰਬਨ ਨਿਕਾਸ ਦੀ ਬੱਚਤ",
    btnCalculateAndBook: "ਇਸ ਰਕਬੇ ਲਈ ਮੁਫਤ ਪਿਕਅੱਪ ਬੁੱਕ ਕਰੋ",
    formTitle: "ਖੇਤ 'ਚੋਂ ਪਰਾਲੀ ਚੁਕਾਈ ਲਈ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ",
    formSubtitle: "ਬੇਲਰ ਤੇ ਟਰਾਲੀ ਸਿੱਧੀ ਤੁਹਾਡੇ ਖੇਤ ਪਹੁੰਚੇਗੀ। ਕੰਡੇ ਤੋਂ ਬਾਅਦ ਤੁਰੰਤ ਬੈਂਕ ਖਾਤੇ 'ਚ ਰਕਮ।",
    fullName: "ਕਿਸਾਨ ਦਾ ਪੂਰਾ ਨਾਮ",
    phone: "ਮੋਬਾਈਲ ਨੰਬਰ (10 ਅੰਕ)",
    email: "ਈਮੇਲ (ਜੇਕਰ ਹੈ)",
    state: "ਸੂਬਾ",
    district: "ਜ਼ਿਲ੍ਹਾ",
    village: "ਪਿੰਡ / ਤਹਿਸੀਲ ਅਤੇ ਖੇਤ ਦਾ ਪਤਾ",
    condition: "ਪਰਾਲੀ ਦੀ ਹਾਲਤ",
    pickupDate: "ਪਿਕਅੱਪ ਦੀ ਮਿਤੀ",
    timeSlot: "ਸਮਾਂ (ਸਵੇਰੇ / ਦੁਪਹਿਰੇ)",
    paymentMode: "ਭੁਗਤਾਨ ਦਾ ਤਰੀਕਾ",
    upiOrAccount: "ਯੂਪੀਆਈ (UPI) ਜਾਂ ਬੈਂਕ ਖਾਤਾ ਨੰਬਰ",
    submitBtn: "🌾 ਪਰਾਲੀ ਚੁਕਾਈ ਅਪਾਇੰਟਮੈਂਟ ਕਨਫਰਮ ਕਰੋ",
    noticeEmail: "🚜 <strong>ਮੁਫਤ ਬੇਲਰ ਸੁਵਿਧਾ:</strong> ਫਾਰਮ ਭਰਨ ਉਪਰੰਤ ਸਾਡੀ ਟੀਮ ਤੁਰੰਤ ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚ ਬੇਲਰ ਅਤੇ ਟਰਾਲੀ ਦਾ ਸਮਾਂ ਤੈਅ ਕਰੇਗੀ।"
  }
};

let currentLang = 'en';

const districtsByState = {
  Punjab: [
    "Ludhiana", "Amritsar", "Patiala", "Sangrur", "Bathinda", "Firozpur", 
    "Jalandhar", "Moga", "Kapurthala", "Barnala", "Fazilka", "Gurdaspur", 
    "Hoshiarpur", "Mansha", "Muktsar", "Fatehgarh Sahib", "Rupnagar", "Tarn Taran"
  ],
  Haryana: [
    "Karnal", "Kurukshetra", "Kaithal", "Ambala", "Fatehabad", "Jind", 
    "Panipat", "Sirsa", "Yamunanagar", "Sonipat", "Hisar", "Rohtak", "Jhajjar"
  ],
  "Uttar Pradesh": [
    "Meerut", "Saharanpur", "Muzaffarnagar", "Baghpat", "Bulandshahr", 
    "Shamli", "Aligarh", "Mathura", "Bareilly", "Pilibhit", "Shahjahanpur", "Lakhimpur Kheri"
  ],
  Rajasthan: [
    "Sri Ganganagar", "Hanumangarh", "Kota", "Bundi", "Baran", "Bharatpur"
  ],
  "Delhi-NCR": [
    "North Delhi", "North West Delhi", "Najafgarh", "Outer Delhi"
  ]
};

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupLanguageSwitcher();
  setupCalculator();
  setupDistrictSelector();
  setupDateDefault();
  setupBookingForm();
  loadImpactStats();
});

function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobileNavToggle");
  const navLinks = document.getElementById("navLinks");
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("active");
    navLinks.classList.toggle("mobile-open");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggleBtn.classList.remove("active");
      navLinks.classList.remove("mobile-open");
    });
  });
}

function setupLanguageSwitcher() {
  const buttons = document.querySelectorAll(".lang-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLang = btn.dataset.lang;
      applyLanguage(currentLang);
    });
  });
}

function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;
  document.querySelectorAll("[data-i18n]").forEach(elem => {
    const key = elem.getAttribute("data-i18n");
    if (dict[key]) {
      elem.innerHTML = dict[key];
    }
  });
}

// Calculator Logic
function setupCalculator() {
  const acresSlider = document.getElementById("acresSlider");
  const acresBadge = document.getElementById("acresBadge");
  const cropSelect = document.getElementById("calcCrop");
  const estYieldElem = document.getElementById("estYield");
  const estPayoutElem = document.getElementById("estPayout");
  const smogAvoidedElem = document.getElementById("smogAvoided");
  const co2OffsetElem = document.getElementById("co2Offset");
  const btnBookFromCalc = document.getElementById("btnBookFromCalc");

  function updateCalculations() {
    const acres = parseFloat(acresSlider.value) || 1;
    acresBadge.textContent = `${acres} ${acres === 1 ? 'Acre' : 'Acres'}`;

    const crop = cropSelect ? cropSelect.value : "Paddy / Non-Basmati";
    const yieldPerAcre = crop.includes("Basmati") ? 2.0 : (crop.includes("Sugarcane") ? 3.5 : 2.2);
    const pricePerTon = 2100; // Average ₹2,100 per metric ton

    const totalTons = Math.round(acres * yieldPerAcre * 10) / 10;
    const totalPayout = Math.round(totalTons * pricePerTon);
    const co2Offset = Math.round(totalTons * 1.5 * 10) / 10;
    const smogAvoidedKg = Math.round(totalTons * 18); // ~18kg PM2.5 / smog particulates per ton burned

    if (estYieldElem) estYieldElem.textContent = `${totalTons} Tons`;
    if (estPayoutElem) estPayoutElem.textContent = `₹${totalPayout.toLocaleString('en-IN')}`;
    if (smogAvoidedElem) smogAvoidedElem.textContent = `${smogAvoidedKg} kg Smoke`;
    if (co2OffsetElem) co2OffsetElem.textContent = `${co2Offset} Tons CO2`;
  }

  if (acresSlider) {
    acresSlider.addEventListener("input", updateCalculations);
  }
  if (cropSelect) {
    cropSelect.addEventListener("change", updateCalculations);
  }

  const btnMinusAcres = document.getElementById("btnMinusAcres");
  const btnPlusAcres = document.getElementById("btnPlusAcres");
  if (btnMinusAcres) {
    btnMinusAcres.addEventListener("click", () => {
      let val = (parseFloat(acresSlider.value) || 1) - 1;
      if (val < 1) val = 1;
      acresSlider.value = val;
      updateCalculations();
    });
  }
  if (btnPlusAcres) {
    btnPlusAcres.addEventListener("click", () => {
      let val = (parseFloat(acresSlider.value) || 1) + 1;
      if (val > 50) val = 50;
      acresSlider.value = val;
      updateCalculations();
    });
  }

  updateCalculations();

  if (btnBookFromCalc) {
    btnBookFromCalc.addEventListener("click", () => {
      const acres = acresSlider.value;
      const crop = cropSelect.value;
      const formAcres = document.getElementById("formAcres");
      const formCrop = document.getElementById("formCrop");

      if (formAcres) formAcres.value = acres;
      if (formCrop) formCrop.value = crop;

      const bookingSec = document.getElementById("booking-section");
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// State & District Dropdown Populator
function setupDistrictSelector() {
  const stateSelect = document.getElementById("formState");
  const districtSelect = document.getElementById("formDistrict");

  function populateDistricts(state) {
    if (!districtSelect) return;
    districtSelect.innerHTML = '<option value="">-- Select District (जिला चुनें) --</option>';
    const list = districtsByState[state] || districtsByState.Punjab;
    list.forEach(dist => {
      const opt = document.createElement("option");
      opt.value = dist;
      opt.textContent = dist;
      districtSelect.appendChild(opt);
    });
  }

  if (stateSelect) {
    stateSelect.addEventListener("change", (e) => {
      populateDistricts(e.target.value);
    });
    populateDistricts(stateSelect.value || "Punjab");
  }
}

function setupDateDefault() {
  const dateInput = document.getElementById("formPickupDate");
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }
}

// Booking Form Submission & Email Trigger
function setupBookingForm() {
  const form = document.getElementById("appointmentForm");
  const submitBtn = document.getElementById("btnSubmitBooking");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("formName").value.trim();
    const phone = document.getElementById("formPhone").value.trim();
    const email = document.getElementById("formEmail") ? document.getElementById("formEmail").value.trim() : "";
    const state = document.getElementById("formState").value;
    const district = document.getElementById("formDistrict").value;
    const village = document.getElementById("formVillage").value.trim();
    const acres = parseFloat(document.getElementById("formAcres").value) || 1;
    const crop = document.getElementById("formCrop").value;
    const condition = document.getElementById("formCondition").value;
    const pickupDate = document.getElementById("formPickupDate").value;
    const timeSlot = document.getElementById("formTimeSlot").value;
    const landmark = document.getElementById("formLandmark") ? document.getElementById("formLandmark").value.trim() : "";
    const paymentMode = document.getElementById("formPaymentMode").value;
    const upiOrAccount = document.getElementById("formUpiOrAccount") ? document.getElementById("formUpiOrAccount").value.trim() : "";

    if (!name || !phone) {
      alert("Please enter Farmer Name and valid 10-digit Phone Number.");
      return;
    }
    if (!district) {
      alert("Please select your District.");
      return;
    }

    // Prepare payload
    const payload = {
      FarmerName: name,
      Phone: phone,
      Email: email,
      State: state,
      District: district,
      TehsilOrVillage: village,
      LandAreaAcres: acres,
      CropVariety: crop,
      StubbleCondition: condition,
      PreferredDate: pickupDate,
      PreferredTimeSlot: timeSlot,
      FieldLandmark: landmark,
      PaymentMethod: paymentMode,
      UpiOrAccount: upiOrAccount
    };

    // UI Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>⏳</span> Registering Appointment & Dispatching Email Alert...`;

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showConfirmationModal(data.appointment, data.emailStatus);
        form.reset();
        setupDateDefault();
        setupDistrictSelector();
        loadImpactStats();
      } else {
        alert("Booking failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please ensure the backend is running.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>🌾</span> <span data-i18n="submitBtn">Confirm Stubble Pickup Appointment</span>`;
      applyLanguage(currentLang);
    }
  });
}

function showConfirmationModal(appointment, emailStatus) {
  const modal = document.getElementById("confirmationModal");
  if (!modal) return;

  document.getElementById("modalBookingId").textContent = appointment.id;
  document.getElementById("modalFarmerName").textContent = appointment.farmerName;
  document.getElementById("modalPhone").textContent = appointment.phone;
  document.getElementById("modalLocation").textContent = `${appointment.tehsilOrVillage}, ${appointment.district}, ${appointment.state}`;
  document.getElementById("modalAcres").textContent = `${appointment.landAreaAcres} Acres (~${appointment.estimatedTons} Tons)`;
  document.getElementById("modalPayout").textContent = `₹${appointment.estimatedPayoutInr.toLocaleString('en-IN')}`;
  document.getElementById("modalPickupSlot").textContent = `${appointment.preferredDate} (${appointment.preferredTimeSlot})`;
  
  const emailAlertBadge = document.getElementById("modalEmailStatus");
  if (emailAlertBadge) {
    emailAlertBadge.innerHTML = `<strong>✅ Pickup Request Confirmed:</strong> Our local baler team has received your appointment. We will contact you at <strong>${appointment.phone}</strong> before arriving at your field.`;
  }

  // Setup WhatsApp share button
  const shareText = `Hello, I have booked a paddy stubble pickup on ParaliMitra! Booking ID: ${appointment.id}, Acres: ${appointment.landAreaAcres}, Village: ${appointment.tehsilOrVillage}, District: ${appointment.district}. Please dispatch the baler.`;
  const waBtn = document.getElementById("modalBtnWhatsApp");
  if (waBtn) {
    waBtn.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }

  modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("confirmationModal");
  if (modal) modal.classList.remove("active");
}

// Fetch live impact stats from API
async function loadImpactStats() {
  try {
    const res = await fetch("/api/stats");
    if (!res.ok) return;
    const stats = await res.json();

    const acresElem = document.getElementById("statAcres");
    const tonsElem = document.getElementById("statTons");
    const payoutElem = document.getElementById("statPayout");
    const co2Elem = document.getElementById("statCO2");

    if (acresElem) acresElem.textContent = `${stats.totalAcres.toLocaleString('en-IN')}+`;
    if (tonsElem) tonsElem.textContent = `${stats.totalTons.toLocaleString('en-IN')} Tons`;
    if (payoutElem) payoutElem.textContent = `₹${(stats.totalPayout / 100000).toFixed(2)} Lakh`;
    if (co2Elem) co2Elem.textContent = `${stats.co2PreventedTons.toLocaleString('en-IN')} Tons`;
  } catch (e) {
    console.warn("Could not load live stats", e);
  }
}
