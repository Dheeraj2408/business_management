import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  QrCode,
  Database,
  CheckCircle2,
  AlertCircle,
  Save,
  Flame,
  CloudUpload,
  RefreshCw,
  Check
} from 'lucide-react';
import { isServerOnline } from '../services/api';
import {
  getFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
  isFirebaseConfigured,
  testFirebaseConnection,
  FirebaseConfig
} from '../services/firebase';
import { seedInitialDataToFirestore } from '../services/firestoreSync';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSaved }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'api_payments' | 'firebase'>('api_payments');

  // AI & Payments
  const [geminiKey, setGeminiKey] = useState(
    localStorage.getItem('operix_gemini_key') ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    ''
  );
  const [upiId, setUpiId] = useState(localStorage.getItem('operix_upi_id') || 'operix@upi');
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);

  // Firebase Config State
  const initialFb = getFirebaseConfig();
  const [fbApiKey, setFbApiKey] = useState(initialFb?.apiKey || '');
  const [fbProjectId, setFbProjectId] = useState(initialFb?.projectId || '');
  const [fbAppId, setFbAppId] = useState(initialFb?.appId || '');

  // Status & Feedback
  const [fbTestStatus, setFbTestStatus] = useState<{ testing: boolean; success?: boolean; message?: string }>({ testing: false });
  const [seedingStatus, setSeedingStatus] = useState<{ seeding: boolean; count?: number; error?: string }>({ seeding: false });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    isServerOnline().then(setServerStatus);
  }, []);

  const handleTestFirebase = async () => {
    if (!fbApiKey || !fbProjectId) {
      setFbTestStatus({ testing: false, success: false, message: 'Please enter both API Key and Project ID.' });
      return;
    }
    setFbTestStatus({ testing: true });
    // Save temporarily to test
    saveFirebaseConfig({
      apiKey: fbApiKey.trim(),
      projectId: fbProjectId.trim(),
      appId: fbAppId.trim()
    });

    const res = await testFirebaseConnection();
    setFbTestStatus({ testing: false, success: res.success, message: res.message });
  };

  const handleSeedDatabase = async () => {
    setSeedingStatus({ seeding: true });
    // Ensure config is saved
    saveFirebaseConfig({
      apiKey: fbApiKey.trim(),
      projectId: fbProjectId.trim(),
      appId: fbAppId.trim()
    });

    const res = await seedInitialDataToFirestore();
    if (res.success) {
      setSeedingStatus({ seeding: false, count: res.count });
    } else {
      setSeedingStatus({ seeding: false, error: res.error });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('operix_gemini_key', geminiKey.trim());
    localStorage.setItem('operix_upi_id', upiId.trim());

    if (fbApiKey.trim() && fbProjectId.trim()) {
      saveFirebaseConfig({
        apiKey: fbApiKey.trim(),
        projectId: fbProjectId.trim(),
        appId: fbAppId.trim()
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved();
      onClose();
    }, 1000);
  };

  const isFbActive = isFirebaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <h3 className="text-lg font-extrabold text-white">System & Cloud Settings</h3>
          <p className="text-xs text-slate-400 mt-1">Configure AI vision, payments & Cloud Firestore dual-engine sync</p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('api_payments')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'api_payments' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            AI & Payments
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('firebase')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'firebase' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Firebase Firestore
            {isFbActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
          </button>
        </div>

        {/* Active Database Status Pill */}
        <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isFbActive ? (
              <Flame className="w-4 h-4 text-amber-400" />
            ) : (
              <Database className="w-4 h-4 text-slate-400" />
            )}
            <div>
              <div className="text-xs font-bold text-white">
                {isFbActive ? 'Cloud Firestore (Real-Time)' : 'SQLite Database Backend'}
              </div>
              <div className="text-[10px] text-slate-500">
                {isFbActive ? `Connected to ${fbProjectId || 'Firebase Cloud'}` : 'http://localhost:5000/api (Local Machine)'}
              </div>
            </div>
          </div>

          {isFbActive ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Flame className="w-3 h-3 text-amber-400" />
              Cloud Live
            </span>
          ) : serverStatus ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Live SQLite
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              Offline Cache
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">

          {/* TAB 1: AI & Payments */}
          {activeTab === 'api_payments' && (
            <div className="space-y-4 animate-fade-in">
              {/* Gemini API Key */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  Google Gemini API Key (Multimodal Vision)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Powers the 1-click invoice scanner. If left blank, Operix built-in neural simulator ensures 100% demo success.
                </p>
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-sky-400" />
                  Store UPI ID (For Live Customer QR Checkout)
                </label>
                <input
                  type="text"
                  placeholder="e.g. merchant@okhdfcbank or 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Generates scannable dynamic UPI QR codes for GPay, PhonePe, and Paytm at POS checkout.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Firebase Cloud Firestore */}
          {activeTab === 'firebase' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Multi-Device Real-Time Cloud Sync
                </p>
                <p className="text-[11px] text-amber-200/80">
                  Enter your Firebase web configuration keys below. Changes made on one device will instantly reflect on any other connected laptop or phone in real time!
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Firebase API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={fbApiKey}
                  onChange={(e) => setFbApiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Firebase Project ID</label>
                <input
                  type="text"
                  placeholder="e.g. operix-alt24"
                  value={fbProjectId}
                  onChange={(e) => setFbProjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Firebase App ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 1:1234567890:web:abcdef"
                  value={fbAppId}
                  onChange={(e) => setFbAppId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Action Buttons for Firebase */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestFirebase}
                  disabled={fbTestStatus.testing}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fbTestStatus.testing ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>

                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={seedingStatus.seeding}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow transition"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>{seedingStatus.seeding ? 'Seeding...' : '1-Click Cloud Seed'}</span>
                </button>
              </div>

              {/* Test Status Feedback */}
              {fbTestStatus.message && (
                <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  fbTestStatus.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {fbTestStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{fbTestStatus.message}</span>
                </div>
              )}

              {/* Seed Status Feedback */}
              {seedingStatus.count !== undefined && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Successfully populated Cloud Firestore with {seedingStatus.count} enterprise records!</span>
                </div>
              )}
              {seedingStatus.error && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{seedingStatus.error}</span>
                </div>
              )}

              {isFbActive && (
                <button
                  type="button"
                  onClick={() => {
                    clearFirebaseConfig();
                    setFbApiKey('');
                    setFbProjectId('');
                    setFbAppId('');
                  }}
                  className="text-[11px] text-red-400 hover:underline block mx-auto pt-1"
                >
                  Disconnect Firebase & Revert to Localhost SQLite
                </button>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            {savedSuccess ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                Settings & Database Synced Successfully!
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center justify-center gap-2 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Credentials & Settings</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
