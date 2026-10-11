import { describe, expect, it } from 'vitest';
import { addHours } from 'date-fns';
import type { Product } from '../types';
import { calculateRescueRecommendation } from './rescueEngine';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'test', name: 'Rescue meal', sellerName: 'Demo seller', originalPrice: 200, rescuePrice: 100,
  discountPercentage: 50, bestBefore: addHours(new Date(), 24).toISOString(), pickupDeadline: addHours(new Date(), 6).toISOString(),
  availableQuantity: 4, imageUrl: '', category: 'Meals', isEligibleForSale: true, minimumAcceptablePrice: 80, ...overrides,
});

describe('rescue engine', () => {
  it('returns an actionable priority and protects the seller price floor', () => {
    const result = calculateRescueRecommendation(product());
    expect(result.score).not.toBeNull();
    expect(result.recommendedPrice).toBeGreaterThanOrEqual(80);
    expect(result.label).toMatch(/High|Medium|Low/);
  });
  it('returns insufficient data when the deadline or floor is missing', () => {
    expect(calculateRescueRecommendation(product({ pickupDeadline: undefined })).label).toBe('Insufficient data');
    expect(calculateRescueRecommendation(product({ minimumAcceptablePrice: undefined })).score).toBeNull();
  });
  it('does not recommend a price below the configured floor', () => {
    const result = calculateRescueRecommendation(product({ rescuePrice: 20, minimumAcceptablePrice: 75 }));
    expect(result.recommendedPrice).toBe(75);
  });
});
