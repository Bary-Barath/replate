import type { CartItem } from '../types';

export const clampCartQuantity = (requestedQuantity: number, availableQuantity: number) =>
  Math.max(0, Math.min(availableQuantity, requestedQuantity));

export const calculateCartTotal = (cart: CartItem[]) =>
  cart.reduce((total, item) => total + item.product.rescuePrice * item.quantity, 0);
