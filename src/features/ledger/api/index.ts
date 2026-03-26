import { apiClient } from '@/src/shared/api';

export type GlobalLedgerItem = {
  id: string;
  date: string;
  type: 'SALES' | 'PAYMENT';
  creditType: 'DEPOSIT' | 'REFUND' | null;
  client: { id: string; code: string; name: string };
  code: string | null;
  debit: number | null;
  credit: number | null;
  status: 'UNPAID' | 'PAID' | 'PARTIAL' | 'CANCEL' | null;
};

export type GlobalLedgerResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
  items: GlobalLedgerItem[];
};

export type LedgerSummary = {
  totalSaleAmount: number;
  totalPaymentAmount: number;
  totalBalance: number;
};

export type GetSummaryParams = {
  clientName?: string;
  startDate?: string;
  endDate?: string;
};

export type GetGlobalLedgerParams = {
  code?: string;
  clientName?: string;
  type?: 'SALES' | 'PAYMENT';
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
};

export type LedgerExcelExportParams = {
  clientName?: string;
  type?: 'SALES' | 'PAYMENT';
  status?: 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCEL';
  startDate?: string;
  endDate?: string;
};

export type LedgerExcelExportResponse = {
  url: string;
  filename: string;
};

export async function getLedgerExcelExport(params?: LedgerExcelExportParams): Promise<LedgerExcelExportResponse> {
  const searchParams: Record<string, string> = {};
  if (params?.clientName) searchParams.clientName = params.clientName;
  if (params?.type) searchParams.type = params.type;
  if (params?.status) searchParams.status = params.status;
  if (params?.startDate) searchParams.startDate = params.startDate;
  if (params?.endDate) searchParams.endDate = params.endDate;
  return apiClient.get('api/export/excel', { searchParams }).json<LedgerExcelExportResponse>();
}

export async function getLedgerSummary(params: GetSummaryParams): Promise<LedgerSummary> {
  const searchParams: Record<string, string> = {};
  if (params.clientName) searchParams.clientName = params.clientName;
  if (params.startDate) searchParams.startDate = params.startDate;
  if (params.endDate) searchParams.endDate = params.endDate;
  return apiClient.get('api/ledger/summary', { searchParams }).json<LedgerSummary>();
}

export async function getGlobalLedger(params: GetGlobalLedgerParams): Promise<GlobalLedgerResponse> {
  const searchParams: Record<string, string> = {};
  if (params.code) searchParams.code = params.code;
  if (params.clientName) searchParams.clientName = params.clientName;
  if (params.type) searchParams.type = params.type;
  if (params.status) searchParams.status = params.status;
  if (params.startDate) searchParams.startDate = params.startDate;
  if (params.endDate) searchParams.endDate = params.endDate;
  if (params.page !== undefined) searchParams.page = String(params.page);
  if (params.pageSize !== undefined) searchParams.pageSize = String(params.pageSize);
  return apiClient.get('api/ledger', { searchParams }).json<GlobalLedgerResponse>();
}
