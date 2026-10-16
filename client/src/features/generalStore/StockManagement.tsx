import React, { useState, useRef } from 'react';
import { Search, Plus, Sparkles, AlertCircle, Package, Trash2, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { Product } from '../../types';
import { VoiceInput } from '../ai/VoiceInput';

interface StockManagementProps {
  products: Product[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onAddProduct: (product: Partial<Product>) => void;
  onDeleteProduct?: (id: string) => void;
  onOpenScanner: () => void;
}

export const StockManagement: React.FC<StockManagementProps> = ({
  products,
  onUpdateQuantity,
  onAddProduct,
  onDeleteProduct,
  onOpenScanner
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // New product form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Grains & Pulses');
  const [newQty, setNewQty] = useState(20);
  const [newPrice, setNewPrice] = useState(100);
  const [newCost, setNewCost] = useState(80);
  const [newUnit, setNewUnit] = useState('kg');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    onAddProduct({
      name: newName,
      category: newCategory,
      quantity: Number(newQty),
      unit: newUnit,
      price: Number(newPrice),
      costPrice: Number(newCost),
      minThreshold: 10,
      supplierName: 'Direct Ingest'
    });

    setNewName('');
    setShowAddModal(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = 'ID,Name,Category,Quantity,Unit,CostPrice,SellingPrice,Batch,Expiry\n';
    const rows = products.map(p => 
      `"${p.id}","${p.name}","${p.category}",${p.quantity},"${p.unit}",${p.costPrice},${p.price},"${p.batchNumber || ''}","${p.expiryDate || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `operix_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length <= 1) return;

      // Skip header, parse lines
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.replace(/^"|"$/g, '').trim());
        if (parts.length >= 2 && parts[1]) {
          onAddProduct({
            name: parts[1],
            category: parts[2] || 'Imported SKU',
            quantity: Number(parts[3]) || 10,
            unit: parts[4] || 'units',
            costPrice: Number(parts[5]) || 50,
            price: Number(parts[6]) || 70,
            batchNumber: parts[7] || undefined,
            expiryDate: parts[8] || undefined
          });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            Inventory & Stock Catalog (Live Database)
          </h3>
          <p className="text-xs text-slate-400">Manage store catalog, track low-stock thresholds, and update supplies</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CSV Export & Import */}
          <button
            onClick={handleExportCSV}
            title="Download full inventory as CSV"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => csvInputRef.current?.click()}
            title="Upload CSV to add products"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <input
            type="file"
            ref={csvInputRef}
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />

          {/* Voice Input Microphone */}
          <VoiceInput onProductDetected={onAddProduct} />

          {/* AI Bill Scanner CTA */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Scan Bill (AI)</span>
          </button>

          {/* Add Item Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search items by name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock Level</th>
              <th className="p-3">Cost / Sell Price</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredProducts.map(p => {
              const isLowStock = p.quantity <= p.minThreshold;

              return (
                <tr key={p.id} className="hover:bg-slate-950/40 transition">
                  <td className="p-3">
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-500">Supplier: {p.supplierName || 'Wholesale Mandi'}</div>
                  </td>
                  <td className="p-3 text-slate-400">{p.category}</td>
                  <td className="p-3">
                    <span className="font-bold text-white text-sm">{p.quantity}</span>
                    <span className="text-[11px] text-slate-400 ml-1">{p.unit}</span>
                  </td>
                  <td className="p-3 text-slate-300">
                    ₹{p.costPrice} <span className="text-slate-500">/ ₹{p.price}</span>
                  </td>
                  <td className="p-3">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertCircle className="w-3 h-3" />
                        Low Stock ({p.quantity} left)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="inline-flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => onUpdateQuantity(p.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-white text-xs">{p.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(p.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition"
                        >
                          +
                        </button>
                      </div>

                      {onDeleteProduct && (
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          title="Delete SKU"
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 border border-slate-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Manual Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="font-extrabold text-base text-white mb-3">Add Product to Inventory</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sona Masoori Rice (10kg)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>Grains & Pulses</option>
                    <option>Oils & Ghee</option>
                    <option>Dairy & Beverages</option>
                    <option>Snacks & Biscuits</option>
                    <option>Home Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Sell Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
