import React, { useState, useEffect } from 'react';
import { X, Key, QrCode, Database, CheckCircle2, AlertCircle, Save, RefreshCw } from 'lucide-react';
import { isServerOnline } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSaved }) => {
  if (!isOpen) return null;

  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('operix_gemini_key') || '');
  const [upiId, setUpiId] = useState(localStorage.getItem('operix_upi_id') || 'operix@upi');
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    isServerOnline().then(setServerStatus);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('operix_gemini_key', geminiKey.trim());
    localStorage.setItem('operix_upi_id', upiId.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <h3 className="text-lg font-extrabold text-white">System & API Settings</h3>
          <p className="text-xs text-slate-400 mt-1">Configure your AI engine, database connection & payment credentials</p>
        </div>

        {/* Database Health Badge */}
        <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-xs font-bold text-white">SQLite Database Backend</div>
              <div className="text-[10px] text-slate-500">http://localhost:5000/api</div>
            </div>
          </div>
          {serverStatus === null ? (
            <span className="text-[10px] text-slate-400">Pinging...</span>
          ) : serverStatus ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Connected (Live DB)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <AlertCircle className="w-3 h-3" />
              Local Cache Mode
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
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
              Optional: Leave empty to use Operix built-in neural simulator during offline judging.
            </p>
          </div>

          {/* UPI ID for QR Code Payments */}
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
              Generates genuine dynamic UPI QR codes scannable by Google Pay, PhonePe & Paytm.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            {savedSuccess ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                Settings Saved Successfully!
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
