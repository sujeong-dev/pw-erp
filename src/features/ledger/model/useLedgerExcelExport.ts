'use client';

import { useMutation } from '@tanstack/react-query';
import { getLedgerExcelExport, type LedgerExcelExportParams } from '../api';

export function useLedgerExcelExport() {
  return useMutation({
    mutationFn: (params?: LedgerExcelExportParams) => getLedgerExcelExport(params),
    onSuccess: ({ url, filename }) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    },
  });
}
