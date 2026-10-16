import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, CheckCircle2, TrendingUp, Zap, Box, Trash2 } from 'lucide-react';
import { SustainabilityMetric } from '../../types';

interface AIGreenAdvisorProps {
  metrics: SustainabilityMetric;
  onApplyOptimization: () => void;
}

export const AIGreenAdvisor: React.FC<AIGreenAdvisorProps> = ({ metrics, onApplyOptimization }) => {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    onApplyOptimization();
    setApplied(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              AI Green Transformation Advisor
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ESG Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Algorithmic recommendations to raise sustainability index & attract top-tier retail buyers</p>
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={applied}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
            applied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950'
          }`}
        >
          {applied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimizations Applied (+10 Pts)</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Apply AI Recommendations</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Recommendation 1: Energy */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                +4 Score Pts
              </span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Rooftop Solar Shift</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Transition Unit 2 warehousing to 85% captive solar microgrid. Reduces grid reliance and saves ~18 tons CO2/month.
            </p>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-amber-400">ROI Payback: 14 Months</div>
        </div>

        {/* Recommendation 2: Packaging */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Box className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                +5 Score Pts
              </span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Corrugated Cardboard Wrap</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Replace secondary PVC shrink-film with 100% water-soluble kraft paper tape across outgoing pallets.
            </p>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-emerald-400">Immediate Consumer Appeal</div>
        </div>

        {/* Recommendation 3: Zero Landfill */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <Trash2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                +3 Score Pts
              </span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Closed-Loop Scrap Resell</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Partner with municipal e-waste & carton recyclers to reach 95% zero-landfill diversion certification.
            </p>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-sky-400">ESG Regulatory Compliant</div>
        </div>
      </div>
    </div>
  );
};
