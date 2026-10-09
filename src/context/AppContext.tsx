import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '../types';
import { mockProducts } from '../mockData';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.rescuePrice * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
