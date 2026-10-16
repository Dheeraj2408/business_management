import React, { useState } from 'react';
import { Phone, Award, ShoppingBag, CheckCircle2, UserCheck, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { CustomerLoyalty as CustomerType, Product } from '../../types';

interface CustomerLoyaltyProps {
  customers: CustomerType[];
  products: Product[];
  onCompleteCheckout: (phone: string, broughtBag: boolean, total: number) => void;
}

export const CustomerLoyalty: React.FC<CustomerLoyaltyProps> = ({ customers, products, onCompleteCheckout }) => {
  const [phoneInput, setPhoneInput] = useState('9876543210'); // Default demo phone
  const [activeCustomer, setActiveCustomer] = useState<CustomerType | null>(customers[0] || null);
  const [broughtBag, setBroughtBag] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({
    'prod-1': 1,
    'prod-2': 1
  });
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = customers.find(c => c.phone === phoneInput.trim());
    if (found) {
      setActiveCustomer(found);
    } else {
      // New Customer
      const newCust: CustomerType = {
        phone: phoneInput.trim(),
        name: 'New Shopper (' + phoneInput.slice(-4) + ')',
        visitCount: 1,
        greenPoints: 10,
        lastVisit: new Date().toISOString().split('T')[0],
        reusableBagCount: broughtBag ? 1 : 0
      };
      setActiveCustomer(newCust);
    }
  };

  const handleQuickSelectPreset = (phone: string) => {
    setPhoneInput(phone);
    const found = customers.find(c => c.phone === phone);
    if (found) setActiveCustomer(found);
  };

  // Cart calculations
  let subtotal = 0;
  Object.entries(selectedItems).forEach(([id, qty]) => {
    const prod = products.find(p => p.id === id);
    if (prod) subtotal += prod.price * qty;
  });

  const isMilestoneVisit = activeCustomer ? activeCustomer.visitCount % 5 === 0 : false;
  const milestoneDiscount = isMilestoneVisit ? Math.floor(subtotal * 0.10) : 0;
  const greenBagDiscount = broughtBag ? 10 : 0;
  const finalTotal = Math.max(0, subtotal - milestoneDiscount - greenBagDiscount);

  const handleCheckout = () => {
    if (!activeCustomer) return;
    onCompleteCheckout(activeCustomer.phone, broughtBag, finalTotal);
    setCheckoutSuccess(true);
    setTimeout(() => setCheckoutSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            Customer Phone Loyalty & Green Stamp Billing
          </h3>
          <p className="text-xs text-slate-400">Zero-app customer check-in using mobile number. Rewards repeat visits and eco-friendly shopping.</p>
        </div>

        {/* Preset test phones */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400">Test Customers:</span>
          {customers.map(c => (
            <button
              key={c.phone}
              onClick={() => handleQuickSelectPreset(c.phone)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono transition ${
                activeCustomer?.phone === c.phone
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {c.name.split(' ')[0]} ({c.visitCount} visits)
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Phone Lookup & Customer Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="tel"
              required
              placeholder="Enter 10-digit mobile number..."
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Lookup
            </button>
          </form>

          {activeCustomer && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>{activeCustomer.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">+91 {activeCustomer.phone}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {activeCustomer.visitCount} Visits Logged
                </span>
              </div>

              {/* Loyalty Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800/80">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-base font-extrabold text-emerald-400">{activeCustomer.greenPoints}</div>
                  <div className="text-[10px] text-slate-400">Green Points</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-base font-extrabold text-sky-400">{activeCustomer.reusableBagCount} times</div>
                  <div className="text-[10px] text-slate-400">Brought Own Bag</div>
                </div>
              </div>

              {/* Milestone Banner */}
              {isMilestoneVisit ? (
                <div className="p-2.5 rounded-lg bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Milestone Unlocked!</strong> This is visit #{activeCustomer.visitCount}. 10% loyal customer discount applied!</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Next milestone reward unlocks on visit #{Math.ceil((activeCustomer.visitCount + 1) / 5) * 5}.
                </div>
              )}

              {/* Green Stamp Toggle Checkbox */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 cursor-pointer hover:bg-slate-850 transition">
                <input
                  type="checkbox"
                  checked={broughtBag}
                  onChange={(e) => setBroughtBag(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    Brought Reusable Cloth Bag
                  </span>
                  <span className="text-[10px] text-emerald-400 block">+15 Green Points & ₹10 Instant Green Discount</span>
                </div>
              </label>

            </div>
          )}
        </div>

        {/* Right Column: POS Fast Billing & Checkout (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Fast POS Billing Register</span>
              <span className="text-[11px] text-slate-400">Customer Cart</span>
            </div>

            {/* Quick Item Toggles */}
            <div className="space-y-2 mb-4">
              {products.slice(0, 3).map(p => {
                const isSelected = !!selectedItems[p.id];
                return (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400">₹{p.price} / {p.unit}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedItems(prev => {
                          const copy = { ...prev };
                          if (copy[p.id]) delete copy[p.id];
                          else copy[p.id] = 1;
                          return copy;
                        });
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'In Cart' : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Cart Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {milestoneDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Visit #5 Milestone Discount (10%)</span>
                  <span>- ₹{milestoneDiscount}</span>
                </div>
              )}
              {greenBagDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Green Bag Eco-Discount</span>
                  <span>- ₹{greenBagDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-slate-800">
                <span>Final Payable Amount</span>
                <span className="text-emerald-400">₹{finalTotal}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="pt-4">
            {checkoutSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Bill Completed! SMS Receipt & +25 Green Points Sent to +91 {activeCustomer?.phone}</span>
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={subtotal === 0}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition"
              >
                <span>Print Bill & Award Green Loyalty Stamp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
