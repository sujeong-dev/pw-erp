'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TablePagination } from '@/src/shared/ui';
import { usePagination } from '@/src/shared/lib/hooks';
import {
  useOrders,
  useOrdersFilters,
  useOrderEdit,
  useOrderRefundDialog,
  CreateOrderDialog,
  EditOrderDialog,
  OrdersFilters,
  OrderRefundDialog,
} from '@/src/features/orders';
import { OrdersTable } from '@/src/widgets/orders-table/ui';

const PAGE_SIZE = 10;

export function OrderPage() {
  const {
    codeSearch,
    setCodeSearch,
    clientSearch,
    setClientSearch,
    dateRange,
    setDateRange,
    status,
    setStatus,
    code,
    clientName,
    startDate,
    endDate,
  } = useOrdersFilters();

  const { page, setPage, reset } = usePagination();

  const { data, isLoading } = useOrders({
    code,
    clientName,
    status: status !== 'all' ? status : undefined,
    startDate,
    endDate,
    page,
    pageSize: PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;

  const {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    editingOrder,
    handleEditOpen,
    handleEditClose,
  } = useOrderEdit();
  const { refundingOrder, openRefund, closeRefund } = useOrderRefundDialog();

  return (
    <main className='flex flex-col gap-6 p-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>매출 내역</h1>
        <Button
          onClick={() => setIsRegisterModalOpen(true)}
          className='cursor-pointer'
        >
          <Plus className='size-4' />
          주문 등록
        </Button>
      </div>

      {/* filters */}
      <OrdersFilters
        codeSearch={codeSearch}
        onCodeChange={(v) => {
          setCodeSearch(v);
          reset();
        }}
        clientSearch={clientSearch}
        onClientChange={(v) => {
          setClientSearch(v);
          reset();
        }}
        dateRange={dateRange}
        onDateRangeChange={(r) => {
          setDateRange(r);
          reset();
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          reset();
        }}
      />

      {/* table */}
      <OrdersTable
        items={items}
        isLoading={isLoading}
        onEditOpen={handleEditOpen}
        onRefundRequest={openRefund}
      />

      <TablePagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* modals */}
      <CreateOrderDialog
        open={isRegisterModalOpen}
        setOpen={setIsRegisterModalOpen}
      />
      <EditOrderDialog order={editingOrder} onClose={handleEditClose} />
      <OrderRefundDialog order={refundingOrder} onClose={closeRefund} />
    </main>
  );
}
