import React, { useState } from 'react';
import { Store, ShieldCheck, Phone, MapPin, Send, X, Printer, CheckCircle2 } from 'lucide-react';
import { RetailerPartner } from '../../types';

interface RetailerNetworkProps {
  retailers: RetailerPartner[];
}

export const RetailerNetwork: React.FC<RetailerNetworkProps> = ({ retailers }) => {
  const [activeInvoiceRetailer, setActiveInvoiceRetailer] = useState<RetailerPartner | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const handleDispatch = (ret: RetailerPartner) => {
    setActiveInvoiceRetailer(ret);
  };

  const handleConfirmDispatch = () => {
    setDispatchStatus('Dispatched');
    setTimeout(() => {
      setDispatchStatus(null);
      setActiveInvoiceRetailer(null);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-400" />
            Downstream Retailer & Distributor Network
          </h3>
          <p className="text-xs text-slate-400">
            Local Kirana stores, pharmacies, and supermarkets procuring certified sustainable stock from your facility
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {retailers.length} Active Connected Outlets
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {retailers.map(ret => (
          <div key={ret.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-white">{ret.storeName}</h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Prop: {ret.ownerName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {ret.city}
                    </span>
                  </div>
                </div>

                {ret.isGreenCertified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    Green Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                    Standard Retail
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Store Category</div>
                  <div className="font-semibold text-slate-200">{ret.tier}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Orders this Month</div>
                  <div className="font-semibold text-emerald-400">{ret.ordersThisMonth} Shipments</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" />
                +91 {ret.phone}
              </span>

              <button
                onClick={() => handleDispatch(ret)}
                className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition"
              >
                <Send className="w-3 h-3" />
                Dispatch Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Invoice Modal */}
      {activeInvoiceRetailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-xs">
            <button
              onClick={() => setActiveInvoiceRetailer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="text-[10px] uppercase font-bold text-purple-400">B2B Commercial Tax Invoice</span>
              <h4 className="text-base font-extrabold text-white">Invoice #INV-2026-{Math.floor(1000 + Math.random() * 9000)}</h4>
              <p className="text-[11px] text-slate-400">Buyer: {activeInvoiceRetailer.storeName} ({activeInvoiceRetailer.city})</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mb-4">
              <div className="flex justify-between text-slate-300">
                <span>Certified Sustainable Packaging (Grade A Kraft Boxes)</span>
                <span>50 Cartons</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Taxable Freight Value</span>
                <span>₹24,500</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18% B2B Input Credit)</span>
                <span>₹4,410</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                <span>Total Invoice Value</span>
                <span>₹28,910</span>
              </div>
            </div>

            {dispatchStatus ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Invoice Dispatched & EDI Sent to {activeInvoiceRetailer.storeName}!</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={handleConfirmDispatch}
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
