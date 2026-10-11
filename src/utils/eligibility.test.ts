import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';
import type { Product } from '../types';
import { isProductPurchasable } from './eligibility';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'eligibility-test', name: 'Test product', sellerName: 'Test seller', originalPrice: 100,
  rescuePrice: 50, discountPercentage: 50, bestBefore: addDays(new Date(), 2).toISOString(),
  availableQuantity: 2, imageUrl: '', category: 'Bakery', isEligibleForSale: true, ...overrides,
});

describe('isProductPurchasable', () => {
  it('rejects expired products', () => expect(isProductPurchasable(product({ bestBefore: addDays(new Date(), -1).toISOString() }))).toBe(false));
  it('rejects products marked ineligible by the seller', () => expect(isProductPurchasable(product({ isEligibleForSale: false }))).toBe(false));
  it('rejects products with no remaining stock', () => expect(isProductPurchasable(product({ availableQuantity: 0 }))).toBe(false));
  it('keeps feed-rescue inventory out of the human marketplace', () => expect(isProductPurchasable(product({ pathway: 'feed' }))).toBe(false));
});
