import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../api';

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
  });
}
