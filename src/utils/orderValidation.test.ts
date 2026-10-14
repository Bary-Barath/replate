import { describe, it, expect } from 'vitest';
import { executeAtomicOrder } from '../services/productService';
import type { CartItem, CustomerInfo } from '../types';

describe('Order Validation and Atomic Placement', () => {
  const dummyCustomer: CustomerInfo = {
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '+91 98765 43210',
    pickupPreference: 'standard',
  };

  const dummyCart: CartItem[] = [
    {
      product: {
        id: 'p1',
        name: 'Chocolate Truffle Cake',
        sellerName: 'FreshBake Bakery',
        originalPrice: 500,
        rescuePrice: 175,
        discountPercentage: 65,
        bestBefore: new Date(Date.now() + 86400000 * 2).toISOString(),
        pickupDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        availableQuantity: 4,
        imageUrl: '',
        category: 'Bakery',
        isEligibleForSale: true,
      },
      quantity: 2,
    },
  ];

  it('calculates totals and platform fees accurately on valid order', async () => {
    const subtotal = 350; // 175 * 2
    const fee = 17.5; // 5%
    const total = 367.5;

    const res = await executeAtomicOrder(dummyCustomer, dummyCart, subtotal, fee, total, 'user-1');
    expect(res.order).toBeDefined();
    expect(res.order?.id).toMatch(/^RP-/);
    expect(res.order?.subtotal).toBe(350);
    expect(res.order?.platformFee).toBe(17.5);
    expect(res.order?.total).toBe(367.5);
    expect(res.order?.customer.name).toBe('Sarah Connor');
    expect(res.order?.items).toHaveLength(1);
  });
});
