"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { Download, ChevronRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ROUTES } from "@/src/shared/config";
import { TX_STATUS, TX_TYPE, CREDIT_TYPE, statusVariant } from "@/src/shared/constants";
import type { TxStatus, TxType, CreditType } from "@/src/shared/constants";
import { DateFilter, SelectFilter } from "@/src/shared/ui";
import { useClientSummary } from "@/src/features/clients";

type Transaction = {
  date: string;
  type: TxType;
  amount: number;
  status: TxStatus | null;
  creditType?: CreditType;
  // SALES 행 전용
  client?: string;
  item?: string;
  tons?: number;
  unitPrice?: number;
  memo?: string;
};

const mockTransactions: Transaction[] = [
  { date: "2026-03-15", type: TX_TYPE.SALES,   amount: 1_200_000, status: TX_STATUS.UNPAID,  client: "한국무역(주)", item: "철근",  tons: 5.0, unitPrice: 218_182, memo: "긴급 납품 요청" },
  { date: "2026-03-12", type: TX_TYPE.PAYMENT, amount: 800_000,   status: null, creditType: CREDIT_TYPE.DEPOSIT },
  { date: "2026-03-10", type: TX_TYPE.SALES,   amount: 950_000,   status: TX_STATUS.PARTIAL, client: "한국무역(주)", item: "H빔",   tons: 3.0, unitPrice: 288_000 },
  { date: "2026-03-08", type: TX_TYPE.PAYMENT, amount: 500_000,   status: null, creditType: CREDIT_TYPE.REFUND },
  { date: "2026-03-05", type: TX_TYPE.SALES,   amount: 620_000,   status: TX_STATUS.PAID,    client: "한국무역(주)", item: "앵글",  tons: 2.0, unitPrice: 281_818 },
  { date: "2026-03-01", type: TX_TYPE.PAYMENT, amount: 1_000_000, status: null, creditType: CREDIT_TYPE.DEPOSIT },
  { date: "2026-02-25", type: TX_TYPE.SALES,   amount: 780_000,   status: TX_STATUS.UNPAID,  client: "한국무역(주)", item: "철판",  tons: 2.5, unitPrice: 283_636, memo: "규격 확인 필요" },
  { date: "2026-02-20", type: TX_TYPE.PAYMENT, amount: 600_000,   status: null, creditType: CREDIT_TYPE.DEPOSIT },
  { date: "2026-02-15", type: TX_TYPE.SALES,   amount: 430_000,   status: TX_STATUS.CANCEL,  client: "한국무역(주)", item: "철근",  tons: 1.5, unitPrice: 260_606 },
  { date: "2026-02-10", type: TX_TYPE.PAYMENT, amount: 1_200_000, status: null, creditType: CREDIT_TYPE.REFUND },
  { date: "2026-02-05", type: TX_TYPE.SALES,   amount: 890_000,   status: TX_STATUS.PAID,    client: "한국무역(주)", item: "H빔",   tons: 3.0, unitPrice: 269_697 },
  { date: "2026-01-28", type: TX_TYPE.PAYMENT, amount: 700_000,   status: null, creditType: CREDIT_TYPE.DEPOSIT },
];

function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

const PAGE_SIZE = 10;

