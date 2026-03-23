'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Payment } from '@/src/features/payments';

const METHOD_DISPLAY: Record<'CASH' | 'NOTE', string> = {
  CASH: '현금',
  NOTE: '어음',
};

type Props = {
  items: Payment[];
  isLoading: boolean;
  onRowClick: (id: string) => void;
};

export function PaymentsTable({ items, isLoading, onRowClick }: Props) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>유형</TableHead>
            <TableHead>수금 일자</TableHead>
            <TableHead>거래처</TableHead>
            <TableHead className='text-right'>금액</TableHead>
            <TableHead className='text-center'>방법</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className='h-4 w-16 rounded bg-muted animate-pulse mx-auto' /></TableCell>
                <TableCell><div className='h-4 w-24 rounded bg-muted animate-pulse' /></TableCell>
                <TableCell><div className='h-4 w-28 rounded bg-muted animate-pulse' /></TableCell>
                <TableCell className='text-right'><div className='h-4 w-24 rounded bg-muted animate-pulse ml-auto' /></TableCell>
                <TableCell><div className='h-4 w-12 rounded bg-muted animate-pulse mx-auto' /></TableCell>
                <TableCell />
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center text-muted-foreground py-8'>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                className='cursor-pointer'
                onClick={() => onRowClick(item.id)}
              >
                <TableCell className='flex justify-center'>
                  <Badge variant={item.creditType === 'DEPOSIT' ? 'secondary' : 'outline'}>
                    {item.creditType === 'DEPOSIT' ? '입금' : '환불'}
                  </Badge>
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {new Date(item.date).toLocaleDateString('ko-KR')}
                </TableCell>
                <TableCell>{item.clientName}</TableCell>
                <TableCell className='text-right'>
                  {item.amount.toLocaleString('ko-KR')}원
                </TableCell>
                <TableCell className='text-center'>{METHOD_DISPLAY[item.method]}</TableCell>
                <TableCell>
                  {item.creditType === 'DEPOSIT' && (
                    <Button
                      variant='destructive'
                      size='sm'
                      className='cursor-pointer'
                      onClick={(e) => e.stopPropagation()}
                    >
                      환불
                    </Button>
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
