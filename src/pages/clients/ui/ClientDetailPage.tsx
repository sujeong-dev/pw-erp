"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type ClientDetail = {
  name: string;
  ceo: string;
  contact: string;
  totalOrders: number;
  totalPayments: number;
  unpaidBalance: number;
};

type Transaction = {
  date: string;
  type: "주문" | "입금";
  amount: number;
  note: string;
  status: "상승" | "정상" | "주의";
  balance: number;
};

const mockClientDetails: Record<string, ClientDetail> = {
  C001: { name: "한국무역(주)", ceo: "김철수", contact: "02-1234-5678", totalOrders: 12500000, totalPayments: 11000000, unpaidBalance: 1500000 },
  C002: { name: "대성산업", ceo: "이영희", contact: "031-234-5678", totalOrders: 8200000, totalPayments: 8200000, unpaidBalance: 0 },
  C003: { name: "서울전자(주)", ceo: "박민준", contact: "02-9876-5432", totalOrders: 5400000, totalPayments: 5080000, unpaidBalance: 320000 },
  C004: { name: "미래물산", ceo: "최지원", contact: "051-345-6789", totalOrders: 6700000, totalPayments: 5830000, unpaidBalance: 870000 },
  C005: { name: "동아상사", ceo: "정수진", contact: "032-456-7890", totalOrders: 3100000, totalPayments: 3100000, unpaidBalance: 0 },
};

const mockTransactions: Transaction[] = [
  { date: "2026-03-15", type: "주문", amount: 1200000, note: "3월 정기 주문", status: "정상", balance: 1500000 },
  { date: "2026-03-12", type: "입금", amount: 800000, note: "2월분 입금", status: "정상", balance: 300000 },
  { date: "2026-03-10", type: "주문", amount: 950000, note: "긴급 추가 주문", status: "상승", balance: 1100000 },
  { date: "2026-03-08", type: "입금", amount: 500000, note: "부분 입금", status: "주의", balance: 150000 },
  { date: "2026-03-05", type: "주문", amount: 620000, note: "2월 말 주문", status: "정상", balance: 650000 },
  { date: "2026-03-01", type: "입금", amount: 1000000, note: "1월분 정산", status: "정상", balance: 30000 },
  { date: "2026-02-25", type: "주문", amount: 780000, note: "정기 주문", status: "정상", balance: 1030000 },
  { date: "2026-02-20", type: "입금", amount: 600000, note: "부분 결제", status: "주의", balance: 250000 },
  { date: "2026-02-15", type: "주문", amount: 430000, note: "샘플 주문", status: "상승", balance: 850000 },
  { date: "2026-02-10", type: "입금", amount: 1200000, note: "1월 전액 정산", status: "정상", balance: 420000 },
  { date: "2026-02-05", type: "주문", amount: 890000, note: "1월 정기 주문", status: "정상", balance: 1620000 },
  { date: "2026-01-28", type: "입금", amount: 700000, note: "12월분 입금", status: "정상", balance: 730000 },
];

const PAGE_SIZE = 10;

const statusBadgeVariant: Record<Transaction["status"], "default" | "secondary" | "destructive"> = {
  상승: "default",
  정상: "secondary",
  주의: "destructive",
};

export function ClientDetailPage({ id }: { id: string }) {
  const [page, setPage] = useState(1);
  const client = mockClientDetails[id] ?? mockClientDetails["C001"];
  const totalPages = Math.ceil(mockTransactions.length / PAGE_SIZE);
  const paged = mockTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="flex flex-col gap-6 p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href={ROUTES.dashboard.clients} className="hover:text-foreground transition-colors">
          거래처 관리
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium">거래처 상세 ({client.name})</span>
      </nav>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 주문액</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{client.totalOrders.toLocaleString("ko-KR")}원</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 입금액</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{client.totalPayments.toLocaleString("ko-KR")}원</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">미수금 잔액</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{client.unpaidBalance.toLocaleString("ko-KR")}원</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">거래처 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">거래처명</dt>
              <dd className="font-medium">{client.name}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">대표자</dt>
              <dd className="font-medium">{client.ceo}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">연락처</dt>
              <dd className="font-medium">{client.contact}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Transaction Ledger */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">거래내역 원장</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="cursor-pointer">
              <Download className="size-4" />
              엑셀 다운로드
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>거래일자</TableHead>
              <TableHead>구분</TableHead>
              <TableHead className="text-right">금액</TableHead>
              <TableHead>적요</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">잔액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((tx, i) => (
              <TableRow key={i}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell className="text-right">{tx.amount.toLocaleString("ko-KR")}원</TableCell>
                <TableCell className="text-muted-foreground">{tx.note}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[tx.status]}>{tx.status}</Badge>
                </TableCell>
                <TableCell className="text-right">{tx.balance.toLocaleString("ko-KR")}원</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
    </main>
  );
}
