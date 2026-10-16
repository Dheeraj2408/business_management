import React, { useState } from 'react';
import { Calendar, AlertTriangle, ShieldCheck, Clock, Search, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';

interface ExpiryTrackerProps {
  products: Product[];
  onLogDisposal: (productId: string) => void;
}

export const ExpiryTracker: React.FC<ExpiryTrackerProps> = ({ products, onLogDisposal }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'safe'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [disposedId, setDisposedId] = useState<string | null>(null);

  const batchProducts = products.filter(p => p.batchNumber && p.expiryDate);

  const getDaysLeft = (expiryDate: string) => {
    return Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (days: number) => {
    if (days <= 15) {
      return {
        label: `Critical (${days}d left)`,
        class: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        type: 'critical'
      };
    } else if (days <= 45) {
      return {
        label: `Warning (${days}d left)`,
        class: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        type: 'warning'
      };
    } else {
      return {
        label: `Safe (${days}d left)`,
        class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        type: 'safe'
      };
    }
  };

  const filtered = batchProducts.filter(p => {
    const days = getDaysLeft(p.expiryDate!);
    const status = getStatusBadge(days).type;
    const matchesFilter = filter === 'all' || status === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.batchNumber!.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDisposal = (id: string) => {
    onLogDisposal(id);
    setDisposedId(id);
    setTimeout(() => setDisposedId(null), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            Batch & Expiry Date Radar (Clinic / Pharmacy Compliance)
          </h3>
          <p className="text-xs text-slate-400">Strict batch tracking for medicines, perishables, and safe chemical/medical disposal</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Batches ({batchProducts.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Critical (&lt;15d)
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Warning (&lt;45d)
          </button>
          <button
            onClick={() => setFilter('safe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'safe' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Safe
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter by drug name or batch code (e.g. BT-8892)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3">Medicine / Product</th>
              <th className="p-3">Batch Number</th>
              <th className="p-3">Stock Qty</th>
              <th className="p-3">Expiry Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Compliance Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(p => {
              const daysLeft = getDaysLeft(p.expiryDate!);
              const badge = getStatusBadge(daysLeft);

              return (
                <tr key={p.id} className="hover:bg-slate-950/40 transition">
                  <td className="p-3 font-semibold text-white">
                    {p.name}
                    <div className="text-[10px] text-slate-500 font-normal">{p.category}</div>
                  </td>
                  <td className="p-3 font-mono text-sky-400 font-bold">{p.batchNumber}</td>
                  <td className="p-3 text-slate-300 font-bold">{p.quantity} {p.unit}</td>
                  <td className="p-3 text-slate-300">{p.expiryDate}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.class}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {disposedId === p.id ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Safe Disposal Verified (+5 Green Pts)
                      </span>
                    ) : daysLeft <= 15 ? (
                      <button
                        onClick={() => handleDisposal(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition"
                      >
                        Log Safe Bio-Disposal
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-medium">No Action Required</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
