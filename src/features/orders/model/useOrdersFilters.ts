'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useDebounce } from '@/src/shared/lib/hooks';

export function useOrdersFilters() {
  const [codeSearch, setCodeSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const debouncedCode = useDebounce(codeSearch, 300);
  const debouncedClient = useDebounce(clientSearch, 300);

  return {
    codeSearch,
    setCodeSearch,
    clientSearch,
    setClientSearch,
    dateFilter,
    setDateFilter,
    code: debouncedCode || undefined,
    clientName: debouncedClient || undefined,
    startDate: dateFilter ? format(dateFilter, 'yyyy-MM-dd') : undefined,
    endDate: dateFilter ? format(dateFilter, 'yyyy-MM-dd') : undefined,
  };
}
