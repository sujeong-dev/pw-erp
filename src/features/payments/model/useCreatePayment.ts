import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPayment, type CreatePaymentRequest } from '../api';

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePaymentRequest) => createPayment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}
