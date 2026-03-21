import { useQuery } from '@tanstack/react-query';
import { getClientSummary } from '../api';

export function useClientSummary(id: string) {
  return useQuery({
    queryKey: ['clients', id, 'summary'],
    queryFn: () => getClientSummary(id),
  });
}
