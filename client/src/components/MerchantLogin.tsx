import React, { useState } from 'react';
import {
  Store,
  Building2,
  Factory,
  CheckCircle2,
  ArrowRight,
  Plus,
  Trash2,
  ShieldCheck,
  Layers,
  Sparkles,
  Phone,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { BusinessTier, Business, User } from '../types';

interface MerchantLoginProps {
  onLogin: (user: User) => void;
}

export const MerchantLogin: React.FC<MerchantLoginProps> = ({ onLogin }) => {
  // Merchant Info
  const [merchantName, setMerchantName] = useState('Venkatesh Rao');
  const [contact, setContact] = useState('+91 98765 43210');

  // Primary Business
  const [primaryBusinessName, setPrimaryBusinessName] = useState('Sri Lakshmi Kirana & General Store');
  const [primaryTier, setPrimaryTier] = useState<BusinessTier>('general_store');

  // Multiple Businesses Support
  const [hasMultipleBusinesses, setHasMultipleBusinesses] = useState<boolean>(false);
  const [additionalBusinesses, setAdditionalBusinesses] = useState<Array<{ id: string; name: string; tier: BusinessTier }>>([
    { id: 'biz-2', name: 'MetroCare Pharmacy & Health Mart', tier: 'mall_clinic' }
  ]);

  const handleAddExtraBusiness = () => {
    const newId = 'biz-' + (additionalBusinesses.length + 2);
    setAdditionalBusinesses(prev => [
      ...prev,
      { id: newId, name: `Branch ${prev.length + 2} Distribution`, tier: 'mall_clinic' }
    ]);
  };

  const handleRemoveExtraBusiness = (id: string) => {
    setAdditionalBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const handleExtraBusinessChange = (id: string, field: 'name' | 'tier', value: string) => {
    setAdditionalBusinesses(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, [field]: value };
      }
      return b;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const primaryBiz: Business = {
      id: 'biz-1',
      name: primaryBusinessName.trim() || 'Primary Store',
      tier: primaryTier
    };

    const extraBizs: Business[] = hasMultipleBusinesses
      ? additionalBusinesses.map(b => ({
          id: b.id,
          name: b.name.trim() || 'Additional Store',
          tier: b.tier
        }))
      : [];

    const allBusinesses = [primaryBiz, ...extraBizs];

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: merchantName.trim() || 'Merchant',
      emailOrPhone: contact.trim() || '+91 98765 43210',
      storeName: primaryBiz.name,
      tier: primaryBiz.tier,
      businesses: allBusinesses,
      activeBusinessId: primaryBiz.id
    };

    onLogin(newUser);
  };

  // Quick 1-Click Judge Profiles (Crucial for 24-hr Hackathon)
  const handleQuickDemo = (profile: 'minor' | 'commercial' | 'enterprise' | 'multi') => {
    if (profile === 'minor') {
      const biz: Business = { id: 'b-1', name: 'Sri Lakshmi Kirana & General Store', tier: 'general_store' };
      onLogin({
        id: 'usr-kirana',
        name: 'Venkatesh Rao',
        emailOrPhone: '+91 98765 43210',
        storeName: biz.name,
        tier: biz.tier,
        businesses: [biz],
        activeBusinessId: biz.id
      });
    } else if (profile === 'commercial') {
      const biz: Business = { id: 'b-2', name: 'MetroCare Pharmacy & Health Mart', tier: 'mall_clinic' };
      onLogin({
        id: 'usr-clinic',
        name: 'Dr. Kavita Reddy',
        emailOrPhone: '+91 97011 23456',
        storeName: biz.name,
        tier: biz.tier,
        businesses: [biz],
        activeBusinessId: biz.id
      });
    } else if (profile === 'enterprise') {
      const biz: Business = { id: 'b-3', name: 'EcoPack Green Mfg Industries Ltd', tier: 'industry' };
      onLogin({
        id: 'usr-industry',
        name: 'Rajesh Varma (COO)',
        emailOrPhone: 'rajesh@ecopackmfg.com',
        storeName: biz.name,
        tier: biz.tier,
        businesses: [biz],
        activeBusinessId: biz.id
      });
    } else {
      // Multi-Business Conglomerate (Kirana + Clinic + Packaging Factory under 1 merchant!)
      const b1: Business = { id: 'b-multi-1', name: 'Sri Lakshmi Kirana (Micro Retail)', tier: 'general_store' };
      const b2: Business = { id: 'b-multi-2', name: 'MetroCare Super Clinic & Meds', tier: 'mall_clinic' };
      const b3: Business = { id: 'b-multi-3', name: 'EcoPack Industrial Plant 01', tier: 'industry' };

      onLogin({
        id: 'usr-conglomerate',
        name: 'Venkatesh Rao (Group Managing Director)',
        emailOrPhone: '+91 98765 43210',
        storeName: b1.name,
        tier: b1.tier,
        businesses: [b1, b2, b3],
        activeBusinessId: b1.id
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-white selection:text-black">
      {/* Background Subtle Gradient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl p-6 sm:p-10 backdrop-blur-md">
        
        {/* Brand & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono font-medium text-zinc-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            OPERIX OS v2.0 • MERCHANT PORTAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Merchant Login & Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-md mx-auto">
            Classify your business scale to launch the respective Chameleon operating system. Supports single and multi-business accounts.
          </p>
        </div>

        {/* 1-Click Judge Quick Demo Bar */}
        <div className="mb-8 p-3.5 rounded-xl bg-black border border-zinc-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              1-Click Judge Quick Presets:
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Instant Tier Verification</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('minor')}
              className="btn-black py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-zinc-300" />
              <span>Minor (Kirana)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('commercial')}
              className="btn-black py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-zinc-300" />
              <span>Commercial</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('enterprise')}
              className="btn-black py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Factory className="w-3.5 h-3.5 text-zinc-300" />
              <span>Enterprise</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('multi')}
              className="btn-black py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-zinc-600 text-white"
            >
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Multi-Business (All 3)</span>
            </button>
          </div>
        </div>

        {/* Main Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Merchant Details */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <UserIcon className="w-3.5 h-3.5 text-white" />
              1. Merchant Identity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Proprietor / Merchant Name
                </label>
                <input
                  type="text"
                  required
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Contact Number / Email
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business Classification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-white" />
                2. Business Classification & Type
              </h2>
              <span className="text-[10px] text-zinc-500 font-mono">Select Primary Scale</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Primary Business / Store Name
              </label>
              <input
                type="text"
                required
                value={primaryBusinessName}
                onChange={(e) => setPrimaryBusinessName(e.target.value)}
                placeholder="e.g. Apex Supermarket & Medicals"
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition mb-3"
              />
            </div>

            {/* 3 Tier Scale Cards (Minor, Commercial, Enterprise) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Tier 1: Minor */}
              <div
                onClick={() => setPrimaryTier('general_store')}
                className={`p-4 rounded-xl cursor-pointer transition border text-left flex flex-col justify-between ${
                  primaryTier === 'general_store'
                    ? 'bg-zinc-900 border-white text-white shadow-lg'
                    : 'bg-black border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-zinc-800 text-white">
                      <Store className="w-4 h-4" />
                    </div>
                    {primaryTier === 'general_store' && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white">Minor</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Kirana & Micro-Retail</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 space-y-1">
                  <div>• Quick Catalog & POS (+/-)</div>
                  <div>• Weekly Revenue Velocity</div>
                  <div>• Voice-to-Stock Entry</div>
                </div>
              </div>

              {/* Tier 2: Commercial */}
              <div
                onClick={() => setPrimaryTier('mall_clinic')}
                className={`p-4 rounded-xl cursor-pointer transition border text-left flex flex-col justify-between ${
                  primaryTier === 'mall_clinic'
                    ? 'bg-zinc-900 border-white text-white shadow-lg'
                    : 'bg-black border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-zinc-800 text-white">
                      <Building2 className="w-4 h-4" />
                    </div>
                    {primaryTier === 'mall_clinic' && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white">Commercial</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Malls, Clinics & Wholesale</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 space-y-1">
                  <div>• Batch & Expiry Radar</div>
                  <div>• Phone Loyalty & Green Stamps</div>
                  <div>• Dynamic UPI QR POS Checkout</div>
                </div>
              </div>

              {/* Tier 3: Enterprise */}
              <div
                onClick={() => setPrimaryTier('industry')}
                className={`p-4 rounded-xl cursor-pointer transition border text-left flex flex-col justify-between ${
                  primaryTier === 'industry'
                    ? 'bg-zinc-900 border-white text-white shadow-lg'
                    : 'bg-black border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-zinc-800 text-white">
                      <Factory className="w-4 h-4" />
                    </div>
                    {primaryTier === 'industry' && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white">Enterprise</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Industrial Manufacturing</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 space-y-1">
                  <div>• 0–100 Algorithmic ESG Index</div>
                  <div>• Factory Workforce & Payroll</div>
                  <div>• Solar Telemetry & Machinery</div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Multiple Businesses Support */}
          <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-zinc-300" />
                  Do you operate more than one business?
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Manage multiple independent stores, clinics, or factories under this single merchant login.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMultipleBusinesses}
                  onChange={(e) => setHasMultipleBusinesses(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white" />
              </label>
            </div>

            {hasMultipleBusinesses && (
              <div className="space-y-3 pt-3 border-t border-zinc-800 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Additional Businesses ({additionalBusinesses.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddExtraBusiness}
                    className="btn-black text-xs px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Business</span>
                  </button>
                </div>

                {additionalBusinesses.map((biz, idx) => (
                  <div
                    key={biz.id}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-center gap-2.5"
                  >
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={biz.name}
                        onChange={(e) => handleExtraBusinessChange(biz.id, 'name', e.target.value)}
                        placeholder={`Business ${idx + 2} Name`}
                        className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div className="w-full sm:w-44">
                      <select
                        value={biz.tier}
                        onChange={(e) => handleExtraBusinessChange(biz.id, 'tier', e.target.value as BusinessTier)}
                        className="w-full bg-black border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                      >
                        <option value="general_store">Minor (Micro-Retail)</option>
                        <option value="mall_clinic">Commercial (Malls & Clinics)</option>
                        <option value="industry">Enterprise (Manufacturing)</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExtraBusiness(biz.id)}
                      className="text-zinc-500 hover:text-red-400 p-1.5 rounded transition"
                      title="Remove business"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action Button with Special Shade Shift */}
          <button
            type="submit"
            className="btn-black w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white border-zinc-700 shadow-xl"
          >
            <span>Launch Operix Adaptive Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
