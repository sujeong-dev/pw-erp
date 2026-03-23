import { apiClient } from '@/src/shared/api';

export type Payment = {
  id: string;
  creditType: 'DEPOSIT' | 'REFUND';
  date: string;
  clientName: string;
  amount: number;
  method: 'CASH' | 'NOTE';
};

export type PaymentsResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
  items: Payment[];
};

export type GetPaymentsParams = {
  creditType?: 'DEPOSIT' | 'REFUND';
  clientName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
};

export async function getPayments(params: GetPaymentsParams): Promise<PaymentsResponse> {
  const searchParams: Record<string, string> = {};
  if (params.creditType) searchParams.creditType = params.creditType;
  if (params.clientName) searchParams.clientName = params.clientName;
  if (params.startDate) searchParams.startDate = params.startDate;
  if (params.endDate) searchParams.endDate = params.endDate;
  if (params.page !== undefined) searchParams.page = String(params.page);
  if (params.pageSize !== undefined) searchParams.pageSize = String(params.pageSize);
  return apiClient.get('api/payments', { searchParams }).json<PaymentsResponse>();
}
