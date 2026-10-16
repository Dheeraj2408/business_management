import React from 'react';
import { Store, ShieldCheck, Phone, MapPin, PackageCheck, Send } from 'lucide-react';
import { RetailerPartner } from '../../types';

interface RetailerNetworkProps {
  retailers: RetailerPartner[];
}

export const RetailerNetwork: React.FC<RetailerNetworkProps> = ({ retailers }) => {
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

              <button className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300">
                <Send className="w-3 h-3" />
                Dispatch Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
