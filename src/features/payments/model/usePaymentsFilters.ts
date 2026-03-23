'use client';

import { useState } from 'react';
import { useDebounce } from '@/src/shared/lib/hooks';

export function usePaymentsFilters() {
  const [creditType, setCreditType] = useState('all');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const debouncedClientName = useDebounce(clientName, 300);
  return { creditType, setCreditType, clientName, setClientName, debouncedClientName, startDate, setStartDate, endDate, setEndDate };
}
