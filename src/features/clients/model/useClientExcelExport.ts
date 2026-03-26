'use client';

import { useMutation } from '@tanstack/react-query';
import { getClientExcelExport, type ExcelExportParams } from '../api';

export function useClientExcelExport(id: string) {
  return useMutation({
    mutationFn: (params?: ExcelExportParams) => getClientExcelExport(id, params),
    onSuccess: ({ url, filename }) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    },
  });
}
