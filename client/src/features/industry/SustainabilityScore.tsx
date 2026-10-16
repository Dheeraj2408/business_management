import React, { useState } from 'react';
import { Leaf, Award, ShieldCheck, Zap, Box, Trash2, MapPin, RefreshCw } from 'lucide-react';
import { SustainabilityMetric } from '../../types';

interface SustainabilityScoreProps {
  metrics: SustainabilityMetric;
  onUpdateMetrics: (newMetrics: SustainabilityMetric) => void;
}

export const SustainabilityScore: React.FC<SustainabilityScoreProps> = ({ metrics, onUpdateMetrics }) => {
  const [energy, setEnergy] = useState(metrics.renewableEnergyPct);
  const [packaging, setPackaging] = useState(metrics.recyclablePackagingPct);
  const [waste, setWaste] = useState(metrics.wasteDiversionPct);
  const [sourcing, setSourcing] = useState(metrics.localSourcingPct);

  // Weighted ESG Formula:
  // Energy (30%) + Packaging (25%) + Waste (25%) + Sourcing (20%)
  const computedScore = Math.round(
    energy * 0.30 + packaging * 0.25 + waste * 0.25 + sourcing * 0.20
  );

  const handleSliderChange = (type: 'energy' | 'packaging' | 'waste' | 'sourcing', val: number) => {
    let e = energy, p = packaging, w = waste, s = sourcing;
    if (type === 'energy') { setEnergy(val); e = val; }
    if (type === 'packaging') { setPackaging(val); p = val; }
    if (type === 'waste') { setWaste(val); w = val; }
    if (type === 'sourcing') { setSourcing(val); s = val; }

    const newScore = Math.round(e * 0.30 + p * 0.25 + w * 0.25 + s * 0.20);
    onUpdateMetrics({
      renewableEnergyPct: e,
      recyclablePackagingPct: p,
      wasteDiversionPct: w,
      localSourcingPct: s,
      overallScore: newScore,
      carbonSavedTons: Math.round(newScore * 1.8)
    });
  };

  const getGrade = (score: number) => {
    if (score >= 80) return { grade: 'A+ Elite', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    if (score >= 70) return { grade: 'A Verified', color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' };
    if (score >= 55) return { grade: 'B Standard', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
    return { grade: 'C Action Req.', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' };
  };

  const gradeInfo = getGrade(computedScore);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            Algorithmic Sustainability Index (0–100 ESG Audit)
          </h3>
          <p className="text-xs text-slate-400">
            Real-time ESG audit score for industrial manufacturers, verified for downstream B2B wholesale buyers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${gradeInfo.color}`}>
            {gradeInfo.grade}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 font-mono border border-slate-800">
            ~{Math.round(computedScore * 1.8)} Tons CO2 Offset
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Overall Circular Dial (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-emerald-500 transition-all duration-700"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * computedScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{computedScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ESG Index</span>
            </div>
          </div>

          <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Certified Green B2B Vendor</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Retailers sourcing from you gain +15 Green Store Points</p>
        </div>

        {/* Right: 4 Pillar Sliders (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Adjust Audit Variables to Test Real-Time Score Recalculation:
          </p>

          {/* 1. Renewable Energy */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Renewable Energy Share (Solar / Wind Captive)
              </span>
              <span className="font-mono text-emerald-400 font-bold">{energy}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={energy}
              onChange={(e) => handleSliderChange('energy', parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* 2. Recyclable Packaging */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Box className="w-4 h-4 text-emerald-400" />
                Recyclable / Biodegradable Packaging Ratio
              </span>
              <span className="font-mono text-emerald-400 font-bold">{packaging}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={packaging}
              onChange={(e) => handleSliderChange('packaging', parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* 3. Waste Diversion */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-sky-400" />
                Zero-Waste-to-Landfill Diversion Rate
              </span>
              <span className="font-mono text-emerald-400 font-bold">{waste}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={waste}
              onChange={(e) => handleSliderChange('waste', parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* 4. Local Sourcing */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-400" />
                Hyperlocal Raw Material Sourcing (&lt;150km)
              </span>
              <span className="font-mono text-emerald-400 font-bold">{sourcing}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sourcing}
              onChange={(e) => handleSliderChange('sourcing', parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
