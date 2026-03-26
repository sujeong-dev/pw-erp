'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TablePagination } from '@/src/shared/ui';
import { usePagination } from '@/src/shared/lib/hooks';
import { ROUTES } from '@/src/shared/config';
import {
  useClientSummary,
  useClientLedger,
  useLedgerFilters,
  useSelectedLedgerItem,
  LedgerFilters,
  LedgerDetailDialog,
} from '@/src/features/clients';
import { ClientLedgerTable } from '@/src/widgets/client-ledger-table';

const PAGE_SIZE = 10;

export function ClientDetailPage({ id }: { id: string }) {
  const { code, setCode, debouncedCode, type, setType, status, setStatus, dateRange, setDateRange, startDate, endDate } = useLedgerFilters();
  const { page, setPage, reset } = usePagination();

  const { data: summary, isLoading: summaryLoading } = useClientSummary(id, {
    startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
    endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
  });
  const { data: ledger, isLoading: ledgerLoading } = useClientLedger(id, {
    code: debouncedCode || undefined,
    type: type !== 'all' ? (type as 'SALES' | 'PAYMENT') : undefined,
    status: status !== 'all' ? status : undefined,
    startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
    endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const { selectedItem, setSelectedItem, clear } = useSelectedLedgerItem();

  return (
    <main className='flex flex-col gap-6 p-8'>
      <nav className='flex items-center gap-1 text-sm text-muted-foreground'>
        <Link href={ROUTES.dashboard.clients} className='hover:text-foreground transition-colors'>
          거래처 관리
        </Link>
        <ChevronRight className='size-4' />
        <span className='text-foreground font-medium'>{id}</span>
      </nav>

      <div className='grid grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>총 주문액</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading
              ? <div className='h-8 w-32 rounded bg-muted animate-pulse' />
              : <p className='text-2xl font-bold'>{summary?.totalSaleAmount.toLocaleString('ko-KR')}원</p>
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>총 입금액</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading
              ? <div className='h-8 w-32 rounded bg-muted animate-pulse' />
              : <p className='text-2xl font-bold'>{summary?.totalPaymentAmount.toLocaleString('ko-KR')}원</p>
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>미수금 잔액</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading
              ? <div className='h-8 w-32 rounded bg-muted animate-pulse' />
              : <p className='text-2xl font-bold text-destructive'>{summary?.totalBalance.toLocaleString('ko-KR')}원</p>
            }
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>거래내역 원장</h2>
          <Button variant='default' className='cursor-pointer'>
            <Download className='size-4' />
            엑셀 다운로드
          </Button>
        </div>

        <LedgerFilters
          code={code}
          onCodeChange={(v) => { setCode(v); reset(); }}
          dateRange={dateRange}
          onDateRangeChange={(r) => { setDateRange(r); reset(); }}
          type={type}
          onTypeChange={(v) => { setType(v); reset(); }}
          status={status}
          onStatusChange={(v) => { setStatus(v); reset(); }}
        />

        <ClientLedgerTable
          items={ledger?.items ?? []}
          isLoading={ledgerLoading}
          onRowClick={setSelectedItem}
        />

        <TablePagination
          page={ledger?.page ?? 1}
          totalPages={ledger?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>

      <LedgerDetailDialog item={selectedItem} onClose={clear} />
    </main>
  );
}
