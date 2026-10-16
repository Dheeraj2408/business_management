import React, { useState, useEffect } from 'react';
import { Leaf, Store, Building2, Factory, LogOut, Sparkles, Settings, Database } from 'lucide-react';
import { BusinessTier, User } from '../types';
import { isServerOnline } from '../services/api';

interface NavbarProps {
  user: User;
  onSwitchTier: (tier: BusinessTier) => void;
  onOpenAuth: () => void;
  onOpenScanner: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSwitchTier,
  onOpenAuth,
  onOpenScanner,
  onOpenSettings
}) => {
  const [dbConnected, setDbConnected] = useState<boolean>(true);

  useEffect(() => {
    isServerOnline().then(setDbConnected);
    const interval = setInterval(() => {
      isServerOnline().then(setDbConnected);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getTierBadge = () => {
    switch (user.tier) {
      case 'general_store':
        return {
          label: 'Operix Micro (Kirana & Retail)',
          icon: <Store className="w-4 h-4 text-emerald-400" />,
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
      case 'mall_clinic':
        return {
          label: 'Operix Commercial (Malls & Clinics)',
          icon: <Building2 className="w-4 h-4 text-sky-400" />,
          color: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
        };
      case 'industry':
        return {
          label: 'Operix Enterprise (Manufacturing)',
          icon: <Factory className="w-4 h-4 text-purple-400" />,
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        };
    }
  };

  const badge = getTierBadge();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Operix</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  OS v2.0
                </span>
                {dbConnected && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Database className="w-2.5 h-2.5" />
                    Live SQLite
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Adaptive Commerce & Sustainability Operating System</p>
            </div>
          </div>

          {/* Quick 1-Click Judge Tier Switcher */}
          <div className="hidden md:flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSwitchTier('general_store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user.tier === 'general_store'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Operix Micro
            </button>
            <button
              onClick={() => onSwitchTier('mall_clinic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user.tier === 'mall_clinic'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Operix Commercial
            </button>
            <button
              onClick={() => onSwitchTier('industry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user.tier === 'industry'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              Operix Enterprise
            </button>
          </div>

          {/* Actions & User Profile */}
          <div className="flex items-center gap-2.5">
            {/* AI Bill Scanner Quick Trigger */}
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Bill Scanner</span>
            </button>

            {/* Current Active Mode Badge */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${badge.color}`}>
              {badge.icon}
              <span className="max-w-[120px] truncate">{user.storeName}</span>
            </div>

            {/* Settings Gear (Gemini Key & UPI) */}
            <button
              onClick={onOpenSettings}
              title="System Settings (Gemini API & UPI)"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Merchant Switch / Login Modal Button */}
            <button
              onClick={onOpenAuth}
              title="Switch Account or Login"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
