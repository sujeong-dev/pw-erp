'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useDebounce } from '@/src/shared/lib/hooks';

export function usePaymentsFilters() {
  const [creditType, setCreditType] = useState('all');
  const [method, setMethod] = useState('all');
  const [clientName, setClientName] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const debouncedClientName = useDebounce(clientName, 300);
  return {
    creditType, setCreditType,
    method, setMethod,
    clientName, setClientName, debouncedClientName,
    dateRange, setDateRange,
    startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  };
}
