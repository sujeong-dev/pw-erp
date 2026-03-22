"use client";

import { useState } from 'react';
import { useDebounce } from '@/src/shared/lib/hooks';

export function useClientsSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  return { search, setSearch, debouncedSearch };
}
