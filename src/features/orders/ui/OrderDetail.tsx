import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_DISPLAY, statusVariant } from "@/src/shared/constants";
import type { Order } from "../api";

export function OrderDetail({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>주문 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className='grid grid-cols-2 gap-4 text-sm'>
          <div className='flex flex-col gap-1'>
            <dt className='text-muted-foreground'>거래처</dt>
            <dd className='font-medium'>{order.client.name}</dd>
          </div>
          <div className='flex flex-col gap-1'>
            <dt className='text-muted-foreground'>주문 날짜</dt>
            <dd className='font-medium'>{order.date}</dd>
          </div>
          <div className='flex flex-col gap-1'>
            <dt className='text-muted-foreground'>품목</dt>
            <dd className='font-medium'>{order.itemName}</dd>
          </div>
          <div className='flex flex-col gap-1'>
            <dt className='text-muted-foreground'>톤수</dt>
            <dd className='font-medium'>{order.tonnage}t</dd>
          </div>
          <div className='flex flex-col gap-1'>
            <dt className='text-muted-foreground'>단가</dt>
            <dd className='font-medium'>
              {order.unitPrice.toLocaleString('ko-KR')}원
            </dd>
          </div>
          <div className='flex flex-col gap-1'>
            <dt className='text-muted-foreground'>합계 금액 (VAT 10% 포함)</dt>
            <dd className='font-medium'>
              {order.totalPrice.toLocaleString('ko-KR')}원
            </dd>
          </div>
          <div className='flex flex-col gap-1'>
            <dt className='text-muted-foreground'>상태</dt>
            <dd>
              <Badge variant={statusVariant[STATUS_DISPLAY[order.status]]}>
                {STATUS_DISPLAY[order.status]}
              </Badge>
            </dd>
          </div>
          {order.memo && (
            <div className='flex flex-col gap-1 col-span-2'>
              <dt className='text-muted-foreground'>메모</dt>
              <dd className='font-medium whitespace-pre-wrap'>{order.memo}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
