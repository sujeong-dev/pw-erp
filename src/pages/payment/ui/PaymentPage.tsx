'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TablePagination } from '@/src/shared/ui';
import { usePagination } from '@/src/shared/lib/hooks';
import { ROUTES } from '@/src/shared/config';
import { usePayments, usePaymentsFilters, PaymentsFilters, CreatePaymentDialog } from '@/src/features/payments';
import { PaymentsTable } from '@/src/widgets/payments-table';

const PAGE_SIZE = 10;

export function PaymentPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    creditType,
    setCreditType,
    clientName,
    setClientName,
    debouncedClientName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = usePaymentsFilters();
  const { page, setPage, reset } = usePagination();

  const { data, isLoading } = usePayments({
    creditType:
      creditType !== 'all' ? (creditType as 'DEPOSIT' | 'REFUND') : undefined,
    clientName: debouncedClientName || undefined,
    startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
    endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <main className='flex flex-col gap-6 p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>수금 내역</h1>
        <Button onClick={() => setDialogOpen(true)} className='cursor-pointer'>
          <Plus className='size-4' />
          입금 등록
        </Button>
      </div>

      <CreatePaymentDialog open={dialogOpen} setOpen={setDialogOpen} />

      <PaymentsFilters
        clientName={clientName}
        onClientNameChange={(v) => {
          setClientName(v);
          reset();
        }}
        startDate={startDate}
        onStartDateChange={(d) => {
          setStartDate(d);
          reset();
        }}
        endDate={endDate}
        onEndDateChange={(d) => {
          setEndDate(d);
          reset();
        }}
        creditType={creditType}
        onCreditTypeChange={(v) => {
          setCreditType(v);
          reset();
        }}
      />

      <PaymentsTable
        items={data?.items ?? []}
        isLoading={isLoading}
        onRowClick={(id) => router.push(ROUTES.dashboard.paymentDetail(id))}
      />

      <TablePagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </main>
  );
}
