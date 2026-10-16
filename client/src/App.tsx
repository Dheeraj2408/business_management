import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { AIBillScanner } from './features/ai/AIBillScanner';
import { AIExpiryForecaster } from './features/ai/AIExpiryForecaster';
import { AIGreenAdvisor } from './features/ai/AIGreenAdvisor';
import { StockManagement } from './features/generalStore/StockManagement';
import { SalesStats } from './features/generalStore/SalesStats';
import { ExpiryTracker } from './features/midScale/ExpiryTracker';
import { CustomerLoyalty } from './features/midScale/CustomerLoyalty';
import { SustainabilityScore } from './features/industry/SustainabilityScore';
import { RetailerNetwork } from './features/industry/RetailerNetwork';
import { BranchManagement } from './features/industry/BranchManagement';

import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUSTAINABILITY,
  INITIAL_RETAILERS,
  INITIAL_BRANCHES
} from './data/mockData';
import { BusinessTier, User, Product, CustomerLoyalty as CustomerType, SustainabilityMetric } from './types';
import { Sparkles, Shield, Store, Building2, Factory } from 'lucide-react';

export const App: React.FC = () => {
  // Global State
  const [user, setUser] = useState<User>({
    id: 'usr-kirana',
    name: 'Venkatesh Rao',
    emailOrPhone: '+91 98765 43210',
    storeName: 'Sri Lakshmi Kirana & General Store',
    tier: 'general_store'
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<CustomerType[]>(INITIAL_CUSTOMERS);
  const [sustainability, setSustainability] = useState<SustainabilityMetric>(INITIAL_SUSTAINABILITY);
  const [retailers] = useState(INITIAL_RETAILERS);
  const [branches] = useState(INITIAL_BRANCHES);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Switch tier handler
  const handleSwitchTier = (tier: BusinessTier) => {
    let updatedStoreName = user.storeName;
    if (tier === 'general_store') updatedStoreName = 'Sri Lakshmi Kirana & General Store';
    if (tier === 'mall_clinic') updatedStoreName = 'MetroCare Pharmacy & Health Mart';
    if (tier === 'industry') updatedStoreName = 'EcoPack Green Mfg Industries Ltd';

    setUser(prev => ({
      ...prev,
      tier,
      storeName: updatedStoreName
    }));
  };

  // Stock Quantity Updater
  const handleUpdateQuantity = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, quantity: Math.max(0, p.quantity + delta) };
      }
      return p;
    }));
  };

  // Add Product from Manual Modal
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  // Import products from AI Bill Scanner
  const handleImportScannedProducts = (newItems: Product[]) => {
    setProducts(prev => [...newItems, ...prev]);
  };

  // Expiry Forecaster: Apply Flash Clearance Discount
  const handleApplyDiscount = (productId: string, discountPct: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const discountedPrice = Math.round(p.price * (1 - discountPct / 100));
        return { ...p, price: discountedPrice };
      }
      return p;
    }));
  };

  // Safe Medical Waste Disposal Log
  const handleLogDisposal = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    // Reward sustainability points
    setSustainability(prev => ({
      ...prev,
      wasteDiversionPct: Math.min(100, prev.wasteDiversionPct + 2),
      overallScore: Math.min(100, prev.overallScore + 1)
    }));
  };

  // Complete Customer Phone Checkout
  const handleCompleteCheckout = (phone: string, broughtBag: boolean, total: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.phone === phone) {
        return {
          ...c,
          visitCount: c.visitCount + 1,
          greenPoints: c.greenPoints + (broughtBag ? 25 : 10),
          reusableBagCount: c.reusableBagCount + (broughtBag ? 1 : 0),
          lastVisit: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
  };

  // AI Green Advisor: Apply recommendations
  const handleApplyOptimization = () => {
    setSustainability(prev => ({
      ...prev,
      renewableEnergyPct: Math.min(100, prev.renewableEnergyPct + 12),
      recyclablePackagingPct: Math.min(100, prev.recyclablePackagingPct + 10),
      wasteDiversionPct: Math.min(100, prev.wasteDiversionPct + 5),
      overallScore: Math.min(100, prev.overallScore + 10),
      carbonSavedTons: prev.carbonSavedTons + 34
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        user={user}
        onSwitchTier={handleSwitchTier}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Adaptive Context Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {user.tier === 'general_store' && <Store className="w-5 h-5 text-emerald-400" />}
              {user.tier === 'mall_clinic' && <Building2 className="w-5 h-5 text-sky-400" />}
              {user.tier === 'industry' && <Factory className="w-5 h-5 text-purple-400" />}
              <h2 className="text-lg font-black text-white">{user.storeName}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
                {user.emailOrPhone}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {user.tier === 'general_store' && "Viewing General Store Workspace: Voice & AI Stock Management + Demand Statistics"}
              {user.tier === 'mall_clinic' && "Viewing Mall / Clinic Workspace: Batch Expiry Radar + Phone Number Loyalty Engine"}
              {user.tier === 'industry' && "Viewing Enterprise Industry Workspace: ESG Sustainability Index + Retailer Directory + Branch Oversight"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scan Bill with AI</span>
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
            >
              Switch Account
            </button>
          </div>
        </div>

        {/* ========================================================
            TIER 1: GENERAL STORES
            Features: Stock Management + Sales Statistics
           ======================================================== */}
        {user.tier === 'general_store' && (
          <div className="space-y-6 animate-fade-in">
            {/* Sales & Demand Stats */}
            <SalesStats products={products} />

            {/* Stock Management Table */}
            <StockManagement
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
              onAddProduct={handleAddProduct}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          </div>
        )}

        {/* ========================================================
            TIER 2: MALLS / WHOLESALES / CLINICS
            Features: Expiry Date Radar + Customer Phone Loyalty + Stock + Stats
           ======================================================== */}
        {user.tier === 'mall_clinic' && (
          <div className="space-y-6 animate-fade-in">
            {/* AI Shelf-Life & Waste Risk Forecaster */}
            <AIExpiryForecaster
              products={products}
              onApplyDiscount={handleApplyDiscount}
            />

            {/* Batch & Expiry Date Radar */}
            <ExpiryTracker
              products={products}
              onLogDisposal={handleLogDisposal}
            />

            {/* Customer Phone Loyalty & Green Stamp POS */}
            <CustomerLoyalty
              customers={customers}
              products={products}
              onCompleteCheckout={handleCompleteCheckout}
            />

            {/* Stock Catalog */}
            <StockManagement
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
              onAddProduct={handleAddProduct}
              onOpenScanner={() => setIsScannerOpen(true)}
            />

            {/* Sales Stats */}
            <SalesStats products={products} />
          </div>
        )}

        {/* ========================================================
            TIER 3: INDUSTRIES / ENTERPRISE
            Features: ESG Sustainability Index + AI Green Advisor + Retailers + Branches
           ======================================================== */}
        {user.tier === 'industry' && (
          <div className="space-y-6 animate-fade-in">
            {/* AI Green Transformation Advisor */}
            <AIGreenAdvisor
              metrics={sustainability}
              onApplyOptimization={handleApplyOptimization}
            />

            {/* Algorithmic ESG Sustainability Score Dials */}
            <SustainabilityScore
              metrics={sustainability}
              onUpdateMetrics={setSustainability}
            />

            {/* Downstream Retailer Directory */}
            <RetailerNetwork retailers={retailers} />

            {/* Multi-Branch Management */}
            <BranchManagement branches={branches} />

            {/* Expiry / Batch & Stock Oversight */}
            <ExpiryTracker
              products={products}
              onLogDisposal={handleLogDisposal}
            />

            <StockManagement
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
              onAddProduct={handleAddProduct}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={setUser}
      />

      <AIBillScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onImportProducts={handleImportScannedProducts}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ALTHON 2.0 • 24-Hour Hackathon Prototype</span>
          <span className="font-semibold text-slate-400">
            Built by <strong className="text-white">team dev</strong> (Dheeraj, Mahesh, Jeshwanth, Revan)
          </span>
          <span className="text-emerald-400 font-medium">EcoTrade OS — Live Demo</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
