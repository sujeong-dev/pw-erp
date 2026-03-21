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

export async function getClientSummary(id: string): Promise<ClientSummary> {
  return apiClient.get(`api/clients/${id}/summary`).json<ClientSummary>();
}
