import { useQuery } from '@tanstack/react-query';
import { getClients, type GetClientsParams } from '../api';

export function useClients(params: GetClientsParams) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => getClients(params),
  });
}