export function ClientDetailPage({ id }: { id: string }) {
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<"all" | TxType>("all");
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);

  const { data: summary, isLoading: summaryLoading } = useClientSummary(id);

  const filtered = mockTransactions.filter((tx) => {
    const matchDate = !date || tx.date === format(date, "yyyy-MM-dd");
    const matchType = typeFilter === "all" || tx.type === typeFilter;
    return matchDate && matchType;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="flex flex-col gap-6 p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href={ROUTES.dashboard.clients} className="hover:text-foreground transition-colors">
          거래처 관리
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium">{id}</span>
      </nav>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 주문액</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading
              ? <div className="h-8 w-32 rounded bg-muted animate-pulse" />
              : <p className="text-2xl font-bold">{summary?.totalSaleAmount.toLocaleString("ko-KR")}원</p>
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 입금액</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading
              ? <div className="h-8 w-32 rounded bg-muted animate-pulse" />
              : <p className="text-2xl font-bold">{summary?.totalPaymentAmount.toLocaleString("ko-KR")}원</p>
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">미수금 잔액</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading
              ? <div className="h-8 w-32 rounded bg-muted animate-pulse" />
              : <p className="text-2xl font-bold text-destructive">{summary?.totalBalance.toLocaleString("ko-KR")}원</p>
            }
          </CardContent>
        </Card>
      </div>

      {/* Transaction Ledger */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">거래내역 원장</h2>
          <Button variant="default" className="cursor-pointer">
            <Download className="size-4" />
            엑셀 다운로드
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <DateFilter
            value={date}
            onChange={(d) => { setDate(d); setPage(1); }}
            placeholder="거래 일자"
          />
          <SelectFilter
            value={typeFilter}
            onChange={(v) => { setTypeFilter(v as "all" | TxType); setPage(1); }}
            options={[
              { value: "all", label: "구분 전체" },
              { value: TX_TYPE.SALES, label: TX_TYPE.SALES },
              { value: TX_TYPE.PAYMENT, label: TX_TYPE.PAYMENT },
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
                <TableHead className="text-right">금액</TableHead>
                <TableHead className='text-center'>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((tx, i) => (
                <TableRow
                  key={i}
                  className={tx.type === TX_TYPE.SALES ? "cursor-pointer" : undefined}
                  onClick={() => tx.type === TX_TYPE.SALES && setDetailTx(tx)}
                >
                  <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center justify-end gap-1">
                      {tx.type === TX_TYPE.PAYMENT && tx.creditType === CREDIT_TYPE.DEPOSIT && (
                        <Plus className="size-3 text-primary" />
                      )}
                      {tx.type === TX_TYPE.PAYMENT && tx.creditType === CREDIT_TYPE.REFUND && (
                        <Minus className="size-3 text-destructive" />
                      )}
                      {formatAmount(tx.amount)}
                    </span>
                  </TableCell>
                  <TableCell className='flex justify-center'>
                    {tx.type === TX_TYPE.SALES && tx.status ? (
                      <Badge variant={statusVariant[tx.status]}>{tx.status}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
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
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* SALES 상세 Dialog */}
      <Dialog open={!!detailTx} onOpenChange={(v) => !v && setDetailTx(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문 상세</DialogTitle>
          </DialogHeader>
          {detailTx && (
            <dl className="flex flex-col gap-4 py-2 text-sm">
              <div className="flex flex-col gap-1.5">
                <dt className="text-muted-foreground">거래처</dt>
                <dd className="font-medium">{detailTx.client}</dd>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="text-muted-foreground">주문 날짜</dt>
                <dd className="font-medium">{detailTx.date}</dd>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="text-muted-foreground">품목</dt>
                <dd className="font-medium">{detailTx.item}</dd>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="text-muted-foreground">톤수</dt>
                <dd className="font-medium">{detailTx.tons}t</dd>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="text-muted-foreground">단가</dt>
                <dd className="font-medium">{detailTx.unitPrice?.toLocaleString("ko-KR")}원</dd>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="text-muted-foreground">합계 금액</dt>
                <dd className="font-medium">{detailTx.amount.toLocaleString("ko-KR")}원</dd>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="text-muted-foreground">상태</dt>
                <dd>
                  {detailTx.status && (
                    <Badge variant={statusVariant[detailTx.status]}>{detailTx.status}</Badge>
                  )}
                </dd>
              </div>
              {detailTx.memo && (
                <div className="flex flex-col gap-1.5">
                  <dt className="text-muted-foreground">메모</dt>
                  <dd className="font-medium whitespace-pre-wrap">{detailTx.memo}</dd>
                </div>
              )}
            </dl>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailTx(null)} className="cursor-pointer">
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
