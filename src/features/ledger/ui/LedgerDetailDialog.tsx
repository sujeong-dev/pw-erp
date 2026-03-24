'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { apiClient } from '@/src/shared/api';
import { STATUS_DISPLAY, statusVariant } from '@/src/shared/constants';
import type { GlobalLedgerItem } from '../api';

type SaleOrder = {
  client: { name: string };
  date: string;
  itemName: string;
  tonnage: number;
  unitPrice: number;
  totalPrice: number;
  status: 'UNPAID' | 'PAID' | 'PARTIAL' | 'CANCEL';
  memo: string | null;
};

type Props = {
  item: GlobalLedgerItem | null;
  onClose: () => void;
};

function useOrderDetail(id: string | null) {
  return useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => apiClient.get(`api/sales/${id}`).json<SaleOrder>(),
    enabled: !!id,
  });
}

export function LedgerDetailDialog({ item, onClose }: Props) {
  const { data: order, isLoading } = useOrderDetail(item?.id ?? null);

  return (
    <Dialog open={!!item} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>주문 상세</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className='h-48 animate-pulse bg-muted rounded-xl' />
        ) : order ? (
          <dl className='flex flex-col gap-4 py-2 text-sm'>
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>거래처</dt>
              <dd className='font-medium'>{order.client.name}</dd>
            </div>
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>주문 날짜</dt>
              <dd className='font-medium'>{order.date}</dd>
            </div>
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>품목</dt>
              <dd className='font-medium'>{order.itemName}</dd>
            </div>
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>톤수</dt>
              <dd className='font-medium'>{order.tonnage}t</dd>
            </div>
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>단가</dt>
              <dd className='font-medium'>{order.unitPrice.toLocaleString('ko-KR')}원</dd>
            </div>
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>합계 금액</dt>
              <dd className='font-medium'>{order.totalPrice.toLocaleString('ko-KR')}원</dd>
            </div>
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>상태</dt>
              <dd>
                <Badge variant={statusVariant[STATUS_DISPLAY[order.status]]}>
                  {STATUS_DISPLAY[order.status]}
                </Badge>
              </dd>
            </div>
            {order.memo && (
              <div className='flex flex-col gap-1.5'>
                <dt className='text-muted-foreground'>메모</dt>
                <dd className='font-medium whitespace-pre-wrap'>{order.memo}</dd>
              </div>
            )}
          </dl>
        ) : null}
        <DialogFooter>
          <Button variant='outline' onClick={onClose} className='cursor-pointer'>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
