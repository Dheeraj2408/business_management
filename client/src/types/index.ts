export type BusinessTier = 'general_store' | 'mall_clinic' | 'industry';

export interface Business {
  id: string;
  name: string;
  tier: BusinessTier; // 'general_store' (Minor) | 'mall_clinic' (Commercial) | 'industry' (Enterprise)
  category?: string;
  city?: string;
}

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  storeName: string; // Active business name
  tier: BusinessTier; // Active business tier
  businesses: Business[];
  activeBusinessId: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  costPrice: number;
  minThreshold: number;
  batchNumber?: string;
  expiryDate?: string; // YYYY-MM-DD
  supplierName?: string;
  isEcoFriendly?: boolean;
}

export interface CustomerLoyalty {
  phone: string;
  name: string;
  visitCount: number;
  greenPoints: number;
  lastVisit: string;
  reusableBagCount: number;
}

export interface SustainabilityMetric {
  renewableEnergyPct: number;
  recyclablePackagingPct: number;
  wasteDiversionPct: number;
  localSourcingPct: number;
  overallScore: number;
  carbonSavedTons: number;
}

export interface RetailerPartner {
  id: string;
  storeName: string;
  ownerName: string;
  phone: string;
  city: string;
  tier: 'General Store' | 'Pharmacy' | 'Supermarket';
  ordersThisMonth: number;
  isGreenCertified: boolean;
}

export interface Branch {
  id: string;
  name: string;
  type: 'Warehouse' | 'Distribution Hub' | 'Retail Outlet';
  city: string;
  manager: string;
  totalSKUs: number;
  sustainabilityScore: number;
  status: 'Operational' | 'High Demand' | 'Maintenance';
}

export interface ScannedBillItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPrice: number;
  mrp: number;
  batchNumber?: string;
  expiryDate?: string;
  selected: boolean;
}

// ============================================
// INDUSTRIAL MANUFACTURING OPERATIONS SUITE
// ============================================

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'Production' | 'Maintenance' | 'Quality Control' | 'Logistics' | 'Safety';
  salary: number; // in ₹/month
  contact: string;
  shift: 'Day Shift (A)' | 'Evening Shift (B)' | 'Night Shift (C)';
  status: 'Active' | 'On Leave';
}

export interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: 'Tons' | 'Bags' | 'Barrels' | 'Liters' | 'Kg';
  costPerUnit: number; // ₹
  supplier: string;
  sustainabilityGrade: 'A+ (100% Recycled)' | 'A (FSC Certified)' | 'B (Standard)' | 'Bio-Based';
  reorderThreshold: number;
}

export interface ElectricityData {
  totalUnitsKWh: number;
  solarGeneratedKWh: number;
  gridPurchasedKWh: number;
  tariffPerKWh: number; // ₹
  totalMonthlyCost: number;
  peakLoadKW: number;
  dailyTrends: { day: string; gridKWh: number; solarKWh: number }[];
}

export interface Machine {
  id: string;
  name: string;
  model: string;
  status: 'Running' | 'Maintenance' | 'Idle';
  powerRatingKW: number;
  outputRatePerHour: number;
  unitProduced: string;
  lastServiced: string;
  nextServiceDue: string;
  efficiencyPct: number;
}
