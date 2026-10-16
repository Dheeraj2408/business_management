import { Product, CustomerLoyalty, SustainabilityMetric, RetailerPartner, Branch } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // General Store Items
  {
    id: 'prod-1',
    name: 'Organic Basmati Rice (5kg)',
    category: 'Grains & Pulses',
    quantity: 42,
    unit: 'bags',
    price: 360,
    costPrice: 290,
    minThreshold: 15,
    supplierName: 'EcoGrain Mills'
  },
  {
    id: 'prod-2',
    name: 'Cold-Pressed Mustard Oil (1L)',
    category: 'Oils & Ghee',
    quantity: 18,
    unit: 'bottles',
    price: 185,
    costPrice: 150,
    minThreshold: 10,
    supplierName: 'PureHarvest Organics'
  },
  {
    id: 'prod-3',
    name: 'Farm Fresh Cow Milk (500ml)',
    category: 'Dairy',
    quantity: 8, // Low stock alert!
    unit: 'packets',
    price: 32,
    costPrice: 26,
    minThreshold: 20,
    supplierName: 'GreenPastures Dairy'
  },
  {
    id: 'prod-4',
    name: 'Jaggery Powder (Organic 1kg)',
    category: 'Sweeteners',
    quantity: 26,
    unit: 'packs',
    price: 90,
    costPrice: 65,
    minThreshold: 8,
    supplierName: 'BioSweet Co.'
  },
  {
    id: 'prod-5',
    name: 'Biodegradable Dish Soap (500ml)',
    category: 'Home Care',
    quantity: 34,
    unit: 'bottles',
    price: 120,
    costPrice: 85,
    minThreshold: 12,
    supplierName: 'EcoClean Ltd'
  },

  // Clinic & Pharmacy Items (With Batches & Expiry Dates)
  {
    id: 'med-1',
    name: 'Paracetamol 650mg (Dolo)',
    category: 'Analgesics',
    quantity: 140,
    unit: 'strips',
    price: 38,
    costPrice: 22,
    minThreshold: 50,
    batchNumber: 'BT-8892',
    expiryDate: '2026-11-04', // Urgent! ~19 days remaining
    supplierName: 'Apex Pharma Supply'
  },
  {
    id: 'med-2',
    name: 'Amoxicillin Antibiotic Suspension',
    category: 'Antibiotics',
    quantity: 55,
    unit: 'bottles',
    price: 110,
    costPrice: 75,
    minThreshold: 25,
    batchNumber: 'AMX-4011',
    expiryDate: '2026-10-28', // Critical! ~12 days remaining
    supplierName: 'Zenith BioMed'
  },
  {
    id: 'med-3',
    name: 'Multivitamin & Zinc Syrup (200ml)',
    category: 'Supplements',
    quantity: 85,
    unit: 'bottles',
    price: 145,
    costPrice: 95,
    minThreshold: 30,
    batchNumber: 'MVT-9022',
    expiryDate: '2027-04-15', // Safe (> 5 months)
    supplierName: 'Apex Pharma Supply'
  },
  {
    id: 'med-4',
    name: 'N95 Medical Grade Face Masks (Box of 20)',
    category: 'Consumables',
    quantity: 60,
    unit: 'boxes',
    price: 320,
    costPrice: 210,
    minThreshold: 20,
    batchNumber: 'MSK-1104',
    expiryDate: '2028-01-10', // Safe
    supplierName: 'SafeShield Supplies'
  },
  {
    id: 'med-5',
    name: 'Pediatric Cough Relief Oral Drops',
    category: 'Pediatric',
    quantity: 32,
    unit: 'vials',
    price: 78,
    costPrice: 48,
    minThreshold: 15,
    batchNumber: 'PCR-3310',
    expiryDate: '2026-11-20', // Warning (< 35 days)
    supplierName: 'Zenith BioMed'
  }
];

export const INITIAL_CUSTOMERS: CustomerLoyalty[] = [
  {
    phone: '9876543210',
    name: 'Rahul Sharma',
    visitCount: 5, // Eligible for 5th-visit milestone discount!
    greenPoints: 120,
    lastVisit: '2026-10-14',
    reusableBagCount: 4
  },
  {
    phone: '9123456780',
    name: 'Priya Iyer',
    visitCount: 2,
    greenPoints: 45,
    lastVisit: '2026-10-12',
    reusableBagCount: 2
  },
  {
    phone: '9988776655',
    name: 'Ananya Deshmukh',
    visitCount: 9, // Frequent shopper!
    greenPoints: 240,
    lastVisit: '2026-10-15',
    reusableBagCount: 8
  }
];

export const INITIAL_SUSTAINABILITY: SustainabilityMetric = {
  renewableEnergyPct: 78,       // 78% Solar / Wind
  recyclablePackagingPct: 84,   // 84% Biodegradable / Paper
  wasteDiversionPct: 92,        // 92% Landfill Diversion
  localSourcingPct: 70,         // 70% Raw Materials within 150km
  overallScore: 82,             // Overall ESG rating (0-100)
  carbonSavedTons: 148.5
};

export const INITIAL_RETAILERS: RetailerPartner[] = [
  {
    id: 'ret-1',
    storeName: 'Sri Lakshmi Kirana & General Stores',
    ownerName: 'Venkatesh Rao',
    phone: '9845012345',
    city: 'Hyderabad',
    tier: 'General Store',
    ordersThisMonth: 14,
    isGreenCertified: true
  },
  {
    id: 'ret-2',
    storeName: 'MetroCare Clinic & Pharmacy Hub',
    ownerName: 'Dr. Kavita Reddy',
    phone: '9701123456',
    city: 'Bengaluru',
    tier: 'Pharmacy',
    ordersThisMonth: 8,
    isGreenCertified: true
  },
  {
    id: 'ret-3',
    storeName: 'GreenMart Eco Supermarket',
    ownerName: 'Manish Gupta',
    phone: '9822098765',
    city: 'Pune',
    tier: 'Supermarket',
    ordersThisMonth: 22,
    isGreenCertified: true
  },
  {
    id: 'ret-4',
    storeName: 'Janata Provisions & Daily Needs',
    ownerName: 'Ramesh Patel',
    phone: '9426011223',
    city: 'Ahmedabad',
    tier: 'General Store',
    ordersThisMonth: 6,
    isGreenCertified: false
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'br-1',
    name: 'Southern Logistics & Cold Hub',
    type: 'Distribution Hub',
    city: 'Hyderabad',
    manager: 'Arun Kumar',
    totalSKUs: 320,
    sustainabilityScore: 86,
    status: 'Operational'
  },
  {
    id: 'br-2',
    name: 'Industrial Unit 4 - Eco Packaging Plant',
    type: 'Warehouse',
    city: 'Chennai',
    manager: 'Srinivasan M.',
    totalSKUs: 140,
    sustainabilityScore: 92,
    status: 'Operational'
  },
  {
    id: 'br-3',
    name: 'Western Regional Dispatch Facility',
    type: 'Distribution Hub',
    city: 'Navi Mumbai',
    manager: 'Vikram Joshi',
    totalSKUs: 410,
    sustainabilityScore: 74,
    status: 'High Demand'
  }
];
