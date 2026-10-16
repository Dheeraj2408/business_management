import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { getFirestoreDb, isFirebaseConfigured } from './firebase';
import {
  Product,
  CustomerLoyalty,
  SustainabilityMetric,
  Branch,
  Employee,
  RawMaterial,
  ElectricityData,
  Machine
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUSTAINABILITY,
  INITIAL_BRANCHES
} from '../data/mockData';

// Firestore collection names
const COLLECTIONS = {
  PRODUCTS: 'operix_products',
  CUSTOMERS: 'operix_customers',
  SUSTAINABILITY: 'operix_sustainability',
  BRANCHES: 'operix_branches',
  EMPLOYEES: 'operix_employees',
  RAW_MATERIALS: 'operix_raw_materials',
  ELECTRICITY: 'operix_electricity',
  MACHINES: 'operix_machines'
};

// ============================================
// REAL-TIME LISTENERS (Multi-device live sync)
// ============================================

export function listenToProducts(callback: (products: Product[]) => void): (() => void) | null {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return null;

  try {
    const colRef = collection(db, COLLECTIONS.PRODUCTS);
    return onSnapshot(colRef, (snapshot: any) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap: any) => {
        items.push({ ...(docSnap.data() as Product), id: docSnap.id });
      });
      if (items.length > 0) {
        callback(items);
      }
    }, (err: any) => {
      console.warn('Firestore products listener error:', err);
    });
  } catch (err) {
    console.warn('Could not attach Firestore products listener:', err);
    return null;
  }
}

export function listenToCustomers(callback: (customers: CustomerLoyalty[]) => void): (() => void) | null {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return null;

  try {
    const colRef = collection(db, COLLECTIONS.CUSTOMERS);
    return onSnapshot(colRef, (snapshot: any) => {
      const items: CustomerLoyalty[] = [];
      snapshot.forEach((docSnap: any) => {
        items.push(docSnap.data() as CustomerLoyalty);
      });
      if (items.length > 0) {
        callback(items);
      }
    });
  } catch {
    return null;
  }
}

export function listenToSustainability(callback: (metrics: SustainabilityMetric) => void): (() => void) | null {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return null;

  try {
    const docRef = doc(db, COLLECTIONS.SUSTAINABILITY, 'current_metrics');
    return onSnapshot(docRef, (docSnap: any) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SustainabilityMetric);
      }
    });
  } catch {
    return null;
  }
}

export function listenToBranches(callback: (branches: Branch[]) => void): (() => void) | null {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return null;

  try {
    const colRef = collection(db, COLLECTIONS.BRANCHES);
    return onSnapshot(colRef, (snapshot: any) => {
      const items: Branch[] = [];
      snapshot.forEach((docSnap: any) => {
        items.push({ ...(docSnap.data() as Branch), id: docSnap.id });
      });
      if (items.length > 0) {
        callback(items);
      }
    });
  } catch {
    return null;
  }
}

export function listenToEmployees(callback: (employees: Employee[]) => void): (() => void) | null {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return null;

  try {
    const colRef = collection(db, COLLECTIONS.EMPLOYEES);
    return onSnapshot(colRef, (snapshot: any) => {
      const items: Employee[] = [];
      snapshot.forEach((docSnap: any) => {
        items.push({ ...(docSnap.data() as Employee), id: docSnap.id });
      });
      if (items.length > 0) {
        callback(items);
      }
    });
  } catch {
    return null;
  }
}

export function listenToRawMaterials(callback: (materials: RawMaterial[]) => void): (() => void) | null {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return null;

  try {
    const colRef = collection(db, COLLECTIONS.RAW_MATERIALS);
    return onSnapshot(colRef, (snapshot: any) => {
      const items: RawMaterial[] = [];
      snapshot.forEach((docSnap: any) => {
        items.push({ ...(docSnap.data() as RawMaterial), id: docSnap.id });
      });
      if (items.length > 0) {
        callback(items);
      }
    });
  } catch {
    return null;
  }
}

export function listenToElectricity(callback: (electricity: ElectricityData) => void): (() => void) | null {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return null;

  try {
    const docRef = doc(db, COLLECTIONS.ELECTRICITY, 'telemetry');
    return onSnapshot(docRef, (docSnap: any) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as ElectricityData);
      }
    });
  } catch {
    return null;
  }
}

export function listenToMachines(callback: (machines: Machine[]) => void): (() => void) | null {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return null;

  try {
    const colRef = collection(db, COLLECTIONS.MACHINES);
    return onSnapshot(colRef, (snapshot: any) => {
      const items: Machine[] = [];
      snapshot.forEach((docSnap: any) => {
        items.push({ ...(docSnap.data() as Machine), id: docSnap.id });
      });
      if (items.length > 0) {
        callback(items);
      }
    });
  } catch {
    return null;
  }
}

