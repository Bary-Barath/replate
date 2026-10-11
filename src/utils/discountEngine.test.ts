import { addDays, formatISO } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { calculateDiscount } from './discountEngine';

const dateAfterDays = (days: number) => formatISO(addDays(new Date(), days), { representation: 'date' });

describe('calculateDiscount', () => {
  it('recommends the highest discount during the final rescue period', () => {
    const result = calculateDiscount(100, dateAfterDays(1));
    expect(result.recommendedDiscountPercentage).toBe(75);
    expect(result.recommendedRescuePrice).toBe(25);
    expect(result.isEligible).toBe(true);
  });

  it('recommends a moderate discount for products with 15 to 30 days remaining', () => {
    const result = calculateDiscount(200, dateAfterDays(20));
    expect(result.recommendedDiscountPercentage).toBe(25);
    expect(result.recommendedRescuePrice).toBe(150);
  });

  it('marks expired products as ineligible', () => {
    const result = calculateDiscount(100, dateAfterDays(-1));
    expect(result.isEligible).toBe(false);
    expect(result.recommendedRescuePrice).toBe(0);
  });
});
