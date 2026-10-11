import { describe, expect, it } from 'vitest';
import type { Order } from '../types';
import { calculatePersonalImpact } from './impactEngine';

const order = (status: Order['status']): Order => ({
  id: status, items: [{ product: { id: 'p', name: 'Meal', sellerName: 'Seller', originalPrice: 100, rescuePrice: 60, discountPercentage: 40, bestBefore: '2099-01-01', availableQuantity: 1, imageUrl: '', category: 'Meals', isEligibleForSale: true }, quantity: 2 }],
  customer: { name: 'Demo', email: 'demo@example.test', phone: '000', pickupPreference: 'standard' }, subtotal: 120, platformFee: 6, total: 126, createdAt: new Date().toISOString(), status,
});

describe('calculatePersonalImpact', () => {
  it('counts confirmed, ready, and collected orders using estimated weight', () => {
    const result = calculatePersonalImpact([order('confirmed'), order('ready'), order('collected')]);
    expect(result.orders).toBe(3);
    expect(result.kg).toBe(2.1);
    expect(result.savings).toBe(240);
    expect(result.estimatedKg).toBe(true);
  });
});
