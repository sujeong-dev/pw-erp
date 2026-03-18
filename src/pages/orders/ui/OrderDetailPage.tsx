"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/src/shared/config";
import { TX_STATUS, statusVariant } from "@/src/shared/constants";
import type { TxStatus } from "@/src/shared/constants";

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
  { id: "O001", client: "한국무역(주)",  orderDate: "2026-03-17", item: "철근",   tons: 5.0,  unitPrice: 800_000,   status: TX_STATUS.UNPAID,   memo: "긴급 납품 요청" },
  { id: "O002", client: "대성산업",      orderDate: "2026-03-15", item: "H빔",    tons: 3.2,  unitPrice: 950_000,   status: TX_STATUS.PAID },
  { id: "O003", client: "서울전자(주)",  orderDate: "2026-03-14", item: "철판",   tons: 1.8,  unitPrice: 1_200_000, status: TX_STATUS.PARTIAL,  memo: "부분 납품 완료, 잔여분 3월 말 납품 예정" },
  { id: "O004", client: "미래물산",      orderDate: "2026-03-12", item: "앵글",   tons: 2.5,  unitPrice: 700_000,   status: TX_STATUS.UNPAID },
  { id: "O005", client: "동아상사",      orderDate: "2026-03-11", item: "철근",   tons: 8.0,  unitPrice: 800_000,   status: TX_STATUS.CANCEL },
  { id: "O006", client: "태양무역",      orderDate: "2026-03-10", item: "H빔",    tons: 4.5,  unitPrice: 950_000,   status: TX_STATUS.PAID },
  { id: "O007", client: "국제기업(주)",  orderDate: "2026-03-09", item: "철판",   tons: 0.8,  unitPrice: 1_200_000, status: TX_STATUS.PAID },
  { id: "O008", client: "한빛산업",      orderDate: "2026-03-08", item: "앵글",   tons: 3.0,  unitPrice: 700_000,   status: TX_STATUS.UNPAID },
  { id: "O009", client: "성진상사",      orderDate: "2026-03-07", item: "철근",   tons: 2.0,  unitPrice: 800_000,   status: TX_STATUS.PARTIAL },
  { id: "O010", client: "우리물산",      orderDate: "2026-03-06", item: "H빔",    tons: 1.5,  unitPrice: 950_000,   status: TX_STATUS.PAID },
  { id: "O011", client: "현대유통",      orderDate: "2026-03-05", item: "철판",   tons: 6.0,  unitPrice: 1_200_000, status: TX_STATUS.UNPAID },
  { id: "O012", client: "신한기업",      orderDate: "2026-03-04", item: "앵글",   tons: 0.5,  unitPrice: 700_000,   status: TX_STATUS.CANCEL },
  { id: "O013", client: "한국무역(주)",  orderDate: "2026-03-03", item: "철근",   tons: 10.0, unitPrice: 800_000,   status: TX_STATUS.PAID },
  { id: "O014", client: "대성산업",      orderDate: "2026-03-02", item: "H빔",    tons: 2.8,  unitPrice: 950_000,   status: TX_STATUS.UNPAID },
];

function calcTotal(tons: number, unitPrice: number): number {
  return Math.round(tons * unitPrice * 1.1);
}

export function OrderDetailPage({ id }: { id: string }) {
  const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];

  return (
    <main className="flex flex-col gap-6 p-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href={ROUTES.dashboard.orders} className="hover:text-foreground transition-colors">
          매출 내역
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium">주문 상세</span>
      </nav>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">주문 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">거래처</dt>
              <dd className="font-medium">{order.client}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">주문 날짜</dt>
              <dd className="font-medium">{order.orderDate}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">품목</dt>
              <dd className="font-medium">{order.item}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">톤수</dt>
              <dd className="font-medium">{order.tons}t</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">단가</dt>
              <dd className="font-medium">{order.unitPrice.toLocaleString("ko-KR")}원</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">합계 금액 (VAT 10% 포함)</dt>
              <dd className="font-medium">{calcTotal(order.tons, order.unitPrice).toLocaleString("ko-KR")}원</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">상태</dt>
              <dd>
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </dd>
            </div>
            {order.memo && (
              <div className="flex flex-col gap-1 col-span-2">
                <dt className="text-muted-foreground">메모</dt>
                <dd className="font-medium whitespace-pre-wrap">{order.memo}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </main>
  );
}