// ============================================
// MUTATION SYNC (Cloud Firestore Writes)
// ============================================

export async function syncProductToFirestore(product: Product): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), product, { merge: true });
  } catch (err) {
    console.warn('Could not sync product to Firestore:', err);
  }
}

export async function deleteProductFromFirestore(id: string): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
  } catch (err) {
    console.warn('Could not delete product from Firestore:', err);
  }
}

export async function syncCustomerToFirestore(customer: CustomerLoyalty): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.CUSTOMERS, customer.phone), customer, { merge: true });
  } catch (err) {
    console.warn('Could not sync customer to Firestore:', err);
  }
}

export async function syncSustainabilityToFirestore(metrics: SustainabilityMetric): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.SUSTAINABILITY, 'current_metrics'), metrics, { merge: true });
  } catch (err) {
    console.warn('Could not sync sustainability to Firestore:', err);
  }
}

export async function syncBranchToFirestore(branch: Branch): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.BRANCHES, branch.id), branch, { merge: true });
  } catch (err) {
    console.warn('Could not sync branch to Firestore:', err);
  }
}

export async function syncEmployeeToFirestore(emp: Employee): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.EMPLOYEES, emp.id), emp, { merge: true });
  } catch (err) {
    console.warn('Could not sync employee to Firestore:', err);
  }
}

export async function deleteEmployeeFromFirestore(id: string): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.EMPLOYEES, id));
  } catch (err) {
    console.warn('Could not delete employee from Firestore:', err);
  }
}

export async function syncRawMaterialToFirestore(mat: RawMaterial): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.RAW_MATERIALS, mat.id), mat, { merge: true });
  } catch (err) {
    console.warn('Could not sync raw material to Firestore:', err);
  }
}

export async function syncElectricityToFirestore(el: ElectricityData): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.ELECTRICITY, 'telemetry'), el, { merge: true });
  } catch (err) {
    console.warn('Could not sync electricity to Firestore:', err);
  }
}

export async function syncMachineToFirestore(machine: Machine): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.MACHINES, machine.id), machine, { merge: true });
  } catch (err) {
    console.warn('Could not sync machine to Firestore:', err);
  }
}

// ============================================
// 1-CLICK CLOUD SEEDER (Instant Hackathon Setup)
// ============================================

