import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
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
import {
  fetchProducts,
  createProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  processCheckout,
  updateSustainability as apiUpdateSustainability,
  transferBranchStock as apiTransferBranchStock
} from './services/api';

import { BusinessTier, User, Product, CustomerLoyalty as CustomerType, SustainabilityMetric, Branch } from './types';
import { Sparkles, Store, Building2, Factory, Database } from 'lucide-react';

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
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch initial products from backend SQLite
  useEffect(() => {
    fetchProducts().then(data => {
      if (data && data.length > 0) {
        setProducts(data);
      }
    });
  }, []);

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
  const handleUpdateQuantity = async (id: string, delta: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const newQty = Math.max(0, prod.quantity + delta);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: newQty } : p));
    await apiUpdateProduct(id, { quantity: newQty });
  };

  // Add Product (Manual or Voice)
  const handleAddProduct = async (newProdData: Partial<Product>) => {
    const created = await createProduct(newProdData);
    setProducts(prev => [created, ...prev]);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await apiDeleteProduct(id);
  };

  // Import products from AI Bill Scanner
  const handleImportScannedProducts = async (newItems: Product[]) => {
    setProducts(prev => [...newItems, ...prev]);
    for (const item of newItems) {
      await createProduct(item);
    }
  };

  // Expiry Forecaster: Apply Flash Clearance Discount
  const handleApplyDiscount = async (productId: string, discountPct: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const discountedPrice = Math.round(prod.price * (1 - discountPct / 100));
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: discountedPrice } : p));
    await apiUpdateProduct(productId, { price: discountedPrice });
  };

  // Safe Medical Waste Disposal Log
  const handleLogDisposal = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    await apiDeleteProduct(productId);

    // Reward sustainability points
    const newMetrics = {
      ...sustainability,
      wasteDiversionPct: Math.min(100, sustainability.wasteDiversionPct + 2),
      overallScore: Math.min(100, sustainability.overallScore + 1)
    };
    setSustainability(newMetrics);
    await apiUpdateSustainability(newMetrics);
  };

  // Complete Customer Phone Checkout (POS + Loyalty)
  const handleCompleteCheckout = async (
    phone: string,
    broughtBag: boolean,
    cartItems: { id: string; quantity: number }[],
    total: number
  ) => {
    // Optimistic UI updates
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

    // Deduct stock quantities
    setProducts(prev => prev.map(p => {
      const inCart = cartItems.find(c => c.id === p.id);
      if (inCart) {
        const newQty = Math.max(0, p.quantity - inCart.quantity);
        apiUpdateProduct(p.id, { quantity: newQty });
        return { ...p, quantity: newQty };
      }
      return p;
    }));

    // Call backend API
    await processCheckout({ phone, broughtBag, items: cartItems, total });
  };

  // AI Green Advisor: Apply recommendations
  const handleApplyOptimization = async () => {
    const newMetrics = {
      ...sustainability,
      renewableEnergyPct: Math.min(100, sustainability.renewableEnergyPct + 12),
      recyclablePackagingPct: Math.min(100, sustainability.recyclablePackagingPct + 10),
      wasteDiversionPct: Math.min(100, sustainability.wasteDiversionPct + 5),
      overallScore: Math.min(100, sustainability.overallScore + 10),
      carbonSavedTons: sustainability.carbonSavedTons + 34
    };
    setSustainability(newMetrics);
    await apiUpdateSustainability(newMetrics);
  };

  // Inter-branch stock transfer
  const handleTransferStock = async (
    sourceBranchId: string,
    targetBranchId: string,
    quantity: number,
    productName: string
  ) => {
    setBranches(prev => prev.map(b => {
      if (b.id === sourceBranchId) return { ...b, totalSKUs: Math.max(0, b.totalSKUs - quantity) };
      if (b.id === targetBranchId) return { ...b, totalSKUs: b.totalSKUs + quantity };
      return b;
    }));

    await apiTransferBranchStock({ sourceBranchId, targetBranchId, quantity, productName });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        user={user}
        onSwitchTier={handleSwitchTier}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
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

            {/* Stock Management Table (with Voice & CSV) */}
            <StockManagement
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
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

            {/* Customer Phone Loyalty & Dynamic UPI QR POS */}
            <CustomerLoyalty
              customers={customers}
              products={products}
              storeName={user.storeName}
              onCompleteCheckout={handleCompleteCheckout}
            />

            {/* Stock Catalog */}
            <StockManagement
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
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
              onUpdateMetrics={async (newMetrics) => {
                setSustainability(newMetrics);
                await apiUpdateSustainability(newMetrics);
              }}
            />

            {/* Downstream Retailer Directory with B2B Invoices */}
            <RetailerNetwork retailers={retailers} />

            {/* Multi-Branch Management with Live Stock Transfers */}
            <BranchManagement
              branches={branches}
              products={products}
              onTransferStock={handleTransferStock}
            />

            {/* Expiry / Batch & Stock Oversight */}
            <ExpiryTracker
              products={products}
              onLogDisposal={handleLogDisposal}
            />

            <StockManagement
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
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

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => {
          fetchProducts().then(data => data && setProducts(data));
        }}
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
          <span className="text-emerald-400 font-medium">Operix Full-Stack — Live Demo</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
