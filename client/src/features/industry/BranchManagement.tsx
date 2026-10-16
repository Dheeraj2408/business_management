import React from 'react';
import { Building, MapPin, User, Package, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { Branch } from '../../types';

interface BranchManagementProps {
  branches: Branch[];
}

export const BranchManagement: React.FC<BranchManagementProps> = ({ branches }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-400" />
            Branch & Regional Warehouse Management
          </h3>
          <p className="text-xs text-slate-400">
            Multi-facility inventory oversight, local manager assignment, and branch-level sustainability audits
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition">
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Inter-Branch Stock Transfer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map(branch => (
          <div key={branch.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {branch.type}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  branch.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {branch.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white mt-1">{branch.name}</h4>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{branch.city}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Inventory Items</div>
                  <div className="font-extrabold text-white">{branch.totalSKUs} SKUs</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Eco Score</div>
                  <div className="font-extrabold text-emerald-400">{branch.sustainabilityScore}/100</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                {branch.manager}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Audited
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
