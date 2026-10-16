import React, { useState } from 'react';
import { X, Plus, Store, Building2, Factory, CheckCircle2 } from 'lucide-react';
import { Business, BusinessTier } from '../types';

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (business: Business) => void;
}

export const AddBusinessModal: React.FC<AddBusinessModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [tier, setTier] = useState<BusinessTier>('mall_clinic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBiz: Business = {
      id: 'biz-' + Date.now(),
      name: name.trim(),
      tier: tier
    };

    onAdd(newBiz);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white selection:bg-white selection:text-black">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-black absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-white" />
            Register Additional Business
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Add a new store, clinic branch, or manufacturing plant to your single merchant login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Business / Store / Plant Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Health Clinic #2"
              className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Business Scale / Chameleon UI
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTier('general_store')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  tier === 'general_store'
                    ? 'bg-zinc-900 border-white text-white'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Store className="w-4 h-4" />
                <span className="text-xs font-bold">Minor</span>
                <span className="text-[9px] text-zinc-400">Micro-Retail</span>
              </button>

              <button
                type="button"
                onClick={() => setTier('mall_clinic')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  tier === 'mall_clinic'
                    ? 'bg-zinc-900 border-white text-white'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-bold">Commercial</span>
                <span className="text-[9px] text-zinc-400">Clinic / Mall</span>
              </button>

              <button
                type="button"
                onClick={() => setTier('industry')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  tier === 'industry'
                    ? 'bg-zinc-900 border-white text-white'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Factory className="w-4 h-4" />
                <span className="text-xs font-bold">Enterprise</span>
                <span className="text-[9px] text-zinc-400">Manufacturing</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-black w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white border-zinc-700"
            >
              Add Business & Switch
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
