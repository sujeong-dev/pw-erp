import { useQuery } from '@tanstack/react-query';
import { getPayments } from '../api';
import type { GetPaymentsParams } from '../api';

export function usePayments(params: GetPaymentsParams) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => getPayments(params),
  });
}
