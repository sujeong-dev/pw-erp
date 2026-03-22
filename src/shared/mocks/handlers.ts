import { http, HttpResponse } from 'msw';
import type { Order, OrdersResponse } from '@/src/features/orders/api';

const mockItems: Order[] = [
  { id: 'o-001', code: 'S-2026-001', clientId: 'c-001', client: { id: 'c-001', code: 'C-001', name: '한국무역(주)' }, userId: 'u-1', date: '2026-03-17', itemName: '철근', tonnage: 5.0, unitPrice: 800_000, totalPrice: 4_400_000, memo: '긴급 납품 요청', status: 'UNPAID', createdAt: '2026-03-17T00:00:00Z', updatedAt: '2026-03-17T00:00:00Z' },
  { id: 'o-002', code: 'S-2026-002', clientId: 'c-002', client: { id: 'c-002', code: 'C-002', name: '대성산업' }, userId: 'u-1', date: '2026-03-15', itemName: 'H빔', tonnage: 3.2, unitPrice: 950_000, totalPrice: 3_344_000, memo: null, status: 'PAID', createdAt: '2026-03-15T00:00:00Z', updatedAt: '2026-03-15T00:00:00Z' },
  { id: 'o-003', code: 'S-2026-003', clientId: 'c-003', client: { id: 'c-003', code: 'C-003', name: '서울전자(주)' }, userId: 'u-1', date: '2026-03-14', itemName: '철판', tonnage: 1.8, unitPrice: 1_200_000, totalPrice: 2_376_000, memo: '부분 납품 완료', status: 'PARTIAL', createdAt: '2026-03-14T00:00:00Z', updatedAt: '2026-03-14T00:00:00Z' },
  { id: 'o-004', code: 'S-2026-004', clientId: 'c-004', client: { id: 'c-004', code: 'C-004', name: '미래물산' }, userId: 'u-1', date: '2026-03-12', itemName: '앵글', tonnage: 2.5, unitPrice: 700_000, totalPrice: 1_925_000, memo: null, status: 'UNPAID', createdAt: '2026-03-12T00:00:00Z', updatedAt: '2026-03-12T00:00:00Z' },
  { id: 'o-005', code: 'S-2026-005', clientId: 'c-005', client: { id: 'c-005', code: 'C-005', name: '동아상사' }, userId: 'u-1', date: '2026-03-11', itemName: '철근', tonnage: 8.0, unitPrice: 800_000, totalPrice: 7_040_000, memo: null, status: 'CANCEL', createdAt: '2026-03-11T00:00:00Z', updatedAt: '2026-03-11T00:00:00Z' },
  { id: 'o-006', code: 'S-2026-006', clientId: 'c-006', client: { id: 'c-006', code: 'C-006', name: '태양무역' }, userId: 'u-1', date: '2026-03-10', itemName: 'H빔', tonnage: 4.5, unitPrice: 950_000, totalPrice: 4_702_500, memo: null, status: 'PAID', createdAt: '2026-03-10T00:00:00Z', updatedAt: '2026-03-10T00:00:00Z' },
  { id: 'o-007', code: 'S-2026-007', clientId: 'c-007', client: { id: 'c-007', code: 'C-007', name: '국제기업(주)' }, userId: 'u-1', date: '2026-03-09', itemName: '철판', tonnage: 0.8, unitPrice: 1_200_000, totalPrice: 1_056_000, memo: null, status: 'PAID', createdAt: '2026-03-09T00:00:00Z', updatedAt: '2026-03-09T00:00:00Z' },
  { id: 'o-008', code: 'S-2026-008', clientId: 'c-008', client: { id: 'c-008', code: 'C-008', name: '한빛산업' }, userId: 'u-1', date: '2026-03-08', itemName: '앵글', tonnage: 3.0, unitPrice: 700_000, totalPrice: 2_310_000, memo: null, status: 'UNPAID', createdAt: '2026-03-08T00:00:00Z', updatedAt: '2026-03-08T00:00:00Z' },
  { id: 'o-009', code: 'S-2026-009', clientId: 'c-009', client: { id: 'c-009', code: 'C-009', name: '성진상사' }, userId: 'u-1', date: '2026-03-07', itemName: '철근', tonnage: 2.0, unitPrice: 800_000, totalPrice: 1_760_000, memo: null, status: 'PARTIAL', createdAt: '2026-03-07T00:00:00Z', updatedAt: '2026-03-07T00:00:00Z' },
  { id: 'o-010', code: 'S-2026-010', clientId: 'c-010', client: { id: 'c-010', code: 'C-010', name: '우리물산' }, userId: 'u-1', date: '2026-03-06', itemName: 'H빔', tonnage: 1.5, unitPrice: 950_000, totalPrice: 1_567_500, memo: null, status: 'PAID', createdAt: '2026-03-06T00:00:00Z', updatedAt: '2026-03-06T00:00:00Z' },
  { id: 'o-011', code: 'S-2026-011', clientId: 'c-011', client: { id: 'c-011', code: 'C-011', name: '현대유통' }, userId: 'u-1', date: '2026-03-05', itemName: '철판', tonnage: 6.0, unitPrice: 1_200_000, totalPrice: 7_920_000, memo: null, status: 'UNPAID', createdAt: '2026-03-05T00:00:00Z', updatedAt: '2026-03-05T00:00:00Z' },
  { id: 'o-012', code: 'S-2026-012', clientId: 'c-012', client: { id: 'c-012', code: 'C-012', name: '신한기업' }, userId: 'u-1', date: '2026-03-04', itemName: '앵글', tonnage: 0.5, unitPrice: 700_000, totalPrice: 385_000, memo: null, status: 'CANCEL', createdAt: '2026-03-04T00:00:00Z', updatedAt: '2026-03-04T00:00:00Z' },
  { id: 'o-013', code: 'S-2026-013', clientId: 'c-001', client: { id: 'c-001', code: 'C-001', name: '한국무역(주)' }, userId: 'u-1', date: '2026-03-03', itemName: '철근', tonnage: 10.0, unitPrice: 800_000, totalPrice: 8_800_000, memo: null, status: 'PAID', createdAt: '2026-03-03T00:00:00Z', updatedAt: '2026-03-03T00:00:00Z' },
  { id: 'o-014', code: 'S-2026-014', clientId: 'c-002', client: { id: 'c-002', code: 'C-002', name: '대성산업' }, userId: 'u-1', date: '2026-03-02', itemName: 'H빔', tonnage: 2.8, unitPrice: 950_000, totalPrice: 2_926_000, memo: null, status: 'UNPAID', createdAt: '2026-03-02T00:00:00Z', updatedAt: '2026-03-02T00:00:00Z' },
];

export const handlers = [
  http.get('*/api/sales', ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code') ?? '';
    const clientName = url.searchParams.get('clientName') ?? '';
    const startDate = url.searchParams.get('startDate') ?? '';
    const endDate = url.searchParams.get('endDate') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);

    let filtered = mockItems;
    if (code) filtered = filtered.filter((i) => i.code.includes(code));
    if (clientName) filtered = filtered.filter((i) => i.client.name.includes(clientName));
    if (startDate) filtered = filtered.filter((i) => i.date >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.date <= endDate);

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);

    const response: OrdersResponse = { totalPages, totalElements, size: pageSize, page, items };
    return HttpResponse.json(response);
  }),
];
