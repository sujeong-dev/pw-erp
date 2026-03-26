import { http, HttpResponse } from 'msw';
import type { Client, ClientsResponse, LedgerItem } from '@/src/features/clients/api';

export const mockClients: Client[] = [
  { id: 'c-001', code: 'C-001', name: '한국무역(주)', contactName: '김철수', contactPhone: '010-1234-5678', totalBalance: 8_800_000, lastSaleDate: '2026-03-17', createdAt: '2025-01-10T00:00:00Z' },
  { id: 'c-002', code: 'C-002', name: '대성산업', contactName: '이영희', contactPhone: '010-2345-6789', totalBalance: 3_270_000, lastSaleDate: '2026-03-15', createdAt: '2025-01-15T00:00:00Z' },
  { id: 'c-003', code: 'C-003', name: '서울전자(주)', contactName: '박민준', contactPhone: '010-3456-7890', totalBalance: 2_376_000, lastSaleDate: '2026-03-14', createdAt: '2025-02-01T00:00:00Z' },
  { id: 'c-004', code: 'C-004', name: '미래물산', contactName: '최지훈', contactPhone: '010-4567-8901', totalBalance: 1_925_000, lastSaleDate: '2026-03-12', createdAt: '2025-02-10T00:00:00Z' },
  { id: 'c-005', code: 'C-005', name: '동아상사', contactName: '정수연', contactPhone: '010-5678-9012', totalBalance: 0, lastSaleDate: '2026-03-11', createdAt: '2025-02-20T00:00:00Z' },
  { id: 'c-006', code: 'C-006', name: '태양무역', contactName: '강동원', contactPhone: '010-6789-0123', totalBalance: 4_702_500, lastSaleDate: '2026-03-10', createdAt: '2025-03-01T00:00:00Z' },
  { id: 'c-007', code: 'C-007', name: '국제기업(주)', contactName: '윤서준', contactPhone: '010-7890-1234', totalBalance: 1_056_000, lastSaleDate: '2026-03-09', createdAt: '2025-03-05T00:00:00Z' },
  { id: 'c-008', code: 'C-008', name: '한빛산업', contactName: '임채원', contactPhone: '010-8901-2345', totalBalance: 2_310_000, lastSaleDate: '2026-03-08', createdAt: '2025-03-10T00:00:00Z' },
  { id: 'c-009', code: 'C-009', name: '성진상사', contactName: '송민아', contactPhone: '010-9012-3456', totalBalance: 880_000, lastSaleDate: '2026-03-07', createdAt: '2025-03-15T00:00:00Z' },
  { id: 'c-010', code: 'C-010', name: '우리물산', contactName: '홍길동', contactPhone: '010-0123-4567', totalBalance: 1_567_500, lastSaleDate: '2026-03-06', createdAt: '2025-03-20T00:00:00Z' },
  { id: 'c-011', code: 'C-011', name: '현대유통', contactName: '오준혁', contactPhone: '010-1122-3344', totalBalance: 7_920_000, lastSaleDate: '2026-03-05', createdAt: '2025-04-01T00:00:00Z' },
  { id: 'c-012', code: 'C-012', name: '신한기업', contactName: '배수지', contactPhone: '010-2233-4455', totalBalance: 0, lastSaleDate: '2026-03-04', createdAt: '2025-04-10T00:00:00Z' },
];

let nextId = 13;

export type MockLedgerItem = LedgerItem & { clientId: string };

