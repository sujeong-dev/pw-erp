'use client';

import { useState } from 'react';
import type { Order } from '../api';

export function useOrderRefundDialog() {
  const [refundingOrder, setRefundingOrder] = useState<Order | null>(null);
  return {
    refundingOrder,
    openRefund: (order: Order) => setRefundingOrder(order),
    closeRefund: () => setRefundingOrder(null),
  };
}
