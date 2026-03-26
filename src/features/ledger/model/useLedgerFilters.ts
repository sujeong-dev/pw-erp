'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useDebounce } from '@/src/shared/lib/hooks';

export function useLedgerFilters() {
  const [code, setCode] = useState('');
  const [clientName, setClientName] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const debouncedCode = useDebounce(code, 300);
  const debouncedClientName = useDebounce(clientName, 300);

  return {
    code, setCode, debouncedCode,
    clientName, setClientName, debouncedClientName,
    type, setType,
    status, setStatus,
    dateRange, setDateRange,
    startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  };
}
