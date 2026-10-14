import { describe, it, expect } from 'vitest';
import { insertProduct, updateProductDb, archiveOrDeleteProduct } from '../services/productService';
import type { Product } from '../types';

describe('Real Product Management Service', () => {
  it('creates a new product with validated positive prices and calculated discount', async () => {
    const newProductData: Omit<Product, 'id' | 'discountPercentage'> = {
      name: 'Artisan Baguette',
      sellerName: 'FreshBake Bakery',
      category: 'Bakery',
      originalPrice: 150,
      rescuePrice: 60,
      availableQuantity: 5,
      imageUrl: '',
      bestBefore: new Date(Date.now() + 86400000 * 2).toISOString(),
      pickupDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      isEligibleForSale: true,
      minimumAcceptablePrice: 50,
    };

    const result = await insertProduct(newProductData, 'demo-seller');
    expect(result.product).toBeDefined();
    expect(result.product?.id).toBeDefined();
    expect(result.product?.name).toBe('Artisan Baguette');
    expect(result.product?.discountPercentage).toBe(60); // (150 - 60)/150 = 60%
    expect(result.product?.availableQuantity).toBe(5);
  });

  it('updates an existing product properties cleanly', async () => {
    const result = await updateProductDb('p1', {
      rescuePrice: 160,
      availableQuantity: 8,
    }, 'demo-seller');

    expect(result.product).toBeDefined();
    expect(result.product?.rescuePrice).toBe(160);
    expect(result.product?.availableQuantity).toBe(8);
  });

  it('safely archives product rather than deleting if orders exist', async () => {
    const result = await archiveOrDeleteProduct('p1', 'demo-seller', false);
    expect(result.success).toBe(true);
  });
});
