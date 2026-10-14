import { useEffect, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, CustomerInfo, Order, Product } from '../types';
import { mockProducts } from '../mockData';
import { calculateCartTotal, clampCartQuantity } from '../utils/cartEngine';
import { isProductPurchasable } from '../utils/eligibility';
import { AppContext } from './context';
import {
  getProducts,
  insertProduct,
  updateProductDb,
  archiveOrDeleteProduct,
  executeAtomicOrder,
} from '../services/productService';

const STORAGE_KEY = 'replate-demo-state-v3';

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
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : mockProducts,
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
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Sync products from database on initial load
  const refreshProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const dbProducts = await getProducts();
      if (dbProducts && dbProducts.length > 0) {
        setState((current) => ({
          ...current,
          products: dbProducts,
        }));
      }
    } catch (err) {
      console.warn('Could not refresh products from DB:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Persist state changes
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Synchronous addProduct for backward compatibility
  const addProduct = (product: Product) => {
    setState((current) => ({ ...current, products: [product, ...current.products] }));
  };

  // Async createProduct with Supabase integration
  const createProduct = async (
    productData: Omit<Product, 'id' | 'discountPercentage'>,
    userId?: string
  ): Promise<{ success: boolean; error?: string; product?: Product }> => {
    const res = await insertProduct(productData, userId);
    if (res.error || !res.product) {
      return { success: false, error: res.error || 'Failed to create product' };
    }

    setState((current) => ({
      ...current,
      products: [res.product!, ...current.products],
    }));

    return { success: true, product: res.product };
  };

  // Synchronous updateProduct for backward compatibility
  const updateProduct = (productId: string, updates: Partial<Product>, sellerId: string) => {
    const product = state.products.find((item) => item.id === productId);
    const ownsProduct =
      product &&
      (product.sellerId === sellerId ||
        sellerId === 'demo-admin' ||
        (sellerId === 'demo-seller' && product.sellerName === 'FreshBake Bakery'));
    if (!ownsProduct) return false;

    setState((current) => ({
      ...current,
      products: current.products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
    }));

    // Trigger background db update
    updateProductDb(productId, updates, sellerId).catch((err) =>
      console.warn('Background product update sync:', err)
    );
    return true;
  };

  // Async editProduct with DB persistence
  const editProduct = async (
    productId: string,
    updates: Partial<Product>,
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await updateProductDb(productId, updates, userId);
    if (res.error) {
      return { success: false, error: res.error };
    }

    setState((current) => ({
      ...current,
      products: current.products.map((p) =>
        p.id === productId ? { ...p, ...updates, ...(res.product ? res.product : {}) } : p
      ),
    }));

    return { success: true };
  };

  // Async delete/archive product
  const deleteProduct = async (
    productId: string,
    userId: string,
    hardDelete = false
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await archiveOrDeleteProduct(productId, userId, hardDelete);
    if (res.error) {
      return { success: false, error: res.error };
    }

    setState((current) => ({
      ...current,
      products: hardDelete
        ? current.products.filter((p) => p.id !== productId)
        : current.products.map((p) => (p.id === productId ? { ...p, isPaused: true } : p)),
    }));

    return { success: true };
  };

  // Pause / Resume product
  const toggleProductPause = async (
    productId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const prod = state.products.find((p) => p.id === productId);
    if (!prod) return { success: false, error: 'Product not found' };

    const newPaused = !prod.isPaused;
    return editProduct(productId, { isPaused: newPaused }, userId);
  };

  // Restock product
  const restockProduct = async (
    productId: string,
    additionalQty: number,
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const prod = state.products.find((p) => p.id === productId);
    if (!prod) return { success: false, error: 'Product not found' };

    const newQty = Math.max(0, prod.availableQuantity + additionalQty);
    return editProduct(productId, { availableQuantity: newQty, isPaused: false }, userId);
  };

  // Cart operations
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
    if (quantity <= 0 || !isProductPurchasable(product)) return;
    setState((current) => {
      const existing = current.cart.find((item) => item.product.id === product.id);
      const nextQuantity = Math.min(
        product.availableQuantity,
        (existing?.quantity ?? 0) + quantity
      );
      if (nextQuantity <= (existing?.quantity ?? 0)) return current;
      return {
        ...current,
        cart: existing
          ? current.cart.map((item) =>
              item.product.id === product.id ? { ...item, quantity: nextQuantity } : item
            )
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

  // Favorites
  const toggleFavorite = (productId: string) => {
    setState((current) => ({
      ...current,
      favorites: current.favorites.includes(productId)
        ? current.favorites.filter((id) => id !== productId)
        : [...current.favorites, productId],
    }));
  };

  const isFavorite = (productId: string) => state.favorites.includes(productId);

  const cartTotal = useMemo(() => calculateCartTotal(state.cart), [state.cart]);
  const platformFee = Number((cartTotal * 0.05).toFixed(2));

  // Sync placeOrder for backward compatibility
  const placeOrder = (customer: CustomerInfo): Order | null => {
    const validCart = state.cart.filter((item) => isProductPurchasable(item.product));
    if (validCart.length !== state.cart.length) {
      setState((current) => ({ ...current, cart: validCart }));
      return null;
    }
    if (validCart.length === 0) return null;

    const order: Order = {
      id: `RP-${Date.now().toString(36).toUpperCase()}`,
      items: validCart,
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
          ? {
              ...product,
              availableQuantity: Math.max(0, product.availableQuantity - purchasedItem.quantity),
            }
          : product;
      }),
      cart: [],
    }));
    return order;
  };

  // Async placeOrder with backend stock revalidation & RPC
  const placeOrderAsync = async (
    customer: CustomerInfo
  ): Promise<{ order: Order | null; error?: string }> => {
    // 1. Revalidate current cart against active inventory
    const validCart = state.cart.filter((item) => isProductPurchasable(item.product));
    if (validCart.length === 0) {
      return { order: null, error: 'Cart contains no available or eligible rescue items.' };
    }

    // Check quantity constraints against active products in state
    for (const item of validCart) {
      const activeProd = state.products.find((p) => p.id === item.product.id);
      if (!activeProd || activeProd.availableQuantity < item.quantity) {
        return {
          order: null,
          error: `Stock for "${item.product.name}" has changed. Please update your cart.`,
        };
      }
    }

    const currentSubtotal = calculateCartTotal(validCart);
    const currentFee = Number((currentSubtotal * 0.05).toFixed(2));
    const currentTotal = Number((currentSubtotal + currentFee).toFixed(2));

    const res = await executeAtomicOrder(
      customer,
      validCart,
      currentSubtotal,
      currentFee,
      currentTotal
    );

    if (res.error || !res.order) {
      return { order: null, error: res.error || 'Failed to place order' };
    }

    // Update state atomically
    setState((current) => ({
      ...current,
      orders: [res.order!, ...current.orders],
      products: current.products.map((prod) => {
        const bought = validCart.find((it) => it.product.id === prod.id);
        if (bought) {
          const rem = Math.max(0, prod.availableQuantity - bought.quantity);
          return {
            ...prod,
            availableQuantity: rem,
            isPaused: rem === 0 ? true : prod.isPaused,
          };
        }
        return prod;
      }),
      cart: [],
    }));

    return { order: res.order };
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        isLoadingProducts,
        refreshProducts,
        addProduct,
        createProduct,
        updateProduct,
        editProduct,
        deleteProduct,
        toggleProductPause,
        restockProduct,
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
        placeOrderAsync,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