export const mockLedgerItems: MockLedgerItem[] = [
  // c-001 SALES
  { id: 'o-001', clientId: 'c-001', date: '2026-03-17T00:00:00.000Z', type: 'SALES', creditType: null, code: 'S-2026-001', status: 'UNPAID', debit: 4_400_000, credit: null },
  { id: 'o-013', clientId: 'c-001', date: '2026-03-03T00:00:00.000Z', type: 'SALES', creditType: null, code: 'S-2026-013', status: 'PAID', debit: 8_800_000, credit: null },
  // c-001 PAYMENT
  { id: 'p-001', clientId: 'c-001', date: '2026-03-10T00:00:00.000Z', type: 'PAYMENT', creditType: 'DEPOSIT', code: null, status: null, debit: null, credit: 8_800_000 },
  { id: 'p-002', clientId: 'c-001', date: '2026-03-06T00:00:00.000Z', type: 'PAYMENT', creditType: 'REFUND', code: null, status: null, debit: null, credit: 500_000 },
  // c-002 SALES
  { id: 'o-002', clientId: 'c-002', date: '2026-03-15T00:00:00.000Z', type: 'SALES', creditType: null, code: 'S-2026-002', status: 'PAID', debit: 3_344_000, credit: null },
  { id: 'o-014', clientId: 'c-002', date: '2026-03-02T00:00:00.000Z', type: 'SALES', creditType: null, code: 'S-2026-014', status: 'UNPAID', debit: 2_926_000, credit: null },
  // c-002 PAYMENT
  { id: 'p-003', clientId: 'c-002', date: '2026-03-08T00:00:00.000Z', type: 'PAYMENT', creditType: 'DEPOSIT', code: null, status: null, debit: null, credit: 3_344_000 },
  // c-003 SALES
  { id: 'o-003', clientId: 'c-003', date: '2026-03-14T00:00:00.000Z', type: 'SALES', creditType: null, code: 'S-2026-003', status: 'PARTIAL', debit: 2_376_000, credit: null },
  // c-003 PAYMENT
  { id: 'p-004', clientId: 'c-003', date: '2026-03-11T00:00:00.000Z', type: 'PAYMENT', creditType: 'DEPOSIT', code: null, status: null, debit: null, credit: 1_000_000 },
  // c-004 SALES
  { id: 'o-004', clientId: 'c-004', date: '2026-03-12T00:00:00.000Z', type: 'SALES', creditType: null, code: 'S-2026-004', status: 'UNPAID', debit: 1_925_000, credit: null },
  // c-006 SALES
  { id: 'o-006', clientId: 'c-006', date: '2026-03-10T00:00:00.000Z', type: 'SALES', creditType: null, code: 'S-2026-006', status: 'PAID', debit: 4_702_500, credit: null },
  // c-011 SALES
  { id: 'o-011', clientId: 'c-011', date: '2026-03-05T00:00:00.000Z', type: 'SALES', creditType: null, code: 'S-2026-011', status: 'UNPAID', debit: 7_920_000, credit: null },
];

export const clientHandlers = [
  http.get('*/api/clients/:id/summary', ({ params, request }) => {
    const { id } = params as { id: string };
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate') ?? '';
    const endDate = url.searchParams.get('endDate') ?? '';

    let clientItems = mockLedgerItems.filter((i) => i.clientId === id);
    if (startDate) clientItems = clientItems.filter((i) => i.date >= startDate);
    if (endDate) clientItems = clientItems.filter((i) => i.date <= endDate);

    const totalSaleAmount = clientItems
      .filter((i) => i.type === 'SALES')
      .reduce((sum, i) => sum + (i.debit ?? 0), 0);
    const totalPaymentAmount = clientItems
      .filter((i) => i.type === 'PAYMENT')
      .reduce((sum, i) => sum + (i.credit ?? 0), 0);
    const totalBalance = totalSaleAmount - totalPaymentAmount;
    return HttpResponse.json({ totalSaleAmount, totalPaymentAmount, totalBalance });
  }),

  http.get('*/api/clients/:id/ledger', ({ params, request }) => {
    const { id } = params as { id: string };
    const url = new URL(request.url);
    const code = url.searchParams.get('code') ?? '';
    const type = url.searchParams.get('type') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const startDate = url.searchParams.get('startDate') ?? '';
    const endDate = url.searchParams.get('endDate') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);

    let filtered = mockLedgerItems.filter((i) => i.clientId === id);
    if (code) filtered = filtered.filter((i) => i.code?.includes(code));
    if (type) filtered = filtered.filter((i) => i.type === type);
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (startDate) filtered = filtered.filter((i) => i.date >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.date <= endDate);

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ totalPages, totalElements, size: pageSize, page, items });
  }),

  http.get('*/api/clients', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? mockClients.length);

    let filtered = mockClients;
    if (name) filtered = filtered.filter((c) => c.name.includes(name));

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    const response: ClientsResponse = { totalPages, totalElements, size: pageSize, page, items };
    return HttpResponse.json(response);
  }),

  http.post('*/api/clients', async ({ request }) => {
    const body = await request.json() as { name: string; contactName: string; contactPhone: string };
    const id = `c-${String(nextId++).padStart(3, '0')}`;
    const code = `C-${String(nextId - 1).padStart(3, '0')}`;
    const newClient: Client = {
      id,
      code,
      name: body.name,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      totalBalance: 0,
      lastSaleDate: '',
      createdAt: new Date().toISOString(),
    };
    mockClients.push(newClient);
    return HttpResponse.json(newClient, { status: 201 });
  }),

  http.patch('*/api/clients/:id', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = await request.json() as { name: string; contactName: string; contactPhone: string };
    const index = mockClients.findIndex((c) => c.id === id);
    if (index === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

    mockClients[index] = { ...mockClients[index], ...body };
    return HttpResponse.json(mockClients[index]);
  }),

  http.delete('*/api/clients/:id', ({ params }) => {
    const { id } = params as { id: string };
    const index = mockClients.findIndex((c) => c.id === id);
    if (index === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

    mockClients.splice(index, 1);
    return HttpResponse.json({ deletedId: id });
  }),
];
