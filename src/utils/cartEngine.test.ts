import { describe, expect, it } from 'vitest';
import type { CartItem } from '../types';
import { calculateCartTotal, clampCartQuantity } from './cartEngine';

describe('cartEngine', () => {
  it('clamps cart quantities to the available stock', () => {
    expect(clampCartQuantity(8, 4)).toBe(4);
    expect(clampCartQuantity(-1, 4)).toBe(0);
  });

  it('calculates a cart subtotal from rescue prices', () => {
    const cart: CartItem[] = [{
      product: {
        id: 'test', name: 'Test Food', sellerName: 'Test Seller', originalPrice: 100,
        rescuePrice: 40, discountPercentage: 60, bestBefore: new Date().toISOString(),
        availableQuantity: 10, imageUrl: '', category: 'Bakery', isEligibleForSale: true,
      },
      quantity: 3,
    }];
    expect(calculateCartTotal(cart)).toBe(120);
  });
});
