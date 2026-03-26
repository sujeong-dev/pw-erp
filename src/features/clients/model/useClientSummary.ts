import { useQuery } from '@tanstack/react-query';
import { getClientSummary, type GetClientSummaryParams } from '../api';

export function useClientSummary(id: string, params?: GetClientSummaryParams) {
  return useQuery({
    queryKey: ['clients', id, 'summary', params],
    queryFn: () => getClientSummary(id, params),
  });
}
