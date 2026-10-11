import type { Order } from '../types';

export interface PersonalImpact { orders: number; kg: number; savings: number; estimatedKg: boolean; }

/** Aggregates completed order impact; quantity-to-weight is explicitly an estimate when weight is absent. */
export const calculatePersonalImpact = (orders: Order[]): PersonalImpact => orders.reduce<PersonalImpact>((impact, order) => {
  if (!['confirmed', 'ready', 'collected'].includes(order.status)) return impact;
  const quantity = order.items.reduce((total, item) => total + item.quantity, 0);
  return {
    orders: impact.orders + 1,
    kg: Number((impact.kg + quantity * 0.35).toFixed(2)),
    savings: impact.savings + order.items.reduce((total, item) => total + (item.product.originalPrice - item.product.rescuePrice) * item.quantity, 0),
    estimatedKg: true,
  };
}, { orders: 0, kg: 0, savings: 0, estimatedKg: false });
