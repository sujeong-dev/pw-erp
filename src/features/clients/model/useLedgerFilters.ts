'use client';

import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useDebounce } from '@/src/shared/lib/hooks';

export function useLedgerFilters() {
  const [code, setCode] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const debouncedCode = useDebounce(code, 300);

  return {
    code, setCode, debouncedCode,
    type, setType,
    status, setStatus,
    dateRange, setDateRange,
    startDate: dateRange?.from,
    endDate: dateRange?.to,
  };
}
