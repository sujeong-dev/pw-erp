import { http, HttpResponse } from 'msw';
import type { Client } from '@/src/features/clients/api';

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

export const clientHandlers = [
  http.get('*/api/clients', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? mockClients.length);

    let filtered = mockClients;
    if (name) filtered = filtered.filter((c) => c.name.includes(name));

    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json(items);
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
