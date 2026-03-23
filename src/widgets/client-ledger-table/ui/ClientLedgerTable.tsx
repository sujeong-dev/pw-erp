'use client';

import { Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STATUS_DISPLAY, statusVariant } from '@/src/shared/constants';
import type { LedgerItem } from '@/src/features/clients';

type Props = {
  items: LedgerItem[];
  isLoading: boolean;
  onRowClick: (item: LedgerItem) => void;
};

export function ClientLedgerTable({ items, isLoading, onRowClick }: Props) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>구분</TableHead>
            <TableHead>거래 일자</TableHead>
            <TableHead>매출 코드</TableHead>
            <TableHead className='text-right'>금액</TableHead>
            <TableHead className='text-center'>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className='h-4 w-16 rounded bg-muted animate-pulse' /></TableCell>
                <TableCell><div className='h-4 w-24 rounded bg-muted animate-pulse' /></TableCell>
                <TableCell><div className='h-4 w-28 rounded bg-muted animate-pulse' /></TableCell>
                <TableCell className='text-right'><div className='h-4 w-24 rounded bg-muted animate-pulse ml-auto' /></TableCell>
                <TableCell><div className='h-4 w-16 rounded bg-muted animate-pulse mx-auto' /></TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center text-muted-foreground py-8'>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                className={item.type === 'SALES' ? 'cursor-pointer' : undefined}
                onClick={() => item.type === 'SALES' && onRowClick(item)}
              >
                <TableCell>{item.type === 'SALES' ? '매출' : '수금'}</TableCell>
                <TableCell className='text-muted-foreground'>
                  {new Date(item.date).toLocaleDateString('ko-KR')}
                </TableCell>
                <TableCell>{item.code ?? '-'}</TableCell>
                <TableCell className='text-right'>
                  <span className='inline-flex items-center justify-end gap-1'>
                    {item.type === 'PAYMENT' && item.creditType === 'DEPOSIT' && (
                      <Plus className='size-3 text-primary' />
                    )}
                    {item.type === 'PAYMENT' && item.creditType === 'REFUND' && (
                      <Minus className='size-3 text-destructive' />
                    )}
                    {item.type === 'SALES'
                      ? `${(item.debit ?? 0).toLocaleString('ko-KR')}원`
                      : `${(item.credit ?? 0).toLocaleString('ko-KR')}원`}
                  </span>
                </TableCell>
                <TableCell className='flex justify-center'>
                  {item.type === 'SALES' && item.status ? (
                    <Badge variant={statusVariant[STATUS_DISPLAY[item.status]]}>
                      {STATUS_DISPLAY[item.status]}
                    </Badge>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
