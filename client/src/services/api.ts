import { Product, CustomerLoyalty, SustainabilityMetric, Branch, Employee, RawMaterial, ElectricityData, Machine } from '../types';

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

// ============================================
// INDUSTRIAL MANUFACTURING OPERATIONS API
// ============================================

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const res = await fetch(`${API_BASE}/industry/employees`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('operix_employees', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend offline, loading employees from cache');
  }
  const cached = localStorage.getItem('operix_employees');
  return cached ? JSON.parse(cached) : [];
}

export async function createEmployee(emp: Partial<Employee>): Promise<Employee> {
  try {
    const res = await fetch(`${API_BASE}/industry/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, saving employee locally');
  }
  const newEmp = { ...emp, id: 'emp-' + Date.now() } as Employee;
  const cached = JSON.parse(localStorage.getItem('operix_employees') || '[]');
  localStorage.setItem('operix_employees', JSON.stringify([newEmp, ...cached]));
  return newEmp;
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/industry/employees/${id}`, { method: 'DELETE' });
  } catch {
    // fallback
  }
  const cached = JSON.parse(localStorage.getItem('operix_employees') || '[]');
  localStorage.setItem('operix_employees', JSON.stringify(cached.filter((e: Employee) => e.id !== id)));
}

export async function fetchRawMaterials(): Promise<RawMaterial[]> {
  try {
    const res = await fetch(`${API_BASE}/industry/raw-materials`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('operix_raw_materials', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend offline, loading raw materials from cache');
  }
  const cached = localStorage.getItem('operix_raw_materials');
  return cached ? JSON.parse(cached) : [];
}

export async function createRawMaterial(mat: Partial<RawMaterial>): Promise<RawMaterial> {
  try {
    const res = await fetch(`${API_BASE}/industry/raw-materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mat)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, saving raw material locally');
  }
  const newMat = { ...mat, id: 'raw-' + Date.now() } as RawMaterial;
  const cached = JSON.parse(localStorage.getItem('operix_raw_materials') || '[]');
  localStorage.setItem('operix_raw_materials', JSON.stringify([newMat, ...cached]));
  return newMat;
}

export async function fetchElectricity(): Promise<ElectricityData | null> {
  try {
    const res = await fetch(`${API_BASE}/industry/electricity`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('operix_electricity', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend offline, loading electricity from cache');
  }
  const cached = localStorage.getItem('operix_electricity');
  return cached ? JSON.parse(cached) : null;
}

export async function updateElectricity(el: Partial<ElectricityData>): Promise<void> {
  try {
    await fetch(`${API_BASE}/industry/electricity`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(el)
    });
  } catch {
    // fallback
  }
  const cached = JSON.parse(localStorage.getItem('operix_electricity') || '{}');
  localStorage.setItem('operix_electricity', JSON.stringify({ ...cached, ...el }));
}

export async function fetchMachines(): Promise<Machine[]> {
  try {
    const res = await fetch(`${API_BASE}/industry/machines`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('operix_machines', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend offline, loading machines from cache');
  }
  const cached = localStorage.getItem('operix_machines');
  return cached ? JSON.parse(cached) : [];
}

export async function toggleMachineStatus(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/industry/machines/${id}/toggle`, { method: 'PUT' });
  } catch {
    // fallback
  }
  const cached = JSON.parse(localStorage.getItem('operix_machines') || '[]');
  const updated = cached.map((m: Machine) => {
    if (m.id === id) {
      const next = m.status === 'Running' ? 'Maintenance' : m.status === 'Maintenance' ? 'Idle' : 'Running';
      return { ...m, status: next };
    }
    return m;
  });
  localStorage.setItem('operix_machines', JSON.stringify(updated));
}

