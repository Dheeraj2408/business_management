# 🚀 ALTHON 2.0 — Project Progress Log

### 👥 Team Overview
- **Team Name:** team dev
- **Team Members:** Dheeraj, Mahesh, Jeshwanth, Revan
- **Project Name:** Operix
- **Live Prototype:** `http://localhost:3000`

---

### 🎯 Problem Statement (How Might We)
> **"How might we help local shopkeepers effortlessly manage their inventory and build customer loyalty, while motivating businesses to adopt and source from sustainable, eco-friendly suppliers?"**

---

### 💡 Proposed Solution
We are developing **Operix**, an adaptive platform that connects everyday store management with practical sustainability incentives:
- **Adaptive Store Setup:** An interface that scales to the shop's operational needs—giving Kirana stores and pharmacies simple daily inventory and billing tools, while offering suppliers a clear format to document their sustainability practices.
- **Low-Friction Daily Management:** Eliminates tedious manual typing through quick voice/AI-based bill scanning, and introduces a simple phone-number visit tracker so merchants can reward repeat shoppers without expensive POS hardware.
- **Circular Green Incentives:** Directly rewards shoppers who bring reusable bags with instant checkout discounts, and enables shopkeepers to easily discover and stock products from verified eco-conscious suppliers.

---

### 🌍 Relevance
- **Grassroots Retail Need:** Local Kirana stores and neighbourhood pharmacies run on thin margins and manual registers. They face heavy competition from quick-commerce delivery apps and lack simple tools to track demand and retain loyal repeat customers.
- **Environmental Impact:** While customers and store owners care about eco-friendly choices, there is no straightforward mechanism for small businesses to evaluate supplier sustainability, or to reward customers who practice reusable habits.
- **Unified Value:** Bridging everyday shop operations with sustainability incentives makes going green practical and rewarding, rather than an extra compliance burden.

---

### ⚙️ Feasibility
- **Modular 4-Person Scope:** The system divides cleanly into independent modules that our 4-member team built in parallel: frontend shop flow (Mahesh), inventory database & contracts (Jeshwanth), AI scanner & advisors (Revan), and system shell & auth (Dheeraj).
- **Reliable Tech Stack:** Built using responsive React, Vite, Tailwind CSS, and lightweight client-side models for zero-lag offline demo resilience.
- **Focused Working Demo:** A complete working prototype covering all 3 business tiers, AI bill scanning, phone loyalty check-in, and ESG scoring.

---

### ⚡ Implemented Core Features (Full-Stack Working System)

1. **Live SQLite Database & Backend REST API (`/server`):**
   - Running live on `http://localhost:5000/api`.
   - Complete ACID persistence for products, customers, transactions, branches, and sustainability audits with automatic LocalStorage sync fallback.

2. **Real AI Suite & Google Gemini Vision Integration:**
   - 📸 **Multimodal AI Bill Scanner:** Allows uploading any physical bill image (PNG/JPG/PDF) or pre-seeded distributor invoices, processing line items via Google Gemini 1.5 Flash Vision API into live stock.
   - 🎙️ **Microphone Voice-to-Stock (Web Speech API):** Click the mic icon and speak naturally (*"Add 15 kg basmati rice for 350 rupees"*) — parsed and added directly to the database.
   - ⚠️ **AI Shelf-Life Risk Forecaster:** Detects perishables approaching expiry and applies 20% flash clearance discounts.
   - 🌿 **AI Green Advisor:** Algorithmic recommendations to raise ESG scores with one-click optimization simulation (+10 pts).

3. **Tier 1: General Stores (Kirana & Micro-Retail):**
   - Live inventory management with search, category filtering, low-stock warnings, and inline quantity adjustments (+ / -).
   - **CSV Export & Import:** Download full store catalog to `.csv` or bulk import supplier sheets.
   - Sales demand analytics with weekly revenue velocity bar charts and AI demand radar.

4. **Tier 2: Malls, Wholesales & Clinics:**
   - **Batch & Expiry Date Radar:** Tracks batch numbers (e.g. `BT-8892`, `AMX-4011`), urgency flags (`Critical <15d`, `Warning <45d`, `Safe`), and safe bio-disposal compliance logging.
   - **Customer Phone Loyalty & Green Stamp POS:** 10-digit mobile lookup, visit streak milestone discounts (10% on 5th visit), and "Brought Reusable Cloth Bag" Green Stamp discount.
   - 📱 **Real Dynamic UPI QR Code:** Generates genuine UPI payment QR codes scannable with Google Pay, PhonePe, or Paytm.
   - 🖨️ **Printable Tax Receipt:** Clean printable store receipt with customer details, item breakdown, tax, and eco-points badge.

5. **Tier 3: Industrial Enterprise & Manufacturing Suite:**
   - **Algorithmic Sustainability Index (0–100 ESG Score):** Real-time weighted formula across Solar Energy (30%), Recyclable Packaging (25%), Zero Landfill (25%), and Local Sourcing (20%).
   - 🏭 **Industrial Manufacturing Operations Suite:**
     - 👷 **Workforce & Factory Payroll Directory:** Tracks employees (`id`, `name`, `salary`, `contact`, `role`, `department`, `shift` A/B/C) with interactive new employee onboarding and payroll calculator.
     - 📦 **Raw Material Inventory & Inbound Consignments:** Tracks industrial manufacturing inputs (Kraft paper pulp, bio-polymers, aluminum foil roll, starch adhesive) with cost per ton/bag, supplier origin, reorder thresholds, and ESG grades.
     - ⚡ **Industrial Electricity & Power Telemetry:** Live breakdown of Solar Generation vs Grid Power consumption (kWh), monthly energy bill in ₹, carbon avoided tons, and interactive solar expansion slider.
     - ⚙️ **Heavy Machinery & Production Line Telemetry:** Monitors factory assembly & corrugation lines (Corrugator Line A1, Thermoformer Unit 2, High-Speed Slitter, Robotic Palletizer) with 1-click status toggling (`Running`, `Maintenance`, `Idle`), power ratings (kW), and real-time hourly output metrics (units/hr).
   - **Downstream Retailer Network:** Connected Kiranas & pharmacies purchasing verified green stock with interactive B2B dispatch invoice generator.
   - 🔄 **Functional Inter-Branch Transfers:** Move supplies between regional logistics hubs and warehouses with live atomic quantity updates.
