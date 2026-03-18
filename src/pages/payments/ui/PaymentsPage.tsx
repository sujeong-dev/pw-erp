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
import { DateFilter, SearchInput, SelectFilter } from "@/src/shared/ui";

const CREDIT_TYPE = {
  DEPOSIT: "입금",
  REFUND: "환불",
} as const;
type CreditType = (typeof CREDIT_TYPE)[keyof typeof CREDIT_TYPE];

const PAYMENT_METHOD = {
  CASH: "현금",
  NOTE: "어음",
} as const;
type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

const creditTypeVariant: Record<CreditType, "secondary" | "outline"> = {
  [CREDIT_TYPE.DEPOSIT]: "secondary",
  [CREDIT_TYPE.REFUND]: "outline",
};

const mockClients = [
  "한국무역(주)", "대성산업", "서울전자(주)", "미래물산", "동아상사",
  "태양무역", "국제기업(주)", "한빛산업", "성진상사", "우리물산",
  "현대유통", "신한기업",
];

type Payment = {
  id: string;
  client: string;
  creditType: CreditType;
  date: string;
  amount: number;
  method: PaymentMethod;
};

const mockPayments: Payment[] = [
  { id: "P001", client: "한국무역(주)", creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-17", amount: 4_400_000, method: PAYMENT_METHOD.CASH },
  { id: "P002", client: "대성산업",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-16", amount: 3_344_000, method: PAYMENT_METHOD.NOTE },
  { id: "P003", client: "서울전자(주)", creditType: CREDIT_TYPE.REFUND,  date: "2026-03-15", amount: 2_376_000, method: PAYMENT_METHOD.CASH },
  { id: "P004", client: "미래물산",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-14", amount: 1_925_000, method: PAYMENT_METHOD.CASH },
  { id: "P005", client: "동아상사",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-13", amount: 7_040_000, method: PAYMENT_METHOD.NOTE },
  { id: "P006", client: "태양무역",     creditType: CREDIT_TYPE.REFUND,  date: "2026-03-12", amount: 4_702_500, method: PAYMENT_METHOD.CASH },
  { id: "P007", client: "국제기업(주)", creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-11", amount: 1_056_000, method: PAYMENT_METHOD.NOTE },
  { id: "P008", client: "한빛산업",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-10", amount: 2_310_000, method: PAYMENT_METHOD.CASH },
  { id: "P009", client: "성진상사",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-09", amount: 1_760_000, method: PAYMENT_METHOD.CASH },
  { id: "P010", client: "우리물산",     creditType: CREDIT_TYPE.REFUND,  date: "2026-03-08", amount: 1_567_500, method: PAYMENT_METHOD.NOTE },
  { id: "P011", client: "현대유통",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-07", amount: 7_920_000, method: PAYMENT_METHOD.NOTE },
  { id: "P012", client: "신한기업",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-06", amount: 385_000,   method: PAYMENT_METHOD.CASH },
  { id: "P013", client: "한국무역(주)", creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-05", amount: 8_800_000, method: PAYMENT_METHOD.NOTE },
  { id: "P014", client: "대성산업",     creditType: CREDIT_TYPE.REFUND,  date: "2026-03-04", amount: 2_926_000, method: PAYMENT_METHOD.CASH },
];

function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

const PAGE_SIZE = 10;

const emptyForm = {
  client: "",
  amount: "",
  method: "" as PaymentMethod | "",
  memo: "",
};

export function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [methodFilter, setMethodFilter] = useState<"all" | PaymentMethod>("all");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);
  const [formDateOpen, setFormDateOpen] = useState(false);

  const filtered = mockPayments.filter((p) => {
    const matchClient = p.client.includes(search);
    const matchDate = !dateFilter || p.date === format(dateFilter, "yyyy-MM-dd");
    const matchMethod = methodFilter === "all" || p.method === methodFilter;
    return matchClient && matchDate && matchMethod;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) {
      setForm({ ...emptyForm });
      setFormDate(undefined);
    }
  }

  return (
    <main className='flex flex-col gap-6 p-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>수금 내역</h1>
        <Button onClick={() => setOpen(true)} className='cursor-pointer'>
          <Plus className='size-4' />
          입금 등록
        </Button>
      </div>

      {/* Register Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>입금 등록</DialogTitle>
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
              <Label>수금 일자</Label>
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
              <Label htmlFor='payment-amount'>금액</Label>
              <Input
                id='payment-amount'
                type='number'
                placeholder='금액 입력'
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label>수금방법</Label>
              <Select
                value={form.method}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, method: v as PaymentMethod }))
                }
              >
                <SelectTrigger className='cursor-pointer'>
                  <SelectValue placeholder='수금방법 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PAYMENT_METHOD.CASH}>
                    {PAYMENT_METHOD.CASH}
                  </SelectItem>
                  <SelectItem value={PAYMENT_METHOD.NOTE}>
                    {PAYMENT_METHOD.NOTE}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='payment-memo'>메모</Label>
              <Textarea
                id='payment-memo'
                placeholder='메모 입력'
                value={form.memo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, memo: e.target.value }))
                }
              />
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
          placeholder='수금 일자'
        />
        <SelectFilter
          value={methodFilter}
          onChange={(v) => { setMethodFilter(v as "all" | PaymentMethod); resetPage(); }}
          options={[
            { value: "all", label: "방법 전체" },
            { value: PAYMENT_METHOD.CASH, label: PAYMENT_METHOD.CASH },
            { value: PAYMENT_METHOD.NOTE, label: PAYMENT_METHOD.NOTE },
          ]}
          className="w-36"
        />
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>유형</TableHead>
              <TableHead>수금 일자</TableHead>
              <TableHead>거래처</TableHead>
              <TableHead className='text-right'>금액</TableHead>
              <TableHead className='text-center'>방법</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className='flex justify-center'>
                  <Badge variant={creditTypeVariant[payment.creditType]}>
                    {payment.creditType}
                  </Badge>
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {payment.date}
                </TableCell>
                <TableCell>{payment.client}</TableCell>
                <TableCell className='text-right'>
                  {formatAmount(payment.amount)}
                </TableCell>
                <TableCell className='text-center'>{payment.method}</TableCell>
                <TableCell>
                  {payment.creditType === CREDIT_TYPE.DEPOSIT && (
                    <Button
                      variant='destructive'
                      size='sm'
                      className='cursor-pointer'
                    >
                      환불
                    </Button>
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
