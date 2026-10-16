import React, { useState } from 'react';
import { X, Phone, Mail, Store, Building2, Factory, CheckCircle2, ArrowRight } from 'lucide-react';
import { BusinessTier, User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [selectedTier, setSelectedTier] = useState<BusinessTier>('general_store');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;

    const user: User = {
      id: 'usr-' + Date.now(),
      name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Merchant ' + phoneOrEmail.slice(-4),
      emailOrPhone: phoneOrEmail,
      storeName: storeName || (selectedTier === 'general_store' ? 'Sri Krishna Provisions' : selectedTier === 'mall_clinic' ? 'Apex Wellness Clinic' : 'EcoPack Industries Ltd'),
      tier: selectedTier
    };

    onLogin(user);
    onClose();
  };

  const handleQuickDemo = (tier: BusinessTier) => {
    let mockUser: User;
    if (tier === 'general_store') {
      mockUser = {
        id: 'usr-kirana',
        name: 'Venkatesh Rao',
        emailOrPhone: '+91 98765 43210',
        storeName: 'Sri Lakshmi Kirana & General Store',
        tier: 'general_store'
      };
    } else if (tier === 'mall_clinic') {
      mockUser = {
        id: 'usr-clinic',
        name: 'Dr. Kavita Reddy',
        emailOrPhone: '+91 97011 23456',
        storeName: 'MetroCare Pharmacy & Health Mart',
        tier: 'mall_clinic'
      };
    } else {
      mockUser = {
        id: 'usr-industry',
        name: 'Rajesh Varma (COO)',
        emailOrPhone: 'rajesh@ecopackmfg.com',
        storeName: 'EcoPack Green Mfg Industries Ltd',
        tier: 'industry'
      };
    }

    onLogin(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <h2 className="text-xl font-extrabold text-white">Merchant Account Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in with phone or email and select your business scale</p>
        </div>

        {/* 1-Click Demo Profiles (For Hackathon Judges) */}
        <div className="mb-5 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            ⚡ Quick 1-Click Judge Profiles:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('general_store')}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition"
            >
              <Store className="w-4 h-4 mb-1" />
              Operix Micro
            </button>
            <button
              onClick={() => handleQuickDemo('mall_clinic')}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-semibold transition"
            >
              <Building2 className="w-4 h-4 mb-1" />
              Operix Commercial
            </button>
            <button
              onClick={() => handleQuickDemo('industry')}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-semibold transition"
            >
              <Factory className="w-4 h-4 mb-1" />
              Operix Enterprise
            </button>
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-500 font-bold">Or Manual Login</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          {/* Method Switcher */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                authMethod === 'phone' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone Number
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                authMethod === 'email' ? 'bg-slate-800 text-sky-400 shadow' : 'text-slate-400'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Business Email
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {authMethod === 'phone' ? '10-Digit Mobile Number' : 'Work Email Address'}
            </label>
            <input
              type={authMethod === 'phone' ? 'tel' : 'email'}
              required
              placeholder={authMethod === 'phone' ? 'e.g. 9876543210' : 'e.g. manager@store.com'}
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Store or Business Name
            </label>
            <input
              type="text"
              placeholder="e.g. National Supermarket & Pharmacy"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Select Category / Scale */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Business Category:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div
                onClick={() => setSelectedTier('general_store')}
                className={`cursor-pointer p-2.5 rounded-xl border text-center transition ${
                  selectedTier === 'general_store'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Store className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <div className="text-[11px] font-bold">Operix Micro</div>
                <div className="text-[9px] text-slate-500">Kirana & Retail</div>
              </div>

              <div
                onClick={() => setSelectedTier('mall_clinic')}
                className={`cursor-pointer p-2.5 rounded-xl border text-center transition ${
                  selectedTier === 'mall_clinic'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                <div className="text-[11px] font-bold">Operix Commercial</div>
                <div className="text-[9px] text-slate-500">Malls & Clinics</div>
              </div>

              <div
                onClick={() => setSelectedTier('industry')}
                className={`cursor-pointer p-2.5 rounded-xl border text-center transition ${
                  selectedTier === 'industry'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Factory className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <div className="text-[11px] font-bold">Operix Enterprise</div>
                <div className="text-[9px] text-slate-500">Manufacturing & ESG</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition"
          >
            <span>Access Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
