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

const summaryCards = [
  { label: "이번 달 총 매출", amount: 12_500_000 },
  { label: "이번 달 입금액", amount: 8_200_000 },
  { label: "이번 달 미정산액", amount: 4_300_000 },
];

const recentTransactions = [
  { date: "2026-03-17", client: "ABC주식회사", type: "매출", amount: 3_500_000, status: "입금완료" },
  { date: "2026-03-15", client: "DEF산업", type: "매출", amount: 2_200_000, status: "미정산" },
  { date: "2026-03-12", client: "GHI상사", type: "매출", amount: 1_800_000, status: "입금완료" },
  { date: "2026-03-10", client: "JKL코퍼레이션", type: "환불", amount: -500_000, status: "처리완료" },
  { date: "2026-03-08", client: "MNO파트너스", type: "매출", amount: 4_800_000, status: "미정산" },
];

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  입금완료: "default",
  미정산: "secondary",
  처리완료: "outline",
};

function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function DashboardPage() {
  return (
    <main className="flex flex-col gap-8 p-8">
      {/* Summary Cards */}
      <section className="grid grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatAmount(card.amount)}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Transactions */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">최신 거래 내역</h2>
          <Button variant="outline" size="sm">
            전체보기
          </Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>거래처</TableHead>
                <TableHead>구분</TableHead>
                <TableHead className="text-right">금액</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx, i) => (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                  <TableCell>{tx.client}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell className="text-right">{formatAmount(tx.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[tx.status] ?? "outline"}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </main>
  );
}
