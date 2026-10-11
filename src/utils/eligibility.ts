import { isBefore, isValid, parseISO, startOfDay } from 'date-fns';
import type { Product } from '../types';

/** Human-food marketplace gate; expiry and pathway rules are enforced before cart/order actions. */
export const isProductPurchasable = (product: Product) =>
  (product.pathway ?? 'human') === 'human' &&
  product.isEligibleForSale &&
  !product.isPaused &&
  product.availableQuantity > 0 &&
  isValid(parseISO(product.bestBefore)) &&
  !isBefore(startOfDay(parseISO(product.bestBefore)), startOfDay(new Date()));
