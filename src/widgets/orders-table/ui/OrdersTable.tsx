"use client";

import { useRouter } from "next/navigation";
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
  statusVariant,
  STATUS_DISPLAY
} from '@/src/shared/constants';
import { ROUTES } from "@/src/shared/config";
import type { Order } from "@/src/features/orders";

type Props = {
  items: Order[];
  isLoading: boolean;
  onEditOpen: (order: Order) => void;
  onRefundRequest: (order: Order) => void;
};

export function OrdersTable({ items, isLoading, onEditOpen, onRefundRequest }: Props) {
  const router = useRouter();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>코드</TableHead>
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
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className='text-center text-muted-foreground py-8'
              >
                불러오는 중...
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className='text-center text-muted-foreground py-8'
              >
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            items.map((order) => (
              <TableRow
                key={order.id}
                className='cursor-pointer'
                onClick={() =>
                  router.push(ROUTES.dashboard.orderDetail(order.id))
                }
              >
                <TableCell className='text-muted-foreground'>
                  {order.code}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {order.date}
                </TableCell>
                <TableCell>{order.client.name}</TableCell>
                <TableCell>{order.itemName}</TableCell>
                <TableCell className='text-left'>{order.tonnage}t</TableCell>
                <TableCell className='text-right'>
                  {order.totalPrice.toLocaleString('ko-KR')}원
                </TableCell>
                <TableCell className='flex justify-center'>
                  <Badge variant={statusVariant[STATUS_DISPLAY[order.status]]}>
                    {STATUS_DISPLAY[order.status]}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className='flex items-center gap-2'>
                    {order.status === 'UNPAID' && (
                      <Button
                        variant='secondary'
                        size='sm'
                        className='cursor-pointer'
                        onClick={() => onEditOpen(order)}
                      >
                        수정
                      </Button>
                    )}
                    {order.isRefundable && (
                      <Button
                        variant='destructive'
                        size='sm'
                        className='cursor-pointer'
                        onClick={() => onRefundRequest(order)}
                      >
                        취소
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
