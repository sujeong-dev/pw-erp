'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TablePagination } from '@/src/shared/ui';
import { usePagination } from '@/src/shared/lib/hooks';
import { cn } from '@/lib/utils';
import {
  useLedgerSummary,
  useLedger,
  useLedgerFilters,
  useSelectedLedgerItem,
  LedgerFilters,
  LedgerDetailDialog,
} from '@/src/features/ledger';
import { LedgerTable } from '@/src/widgets/ledger-table';

const PAGE_SIZE = 10;

export function LedgerPage() {
  const {
    code, setCode, debouncedCode,
    clientName, setClientName, debouncedClientName,
    type, setType,
    status, setStatus,
    dateRange, setDateRange,
    startDate, endDate,
  } = useLedgerFilters();
  const { page, setPage, reset } = usePagination();
  const { selectedItem, setSelectedItem, clear } = useSelectedLedgerItem();

  const { data: summary } = useLedgerSummary({
    clientName: debouncedClientName || undefined,
    startDate,
    endDate,
  });

  const { data: ledger, isLoading: ledgerLoading } = useLedger({
    code: debouncedCode || undefined,
    clientName: debouncedClientName || undefined,
    type: type !== 'all' ? (type as 'SALES' | 'PAYMENT') : undefined,
    status: status !== 'all' ? status : undefined,
    startDate,
    endDate,
    page,
    pageSize: PAGE_SIZE,
  });

  function handleFilterChange(setter: (v: string) => void) {
    return (v: string) => { setter(v); reset(); };
  }

  return (
    <main className='flex flex-col gap-8 p-8'>
      <section className='grid grid-cols-3 gap-4'>
        {[
          { label: '총 매출액', value: summary?.totalSaleAmount, red: false },
          { label: '총 입금액', value: summary?.totalPaymentAmount, red: false },
          { label: '총 미수금 잔액', value: summary?.totalBalance, red: true },
        ].map((card) => (
          <Card key={card.label}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn('text-2xl font-bold', card.red && 'text-destructive')}>
                {card.value !== undefined ? `${card.value.toLocaleString('ko-KR')}원` : '-'}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>거래 내역</h2>
          <Button variant='default' size='lg' className='cursor-pointer'>
            <Download className='size-4' />
            엑셀 다운로드
          </Button>
        </div>

        <LedgerFilters
          code={code}
          onCodeChange={handleFilterChange(setCode)}
          clientName={clientName}
          onClientNameChange={(v) => { setClientName(v); reset(); }}
          dateRange={dateRange}
          onDateRangeChange={(r) => { setDateRange(r); reset(); }}
          type={type}
          onTypeChange={handleFilterChange(setType)}
          status={status}
          onStatusChange={handleFilterChange(setStatus)}
        />

        <LedgerTable
          items={ledger?.items ?? []}
          isLoading={ledgerLoading}
          onRowClick={setSelectedItem}
        />

        <TablePagination
          page={page}
          totalPages={ledger?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </section>

      <LedgerDetailDialog item={selectedItem} onClose={clear} />
    </main>
  );
}
