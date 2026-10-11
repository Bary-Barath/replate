import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, CustomerInfo, Order, Product } from '../types';
import { mockProducts } from '../mockData';
import { calculateCartTotal, clampCartQuantity } from '../utils/cartEngine';
import { AppContext } from './context';

const STORAGE_KEY = 'replate-demo-state';

interface PersistedState {
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
}

const emptyState: PersistedState = {
  products: mockProducts,
  cart: [],
  favorites: [],
  orders: [],
};

const readState = (): PersistedState => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyState;
    const parsed = JSON.parse(stored) as Partial<PersistedState>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products : mockProducts,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    return emptyState;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PersistedState>(readState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addProduct = (product: Product) => {
    setState((current) => ({ ...current, products: [...current.products, product] }));
  };

  const setCartQuantity = (productId: string, quantity: number) => {
    setState((current) => ({
      ...current,
      cart: current.cart
        .map((item) => {
          if (item.product.id !== productId) return item;
          const safeQuantity = clampCartQuantity(quantity, item.product.availableQuantity);
          return { ...item, quantity: safeQuantity };
        })
        .filter((item) => item.quantity > 0),
    }));
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0 || product.availableQuantity <= 0) return;
    setState((current) => {
      const existing = current.cart.find((item) => item.product.id === product.id);
      const nextQuantity = Math.min(
        product.availableQuantity,
        (existing?.quantity ?? 0) + quantity,
      );
      if (nextQuantity <= (existing?.quantity ?? 0)) return current;
      return {
        ...current,
        cart: existing
          ? current.cart.map((item) => item.product.id === product.id
            ? { ...item, quantity: nextQuantity }
            : item)
          : [...current.cart, { product, quantity: nextQuantity }],
      };
    });
  };

  const increaseQuantity = (productId: string) => {
    const item = state.cart.find((cartItem) => cartItem.product.id === productId);
    if (item) setCartQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId: string) => {
    const item = state.cart.find((cartItem) => cartItem.product.id === productId);
    if (item) setCartQuantity(productId, item.quantity - 1);
  };

  const removeFromCart = (productId: string) => {
    setState((current) => ({
      ...current,
      cart: current.cart.filter((item) => item.product.id !== productId),
    }));
  };

  const clearCart = () => setState((current) => ({ ...current, cart: [] }));

  const toggleFavorite = (productId: string) => {
    setState((current) => ({
      ...current,
      favorites: current.favorites.includes(productId)
        ? current.favorites.filter((id) => id !== productId)
        : [...current.favorites, productId],
    }));
  };

  const isFavorite = (productId: string) => state.favorites.includes(productId);

  const cartTotal = useMemo(
    () => calculateCartTotal(state.cart),
    [state.cart],
  );
  const platformFee = Number((cartTotal * 0.05).toFixed(2));

  const placeOrder = (customer: CustomerInfo): Order | null => {
    if (state.cart.length === 0) return null;
    const order: Order = {
      id: `RP-${Date.now().toString(36).toUpperCase()}`,
      items: state.cart,
      customer,
      subtotal: cartTotal,
      platformFee,
      total: Number((cartTotal + platformFee).toFixed(2)),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };
    setState((current) => ({
      ...current,
      orders: [order, ...current.orders],
      products: current.products.map((product) => {
        const purchasedItem = order.items.find((item) => item.product.id === product.id);
        return purchasedItem
          ? { ...product, availableQuantity: Math.max(0, product.availableQuantity - purchasedItem.quantity) }
          : product;
      }),
      cart: [],
    }));
    return order;
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addProduct,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      setCartQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
      cartTotal,
      platformFee,
      placeOrder,
    }}>
      {children}
    </AppContext.Provider>
  );
};
