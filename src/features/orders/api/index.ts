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
  paidAmount: number;
  status: 'UNPAID' | 'PAID' | 'PARTIAL' | 'CANCEL';
  isRefundable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetOrdersParams = {
  code?: string;
  clientName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
};

export type OrdersResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
  items: Order[];
};

export async function getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
  const searchParams: Record<string, string> = {};
  if (params.code) searchParams.code = params.code;
  if (params.clientName) searchParams.clientName = params.clientName;
  if (params.status) searchParams.status = params.status;
  if (params.startDate) searchParams.startDate = params.startDate;
  if (params.endDate) searchParams.endDate = params.endDate;
  if (params.page !== undefined) searchParams.page = String(params.page);
  if (params.pageSize !== undefined) searchParams.pageSize = String(params.pageSize);
  return apiClient.get('api/sales', { searchParams }).json<OrdersResponse>();
}

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

export async function getOrder(id: string): Promise<Order> {
  return apiClient.get(`api/sales/${id}`).json<Order>();
}

export type RefundPaymentRequest = {
  clientId: string;
  date: string;
  amount: number;
  salesId: string;
  method: 'CASH' | 'BILL';
  memo?: string;
};

export type RefundPaymentResponse = {
  data: {
    id: string;
    creditType: 'DEPOSIT';
    date: string;
    amount: number;
    method: 'CASH' | 'BILL';
    memo: object;
    client: { id: string; code: string; name: string };
    saleId: string;
    saleCode: string;
    createdAt: string;
  };
  message: string;
};

export async function createRefundPayment(body: RefundPaymentRequest): Promise<RefundPaymentResponse> {
  return apiClient.post('api/payments/refund', { json: body }).json<RefundPaymentResponse>();
}
