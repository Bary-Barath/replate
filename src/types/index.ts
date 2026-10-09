export interface Product {
  id: string;
  name: string;
  sellerName: string;
  originalPrice: number;
  rescuePrice: number;
  discountPercentage: number;
  bestBefore: string;
  availableQuantity: number;
  imageUrl: string;
  category: string;
  distance?: string;
  isEligibleForSale: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}
