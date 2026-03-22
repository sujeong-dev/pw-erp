import { useQuery } from '@tanstack/react-query';
import { getOrders, type GetOrdersParams } from '../api';

export function useOrders(params: GetOrdersParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  });
}
