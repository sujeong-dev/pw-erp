"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TX_STATUS, statusVariant } from "@/src/shared/constants";
import { ROUTES } from "@/src/shared/config";
import { DateFilter, SearchInput, ConfirmDialog, TablePagination } from "@/src/shared/ui";
import { useDebounce, usePagination } from "@/src/shared/lib/hooks";
import {
  useOrders,
  useDeleteOrder,
  CreateOrderDialog,
  EditOrderDialog,
  type Order,
} from "@/src/features/orders";

const PAGE_SIZE = 10;

const STATUS_DISPLAY = {
  UNPAID: TX_STATUS.UNPAID,
  PAID: TX_STATUS.PAID,
  PARTIAL: TX_STATUS.PARTIAL,
  CANCEL: TX_STATUS.CANCEL,
} as const;

type EditableOrder = {
  id: string;
  clientId: string;
  date: string;
  itemName: string;
  tonnage: number;
  unitPrice: number;
  memo?: string;
};

export function OrdersPage() {
  const router = useRouter();

  const [codeSearch, setCodeSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const debouncedCode = useDebounce(codeSearch, 300);
  const debouncedClient = useDebounce(clientSearch, 300);

  const { page, setPage, reset } = usePagination();

  const { data, isLoading } = useOrders({
    code: debouncedCode || undefined,
    clientName: debouncedClient || undefined,
    startDate: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
    endDate: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;


  const [editingOrder, setEditingOrder] = useState<EditableOrder | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  function handleEditOpen(order: Order) {
    setEditingOrder({
      id: order.id,
      clientId: order.clientId,
      date: order.date,
      itemName: order.itemName,
      tonnage: order.tonnage,
      unitPrice: order.unitPrice,
      memo: order.memo ?? undefined,
    });
  }

  function handleEditClose() {
    setEditingOrder(null);
  }

  function handleDelete() {
    if (!deleteOrderId) return;
    deleteOrder(deleteOrderId, { onSuccess: () => setDeleteOrderId(null) });
  }

  function resetPage() {
    reset();
  }

  return (
    <main className='flex flex-col gap-6 p-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>매출 내역</h1>
        <CreateOrderDialog />
      </div>

      <EditOrderDialog order={editingOrder} onClose={handleEditClose} />
      <ConfirmDialog
        open={!!deleteOrderId}
        onOpenChange={(v) => !v && setDeleteOrderId(null)}
        title='정말 취소하시겠습니까?'
        description='취소된 주문은 복구할 수 없습니다.'
        confirmLabel='삭제'
        cancelLabel='취소'
        onConfirm={handleDelete}
        isPending={isDeleting}
      />

      {/* Filters */}
      <div className='flex items-center gap-3'>
        <SearchInput
          value={codeSearch}
          onChange={(v) => { setCodeSearch(v); resetPage(); }}
          placeholder='코드 검색'
          className='w-40'
        />
        <SearchInput
          value={clientSearch}
          onChange={(v) => { setClientSearch(v); resetPage(); }}
          placeholder='거래처 검색'
          className='w-56'
        />
        <DateFilter
          value={dateFilter}
          onChange={(d) => { setDateFilter(d); resetPage(); }}
          placeholder='주문 날짜'
        />
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>코드</TableHead>
              <TableHead>주문 일자</TableHead>
              <TableHead>거래처</TableHead>
              <TableHead>품목</TableHead>
              <TableHead className='text-left'>톤수</TableHead>
              <TableHead className='text-right'>합계 금액</TableHead>
              <TableHead className='text-center'>상태</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center text-muted-foreground py-8'>
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center text-muted-foreground py-8'>
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              items.map((order) => (
                <TableRow
                  key={order.id}
                  className='cursor-pointer'
                  onClick={() => router.push(ROUTES.dashboard.orderDetail(order.id))}
                >
                  <TableCell className='text-muted-foreground'>{order.code}</TableCell>
                  <TableCell className='text-muted-foreground'>{order.date}</TableCell>
                  <TableCell>{order.client.name}</TableCell>
                  <TableCell>{order.itemName}</TableCell>
                  <TableCell className='text-left'>{order.tonnage}t</TableCell>
                  <TableCell className='text-right'>
                    {order.totalPrice.toLocaleString("ko-KR")}원
                  </TableCell>
                  <TableCell className='flex justify-center'>
                    <Badge variant={statusVariant[STATUS_DISPLAY[order.status]]}>
                      {STATUS_DISPLAY[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {order.status === 'UNPAID' && (
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='secondary'
                          size='sm'
                          className='cursor-pointer'
                          onClick={() => handleEditOpen(order)}
                        >
                          수정
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                          onClick={() => setDeleteOrderId(order.id)}
                        >
                          취소
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <TablePagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
}
