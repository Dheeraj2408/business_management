import React, { useState } from 'react';
import { Phone, Award, ShoppingBag, CheckCircle2, UserCheck, Sparkles, QrCode, Printer, X, ArrowRight } from 'lucide-react';
import { CustomerLoyalty as CustomerType, Product } from '../../types';

interface CustomerLoyaltyProps {
  customers: CustomerType[];
  products: Product[];
  storeName: string;
  onCompleteCheckout: (phone: string, broughtBag: boolean, items: { id: string; quantity: number }[], total: number) => void;
}

export const CustomerLoyalty: React.FC<CustomerLoyaltyProps> = ({ customers, products, storeName, onCompleteCheckout }) => {
  const [phoneInput, setPhoneInput] = useState('9876543210');
  const [activeCustomer, setActiveCustomer] = useState<CustomerType | null>(customers[0] || null);
  const [broughtBag, setBroughtBag] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({
    'prod-1': 1,
    'prod-2': 1
  });

  // Modals for UPI QR and Printable Receipt
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastBill, setLastBill] = useState<any>(null);

  const upiId = localStorage.getItem('operix_upi_id') || 'operix@okhdfcbank';

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = customers.find(c => c.phone === phoneInput.trim());
    if (found) {
      setActiveCustomer(found);
    } else {
      const newCust: CustomerType = {
        phone: phoneInput.trim(),
        name: 'Shopper (' + phoneInput.slice(-4) + ')',
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
  const cartItemList: { product: Product; quantity: number }[] = [];
  Object.entries(selectedItems).forEach(([id, qty]) => {
    const prod = products.find(p => p.id === id);
    if (prod && qty > 0) {
      subtotal += prod.price * qty;
      cartItemList.push({ product: prod, quantity: qty });
    }
  });

  const isMilestoneVisit = activeCustomer ? activeCustomer.visitCount % 5 === 0 : false;
  const milestoneDiscount = isMilestoneVisit ? Math.floor(subtotal * 0.10) : 0;
  const greenBagDiscount = broughtBag ? 10 : 0;
  const finalTotal = Math.max(0, subtotal - milestoneDiscount - greenBagDiscount);

  // Generate UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(storeName)}&am=${finalTotal}&cu=INR&tn=Operix%20Store%20Purchase`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;

  const handleCompleteTransaction = () => {
    if (!activeCustomer) return;
    const checkoutItems = Object.entries(selectedItems).map(([id, quantity]) => ({ id, quantity }));
    
    onCompleteCheckout(activeCustomer.phone, broughtBag, checkoutItems, finalTotal);

    // Save for receipt
    setLastBill({
      receiptNo: 'OPX-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString('en-IN'),
      customerName: activeCustomer.name,
      customerPhone: activeCustomer.phone,
      items: [...cartItemList],
      subtotal,
      milestoneDiscount,
      greenBagDiscount,
      finalTotal,
      greenPointsEarned: broughtBag ? 25 : 10
    });

    setShowUpiModal(false);
    setShowReceiptModal(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            Customer Phone Loyalty & Green Stamp POS Register
          </h3>
          <p className="text-xs text-slate-400">
            Real customer lookup via mobile number, automatic milestone discount, and instant UPI QR payments
          </p>
        </div>

        {/* Preset test phones */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400">Quick Test Customers:</span>
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
        
        {/* Left: Customer Lookup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="tel"
              required
              placeholder="Enter 10-digit customer mobile..."
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

        {/* Right: Live POS Cart & Checkout (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Fast POS Register Cart</span>
              <span className="text-[11px] text-slate-400">{cartItemList.length} products selected</span>
            </div>

            {/* Quick Item Selectors */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
              {products.slice(0, 5).map(p => {
                const isSelected = !!selectedItems[p.id];
                return (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400">₹{p.price} / {p.unit} (In stock: {p.quantity})</div>
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
                <span>Subtotal ({cartItemList.length} items)</span>
                <span>₹{subtotal}</span>
              </div>
              {milestoneDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Visit #{activeCustomer?.visitCount} Milestone Discount (10%)</span>
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
                <span>Total Amount Due</span>
                <span className="text-emerald-400">₹{finalTotal}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Pay via UPI QR or Cash Bill */}
          <div className="pt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowUpiModal(true)}
              disabled={subtotal === 0}
              className="py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-950 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              <QrCode className="w-4 h-4" />
              <span>Pay via UPI QR (PhonePe / GPay)</span>
            </button>

            <button
              onClick={handleCompleteTransaction}
              disabled={subtotal === 0}
              className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Checkout & Print Receipt</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================
          MODAL 1: REAL DYNAMIC UPI QR CODE
         ======================================================== */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-extrabold text-white">Scan & Pay via UPI</h4>
            <p className="text-xs text-slate-400 mt-0.5">Use Google Pay, PhonePe, Paytm or BHIM</p>

            <div className="my-4 p-3 bg-white rounded-2xl inline-block shadow-inner">
              <img src={upiQrCodeUrl} alt="UPI QR Code" className="w-48 h-48 mx-auto" />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs mb-4">
              <div className="text-slate-400">Total Payable:</div>
              <div className="text-2xl font-black text-emerald-400">₹{finalTotal}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">UPI ID: {upiId}</div>
            </div>

            <button
              onClick={handleCompleteTransaction}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Payment & Print Bill</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: PRINTABLE THERMAL RECEIPT
         ======================================================== */}
      {showReceiptModal && lastBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col font-mono text-xs">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Printable Content */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-3">
              <div className="text-center pb-3 border-b-2 border-dashed border-slate-300">
                <div className="font-black text-base uppercase tracking-tight">{storeName}</div>
                <div className="text-[11px] text-slate-600">GSTIN: 36AAECP1234F1Z5 • Tel: +91 9876543210</div>
                <div className="text-[10px] text-slate-500 mt-1">Receipt #{lastBill.receiptNo} • {lastBill.date}</div>
              </div>

              <div>
                <div className="text-[11px]">Customer: <strong>{lastBill.customerName}</strong></div>
                <div className="text-[11px]">Mobile: +91 {lastBill.customerPhone}</div>
              </div>

              <table className="w-full text-left border-t border-b border-dashed border-slate-300 py-2 my-2">
                <thead>
                  <tr className="text-slate-600 border-b border-slate-200">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {lastBill.items.map((it: any, idx: number) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-1">{it.product.name}</td>
                      <td className="py-1 text-center">{it.quantity}</td>
                      <td className="py-1 text-right">₹{it.product.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-right">
                <div>Subtotal: ₹{lastBill.subtotal}</div>
                {lastBill.milestoneDiscount > 0 && (
                  <div className="text-emerald-700 font-bold">- Milestone 10% Discount: ₹{lastBill.milestoneDiscount}</div>
                )}
                {lastBill.greenBagDiscount > 0 && (
                  <div className="text-emerald-700 font-bold">- Green Bag Discount: ₹{lastBill.greenBagDiscount}</div>
                )}
                <div className="text-base font-black pt-1 border-t border-dashed border-slate-400">
                  TOTAL PAID: ₹{lastBill.finalTotal}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-[10px] text-emerald-800">
                🌿 <strong>+{lastBill.greenPointsEarned} Green Points Awarded!</strong> Thank you for carrying your own reusable bag & supporting eco-friendly retail.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Receipt</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
