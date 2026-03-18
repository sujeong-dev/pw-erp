"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { TX_STATUS, statusVariant } from "@/src/shared/constants";
import type { TxStatus } from "@/src/shared/constants";
import { DateFilter, SearchInput, SelectFilter } from "@/src/shared/ui";

type TxType = "매출" | "수금";

const summaryCards = [
  { label: "총 매출액", amount: 42_800_000, red: false },
  { label: "총 입금액", amount: 35_200_000, red: false },
  { label: "총 미수금 잔액", amount: 7_600_000, red: true },
];

const transactions: { date: string; client: string; type: TxType; amount: number; status: TxStatus | null }[] = [
  { date: "2026-03-17", client: "한국무역(주)", type: "매출", amount: 3_500_000, status: TX_STATUS.UNPAID },
  { date: "2026-03-15", client: "대성산업",     type: "수금", amount: 2_200_000, status: null },
  { date: "2026-03-14", client: "서울전자(주)", type: "매출", amount: 1_800_000, status: TX_STATUS.PAID },
  { date: "2026-03-12", client: "미래물산",     type: "매출", amount: 950_000,   status: TX_STATUS.PARTIAL },
  { date: "2026-03-11", client: "동아상사",     type: "수금", amount: 1_200_000, status: null },
  { date: "2026-03-10", client: "태양무역",     type: "매출", amount: 4_800_000, status: TX_STATUS.CANCEL },
  { date: "2026-03-09", client: "국제기업(주)", type: "매출", amount: 680_000,   status: TX_STATUS.PAID },
  { date: "2026-03-08", client: "한빛산업",     type: "수금", amount: 2_750_000, status: null },
  { date: "2026-03-07", client: "성진상사",     type: "매출", amount: 1_300_000, status: TX_STATUS.UNPAID },
  { date: "2026-03-06", client: "우리물산",     type: "매출", amount: 900_000,   status: TX_STATUS.PARTIAL },
  { date: "2026-03-05", client: "현대유통",     type: "수금", amount: 3_200_000, status: null },
  { date: "2026-03-04", client: "신한기업",     type: "매출", amount: 560_000,   status: TX_STATUS.PAID },
];


function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

const PAGE_SIZE = 10;

export function DashboardPage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<"all" | TxType>("all");
  const [page, setPage] = useState(1);

  const filtered = transactions.filter((tx) => {
    const matchClient = tx.client.includes(search);
    const matchDate = !date || tx.date === format(date, "yyyy-MM-dd");
    const matchType = typeFilter === "all" || tx.type === typeFilter;
    return matchClient && matchDate && matchType;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  return (
    <main className='flex flex-col gap-8 p-8'>
      {/* Summary Cards */}
      <section className='grid grid-cols-3 gap-4'>
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  'text-2xl font-bold',
                  card.red && 'text-destructive',
                )}
              >
                {formatAmount(card.amount)}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Transaction Table */}
      <section className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>거래 내역</h2>
          <Button variant='default' size='lg' className='cursor-pointer'>
            <Download className='size-4' />
            엑셀 다운로드
          </Button>
        </div>

        {/* Filters */}
        <div className='flex items-center gap-3'>
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); resetPage(); }}
            placeholder="거래처명 검색"
            className="w-56"
          />

          <DateFilter
            value={date}
            onChange={(d) => { setDate(d); resetPage(); }}
            placeholder="거래일자"
          />

          <SelectFilter
            value={typeFilter}
            onChange={(v) => { setTypeFilter(v as typeof typeFilter); resetPage(); }}
            options={[
              { value: "all", label: "구분 전체" },
              { value: "매출", label: "매출" },
              { value: "수금", label: "수금" },
            ]}
            className="w-32"
          />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>거래 일자</TableHead>
                <TableHead>구분</TableHead>
                <TableHead>거래처명</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((tx, i) => (
                <TableRow key={i}>
                  <TableCell className='text-muted-foreground'>
                    {tx.date}
                  </TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>{tx.client}</TableCell>
                  <TableCell className='text-left'>
                    {formatAmount(tx.amount)}
                  </TableCell>
                  <TableCell>
                    {tx.status ? (
                      <Badge variant={statusVariant[tx.status]}>
                        {tx.status}
                      </Badge>
                    ) : (
                      <span className='text-muted-foreground'>-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

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
      </section>
    </main>
  );
}
