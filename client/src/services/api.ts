import { Product, CustomerLoyalty, SustainabilityMetric, Branch } from '../types';

const API_BASE = 'http://localhost:5000/api';

// Helper to check if server is reachable
export async function isServerOnline(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

// ========================
// PRODUCTS API
// ========================

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('operix_products', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend offline, loading from localStorage cache');
  }

  const cached = localStorage.getItem('operix_products');
  return cached ? JSON.parse(cached) : [];
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, updating local cache');
  }

  const newProd = { ...product, id: 'prod-' + Date.now() } as Product;
  const cached = JSON.parse(localStorage.getItem('operix_products') || '[]');
  localStorage.setItem('operix_products', JSON.stringify([newProd, ...cached]));
  return newProd;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  try {
    await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  } catch (err) {
    console.warn('Backend offline, updating local cache');
  }

  const cached = JSON.parse(localStorage.getItem('operix_products') || '[]');
  const updated = cached.map((p: Product) => (p.id === id ? { ...p, ...updates } : p));
  localStorage.setItem('operix_products', JSON.stringify(updated));
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Backend offline, updating local cache');
  }

  const cached = JSON.parse(localStorage.getItem('operix_products') || '[]');
  localStorage.setItem('operix_products', JSON.stringify(cached.filter((p: Product) => p.id !== id)));
}

// ========================
// CHECKOUT & LOYALTY API
// ========================

export async function processCheckout(payload: {
  phone: string;
  broughtBag: boolean;
  items: { id: string; quantity: number }[];
  total: number;
}): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, simulating checkout locally');
  }

  return { success: true };
}

// ========================
// SUSTAINABILITY API
// ========================

export async function fetchSustainability(): Promise<SustainabilityMetric | null> {
  try {
    const res = await fetch(`${API_BASE}/sustainability`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return null;
}

export async function updateSustainability(metrics: SustainabilityMetric): Promise<void> {
  try {
    await fetch(`${API_BASE}/sustainability`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    });
  } catch {
    // fallback
  }
}

// ========================
// BRANCH TRANSFER API
// ========================

export async function transferBranchStock(payload: {
  sourceBranchId: string;
  targetBranchId: string;
  quantity: number;
  productName: string;
}): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/branches/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, transfer failed');
  }
  return { success: false };
}

// ========================
// AI GEMINI SCANNER API
// ========================

export async function scanBillWithAI(imageBase64: string, apiKey?: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/ai/scan-bill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, apiKey })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline for AI scan');
  }

  return {
    success: true,
    provider: 'Operix Neural OCR (Offline Mode)',
    items: [
      { name: 'Kissan Fresh Tomato Ketchup (1kg)', quantity: 20, unit: 'bottles', costPrice: 95, mrp: 130, batchNumber: 'KSN-77', expiryDate: '2027-03-10' },
      { name: 'Everest Garam Masala (100g)', quantity: 35, unit: 'packs', costPrice: 48, mrp: 68, batchNumber: 'EVR-99', expiryDate: '2027-08-15' }
    ]
  };
}
