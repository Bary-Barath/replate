import type { Product } from './types';
import { addDays } from 'date-fns';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Chocolate Truffle Cake',
    sellerName: 'FreshBake Bakery',
    originalPrice: 500,
    rescuePrice: 175,
    discountPercentage: 65,
    bestBefore: addDays(new Date(), 4).toISOString(),
    availableQuantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    category: 'Bakery',
    distance: '1.2 km',
    isEligibleForSale: true
  },
  {
    id: 'p2',
    name: 'Assorted Croissants (Box of 4)',
    sellerName: 'La Petite Boulangerie',
    originalPrice: 320,
    rescuePrice: 128,
    discountPercentage: 60,
    bestBefore: addDays(new Date(), 2).toISOString(),
    availableQuantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&q=80&w=800',
    category: 'Bakery',
    distance: '3.5 km',
    isEligibleForSale: true
  },
  {
    id: 'p3',
    name: 'Organic Mixed Vegetables Pack',
    sellerName: 'GreenRoots Market',
    originalPrice: 250,
    rescuePrice: 150,
    discountPercentage: 40,
    bestBefore: addDays(new Date(), 5).toISOString(),
    availableQuantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: 'Fruits & Vegetables',
    distance: '0.8 km',
    isEligibleForSale: true
  },
  {
    id: 'p4',
    name: 'Premium Roasted Coffee Beans (500g)',
    sellerName: 'Bean & Brew Roasters',
    originalPrice: 850,
    rescuePrice: 595,
    discountPercentage: 30,
    bestBefore: addDays(new Date(), 20).toISOString(),
    availableQuantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800',
    category: 'Beverages',
    distance: '4.2 km',
    isEligibleForSale: true
  }
];
