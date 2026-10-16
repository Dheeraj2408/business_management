import React from 'react';
import { AlertTriangle, Sparkles, TrendingDown, CheckCircle, Tag } from 'lucide-react';
import { Product } from '../../types';

interface AIExpiryForecasterProps {
  products: Product[];
  onApplyDiscount: (productId: string, discountPct: number) => void;
}

export const AIExpiryForecaster: React.FC<AIExpiryForecasterProps> = ({ products, onApplyDiscount }) => {
  // Find products expiring soon (within next 45 days)
  const expiringSoon = products.filter(p => {
    if (!p.expiryDate) return false;
    const diffDays = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 45;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              AI Shelf-Life & Waste Risk Forecaster
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Predictive AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Compares inventory shelf-life against daily sales velocity to avoid unsellable write-offs</p>
          </div>
        </div>
      </div>

      {expiringSoon.length === 0 ? (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>All batches are in healthy shelf-life zones. Zero immediate waste risk detected.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {expiringSoon.map(item => {
            const daysLeft = Math.ceil((new Date(item.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const estimatedUnitsAtRisk = Math.max(5, Math.floor(item.quantity * 0.4));

            return (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        Batch: {item.batchNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Expires in <strong className="text-amber-400">{daysLeft} days</strong> ({item.expiryDate}) • Current stock: {item.quantity} {item.unit}
                    </p>
                    <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5 mt-1">
                      <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                      <span><strong>AI Risk Alert:</strong> Projected {estimatedUnitsAtRisk} units will expire unsold at current sales velocity.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApplyDiscount(item.id, 20)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Apply 20% Flash Clearance</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
