import { differenceInHours, isValid, parseISO } from 'date-fns';
import type { Product } from '../types';

export interface RescueRecommendation {
  score: number | null;
  label: 'High' | 'Medium' | 'Low' | 'Insufficient data';
  explanation: string;
  recommendedPrice: number | null;
  remainingHours: number | null;
}

/** Produces a seller-facing urgency score without lowering the seller's minimum price. */
export const calculateRescueRecommendation = (product: Product): RescueRecommendation => {
  const deadline = product.pickupDeadline ? parseISO(product.pickupDeadline) : null;
  const remainingHours = deadline && isValid(deadline) ? Math.max(0, differenceInHours(deadline, new Date())) : null;
  const minimumPrice = product.minimumAcceptablePrice;
  const hasRequiredData = remainingHours !== null && product.availableQuantity > 0 && product.originalPrice > 0 && minimumPrice !== undefined;

  if (!hasRequiredData) return { score: null, label: 'Insufficient data', explanation: 'Add a pickup deadline, quantity, original price, and seller minimum price to calculate rescue priority.', recommendedPrice: null, remainingHours };

  const urgency = Math.max(0, Math.min(1, 1 - remainingHours / (72)));
  const stockPressure = Math.max(0, Math.min(1, product.availableQuantity / 12));
  const currentDiscount = Math.max(0, Math.min(1, 1 - product.rescuePrice / product.originalPrice));
  const score = Math.round((urgency * 55 + stockPressure * 20 + currentDiscount * 25));
  const label = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';
  const suggestedDiscount = Math.min(0.75, Math.max(currentDiscount, urgency * 0.75));
  const calculatedPrice = Number((product.originalPrice * (1 - suggestedDiscount)).toFixed(2));
  const recommendedPrice = Math.max(minimumPrice, calculatedPrice);
  const explanation = score >= 70
    ? `${product.availableQuantity} portions remain and pickup closes soon.`
    : score >= 40
      ? `There is time to rescue this listing, but ${product.availableQuantity} portions still need a buyer.`
      : 'This listing has healthy time remaining and does not need an aggressive price change.';
  return { score, label, explanation, recommendedPrice, remainingHours };
};
