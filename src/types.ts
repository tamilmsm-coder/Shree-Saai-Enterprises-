export interface Product {
  id: string;
  category: 'electrical' | 'plumbing' | 'sanitary' | 'solar' | 'tools' | 'ro' | 'security' | 'appliances' | 'accessories';
  name: string;
  brand: string;
  rate: number;
  unit: string;
  specification?: string;
  isCustom?: boolean;
}

export interface EstimateItem {
  product: Product;
  quantity: number;
  discountPercent: number; // Item-level discount
  customRate?: number; // Override rate for this estimate
  notes?: string;
}

export interface Estimate {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  estimateNumber: string;
  date: string;
  items: EstimateItem[];
  overallDiscountPercent: number;
  taxPercent: number;
  includeTax: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'AED', symbol: 'AED ', label: 'UAE Dirham' }
];
