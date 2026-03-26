import { apiClient } from '@/src/shared/api';

export type Client = {
  id: string;
  code: string;
  name: string;
  contactName: string;
  contactPhone: string;
  totalBalance: number;
  lastSaleDate: string;
  createdAt: string;
};

export type GetClientsParams = {
  name?: string;
  page?: number;
  pageSize?: number;
};

export type CreateClientRequest = {
  name: string;
  contactName: string;
  contactPhone: string;
};

export type ClientsResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
  items: Client[];
};

export async function getClients(params: GetClientsParams): Promise<ClientsResponse> {
  const searchParams: Record<string, string> = {};
  if (params.name) searchParams.name = params.name;
  if (params.page !== undefined) searchParams.page = String(params.page);
  if (params.pageSize !== undefined) searchParams.pageSize = String(params.pageSize);
  return apiClient.get('api/clients', { searchParams }).json<ClientsResponse>();
}

export async function createClient(body: CreateClientRequest): Promise<Client> {
  return apiClient.post('api/clients', { json: body }).json<Client>();
}

export async function updateClient(id: string, body: CreateClientRequest): Promise<Client> {
  return apiClient.patch(`api/clients/${id}`, { json: body }).json<Client>();
}

export type DeleteClientResponse = { deletedId: string };

export async function deleteClient(id: string): Promise<DeleteClientResponse> {
  return apiClient.delete(`api/clients/${id}`).json<DeleteClientResponse>();
}

export type ClientSummary = {
  totalSaleAmount: number;
  totalPaymentAmount: number;
  totalBalance: number;
};

export type GetClientSummaryParams = {
  startDate?: string;
  endDate?: string;
};

export async function getClientSummary(id: string, params?: GetClientSummaryParams): Promise<ClientSummary> {
  const searchParams: Record<string, string> = {};
  if (params?.startDate) searchParams.startDate = params.startDate;
  if (params?.endDate) searchParams.endDate = params.endDate;
  return apiClient.get(`api/clients/${id}/summary`, { searchParams }).json<ClientSummary>();
}

export type LedgerItem = {
  id: string;
  date: string;
  type: 'SALES' | 'PAYMENT';
  creditType: 'DEPOSIT' | 'REFUND' | null;
  code: string | null;
  status: 'UNPAID' | 'PAID' | 'PARTIAL' | 'CANCEL' | null;
  debit: number | null;
  credit: number | null;
};

export type LedgerResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
  items: LedgerItem[];
};

export type GetLedgerParams = {
  code?: string;
  type?: 'SALES' | 'PAYMENT';
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
};

export type ExcelExportParams = {
  type?: 'SALES' | 'PAYMENT';
  status?: 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCEL';
  startDate?: string;
  endDate?: string;
};

export type ExcelExportResponse = {
  url: string;
  filename: string;
};

export async function getClientExcelExport(id: string, params?: ExcelExportParams): Promise<ExcelExportResponse> {
  const searchParams: Record<string, string> = {};
  if (params?.type) searchParams.type = params.type;
  if (params?.status) searchParams.status = params.status;
  if (params?.startDate) searchParams.startDate = params.startDate;
  if (params?.endDate) searchParams.endDate = params.endDate;
  return apiClient.get(`api/export/excel/${id}`, { searchParams }).json<ExcelExportResponse>();
}

export async function getClientLedger(id: string, params: GetLedgerParams): Promise<LedgerResponse> {
  const searchParams: Record<string, string> = {};
  if (params.code) searchParams.code = params.code;
  if (params.type) searchParams.type = params.type;
  if (params.status) searchParams.status = params.status;
  if (params.startDate) searchParams.startDate = params.startDate;
  if (params.endDate) searchParams.endDate = params.endDate;
  if (params.page !== undefined) searchParams.page = String(params.page);
  if (params.pageSize !== undefined) searchParams.pageSize = String(params.pageSize);
  return apiClient.get(`api/clients/${id}/ledger`, { searchParams }).json<LedgerResponse>();
}
