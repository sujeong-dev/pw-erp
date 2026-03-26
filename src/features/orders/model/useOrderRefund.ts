'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRefundPayment, deleteOrder, type RefundPaymentRequest } from '../api';

export function useOrderRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: RefundPaymentRequest) => {
      await createRefundPayment(params);
      return deleteOrder(params.salesId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
