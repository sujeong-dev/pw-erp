"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/src/shared/config";

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

type Payment = {
  id: string;
  client: string;
  creditType: CreditType;
  date: string;
  amount: number;
  method: PaymentMethod;
  memo?: string;
};

const mockPayments: Payment[] = [
  { id: "P001", client: "한국무역(주)", creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-17", amount: 4_400_000, method: PAYMENT_METHOD.CASH, memo: "3월 정기 수금" },
  { id: "P002", client: "대성산업",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-16", amount: 3_344_000, method: PAYMENT_METHOD.NOTE },
  { id: "P003", client: "서울전자(주)", creditType: CREDIT_TYPE.REFUND,  date: "2026-03-15", amount: 2_376_000, method: PAYMENT_METHOD.CASH, memo: "불량품 환불 처리" },
  { id: "P004", client: "미래물산",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-14", amount: 1_925_000, method: PAYMENT_METHOD.CASH },
  { id: "P005", client: "동아상사",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-13", amount: 7_040_000, method: PAYMENT_METHOD.NOTE },
  { id: "P006", client: "태양무역",     creditType: CREDIT_TYPE.REFUND,  date: "2026-03-12", amount: 4_702_500, method: PAYMENT_METHOD.CASH },
  { id: "P007", client: "국제기업(주)", creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-11", amount: 1_056_000, method: PAYMENT_METHOD.NOTE },
  { id: "P008", client: "한빛산업",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-10", amount: 2_310_000, method: PAYMENT_METHOD.CASH },
  { id: "P009", client: "성진상사",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-09", amount: 1_760_000, method: PAYMENT_METHOD.CASH },
  { id: "P010", client: "우리물산",     creditType: CREDIT_TYPE.REFUND,  date: "2026-03-08", amount: 1_567_500, method: PAYMENT_METHOD.NOTE, memo: "계약 취소에 따른 환불" },
  { id: "P011", client: "현대유통",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-07", amount: 7_920_000, method: PAYMENT_METHOD.NOTE },
  { id: "P012", client: "신한기업",     creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-06", amount: 385_000,   method: PAYMENT_METHOD.CASH },
  { id: "P013", client: "한국무역(주)", creditType: CREDIT_TYPE.DEPOSIT, date: "2026-03-05", amount: 8_800_000, method: PAYMENT_METHOD.NOTE },
  { id: "P014", client: "대성산업",     creditType: CREDIT_TYPE.REFUND,  date: "2026-03-04", amount: 2_926_000, method: PAYMENT_METHOD.CASH },
];

function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function PaymentDetailPage({ id }: { id: string }) {
  const payment = mockPayments.find((p) => p.id === id) ?? mockPayments[0];

  return (
    <main className="flex flex-col gap-6 p-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href={ROUTES.dashboard.payments} className="hover:text-foreground transition-colors">
          수금 내역
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium">수금 상세</span>
      </nav>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">수금 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">유형</dt>
              <dd>
                <Badge variant={creditTypeVariant[payment.creditType]}>
                  {payment.creditType}
                </Badge>
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">수금 일자</dt>
              <dd className="font-medium">{payment.date}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">거래처</dt>
              <dd className="font-medium">{payment.client}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">금액</dt>
              <dd className="font-medium">{formatAmount(payment.amount)}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">수금방법</dt>
              <dd className="font-medium">{payment.method}</dd>
            </div>
            {payment.memo && (
              <div className="flex flex-col gap-1 col-span-2">
                <dt className="text-muted-foreground">메모</dt>
                <dd className="font-medium whitespace-pre-wrap">{payment.memo}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </main>
  );
}
