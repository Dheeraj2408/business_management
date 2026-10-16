import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MerchantLogin } from './components/MerchantLogin';
import { AddBusinessModal } from './components/AddBusinessModal';
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
import { IndustrialOperations } from './features/industry/IndustrialOperations';

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
  transferBranchStock as apiTransferBranchStock,
  fetchEmployees,
  createEmployee,
  deleteEmployee as apiDeleteEmployee,
  fetchRawMaterials,
  createRawMaterial,
  fetchElectricity,
  updateElectricity as apiUpdateElectricity,
  fetchMachines,
  toggleMachineStatus as apiToggleMachineStatus
} from './services/api';

import {
  BusinessTier,
  Business,
  User,
  Product,
  CustomerLoyalty as CustomerType,
  SustainabilityMetric,
  Branch,
  Employee,
  RawMaterial,
  ElectricityData,
  Machine
} from './types';
import {
  listenToProducts,
  listenToCustomers,
  listenToSustainability,
  listenToBranches,
  listenToEmployees,
  listenToRawMaterials,
  listenToElectricity,
  listenToMachines,
  syncProductToFirestore,
  deleteProductFromFirestore,
  syncCustomerToFirestore,
  syncSustainabilityToFirestore,
  syncBranchToFirestore,
  syncEmployeeToFirestore,
  deleteEmployeeFromFirestore,
  syncRawMaterialToFirestore,
  syncElectricityToFirestore,
  syncMachineToFirestore
} from './services/firestoreSync';
import { isFirebaseConfigured } from './services/firebase';
import { Sparkles, Store, Building2, Factory, Database } from 'lucide-react';

