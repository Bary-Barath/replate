import { createContext } from 'react';
import type { CartItem, CustomerInfo, Order, Product } from '../types';

export interface AppContextType {
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  addProduct: (product: Product) => void;
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
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
