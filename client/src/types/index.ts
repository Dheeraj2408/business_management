export type BusinessTier = 'general_store' | 'mall_clinic' | 'industry';

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  storeName: string;
  tier: BusinessTier;
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
