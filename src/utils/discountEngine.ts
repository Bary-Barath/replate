import { differenceInDays, isValid, parseISO, startOfDay } from 'date-fns';

export interface DiscountRecommendation {
  originalPrice: number;
  recommendedDiscountPercentage: number;
  recommendedRescuePrice: number;
  remainingDays: number;
  isEligible: boolean;
  reason: string;
}

/**
 * Calculates a date-based rescue discount. Invalid or expired food is returned
 * as ineligible; the UI must not treat the discount recommendation as a safety decision.
 */
export const calculateDiscount = (
  originalPrice: number,
  bestBeforeStr: string,
  useByStr?: string
): DiscountRecommendation => {
  const today = startOfDay(new Date());
  
  // Use 'useBy' if available for strict deadline, else use 'bestBefore'
  const deadlineStr = useByStr || bestBeforeStr;
  const deadlineDate = startOfDay(parseISO(deadlineStr));

  if (originalPrice <= 0 || !isValid(deadlineDate)) {
    return {
      originalPrice,
      recommendedDiscountPercentage: 0,
      recommendedRescuePrice: 0,
      remainingDays: 0,
      isEligible: false,
      reason: 'Enter a valid positive price and a valid applicable sale deadline.',
    };
  }
  
  const remainingDays = differenceInDays(deadlineDate, today);
  
  if (remainingDays < 0) {
    return {
      originalPrice,
      recommendedDiscountPercentage: 0,
      recommendedRescuePrice: 0,
      remainingDays,
      isEligible: false,
      reason: 'Product has passed its applicable sale deadline and is no longer eligible for human consumption sale.',
    };
  }
  
  let discount = 0;
  let reason = '';
  
  if (remainingDays > 30) {
    discount = 15;
    reason = 'More than 30 days remaining. A small discount is recommended.';
  } else if (remainingDays >= 15 && remainingDays <= 30) {
    discount = 25;
    reason = '15-30 days remaining. Moderate discount recommended to clear stock early.';
  } else if (remainingDays >= 8 && remainingDays <= 14) {
    discount = 40;
    reason = '8-14 days remaining. Increased discount to ensure sale.';
  } else if (remainingDays >= 3 && remainingDays <= 7) {
    discount = 60;
    reason = '3-7 days remaining. High discount recommended for quick rescue.';
  } else {
    discount = 75;
    reason = 'Final rescue period! Maximum discount recommended before the deadline.';
  }
  
  const recommendedRescuePrice = Number((originalPrice * (1 - discount / 100)).toFixed(2));
  
  return {
    originalPrice,
    recommendedDiscountPercentage: discount,
    recommendedRescuePrice,
    remainingDays,
    isEligible: true,
    reason,
  };
};
