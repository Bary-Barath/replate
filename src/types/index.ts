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
  sellerId?: string;
  isPaused?: boolean;
  pathway?: 'human' | 'feed';
  pickupDeadline?: string;
  pickupInstructions?: string;
  collectionLocation?: string;
  allergenInfo?: string;
  storageInfo?: string;
  minimumAcceptablePrice?: number;
  availableWeightKg?: number;
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

export type UserRole = 'customer' | 'seller' | 'admin';
export type SellerVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
  verificationStatus?: SellerVerificationStatus;
}

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
