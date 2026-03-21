import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient, type CreateClientRequest } from '../api';

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateClientRequest) => createClient(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
