"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import type { TxStatus } from "@/src/shared/constants";
import { DateFilter, SearchInput } from "@/src/shared/ui";

const mockClients = [
  "한국무역(주)", "대성산업", "서울전자(주)", "미래물산", "동아상사",
  "태양무역", "국제기업(주)", "한빛산업", "성진상사", "우리물산",
  "현대유통", "신한기업",
];

type Order = {
  id: string;
  client: string;
  orderDate: string;
  item: string;
  tons: number;
  unitPrice: number;
  status: TxStatus;
};

const mockOrders: Order[] = [
  { id: "O001", client: "한국무역(주)",  orderDate: "2026-03-17", item: "철근",   tons: 5.0,  unitPrice: 800_000,  status: TX_STATUS.UNPAID },
  { id: "O002", client: "대성산업",      orderDate: "2026-03-15", item: "H빔",    tons: 3.2,  unitPrice: 950_000,  status: TX_STATUS.PAID },
  { id: "O003", client: "서울전자(주)",  orderDate: "2026-03-14", item: "철판",   tons: 1.8,  unitPrice: 1_200_000, status: TX_STATUS.PARTIAL },
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

const emptyForm = { client: "", orderDate: undefined as Date | undefined, item: "", tons: "", unitPrice: "", memo: "" };

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);
  const [formDateOpen, setFormDateOpen] = useState(false);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [editFormDate, setEditFormDate] = useState<Date | undefined>(undefined);
  const [editFormDateOpen, setEditFormDateOpen] = useState(false);

  const filtered = mockOrders.filter((o) => {
    const matchClient = o.client.includes(search);
    const matchDate = !dateFilter || o.orderDate === format(dateFilter, "yyyy-MM-dd");
    return matchClient && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() { setPage(1); }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) {
      setForm({ ...emptyForm });
      setFormDate(undefined);
    }
  }

  function handleEditOpen(order: Order) {
    setEditingOrder(order);
    setEditForm({ client: order.client, item: order.item, tons: String(order.tons), unitPrice: String(order.unitPrice), orderDate: undefined, memo: "" });
    setEditFormDate(new Date(order.orderDate));
  }

  function handleEditClose() {
    setEditingOrder(null);
    setEditForm({ ...emptyForm });
    setEditFormDate(undefined);
  }

  const tons = parseFloat(form.tons) || 0;
  const unitPrice = parseFloat(form.unitPrice) || 0;
  const totalAmount = tons > 0 && unitPrice > 0 ? calcTotal(tons, unitPrice) : null;

  const editTons = parseFloat(editForm.tons) || 0;
  const editUnitPrice = parseFloat(editForm.unitPrice) || 0;
  const editTotalAmount = editTons > 0 && editUnitPrice > 0 ? calcTotal(editTons, editUnitPrice) : null;

  return (
    <main className='flex flex-col gap-6 p-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>매출 내역</h1>
        <Button onClick={() => setOpen(true)} className='cursor-pointer'>
          <Plus className='size-4' />
          주문 등록
        </Button>
      </div>

      {/* Register Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문 등록</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-4 py-2'>
            <div className='flex flex-col gap-1.5'>
              <Label>거래처</Label>
              <Select
                value={form.client}
                onValueChange={(v) => setForm((f) => ({ ...f, client: v }))}
              >
                <SelectTrigger className='cursor-pointer'>
                  <SelectValue placeholder='거래처 선택' />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label>주문 날짜</Label>
              <Popover open={formDateOpen} onOpenChange={setFormDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='justify-start gap-2 cursor-pointer'
                  >
                    <CalendarIcon className='size-4' />
                    {formDate ? format(formDate, 'yyyy-MM-dd') : '날짜 선택'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={formDate}
                    onSelect={(d) => {
                      setFormDate(d);
                      setFormDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='order-item'>품목</Label>
              <Input
                id='order-item'
                placeholder='품목 입력'
                value={form.item}
                onChange={(e) =>
                  setForm((f) => ({ ...f, item: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='order-tons'>톤수</Label>
              <Input
                id='order-tons'
                type='number'
                placeholder='톤수 입력'
                value={form.tons}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tons: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='order-unit-price'>단가</Label>
              <Input
                id='order-unit-price'
                type='number'
                placeholder='단가 입력'
                value={form.unitPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, unitPrice: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='order-memo'>메모</Label>
              <Textarea
                id='order-memo'
                placeholder='메모 입력'
                value={form.memo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, memo: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label>합계 금액 (VAT 10% 포함)</Label>
              <div className='flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground'>
                {totalAmount !== null ? formatAmount(totalAmount) : '-'}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => handleOpenChange(false)}
              className='cursor-pointer'
            >
              취소
            </Button>
            <Button
              onClick={() => handleOpenChange(false)}
              className='cursor-pointer'
            >
              등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editingOrder !== null}
        onOpenChange={(v) => {
          if (!v) handleEditClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문 수정</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-4 py-2'>
            <div className='flex flex-col gap-1.5'>
              <Label>거래처</Label>
              <Select
                value={editForm.client}
                onValueChange={(v) => setEditForm((f) => ({ ...f, client: v }))}
              >
                <SelectTrigger className='cursor-pointer'>
                  <SelectValue placeholder='거래처 선택' />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label>주문 날짜</Label>
              <Popover
                open={editFormDateOpen}
                onOpenChange={setEditFormDateOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='justify-start gap-2 cursor-pointer'
                  >
                    <CalendarIcon className='size-4' />
                    {editFormDate
                      ? format(editFormDate, 'yyyy-MM-dd')
                      : '날짜 선택'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={editFormDate}
                    onSelect={(d) => {
                      setEditFormDate(d);
                      setEditFormDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='edit-item'>품목</Label>
              <Input
                id='edit-item'
                placeholder='품목 입력'
                value={editForm.item}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, item: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='edit-tons'>톤수</Label>
              <Input
                id='edit-tons'
                type='number'
                placeholder='톤수 입력'
                value={editForm.tons}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, tons: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='edit-unit-price'>단가</Label>
              <Input
                id='edit-unit-price'
                type='number'
                placeholder='단가 입력'
                value={editForm.unitPrice}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, unitPrice: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='edit-memo'>메모</Label>
              <Textarea
                id='edit-memo'
                placeholder='메모 입력'
                value={editForm.memo}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, memo: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label>합계 금액 (VAT 10% 포함)</Label>
              <div className='flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground'>
                {editTotalAmount !== null ? formatAmount(editTotalAmount) : '-'}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={handleEditClose}
              className='cursor-pointer'
            >
              취소
            </Button>
            <Button onClick={handleEditClose} className='cursor-pointer'>
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className='flex items-center gap-3'>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            resetPage();
          }}
          placeholder='거래처 검색'
          className='w-56'
        />

        <DateFilter
          value={dateFilter}
          onChange={(d) => {
            setDateFilter(d);
            resetPage();
          }}
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
              <TableHead className='text-left'>합계 금액</TableHead>
              <TableHead>상태</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='text-muted-foreground'>
                  {order.orderDate}
                </TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>{order.item}</TableCell>
                <TableCell className='text-left'>{order.tons}t</TableCell>
                <TableCell className='text-left'>
                  {formatAmount(calcTotal(order.tons, order.unitPrice))}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.status === TX_STATUS.UNPAID && (
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
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
                className={
                  page === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
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
                className={
                  page === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
}
