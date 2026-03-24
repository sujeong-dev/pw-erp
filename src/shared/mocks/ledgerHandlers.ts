import { http, HttpResponse } from 'msw';
import type { GlobalLedgerItem } from '@/src/features/ledger';
import { mockClients, mockLedgerItems } from './clientHandlers';

function getAllLedgerItems(): GlobalLedgerItem[] {
  return mockLedgerItems.map((item) => {
    const client = mockClients.find((c) => c.id === item.clientId)!;
    return {
      id: item.id,
      date: item.date,
      type: item.type,
      creditType: item.creditType,
      client: { id: client.id, code: client.code, name: client.name },
      code: item.code,
      debit: item.debit,
      credit: item.credit,
      status: item.status,
    };
  });
}

export const ledgerHandlers = [
  http.get('*/api/ledger/summary', ({ request }) => {
    const url = new URL(request.url);
    const clientName = url.searchParams.get('clientName') ?? '';
    const startDate = url.searchParams.get('startDate') ?? '';
    const endDate = url.searchParams.get('endDate') ?? '';

    let filtered = getAllLedgerItems();
    if (clientName) filtered = filtered.filter((i) => i.client.name.includes(clientName));
    if (startDate) filtered = filtered.filter((i) => i.date >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.date <= endDate);

    const totalSaleAmount = filtered
      .filter((i) => i.type === 'SALES')
      .reduce((sum, i) => sum + (i.debit ?? 0), 0);
    const totalPaymentAmount = filtered
      .filter((i) => i.type === 'PAYMENT')
      .reduce((sum, i) => sum + (i.credit ?? 0), 0);
    const totalBalance = totalSaleAmount - totalPaymentAmount;

    return HttpResponse.json({ totalSaleAmount, totalPaymentAmount, totalBalance });
  }),

  http.get('*/api/ledger', ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code') ?? '';
    const clientName = url.searchParams.get('clientName') ?? '';
    const type = url.searchParams.get('type') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const startDate = url.searchParams.get('startDate') ?? '';
    const endDate = url.searchParams.get('endDate') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);

    let filtered = getAllLedgerItems();
    if (code) filtered = filtered.filter((i) => i.code?.includes(code));
    if (clientName) filtered = filtered.filter((i) => i.client.name.includes(clientName));
    if (type) filtered = filtered.filter((i) => i.type === type);
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (startDate) filtered = filtered.filter((i) => i.date >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.date <= endDate);

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ totalPages, totalElements, size: pageSize, page, items });
  }),
];
