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

export async function getClients(params: GetClientsParams): Promise<Client[]> {
  const searchParams: Record<string, string> = {};
  if (params.name) searchParams.name = params.name;
  if (params.page !== undefined) searchParams.page = String(params.page);
  if (params.pageSize !== undefined) searchParams.pageSize = String(params.pageSize);
  return apiClient.get('api/clients', { searchParams }).json<Client[]>();
}

export async function createClient(body: CreateClientRequest): Promise<Client> {
  return apiClient.post('api/clients', { json: body }).json<Client>();
}
