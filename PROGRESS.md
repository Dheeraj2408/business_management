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

### ⚡ Implemented Core Features (Working Prototype)

1. **Merchant Authentication (Phone / Email) & 3-Tier Chameleon UI:**
   - One-click account switching between **General Store**, **Clinic/Mall**, and **Industry**.

2. **Tier 1: General Stores (Kirana & Micro-Retail):**
   - Real-time inventory table with low-stock warnings and quick quantity updates (+ / -).
   - Sales demand analytics with weekly revenue velocity bar charts.

3. **Tier 2: Malls, Wholesales & Clinics:**
   - **Batch & Expiry Date Radar:** Color-coded urgency alerts (`Critical <15d`, `Warning <45d`, `Safe`) and medical bio-waste disposal logging.
   - **Customer Phone Loyalty Portal:** 10-digit mobile check-in, visit count milestone discounts (10% on 5th visit), and "Brought Reusable Cloth Bag" Green Stamp discount.

4. **Tier 3: Industrial Enterprise:**
   - **Algorithmic Sustainability Index (0–100):** Real-time weighted formula across Solar Energy %, Recyclable Packaging %, Zero Landfill %, and Local Sourcing.
   - **Downstream Retailer Network:** Directory of connected Kiranas and pharmacies purchasing certified sustainable stock.
   - **Multi-Branch Management:** Regional distribution hubs and warehouses tracking SKU counts and manager assignments.

5. **AI Intelligence Suite:**
   - 📸 **AI Wholesale Bill-to-Stock Scanner:** Extracts products, quantities, wholesale rates, and batch codes from paper invoices.
   - ⚠️ **AI Shelf-Life & Waste Risk Forecaster:** Identifies batches at risk of expiring unsold and suggests flash clearance discounts.
   - 🌿 **AI Green Transformation Advisor:** Algorithmic recommendations to raise ESG scores with one-click optimization simulation.
