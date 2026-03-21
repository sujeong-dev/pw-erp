import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrder, type UpdateOrderRequest } from '../api';

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateOrderRequest }) =>
      updateOrder(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
