import { createContext } from 'react';
import type { CartItem, CustomerInfo, Order, Product } from '../types';

export interface AppContextType {
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  createProduct: (
    productData: Omit<Product, 'id' | 'discountPercentage'>,
    userId?: string
  ) => Promise<{ success: boolean; error?: string; product?: Product }>;
  updateProduct: (productId: string, updates: Partial<Product>, sellerId: string) => boolean;
  editProduct: (
    productId: string,
    updates: Partial<Product>,
    userId: string
  ) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (
    productId: string,
    userId: string,
    hardDelete?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  toggleProductPause: (productId: string, userId: string) => Promise<{ success: boolean; error?: string }>;
  restockProduct: (productId: string, additionalQty: number, userId: string) => Promise<{ success: boolean; error?: string }>;
  addToCart: (product: Product, quantity?: number) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  cartTotal: number;
  platformFee: number;
  placeOrder: (customer: CustomerInfo) => Order | null;
  placeOrderAsync: (customer: CustomerInfo) => Promise<{ order: Order | null; error?: string }>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