export async function seedInitialDataToFirestore(): Promise<{ success: boolean; count: number; error?: string }> {
  const db = getFirestoreDb();
  if (!db || !isFirebaseConfigured()) {
    return { success: false, count: 0, error: 'Firebase is not configured yet. Please enter your credentials first.' };
  }

  try {
    const batch = writeBatch(db);
    let count = 0;

    // 1. Products
    for (const p of INITIAL_PRODUCTS) {
      batch.set(doc(db, COLLECTIONS.PRODUCTS, p.id), p);
      count++;
    }

    // 2. Customers
    for (const c of INITIAL_CUSTOMERS) {
      batch.set(doc(db, COLLECTIONS.CUSTOMERS, c.phone), c);
      count++;
    }

    // 3. Sustainability
    batch.set(doc(db, COLLECTIONS.SUSTAINABILITY, 'current_metrics'), INITIAL_SUSTAINABILITY);
    count++;

    // 4. Branches
    for (const b of INITIAL_BRANCHES) {
      batch.set(doc(db, COLLECTIONS.BRANCHES, b.id), b);
      count++;
    }

    // 5. Employees
    const INITIAL_EMPLOYEES: Employee[] = [
      { id: 'EMP-101', name: 'Rameshwar Sharma', role: 'Chief Plant Engineer', department: 'Maintenance', salary: 78000, contact: '+91 98450 12345', shift: 'Day Shift (A)', status: 'Active' },
      { id: 'EMP-102', name: 'Sunita Patel', role: 'Senior Line Operator', department: 'Production', salary: 46000, contact: '+91 97120 54321', shift: 'Day Shift (A)', status: 'Active' },
      { id: 'EMP-103', name: 'Arjun Nair', role: 'Shift Supervisor', department: 'Production', salary: 58000, contact: '+91 94002 98765', shift: 'Evening Shift (B)', status: 'Active' },
      { id: 'EMP-104', name: 'Vikram Singh', role: 'QA & Compliance Lead', department: 'Quality Control', salary: 62000, contact: '+91 99881 12233', shift: 'Day Shift (A)', status: 'Active' },
      { id: 'EMP-105', name: 'Farhan Akhtar', role: 'Materials Handler', department: 'Logistics', salary: 34000, contact: '+91 93214 77889', shift: 'Night Shift (C)', status: 'Active' }
    ];
    for (const e of INITIAL_EMPLOYEES) {
      batch.set(doc(db, COLLECTIONS.EMPLOYEES, e.id), e);
      count++;
    }

    // 6. Raw Materials
    const INITIAL_RAW_MATERIALS: RawMaterial[] = [
      { id: 'RAW-01', name: 'Bleached Kraft Pulp', quantity: 65, unit: 'Tons', costPerUnit: 48500, supplier: 'Orient Paper Mills Ltd', sustainabilityGrade: 'A+ (100% Recycled)', reorderThreshold: 20 },
      { id: 'RAW-02', name: 'Bio-Polymer Resin (PLA)', quantity: 22, unit: 'Tons', costPerUnit: 185000, supplier: 'NatureWorks Bio Ltd', sustainabilityGrade: 'Bio-Based', reorderThreshold: 10 },
      { id: 'RAW-03', name: 'Aluminum Barrier Foil Rolls', quantity: 140, unit: 'Kg', costPerUnit: 12400, supplier: 'Hindalco Extrusions Ltd', sustainabilityGrade: 'B (Standard)', reorderThreshold: 30 },
      { id: 'RAW-04', name: 'Cornstarch Aqueous Adhesive', quantity: 1200, unit: 'Kg', costPerUnit: 65, supplier: 'Roquette India Pvt', sustainabilityGrade: 'A+ (100% Recycled)', reorderThreshold: 300 }
    ];
    for (const r of INITIAL_RAW_MATERIALS) {
      batch.set(doc(db, COLLECTIONS.RAW_MATERIALS, r.id), r);
      count++;
    }

    // 7. Electricity Telemetry
    const INITIAL_ELECTRICITY: ElectricityData = {
      totalUnitsKWh: 42850,
      solarGeneratedKWh: 24500,
      gridPurchasedKWh: 18350,
      tariffPerKWh: 8.0,
      totalMonthlyCost: 146800,
      peakLoadKW: 350,
      dailyTrends: [
        { day: 'Mon', gridKWh: 2600, solarKWh: 3500 },
        { day: 'Tue', gridKWh: 2800, solarKWh: 3600 },
        { day: 'Wed', gridKWh: 2500, solarKWh: 3400 },
        { day: 'Thu', gridKWh: 2700, solarKWh: 3700 },
        { day: 'Fri', gridKWh: 2900, solarKWh: 3800 },
        { day: 'Sat', gridKWh: 2200, solarKWh: 3200 },
        { day: 'Sun', gridKWh: 1800, solarKWh: 2800 }
      ]
    };
    batch.set(doc(db, COLLECTIONS.ELECTRICITY, 'telemetry'), INITIAL_ELECTRICITY);
    count++;

    // 8. Machines
    const INITIAL_MACHINES: Machine[] = [
      { id: 'MCH-01', name: 'Corrugator Board Line A1', model: 'Line 1 - Corrugation', status: 'Running', powerRatingKW: 185, outputRatePerHour: 1450, unitProduced: 'Sheets', lastServiced: '2026-09-15', nextServiceDue: '2026-11-15', efficiencyPct: 94 },
      { id: 'MCH-02', name: 'Thermoforming Molding Unit 2', model: 'Line 2 - Molding', status: 'Running', powerRatingKW: 95, outputRatePerHour: 820, unitProduced: 'Trays', lastServiced: '2026-09-28', nextServiceDue: '2026-11-28', efficiencyPct: 89 },
      { id: 'MCH-03', name: 'High-Speed Slitter & Rewinder', model: 'Line 3 - Finishing', status: 'Maintenance', powerRatingKW: 45, outputRatePerHour: 2100, unitProduced: 'Rolls', lastServiced: '2026-10-12', nextServiceDue: '2026-10-20', efficiencyPct: 78 },
      { id: 'MCH-04', name: 'Automated Robotic Palletizer', model: 'Line 4 - Packaging', status: 'Running', powerRatingKW: 30, outputRatePerHour: 650, unitProduced: 'Pallets', lastServiced: '2026-08-30', nextServiceDue: '2026-11-30', efficiencyPct: 96 }
    ];
    for (const m of INITIAL_MACHINES) {
      batch.set(doc(db, COLLECTIONS.MACHINES, m.id), m);
      count++;
    }

    await batch.commit();
    return { success: true, count };
  } catch (err: any) {
    console.error('Failed to seed Cloud Firestore:', err);
    return { success: false, count: 0, error: err.message || 'Could not seed Cloud Firestore' };
  }
}
