import React from 'react';
import { TrendingUp, DollarSign, PackageCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface SalesStatsProps {
  products: Product[];
}

export const SalesStats: React.FC<SalesStatsProps> = ({ products }) => {
  const totalItemsCount = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStockCount = products.filter(p => p.quantity <= p.minThreshold).length;

  // Mock weekly revenue bars
  const weeklyData = [
    { day: 'Mon', revenue: 8400, height: '55%' },
    { day: 'Tue', revenue: 9200, height: '62%' },
    { day: 'Wed', revenue: 11500, height: '78%' },
    { day: 'Thu', revenue: 10200, height: '68%' },
    { day: 'Fri', revenue: 14800, height: '95%' },
    { day: 'Sat', revenue: 16200, height: '100%' },
    { day: 'Sun (Today)', revenue: 12450, height: '82%' },
  ];

  return (
    <div className="space-y-4">
      
      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Today's Revenue</div>
            <div className="text-xl font-extrabold text-white">₹12,450</div>
            <div className="text-[10px] text-emerald-400 font-semibold">+18.4% vs last week</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Total Units in Stock</div>
            <div className="text-xl font-extrabold text-white">{totalItemsCount} units</div>
            <div className="text-[10px] text-slate-400 font-semibold">{products.length} distinct SKUs</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Low Stock Alerts</div>
            <div className="text-xl font-extrabold text-rose-400">{lowStockCount} items</div>
            <div className="text-[10px] text-slate-400 font-semibold">Immediate reorder suggested</div>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart & Demand Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Weekly Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-extrabold text-white">Weekly Store Sales Velocity</h4>
              <p className="text-[11px] text-slate-400">Daily checkout gross totals across morning and evening peak hours</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 font-semibold border border-slate-800">
              Total: ₹82,750
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
            {weeklyData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition">
                  ₹{item.revenue}
                </div>
                <div
                  style={{ height: item.height }}
                  className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 group-hover:brightness-125 ${
                    idx === weeklyData.length - 1 ? 'bg-gradient-to-t from-emerald-600 to-teal-400' : 'bg-slate-800'
                  }`}
                ></div>
                <span className="text-[10px] text-slate-400 mt-2 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Local Demand Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">AI Demand Radar</h4>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Basmati Rice (5kg)</span>
                  <span className="text-emerald-400 text-[10px]">🔥 +32% Demand</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Festive weekend spike expected in your postal zone.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Cow Milk Packets</span>
                  <span className="text-amber-400 text-[10px]">⚠️ Fast Depletion</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Average daily run-rate is 25 packets; current stock is only 8.</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-3 text-[11px] text-slate-500 text-center">
            Updated via Real-time POS Transactions
          </div>
        </div>

      </div>

    </div>
  );
};
