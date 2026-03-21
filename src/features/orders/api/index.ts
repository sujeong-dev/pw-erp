import { apiClient } from '@/src/shared/api';

export type OrderClient = { id: string; code: string; name: string };

export type Order = {
  id: string;
  code: string;
  clientId: string;
  client: OrderClient;
  userId: string;
  date: string;
  itemName: string;
  tonnage: number;
  unitPrice: number;
  totalPrice: number;
  memo: string | null;
  status: 'UNPAID' | 'PAID' | 'PARTIAL' | 'CANCEL';
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderRequest = {
  clientId: string;
  date: string;
  itemName: string;
  tonnage: number;
  unitPrice: number;
  memo?: string;
};

export type UpdateOrderRequest = CreateOrderRequest;

export async function createOrder(body: CreateOrderRequest): Promise<Order> {
  return apiClient.post('api/sales', { json: body }).json<Order>();
}

export type DeleteOrderResponse = { deletedId: string };

export async function updateOrder(id: string, body: UpdateOrderRequest): Promise<Order> {
  return apiClient.patch(`api/sales/${id}`, { json: body }).json<Order>();
}

export async function deleteOrder(id: string): Promise<DeleteOrderResponse> {
  return apiClient.delete(`api/sales/${id}`).json<DeleteOrderResponse>();
}
