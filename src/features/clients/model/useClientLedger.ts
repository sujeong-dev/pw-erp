import { useQuery } from '@tanstack/react-query';
import { getClientLedger } from '../api';
import type { GetLedgerParams } from '../api';

export function useClientLedger(id: string, params: GetLedgerParams) {
  return useQuery({
    queryKey: ['clients', id, 'ledger', params],
    queryFn: () => getClientLedger(id, params),
  });
}
