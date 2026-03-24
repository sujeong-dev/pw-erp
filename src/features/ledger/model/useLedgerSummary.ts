import { useQuery } from '@tanstack/react-query';
import { getLedgerSummary } from '../api';
import type { GetSummaryParams } from '../api';

export function useLedgerSummary(params: GetSummaryParams) {
  return useQuery({
    queryKey: ['ledger', 'summary', params],
    queryFn: () => getLedgerSummary(params),
  });
}
