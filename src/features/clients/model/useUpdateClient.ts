import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClient, type CreateClientRequest } from '../api';

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateClientRequest }) =>
      updateClient(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
