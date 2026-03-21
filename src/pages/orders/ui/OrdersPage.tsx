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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TX_STATUS, statusVariant } from "@/src/shared/constants";
import { ROUTES } from "@/src/shared/config";
import type { TxStatus } from "@/src/shared/constants";
import { DateFilter, SearchInput } from "@/src/shared/ui";
import { CreateOrderDialog, EditOrderDialog } from "@/src/features/orders";

type Order = {
  id: string;
  client: string;
  orderDate: string;
  item: string;
  tons: number;
  unitPrice: number;
  status: TxStatus;
  memo?: string;
};

const mockOrders: Order[] = [
  { id: "O001", client: "한국무역(주)",  orderDate: "2026-03-17", item: "철근",   tons: 5.0,  unitPrice: 800_000,  status: TX_STATUS.UNPAID, memo: "긴급 납품 요청" },
  { id: "O002", client: "대성산업",      orderDate: "2026-03-15", item: "H빔",    tons: 3.2,  unitPrice: 950_000,  status: TX_STATUS.PAID },
  { id: "O003", client: "서울전자(주)",  orderDate: "2026-03-14", item: "철판",   tons: 1.8,  unitPrice: 1_200_000, status: TX_STATUS.PARTIAL, memo: "부분 납품 완료, 잔여분 3월 말 납품 예정" },
  { id: "O004", client: "미래물산",      orderDate: "2026-03-12", item: "앵글",   tons: 2.5,  unitPrice: 700_000,  status: TX_STATUS.UNPAID },
  { id: "O005", client: "동아상사",      orderDate: "2026-03-11", item: "철근",   tons: 8.0,  unitPrice: 800_000,  status: TX_STATUS.CANCEL },
  { id: "O006", client: "태양무역",      orderDate: "2026-03-10", item: "H빔",    tons: 4.5,  unitPrice: 950_000,  status: TX_STATUS.PAID },
  { id: "O007", client: "국제기업(주)",  orderDate: "2026-03-09", item: "철판",   tons: 0.8,  unitPrice: 1_200_000, status: TX_STATUS.PAID },
  { id: "O008", client: "한빛산업",      orderDate: "2026-03-08", item: "앵글",   tons: 3.0,  unitPrice: 700_000,  status: TX_STATUS.UNPAID },
  { id: "O009", client: "성진상사",      orderDate: "2026-03-07", item: "철근",   tons: 2.0,  unitPrice: 800_000,  status: TX_STATUS.PARTIAL },
  { id: "O010", client: "우리물산",      orderDate: "2026-03-06", item: "H빔",    tons: 1.5,  unitPrice: 950_000,  status: TX_STATUS.PAID },
  { id: "O011", client: "현대유통",      orderDate: "2026-03-05", item: "철판",   tons: 6.0,  unitPrice: 1_200_000, status: TX_STATUS.UNPAID },
  { id: "O012", client: "신한기업",      orderDate: "2026-03-04", item: "앵글",   tons: 0.5,  unitPrice: 700_000,  status: TX_STATUS.CANCEL },
  { id: "O013", client: "한국무역(주)",  orderDate: "2026-03-03", item: "철근",   tons: 10.0, unitPrice: 800_000,  status: TX_STATUS.PAID },
  { id: "O014", client: "대성산업",      orderDate: "2026-03-02", item: "H빔",    tons: 2.8,  unitPrice: 950_000,  status: TX_STATUS.UNPAID },
];

function calcTotal(tons: number, unitPrice: number): number {
  return Math.round(tons * unitPrice * 1.1);
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

const PAGE_SIZE = 10;

export function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const filtered = mockOrders.filter((o) => {
    const matchClient = o.client.includes(search);
    const matchDate = !dateFilter || o.orderDate === format(dateFilter, "yyyy-MM-dd");
    return matchClient && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() { setPage(1); }

  function handleEditOpen(order: Order) {
    setEditingOrder(order);
  }

  function handleEditClose() {
    setEditingOrder(null);
  }

  // Map mock Order to the shape EditOrderDialog expects
  const editOrderProps = editingOrder
    ? {
        id: editingOrder.id,
        clientId: "",
        date: editingOrder.orderDate,
        itemName: editingOrder.item,
        tonnage: editingOrder.tons,
        unitPrice: editingOrder.unitPrice,
        memo: editingOrder.memo,
      }
    : null;

  return (
    <main className='flex flex-col gap-6 p-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>매출 내역</h1>
        <CreateOrderDialog />
      </div>

      <EditOrderDialog order={editOrderProps} onClose={handleEditClose} />

      {/* Filters */}
      <div className='flex items-center gap-3'>
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); resetPage(); }}
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
            {paged.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={() => router.push(ROUTES.dashboard.orderDetail(order.id))}
              >
                <TableCell className='text-muted-foreground'>
                  {order.orderDate}
                </TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>{order.item}</TableCell>
                <TableCell className='text-left'>{order.tons}t</TableCell>
                <TableCell className='text-right'>
                  {formatAmount(calcTotal(order.tons, order.unitPrice))}
                </TableCell>
                <TableCell className='flex justify-center'>
                  <Badge variant={statusVariant[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {order.status === TX_STATUS.UNPAID && (
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
                      >
                        취소
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className='cursor-pointer'
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={page === totalPages}
                className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
}
