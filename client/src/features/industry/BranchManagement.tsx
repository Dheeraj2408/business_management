import React, { useState } from 'react';
import { Building, MapPin, User, ArrowRightLeft, CheckCircle2, X } from 'lucide-react';
import { Branch, Product } from '../../types';

interface BranchManagementProps {
  branches: Branch[];
  products: Product[];
  onTransferStock: (sourceBranchId: string, targetBranchId: string, quantity: number, productName: string) => void;
}

export const BranchManagement: React.FC<BranchManagementProps> = ({ branches, products, onTransferStock }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [sourceId, setSourceId] = useState(branches[0]?.id || '');
  const [targetId, setTargetId] = useState(branches[1]?.id || '');
  const [transferQty, setTransferQty] = useState(15);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.name || 'Basmati Rice');
  const [transferSuccess, setTransferSuccess] = useState(false);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceId === targetId) {
      alert('Source and destination branches cannot be the same!');
      return;
    }

    onTransferStock(sourceId, targetId, Number(transferQty), selectedProduct);
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setShowTransferModal(false);
    }, 1800);
  };

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

        <button
          onClick={() => setShowTransferModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
        >
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

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setShowTransferModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-purple-400" />
              Inter-Branch Stock Transfer
            </h4>
            <p className="text-xs text-slate-400 mb-4">Move supplies between regional warehouses and production units</p>

            {transferSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Stock Transfer Completed & Synced in Database!</span>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Select Product SKU</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.name}>{p.name} (Stock: {p.quantity})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Source Branch</label>
                    <select
                      value={sourceId}
                      onChange={(e) => setSourceId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-[11px]"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name.split('-')[0]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Target Branch</label>
                    <select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-[11px]"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name.split('-')[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Transfer Units</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={transferQty}
                    onChange={(e) => setTransferQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
                >
                  Confirm & Transfer Stock
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
