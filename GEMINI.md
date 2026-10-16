# 🚀 Operix — Team Dev Knowledge Base & Context

> **Hackathon:** ALTHON 2.0 (24-Hour Hackathon)  
> **Team Name:** `team dev`  
> **Team Members:** Dheeraj (Lead/Integrator), Mahesh (Frontend Lead), Jeshwanth (Backend/Data), Revan (AI & Pitch Master)  
> **Repository:** `https://github.com/Dheeraj2408/business_management.git`

---

## 📌 Project Overview
**Operix** is an adaptive commerce and sustainability operating system spanning from corner Kirana stores to specialized pharmacies and industrial manufacturers.

### The 3 Business Tiers (Adaptive Chameleon UI):
1. **Tier 1: General Store (Kirana / Micro-Retail):**
   - Fast inventory catalog with search, category filtering, low-stock warnings, and inline quantity adjustments (+ / -).
   - Sales & demand statistics with weekly revenue velocity bar charts and AI demand radar.
2. **Tier 2: Malls, Wholesales & Clinics:**
   - Everything in Tier 1.
   - **Batch & Expiry Date Radar:** Tracks batch numbers (e.g. `BT-8892`, `AMX-4011`), color-coded urgency flags (`Critical <15d`, `Warning <45d`, `Safe`), and safe bio-disposal compliance logging.
   - **Customer Phone Loyalty & Green Stamp POS:** 10-digit mobile lookup, visit streak milestone discounts (10% on 5th visit), and "Brought Reusable Cloth Bag" Green Stamp discount.
3. **Tier 3: Industrial Enterprise & Manufacturing Suite:**
   - Everything in Tier 2.
   - **Algorithmic Sustainability Index (0–100 ESG Score):** Real-time weighted formula across Solar Energy (30%), Recyclable Packaging (25%), Zero Landfill (25%), and Local Sourcing (20%).
   - **Industrial Manufacturing Operations Suite (`/features/industry/IndustrialOperations.tsx`):**
     - Factory workforce directory & payroll (`id`, `name`, `salary`, `contact`, shift, department).
     - Raw material inventory costing (Kraft paper pulp, biopolymers, aluminum foil rolls, resins).
     - Electricity & power telemetry (Solar generation vs Grid consumption kWh, monthly bill ₹, carbon offset).
     - Heavy machinery & production lines telemetry (1-click status toggle, kW rating, units/hr output).
   - **Downstream Retailer Network:** Directory of connected Kiranas and clinics buying verified green stock.
   - **Branch Management:** Multi-facility distribution hubs and packaging plants with manager details and localized inventory counts.

### 🤖 AI Intelligence Suite:
- **AI Wholesale Bill Scanner (`/features/ai/AIBillScanner.tsx`):** Extracts products, quantities, wholesale rates, and batch codes from paper invoices into live stock.
- **AI Shelf-Life & Waste Risk Forecaster (`/features/ai/AIExpiryForecaster.tsx`):** Identifies batches at risk of expiring unsold and suggests flash clearance discounts.
- **AI Green Transformation Advisor (`/features/ai/AIGreenAdvisor.tsx`):** Algorithmic recommendations to raise ESG scores with one-click optimization simulation.

---

## ⚡ How to Run Locally (Quick Start)

```bash
# 1. Clone the repository
git clone https://github.com/Dheeraj2408/business_management.git
cd business_management/client

# 2. Install dependencies (runs in ~30s)
npm install

# 3. Start development server
npm run dev
```
The app will be live at `http://localhost:3000`.

---

## 👥 Module Ownership & Contribution Guide

To prevent merge conflicts, each member has strict ownership of their respective directory:

### 1. Dheeraj (Team Lead & Integrator)
- **Owns:** `client/src/App.tsx`, `client/src/components/Navbar.tsx`, `client/src/components/AuthModal.tsx`, routing, and cloud deployment (Vercel/Render).
- **Rule:** Dheeraj is the only person who modifies the top-level app layout and root configuration files.

### 2. Mahesh (Frontend Lead)
- **Owns:** `client/src/features/generalStore/` and `client/src/features/midScale/`
- **Next Steps:**
  - Enhance POS checkout with UPI QR Code generator for payments.
  - Add quick receipt printable styling or export to PDF button.
  - Polish animations on the customer loyalty modal.

### 3. Jeshwanth (Backend & Data Lead)
- **Owns:** `client/src/types/index.ts`, `client/src/data/mockData.ts`, and `/server` (if backend API is added).
- **Next Steps:**
  - Ensure data persistence via `localStorage` or setup a lightweight Express/FastAPI SQLite backend.
  - Refine the ESG score mathematical formula in `SustainabilityScore.tsx`.
  - Add export/import CSV functionality for store inventory.

### 4. Revan (AI Specialist & Pitch Master)
- **Owns:** `client/src/features/ai/`, Pitch Deck, and Demo Video.
- **Next Steps:**
  - Connect real Google Gemini API / Web Speech API into the AI Bill Scanner and Voice input.
  - Create the 8-minute pitch deck slides (Canva/Slides) based on `PROGRESS.md`.
  - Record a 2-minute backup demo video of the working flow on `localhost:3000` to ensure 100% demo safety.

---

## 🛡️ Git Workflow Rules
1. Never commit directly to `main` without testing `npm run build` first.
2. Always create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Pull the latest `main` before pushing:
   ```bash
   git checkout main
   git pull origin main
   git checkout feat/your-feature-name
   git rebase main
   ```
4. Never commit `node_modules/` or `.env` files.
