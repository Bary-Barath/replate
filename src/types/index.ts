export interface Product {
  id: string;
  name: string;
  sellerName: string;
  originalPrice: number;
  rescuePrice: number;
  discountPercentage: number;
  bestBefore: string;
  availableQuantity: number;
  imageUrl: string;
  category: string;
  distance?: string;
  isEligibleForSale: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  pickupPreference: 'standard' | 'contactless';
}

export type OrderStatus = 'confirmed' | 'ready' | 'collected';

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  subtotal: number;
  platformFee: number;
  total: number;
  createdAt: string;
  status: OrderStatus;
}
