'use client';

import { useState } from 'react';
import { useDebounce } from '@/src/shared/lib/hooks';

export function useLedgerFilters() {
  const [code, setCode] = useState('');
  const [clientName, setClientName] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const debouncedCode = useDebounce(code, 300);
  const debouncedClientName = useDebounce(clientName, 300);

  return {
    code, setCode, debouncedCode,
    clientName, setClientName, debouncedClientName,
    type, setType,
    status, setStatus,
    startDate, setStartDate,
    endDate, setEndDate,
  };
}
