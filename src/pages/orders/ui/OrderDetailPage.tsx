"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/src/shared/config";
import { useOrder, OrderDetail } from "@/src/features/orders";

export function OrderDetailPage({ id }: { id: string }) {
  const { data: order, isLoading } = useOrder(id);

  return (
    <main className='flex flex-col gap-6 p-8'>
      {isLoading ? (
        <Card>
          <CardContent className='h-64 animate-pulse bg-muted rounded-xl' />
        </Card>
      ) : order ? (
        <OrderDetail order={order} />
      ) : null}

      <div>
        <Button variant='default' asChild>
          <Link href={ROUTES.dashboard.orders}>목록으로가기</Link>
        </Button>
      </div>
    </main>
  );
}
