import type { Product } from '../types';
import { isProductPurchasable } from './eligibility';

export type MarketplaceSort = 'ending-soon' | 'discount' | 'price' | 'distance';

export interface MarketplaceFilters {
  searchQuery?: string;
  category?: string;
  minDiscount?: number;
  sortBy?: MarketplaceSort;
}

/** Applies the same eligibility, search, filter, and sort rules used by the marketplace UI. */
export const filterMarketplaceProducts = (products: Product[], filters: MarketplaceFilters = {}) => {
  const query = filters.searchQuery?.trim().toLowerCase() ?? '';
  const category = filters.category ?? 'All';
  const minDiscount = filters.minDiscount ?? 0;
  const sortBy = filters.sortBy ?? 'ending-soon';
  return products.filter((product) => {
    const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.sellerName.toLowerCase().includes(query);
    return matchesSearch && (category === 'All' || product.category === category) && product.discountPercentage >= minDiscount && isProductPurchasable(product);
  }).sort((a, b) => {
    if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
    if (sortBy === 'price') return a.rescuePrice - b.rescuePrice;
    if (sortBy === 'distance') return Number.parseFloat(a.distance ?? '999') - Number.parseFloat(b.distance ?? '999');
    return new Date(a.pickupDeadline ?? a.bestBefore).getTime() - new Date(b.pickupDeadline ?? b.bestBefore).getTime();
  });
};
