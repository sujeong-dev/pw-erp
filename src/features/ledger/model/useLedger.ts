import { useQuery } from '@tanstack/react-query';
import { getGlobalLedger } from '../api';
import type { GetGlobalLedgerParams } from '../api';

export function useLedger(params: GetGlobalLedgerParams) {
  return useQuery({
    queryKey: ['ledger', params],
    queryFn: () => getGlobalLedger(params),
  });
}
