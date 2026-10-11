import type { CartItem } from '../types';

/** Clamps requested quantity to the safe stock range; zero removes an item upstream. */
export const clampCartQuantity = (requestedQuantity: number, availableQuantity: number) =>
  Math.max(0, Math.min(availableQuantity, requestedQuantity));

/** Calculates subtotal from current rescue prices; checkout revalidates stock separately. */
export const calculateCartTotal = (cart: CartItem[]) =>
  cart.reduce((total, item) => total + item.product.rescuePrice * item.quantity, 0);
