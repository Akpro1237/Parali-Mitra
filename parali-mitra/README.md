# 🌾 ParaliMitra - Anti-Stubble Burning & Farmer Biomass Exchange Platform

> **"किसान धन • स्वच्छ हवा • हरित भारत" (Farmer Wealth • Clean Air • Green India)**

ParaliMitra is a comprehensive web platform designed to solve India's severe crop residue / stubble (*parali*) burning crisis in Punjab, Haryana, Uttar Pradesh, and Rajasthan. It connects farmers who have paddy crop residue with industrial buyers (bio-ethanol refineries, NTPC biomass co-firing power plants, bio-pellet manufacturers, and paper mills).

When a farmer books an appointment for doorstep baling and stubble pickup, **the platform automatically sends a detailed email alert to the admin/coordinator** containing the farmer's contact details, location, acreage, preferred pickup slot, and payment details.

---

## 🌟 Key Features

### 1. 🚜 Doorstep Stubble Pickup & Appointment Booking
* Farmer-friendly form with **multilingual support (English, हिन्दी, ਪੰਜਾਬੀ)**.
* Farmers enter their land acreage, crop variety (Non-Basmati, Basmati, Sugarcane trash), district, village, and preferred pickup date/time slot.
* Provides instant appointment confirmation with a unique reference ID (e.g. `PM-2611-8269`), printable receipt slip, and one-click WhatsApp sharing.

### 2. ✉️ Instant Automated Email Notification
* **Admin Alert Dispatch**: As soon as a farmer books an appointment, an email is instantly generated and sent to the administrator/user.
* **Email Contents**:
  - Farmer Name, Clickable Phone Number (`tel:`) and direct **WhatsApp chat link**.
  - Village, District, State, and Field GPS Landmark.
  - Land Area (Acres), Estimated Biomass Yield (Tons), and Farmer Payout (₹).
  - Requested Pickup Date and Morning/Afternoon Time Slot.
  - Environmental Impact (Tons of CO2 and PM2.5 smoke prevented).
* **Dual-Delivery Mode**:
  - **Live SMTP**: Send real emails to your Gmail/Outlook/SendGrid inbox.
  - **Simulation Outbox**: Every outgoing email is saved to a visual Outbox in the Admin Dashboard, guaranteeing that no appointment is missed even before configuring SMTP credentials.

### 3. ⚡ Stubble Yield & Earnings Calculator
* Interactive real-time calculator with an acreage slider.
* Shows farmers how much money they can earn (guaranteed **₹2,000–₹2,500 per ton**) instead of burning the residue and destroying their soil micronutrients.
* Displays environmental savings: kg of toxic smoke avoided and tons of CO2 offset.

### 4. 🏭 Industry Procurement Marketplace
* Demands board where 2G Bio-Ethanol refineries (e.g., IOCL Panipat), NTPC Thermal Power Plants, and pellet manufacturers publish active procurement tenders.
* Industrial buyers can post new residue requirements directly.

### 5. ⚙️ Admin & Dispatch Management Center
* Live appointment management table with district filtering.
* Baler assignment and status updater (Pending → Baler Assigned → In Transit → Picked Up → Completed).
* 1-Click SMTP configuration with a **"Send Test Email"** button to verify delivery directly to your inbox.
* Outbox log viewer allowing you to preview the exact HTML emails.

---

## 🚀 How to Run the Website

### Option 1: Double-Click (Easiest)
Navigate to `C:\Users\iamsu\.gemini\antigravity\scratch\parali-mitra` and double-click:
* **`run.bat`** (Windows Batch file) or **`run.ps1`** (PowerShell script).

### Option 2: Command Line
Open PowerShell and run:
```powershell
cd C:\Users\iamsu\.gemini\antigravity\scratch\parali-mitra
$env:DOTNET_CLI_HOME = "C:\Users\iamsu\.gemini\antigravity\scratch\.dotnet"
& "C:\Program Files\dotnet\dotnet.exe" run
```

Then open your browser at:
* **Farmer Portal**: `http://localhost:5000/`
* **Admin & Email Outbox Center**: `http://localhost:5000/admin.html`
* **Biomass Marketplace**: `http://localhost:5000/marketplace.html`

---

## 📧 How to Set Your Email for Alerts

1. Open `http://localhost:5000/admin.html`.
2. In the **Stubble Appointment Email Notification Settings** card:
   - Enter your email address in the **Your Admin Notification Email** box.
   - Click **Save Email**.
3. (Optional for live delivery to your Gmail):
   - Click **Configure Real SMTP**.
   - Enter your Gmail address in **SMTP Username**.
   - Enter your 16-character [Google App Password](https://myaccount.google.com/apppasswords) in **SMTP Password**.
   - Uncheck "Simulation Mode" and click **Save All Settings**.
   - Click **Send Test Email** to verify!
