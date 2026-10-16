import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  Building2,
  Factory,
  LogOut,
  Sparkles,
  Settings,
  Database,
  Flame,
  ChevronDown,
  Plus,
  Check,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { BusinessTier, User, Business } from '../types';
import { isServerOnline } from '../services/api';
import { isFirebaseConfigured } from '../services/firebase';

interface NavbarProps {
  user: User;
  onSwitchTier: (tier: BusinessTier) => void;
  onSwitchBusiness: (businessId: string) => void;
  onAddNewBusiness: () => void;
  onLogout: () => void;
  onOpenScanner: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSwitchTier,
  onSwitchBusiness,
  onAddNewBusiness,
  onLogout,
  onOpenScanner,
  onOpenSettings
}) => {
  const [dbConnected, setDbConnected] = useState<boolean>(true);
  const [isFbActive, setIsFbActive] = useState<boolean>(isFirebaseConfigured());
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isServerOnline().then(setDbConnected);
    setIsFbActive(isFirebaseConfigured());
    const interval = setInterval(() => {
      isServerOnline().then(setDbConnected);
      setIsFbActive(isFirebaseConfigured());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBusinessDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTierDetails = (tier: BusinessTier) => {
    switch (tier) {
      case 'general_store':
        return {
          shortLabel: 'Minor',
          fullLabel: 'Operix Micro (Kirana & Retail)',
          icon: <Store className="w-3.5 h-3.5 text-zinc-300" />
        };
      case 'mall_clinic':
        return {
          shortLabel: 'Commercial',
          fullLabel: 'Operix Commercial (Malls & Clinics)',
          icon: <Building2 className="w-3.5 h-3.5 text-zinc-300" />
        };
      case 'industry':
        return {
          shortLabel: 'Enterprise',
          fullLabel: 'Operix Enterprise (Manufacturing)',
          icon: <Factory className="w-3.5 h-3.5 text-zinc-300" />
        };
    }
  };

  const activeTierDetails = getTierDetails(user.tier);
  const businesses = user.businesses && user.businesses.length > 0
    ? user.businesses
    : [{ id: 'b-default', name: user.storeName, tier: user.tier }];

  const activeBusiness = businesses.find(b => b.id === user.activeBusinessId) || businesses[0];

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-800 text-white selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black tracking-tighter text-lg shadow-md shadow-white/10">
              O
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Operix</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-700">
                  v2.0
                </span>
                {isFbActive ? (
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700">
                    <Flame className="w-2.5 h-2.5 text-white" />
                    Cloud Sync
                  </span>
                ) : dbConnected ? (
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
                    <Database className="w-2.5 h-2.5 text-zinc-400" />
                    Local SQLite
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">Adaptive Commerce & Sustainability Operating System</p>
            </div>
          </div>

          {/* Multi-Business Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setBusinessDropdownOpen(prev => !prev)}
              className="btn-black flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
              title="Switch business branch or enterprise"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-300" />
              <div className="text-left flex items-center gap-1.5">
                <span className="max-w-[130px] sm:max-w-[170px] truncate font-bold text-white">
                  {activeBusiness.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">
                  {activeTierDetails.shortLabel}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${businessDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {businessDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-2.5 py-1.5 border-b border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Merchant Businesses ({businesses.length})</span>
                  <span className="text-zinc-500 font-normal">{user.name.split(' ')[0]}</span>
                </div>

                <div className="py-1 max-h-56 overflow-y-auto space-y-1">
                  {businesses.map((biz) => {
                    const isCurrent = biz.id === activeBusiness.id;
                    const tierMeta = getTierDetails(biz.tier);
                    return (
                      <button
                        key={biz.id}
                        type="button"
                        onClick={() => {
                          onSwitchBusiness(biz.id);
                          setBusinessDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition ${
                          isCurrent
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {tierMeta.icon}
                          <div className="truncate">
                            <div className="truncate">{biz.name}</div>
                            <div className="text-[10px] text-zinc-400 font-normal">{tierMeta.shortLabel} Scale</div>
                          </div>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Business action */}
                <div className="pt-1.5 mt-1 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setBusinessDropdownOpen(false);
                      onAddNewBusiness();
                    }}
                    className="btn-black w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Another Business</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 1-Click Scale Selector (Chameleon Adaptive Switcher) */}
          <div className="hidden lg:flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => onSwitchTier('general_store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user.tier === 'general_store'
                  ? 'btn-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Operix Micro</span>
            </button>
            <button
              onClick={() => onSwitchTier('mall_clinic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user.tier === 'mall_clinic'
                  ? 'btn-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Operix Commercial</span>
            </button>
            <button
              onClick={() => onSwitchTier('industry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user.tier === 'industry'
                  ? 'btn-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Operix Enterprise</span>
            </button>
          </div>

          {/* Quick Actions (AI Scanner, Settings, Logout) */}
          <div className="flex items-center gap-2">
            {/* AI Bill Scanner */}
            <button
              onClick={onOpenScanner}
              className="btn-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
              title="AI Invoice & Bill OCR Scanner"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span className="hidden sm:inline">AI Bill Scanner</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              title="System Settings"
              className="btn-black p-2 rounded-xl"
            >
              <Settings className="w-4 h-4 text-zinc-300" />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Log Out / Switch Merchant"
              className="btn-black p-2 rounded-xl text-zinc-400 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
