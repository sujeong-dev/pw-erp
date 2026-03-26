'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TablePagination } from '@/src/shared/ui';
import { usePagination } from '@/src/shared/lib/hooks';
import {
  useOrders,
  useOrdersFilters,
  useOrderEdit,
  useOrderDeleteDialog,
  CreateOrderDialog,
  EditOrderDialog,
  OrdersFilters,
  OrderDeleteDialog,
} from '@/src/features/orders';
import { OrdersTable } from '@/src/widgets/orders-table/ui';

const PAGE_SIZE = 10;

export function OrderPage() {
  const {
    codeSearch,
    setCodeSearch,
    clientSearch,
    setClientSearch,
    dateFilter,
    setDateFilter,
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
  const { deleteOrderId, setDeleteOrderId, isDeleting, handleDelete } =
    useOrderDeleteDialog();

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
        dateFilter={dateFilter}
        onDateChange={(d) => {
          setDateFilter(d);
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
        onDeleteRequest={setDeleteOrderId}
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
      <OrderDeleteDialog
        open={!!deleteOrderId}
        onOpenChange={(o) => !o && setDeleteOrderId(null)}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </main>
  );
}
