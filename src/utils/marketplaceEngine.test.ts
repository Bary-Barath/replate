import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';
import type { Product } from '../types';
import { filterMarketplaceProducts } from './marketplaceEngine';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'product', name: 'Chocolate Cake', sellerName: 'FreshBake Bakery', originalPrice: 100, rescuePrice: 50,
  discountPercentage: 50, bestBefore: addDays(new Date(), 2).toISOString(), availableQuantity: 3,
  imageUrl: '', category: 'Bakery', distance: '2 km', isEligibleForSale: true, ...overrides,
});

describe('filterMarketplaceProducts', () => {
  it('searches product and seller names and excludes ineligible products', () => {
    const result = filterMarketplaceProducts([product(), product({ id: 'feed', pathway: 'feed' }), product({ id: 'seller', name: 'Salad', sellerName: 'GreenRoots Market' })], { searchQuery: 'greenroots' });
    expect(result.map((item) => item.id)).toEqual(['seller']);
  });
  it('combines category and minimum discount filters', () => {
    const result = filterMarketplaceProducts([product(), product({ id: 'low', discountPercentage: 10 }), product({ id: 'meal', category: 'Meals' })], { category: 'Bakery', minDiscount: 40 });
    expect(result.map((item) => item.id)).toEqual(['product']);
  });
  it('sorts by rescue price and handles empty results', () => {
    expect(filterMarketplaceProducts([product({ id: 'high', rescuePrice: 90 }), product({ id: 'low', rescuePrice: 20 })], { sortBy: 'price' }).map((item) => item.id)).toEqual(['low', 'high']);
    expect(filterMarketplaceProducts([product()], { searchQuery: 'does-not-exist' })).toEqual([]);
  });
});
