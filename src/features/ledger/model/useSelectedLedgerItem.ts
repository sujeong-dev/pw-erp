'use client';

import { useState } from 'react';
import type { GlobalLedgerItem } from '../api';

export function useSelectedLedgerItem() {
  const [selectedItem, setSelectedItem] = useState<GlobalLedgerItem | null>(null);
  const clear = () => setSelectedItem(null);
  return { selectedItem, setSelectedItem, clear };
}
