import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, type CreateOrderRequest } from '../api';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrderRequest) => createOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
