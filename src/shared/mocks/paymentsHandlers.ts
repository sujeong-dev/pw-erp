import { http, HttpResponse } from 'msw';
import type { Payment, CreatePaymentRequest } from '@/src/features/payments';
import { mockClients, mockLedgerItems, type MockLedgerItem } from './clientHandlers';

export const mockPayments: Payment[] = [
  { id: 'pay-001', creditType: 'DEPOSIT', date: '2026-03-17T00:00:00.000Z', clientName: '한국무역(주)', amount: 4_400_000, method: 'CASH' },
  { id: 'pay-002', creditType: 'DEPOSIT', date: '2026-03-16T00:00:00.000Z', clientName: '대성산업', amount: 3_344_000, method: 'BILL' },
  { id: 'pay-003', creditType: 'REFUND',  date: '2026-03-15T00:00:00.000Z', clientName: '서울전자(주)', amount: 2_376_000, method: 'CASH' },
  { id: 'pay-004', creditType: 'DEPOSIT', date: '2026-03-14T00:00:00.000Z', clientName: '미래물산', amount: 1_925_000, method: 'CASH' },
  { id: 'pay-005', creditType: 'DEPOSIT', date: '2026-03-13T00:00:00.000Z', clientName: '동아상사', amount: 7_040_000, method: 'BILL' },
  { id: 'pay-006', creditType: 'REFUND',  date: '2026-03-12T00:00:00.000Z', clientName: '태양무역', amount: 4_702_500, method: 'CASH' },
  { id: 'pay-007', creditType: 'DEPOSIT', date: '2026-03-11T00:00:00.000Z', clientName: '국제기업(주)', amount: 1_056_000, method: 'BILL' },
  { id: 'pay-008', creditType: 'DEPOSIT', date: '2026-03-10T00:00:00.000Z', clientName: '한빛산업', amount: 2_310_000, method: 'CASH' },
  { id: 'pay-009', creditType: 'DEPOSIT', date: '2026-03-09T00:00:00.000Z', clientName: '성진상사', amount: 1_760_000, method: 'CASH' },
  { id: 'pay-010', creditType: 'REFUND',  date: '2026-03-08T00:00:00.000Z', clientName: '우리물산', amount: 1_567_500, method: 'BILL' },
  { id: 'pay-011', creditType: 'DEPOSIT', date: '2026-03-07T00:00:00.000Z', clientName: '현대유통', amount: 7_920_000, method: 'BILL' },
  { id: 'pay-012', creditType: 'DEPOSIT', date: '2026-03-06T00:00:00.000Z', clientName: '신한기업', amount: 385_000, method: 'CASH' },
  { id: 'pay-013', creditType: 'DEPOSIT', date: '2026-03-05T00:00:00.000Z', clientName: '한국무역(주)', amount: 8_800_000, method: 'BILL' },
  { id: 'pay-014', creditType: 'REFUND',  date: '2026-03-04T00:00:00.000Z', clientName: '대성산업', amount: 2_926_000, method: 'CASH' },
];

export const paymentHandlers = [
  http.get('*/api/payments', ({ request }) => {
    const url = new URL(request.url);
    const creditType = url.searchParams.get('creditType') ?? '';
    const method = url.searchParams.get('method') ?? '';
    const clientName = url.searchParams.get('clientName') ?? '';
    const startDate = url.searchParams.get('startDate') ?? '';
    const endDate = url.searchParams.get('endDate') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);

    let filtered = [...mockPayments];
    if (creditType) filtered = filtered.filter((p) => p.creditType === creditType);
    if (method) filtered = filtered.filter((p) => p.method === method);
    if (clientName) filtered = filtered.filter((p) => p.clientName.includes(clientName));
    if (startDate) filtered = filtered.filter((p) => p.date >= startDate);
    if (endDate) filtered = filtered.filter((p) => p.date <= endDate);

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ totalPages, totalElements, size: pageSize, page, items });
  }),

  http.post('*/api/payments/refund', async ({ request }) => {
    const body = await request.json() as { clientId: string; date: string; amount: number; salesId: string; method: 'CASH' | 'BILL'; memo?: string };
    const client = mockClients.find((c) => c.id === body.clientId);
    const id = `pay-ref-${Date.now()}`;
    const now = new Date().toISOString();
    return HttpResponse.json({
      data: {
        id,
        creditType: 'DEPOSIT',
        date: now,
        amount: body.amount,
        method: body.method,
        memo: body.memo ? { text: body.memo } : {},
        client: client
          ? { id: client.id, code: client.code, name: client.name }
          : { id: body.clientId, code: '', name: '' },
        saleId: body.salesId,
        saleCode: `S-${body.salesId}`,
        createdAt: now,
      },
      message: '매출 취소 처리가 완료되었습니다.',
    });
  }),

  http.post('*/api/payments', async ({ request }) => {
    const body = await request.json() as CreatePaymentRequest;
    const client = mockClients.find((c) => c.id === body.clientId);
    const newPayment: Payment = {
      id: `pay-${String(mockPayments.length + 1).padStart(3, '0')}`,
      creditType: 'DEPOSIT',
      date: new Date(body.date).toISOString(),
      clientName: client?.name ?? body.clientId,
      amount: body.amount,
      method: body.method,
    };
    mockPayments.push(newPayment);

    const newLedgerItem: MockLedgerItem = {
      id: newPayment.id,
      clientId: body.clientId,
      date: newPayment.date,
      type: 'PAYMENT',
      creditType: 'DEPOSIT',
      code: null,
      status: null,
      debit: null,
      credit: body.amount,
    };
    mockLedgerItems.push(newLedgerItem);

    return HttpResponse.json(newPayment, { status: 201 });
  }),
];
