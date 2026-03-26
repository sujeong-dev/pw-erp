'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useDebounce } from '@/src/shared/lib/hooks';

export function useOrdersFilters() {
  const [codeSearch, setCodeSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [status, setStatus] = useState('all');

  const debouncedCode = useDebounce(codeSearch, 300);
  const debouncedClient = useDebounce(clientSearch, 300);

  return {
    codeSearch,
    setCodeSearch,
    clientSearch,
    setClientSearch,
    dateRange,
    setDateRange,
    code: debouncedCode || undefined,
    clientName: debouncedClient || undefined,
    status,
    setStatus,
    startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  };
}
