import React, { useState, useRef } from 'react';
import { X, Sparkles, Upload, FileText, CheckCircle2, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { Product, ScannedBillItem } from '../../types';
import { scanBillWithAI } from '../../services/api';

interface AIBillScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProducts: (newProducts: Product[]) => void;
}

const SAMPLE_KIRANA_BILL: ScannedBillItem[] = [
  { id: 'sb-1', name: 'Fortune Sunflower Oil (1L Pouch)', quantity: 24, unit: 'pouches', costPrice: 115, mrp: 140, selected: true },
  { id: 'sb-2', name: 'Aashirvaad Shudh Chakki Atta (10kg)', quantity: 15, unit: 'bags', costPrice: 380, mrp: 440, selected: true },
  { id: 'sb-3', name: 'Tata Tea Gold (500g)', quantity: 30, unit: 'packs', costPrice: 240, mrp: 290, selected: true },
  { id: 'sb-4', name: 'Surf Excel Quick Wash (1kg)', quantity: 18, unit: 'packs', costPrice: 160, mrp: 195, selected: true }
];

const SAMPLE_PHARMA_BILL: ScannedBillItem[] = [
  { id: 'sp-1', name: 'Azithromycin 500mg Tablets', quantity: 80, unit: 'strips', costPrice: 62, mrp: 110, batchNumber: 'AZ-9921', expiryDate: '2027-08-30', selected: true },
  { id: 'sp-2', name: 'Cetrizen Allergy Relief (10mg)', quantity: 120, unit: 'strips', costPrice: 18, mrp: 35, batchNumber: 'CTZ-4010', expiryDate: '2027-05-15', selected: true },
  { id: 'sp-3', name: 'Betadine 10% Antiseptic Solution (100ml)', quantity: 25, unit: 'bottles', costPrice: 85, mrp: 130, batchNumber: 'BTD-119', expiryDate: '2026-11-10', selected: true },
  { id: 'sp-4', name: 'Disposable Sterile Syringes 5ml (Box)', quantity: 40, unit: 'boxes', costPrice: 140, mrp: 220, batchNumber: 'SYR-505', expiryDate: '2028-12-01', selected: true }
];

export const AIBillScanner: React.FC<AIBillScannerProps> = ({ isOpen, onClose, onImportProducts }) => {
  if (!isOpen) return null;

  const [scanning, setScanning] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ScannedBillItem[]>([]);
  const [billSource, setBillSource] = useState<string>('');
  const [providerName, setProviderName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Preset Sample Bill Scans
  const handleSimulateScan = (type: 'kirana' | 'pharma') => {
    setScanning(true);
    setBillSource(type === 'kirana' ? 'Wholesale Grocery Mandi Invoice #WH-8821' : 'Apollo Pharma Distributor Bill #MED-4091');

    setTimeout(() => {
      setExtractedItems(type === 'kirana' ? SAMPLE_KIRANA_BILL : SAMPLE_PHARMA_BILL);
      setProviderName('Operix Neural Vision Engine');
      setScanning(false);
    }, 1200);
  };

  // Handle Real File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setBillSource(file.name);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const apiKey = localStorage.getItem('operix_gemini_key') || undefined;

      try {
        const response = await scanBillWithAI(base64, apiKey);
        if (response && response.items) {
          const items: ScannedBillItem[] = response.items.map((it: any, idx: number) => ({
            id: 'scan-' + Date.now() + '-' + idx,
            name: it.name || 'Scanned Item ' + (idx + 1),
            quantity: Number(it.quantity) || 1,
            unit: it.unit || 'units',
            costPrice: Number(it.costPrice) || 50,
            mrp: Number(it.mrp) || 75,
            batchNumber: it.batchNumber || undefined,
            expiryDate: it.expiryDate || undefined,
            selected: true
          }));
          setExtractedItems(items);
          setProviderName(response.provider || 'Google Gemini 1.5 Flash');
        }
      } catch (err) {
        console.error('OCR Error:', err);
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSelect = (id: string) => {
    setExtractedItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setExtractedItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, qty) } : item));
  };

  const handleConfirmImport = () => {
    const selected = extractedItems.filter(item => item.selected);
    const newProducts: Product[] = selected.map(item => ({
      id: 'scanned-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: item.name,
      category: item.batchNumber ? 'Pharmaceuticals' : 'Grocery Stock',
      quantity: item.quantity,
      unit: item.unit,
      price: item.mrp,
      costPrice: item.costPrice,
      minThreshold: 10,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      supplierName: billSource.includes('Pharma') ? 'Apex Med Distributors' : 'Mandi Wholesale Supply'
    }));

    onImportProducts(newProducts);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                AI Wholesale Bill Scanner
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Multimodal Vision OCR
                </span>
              </h3>
              <p className="text-xs text-slate-400">Instantly parse physical paper bills & supplier invoices into digital inventory</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Actions & Sample Buttons */}
        <div className="py-4 border-b border-slate-800 space-y-3">
          
          {/* Real File Upload Drag & Drop Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-emerald-500/70 rounded-xl p-4 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition flex items-center justify-center gap-3 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                Upload or Drop Any Real Store Bill (PNG / JPG / PDF)
              </div>
              <div className="text-[11px] text-slate-500">
                Processed via Google Gemini 1.5 Flash Vision / Neural OCR
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Or test with pre-loaded distributor invoices:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSimulateScan('kirana')}
                disabled={scanning}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-semibold"
              >
                Kirana Mandi Bill
              </button>
              <button
                onClick={() => handleSimulateScan('pharma')}
                disabled={scanning}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-semibold"
              >
                Pharma Batch Invoice
              </button>
            </div>
          </div>

        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4">
          {scanning ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
              <p className="text-sm font-bold text-white">AI Vision Scanning Distributor Invoice...</p>
              <p className="text-xs text-slate-400 mt-1">Extracting product names, quantities, wholesale prices & batch codes</p>
            </div>
          ) : extractedItems.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Extracted {extractedItems.length} Products via {providerName}
                </span>
                <span className="text-xs text-slate-400">
                  {extractedItems.filter(i => i.selected).length} selected
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3 w-10">Include</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Cost / MRP</th>
                      <th className="p-3">Batch & Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {extractedItems.map(item => (
                      <tr key={item.id} className={item.selected ? 'bg-slate-900/60' : 'bg-slate-950/40 opacity-50'}>
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-semibold text-white">{item.name}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-center"
                          />
                          <span className="ml-1 text-[11px] text-slate-400">{item.unit}</span>
                        </td>
                        <td className="p-3 text-slate-300">
                          ₹{item.costPrice} <span className="text-slate-500">/ ₹{item.mrp}</span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {item.batchNumber ? (
                            <div>
                              <span className="font-mono text-emerald-400">{item.batchNumber}</span>
                              <div className="text-[10px] text-amber-400">Exp: {item.expiryDate}</div>
                            </div>
                          ) : (
                            <span className="text-slate-600">Standard SKU</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-slate-950/30">
              <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No bill scanned yet</p>
              <p className="text-xs text-slate-500 mt-1">Upload a photo of your paper invoice or click one of the samples above</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {extractedItems.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setExtractedItems([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear Results
            </button>
            <button
              onClick={handleConfirmImport}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center gap-2 transition"
            >
              <span>Import {extractedItems.filter(i => i.selected).length} Items into Live Database</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
