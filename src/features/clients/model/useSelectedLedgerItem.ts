'use client';

import { useState } from 'react';
import type { LedgerItem } from '../api';

export function useSelectedLedgerItem() {
  const [selectedItem, setSelectedItem] = useState<LedgerItem | null>(null);
  const clear = () => setSelectedItem(null);
  return { selectedItem, setSelectedItem, clear };
}