export const App: React.FC = () => {
  // Global State (Null by default -> forces Merchant Login on first visit!)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('operix_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.tier) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved user', e);
    }
    return null;
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<CustomerType[]>(INITIAL_CUSTOMERS);
  const [sustainability, setSustainability] = useState<SustainabilityMetric>(INITIAL_SUSTAINABILITY);
  const [retailers] = useState(INITIAL_RETAILERS);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);

  // Industrial Operations State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [electricity, setElectricity] = useState<ElectricityData | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState(false);

  // Fetch initial data from SQLite & attach real-time Cloud Firestore listeners
  useEffect(() => {
    // 1. Initial load from local backend
    fetchProducts().then(data => {
      if (data && data.length > 0) setProducts(data);
    });
    fetchEmployees().then(data => {
      if (data && data.length > 0) setEmployees(data);
    });
    fetchRawMaterials().then(data => {
      if (data && data.length > 0) setRawMaterials(data);
    });
    fetchElectricity().then(data => {
      if (data) setElectricity(data);
    });
    fetchMachines().then(data => {
      if (data && data.length > 0) setMachines(data);
    });

    // 2. Attach live Cloud Firestore subscriptions if configured
    let unsubProducts: (() => void) | null = null;
    let unsubCustomers: (() => void) | null = null;
    let unsubSustainability: (() => void) | null = null;
    let unsubBranches: (() => void) | null = null;
    let unsubEmployees: (() => void) | null = null;
    let unsubRawMaterials: (() => void) | null = null;
    let unsubElectricity: (() => void) | null = null;
    let unsubMachines: (() => void) | null = null;

    if (isFirebaseConfigured()) {
      unsubProducts = listenToProducts((items) => {
        if (items && items.length > 0) setProducts(items);
      });
      unsubCustomers = listenToCustomers((items) => {
        if (items && items.length > 0) setCustomers(items);
      });
      unsubSustainability = listenToSustainability((metrics) => {
        if (metrics) setSustainability(metrics);
      });
      unsubBranches = listenToBranches((items) => {
        if (items && items.length > 0) setBranches(items);
      });
      unsubEmployees = listenToEmployees((items) => {
        if (items && items.length > 0) setEmployees(items);
      });
      unsubRawMaterials = listenToRawMaterials((items) => {
        if (items && items.length > 0) setRawMaterials(items);
      });
      unsubElectricity = listenToElectricity((el) => {
        if (el) setElectricity(el);
      });
      unsubMachines = listenToMachines((items) => {
        if (items && items.length > 0) setMachines(items);
      });
    }

    return () => {
      unsubProducts?.();
      unsubCustomers?.();
      unsubSustainability?.();
      unsubBranches?.();
      unsubEmployees?.();
      unsubRawMaterials?.();
      unsubElectricity?.();
      unsubMachines?.();
    };
  }, []);

  // Login handler
  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('operix_user', JSON.stringify(newUser));
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('operix_user');
  };

  // Switch Active Business
  const handleSwitchBusiness = (businessId: string) => {
    if (!user) return;
    const selected = (user.businesses || []).find(b => b.id === businessId);
    if (selected) {
      const updatedUser: User = {
        ...user,
        activeBusinessId: selected.id,
        storeName: selected.name,
        tier: selected.tier
      };
      setUser(updatedUser);
      localStorage.setItem('operix_user', JSON.stringify(updatedUser));
    }
  };

  // Add Additional Business to Account
  const handleAddNewBusiness = (newBiz: Business) => {
    if (!user) return;
    const currentBusinesses = user.businesses && user.businesses.length > 0
      ? user.businesses
      : [{ id: 'biz-default', name: user.storeName, tier: user.tier }];

    const updatedBusinesses = [...currentBusinesses, newBiz];
    const updatedUser: User = {
      ...user,
      businesses: updatedBusinesses,
      activeBusinessId: newBiz.id,
      storeName: newBiz.name,
      tier: newBiz.tier
    };
    setUser(updatedUser);
    localStorage.setItem('operix_user', JSON.stringify(updatedUser));
  };

  // Switch tier handler
  const handleSwitchTier = (tier: BusinessTier) => {
    if (!user) return;
    let updatedStoreName = user.storeName;
    if (tier === 'general_store' && !user.storeName) updatedStoreName = 'Sri Lakshmi Kirana & General Store';
    if (tier === 'mall_clinic' && !user.storeName) updatedStoreName = 'MetroCare Pharmacy & Health Mart';
    if (tier === 'industry' && !user.storeName) updatedStoreName = 'EcoPack Green Mfg Industries Ltd';

    const updatedBusinesses = (user.businesses || []).map(b => {
      if (b.id === user.activeBusinessId) {
        return { ...b, tier };
      }
      return b;
    });

    const updatedUser: User = {
      ...user,
      tier,
      storeName: updatedStoreName,
      businesses: updatedBusinesses
    };
    setUser(updatedUser);
    localStorage.setItem('operix_user', JSON.stringify(updatedUser));
  };

  // Stock Quantity Updater
  const handleUpdateQuantity = async (id: string, delta: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const newQty = Math.max(0, prod.quantity + delta);
    const updated = { ...prod, quantity: newQty };
    setProducts(prev => prev.map(p => p.id === id ? updated : p));

    await apiUpdateProduct(id, { quantity: newQty });
    await syncProductToFirestore(updated);
  };

  // Add Product (Manual or Voice)
  const handleAddProduct = async (newProdData: Partial<Product>) => {
    const created = await createProduct(newProdData);
    setProducts(prev => [created, ...prev]);
    await syncProductToFirestore(created);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await apiDeleteProduct(id);
    await deleteProductFromFirestore(id);
  };

  // Import products from AI Bill Scanner
  const handleImportScannedProducts = async (newItems: Product[]) => {
    setProducts(prev => [...newItems, ...prev]);
    for (const item of newItems) {
      await createProduct(item);
      await syncProductToFirestore(item);
    }
  };

  // Expiry Forecaster: Apply Flash Clearance Discount
  const handleApplyDiscount = async (productId: string, discountPct: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const discountedPrice = Math.round(prod.price * (1 - discountPct / 100));
    const updated = { ...prod, price: discountedPrice };
    setProducts(prev => prev.map(p => p.id === productId ? updated : p));

    await apiUpdateProduct(productId, { price: discountedPrice });
    await syncProductToFirestore(updated);
  };

  // Safe Medical Waste Disposal Log
  const handleLogDisposal = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    await apiDeleteProduct(productId);
    await deleteProductFromFirestore(productId);

    // Reward sustainability points
    const newMetrics = {
      ...sustainability,
      wasteDiversionPct: Math.min(100, sustainability.wasteDiversionPct + 2),
      overallScore: Math.min(100, sustainability.overallScore + 1)
    };
    setSustainability(newMetrics);
    await apiUpdateSustainability(newMetrics);
    await syncSustainabilityToFirestore(newMetrics);
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
        const updated = {
          ...c,
          visitCount: c.visitCount + 1,
          greenPoints: c.greenPoints + (broughtBag ? 25 : 10),
          reusableBagCount: c.reusableBagCount + (broughtBag ? 1 : 0),
          lastVisit: new Date().toISOString().split('T')[0]
        };
        syncCustomerToFirestore(updated);
        return updated;
      }
      return c;
    }));

    // Deduct stock quantities
    setProducts(prev => prev.map(p => {
      const inCart = cartItems.find(c => c.id === p.id);
      if (inCart) {
        const newQty = Math.max(0, p.quantity - inCart.quantity);
        const updatedProd = { ...p, quantity: newQty };
        apiUpdateProduct(p.id, { quantity: newQty });
        syncProductToFirestore(updatedProd);
        return updatedProd;
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
    await syncSustainabilityToFirestore(newMetrics);
  };

  // Inter-branch stock transfer
  const handleTransferStock = async (
    sourceBranchId: string,
    targetBranchId: string,
    quantity: number,
    productName: string
  ) => {
    setBranches(prev => prev.map(b => {
      if (b.id === sourceBranchId) {
        const updated = { ...b, totalSKUs: Math.max(0, b.totalSKUs - quantity) };
        syncBranchToFirestore(updated);
        return updated;
      }
      if (b.id === targetBranchId) {
        const updated = { ...b, totalSKUs: b.totalSKUs + quantity };
        syncBranchToFirestore(updated);
        return updated;
      }
      return b;
    }));

    await apiTransferBranchStock({ sourceBranchId, targetBranchId, quantity, productName });
  };

  // Industrial Operations Handlers
  const handleAddEmployee = async (newEmp: Partial<Employee>) => {
    const created = await createEmployee(newEmp);
    setEmployees(prev => [created, ...prev]);
    await syncEmployeeToFirestore(created);
  };

  const handleDeleteEmployee = async (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    await apiDeleteEmployee(id);
    await deleteEmployeeFromFirestore(id);
  };

  const handleAddRawMaterial = async (newMat: Partial<RawMaterial>) => {
    const created = await createRawMaterial(newMat);
    setRawMaterials(prev => [created, ...prev]);
    await syncRawMaterialToFirestore(created);
  };

  const handleToggleMachine = async (id: string) => {
    setMachines(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus: 'Running' | 'Maintenance' | 'Idle' =
          m.status === 'Running' ? 'Maintenance' : m.status === 'Maintenance' ? 'Idle' : 'Running';
        const updated: Machine = { ...m, status: nextStatus };
        syncMachineToFirestore(updated);
        return updated;
      }
      return m;
    }));
    await apiToggleMachineStatus(id);
  };

  const handleUpdateElectricity = async (updates: Partial<ElectricityData>) => {
    setElectricity(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      syncElectricityToFirestore(updated);
      return updated;
    });
    await apiUpdateElectricity(updates);
  };

  // If user is not logged in, first page MUST be Merchant Login!
  if (!user) {
    return <MerchantLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        user={user}
        onSwitchTier={handleSwitchTier}
        onSwitchBusiness={handleSwitchBusiness}
        onAddNewBusiness={() => setIsAddBusinessOpen(true)}
        onLogout={handleLogout}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Adaptive Context Banner */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white">
                {user.tier === 'general_store' && <Store className="w-4 h-4 text-white" />}
                {user.tier === 'mall_clinic' && <Building2 className="w-4 h-4 text-white" />}
                {user.tier === 'industry' && <Factory className="w-4 h-4 text-white" />}
              </div>
              <h2 className="text-lg font-black text-white">{user.storeName}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">
                {user.tier === 'general_store' ? 'Minor Scale' : user.tier === 'mall_clinic' ? 'Commercial Scale' : 'Enterprise Scale'}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {user.tier === 'general_store' && "Viewing Operix Micro Workspace: Voice & AI Stock Management + Demand Statistics"}
              {user.tier === 'mall_clinic' && "Viewing Operix Commercial Workspace: Batch Expiry Radar + Phone Number Loyalty + UPI QR POS"}
              {user.tier === 'industry' && "Viewing Operix Enterprise Workspace: Industrial Operations Suite + ESG Index + Retailer Directory"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="btn-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Scan Bill with AI</span>
            </button>
            <button
              onClick={() => setIsAddBusinessOpen(true)}
              className="btn-black px-3 py-1.5 rounded-xl text-xs font-semibold"
            >
              + Add Business
            </button>
          </div>
        </div>

        {/* ========================================================
            TIER 1: OPERIX MICRO (Kirana & Micro-Retail)
            Features: Stock Management + Sales Statistics + Voice POS
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
            TIER 2: OPERIX COMMERCIAL (Malls, Clinics & Wholesale)
            Features: Expiry Date Radar + Customer Phone Loyalty + Dynamic UPI POS
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
            TIER 3: OPERIX ENTERPRISE (Industrial Manufacturing Suite)
            Features: Industrial Operations + ESG Index + Retailers + Branches
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

            {/* Industrial Manufacturing Operations: Workforce, Raw Materials, Power, Machinery */}
            <IndustrialOperations
              employees={employees}
              rawMaterials={rawMaterials}
              electricity={electricity}
              machines={machines}
              onAddEmployee={handleAddEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onAddRawMaterial={handleAddRawMaterial}
              onToggleMachine={handleToggleMachine}
              onUpdateElectricity={handleUpdateElectricity}
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
      <AddBusinessModal
        isOpen={isAddBusinessOpen}
        onClose={() => setIsAddBusinessOpen(false)}
        onAdd={handleAddNewBusiness}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
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
      <footer className="mt-auto border-t border-zinc-900 bg-black py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ALTHON 2.0 • 24-Hour Hackathon Prototype</span>
          <span className="font-semibold text-zinc-400">
            Built by <strong className="text-white">team dev</strong> (Dheeraj, Mahesh, Jeshwanth, Revan)
          </span>
          <span className="text-zinc-300 font-medium font-mono">Operix Chameleon OS — Live Demo</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
