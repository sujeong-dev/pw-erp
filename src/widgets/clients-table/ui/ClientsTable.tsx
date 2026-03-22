'use client';

import { useRouter } from 'next/navigation';
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
import { ROUTES } from '@/src/shared/config';
import type { Client } from '@/src/features/clients';

type Props = {
  items: Client[];
  isLoading: boolean;
  onEditOpen: (client: Client) => void;
  onDeleteRequest: (id: string) => void;
};

export function ClientsTable({ items, isLoading, onEditOpen, onDeleteRequest }: Props) {
  const router = useRouter();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>거래처 코드</TableHead>
            <TableHead>거래처명</TableHead>
            <TableHead>최근 거래일</TableHead>
            <TableHead className='text-right'>미수금 잔액</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className='h-4 w-28 rounded bg-muted animate-pulse' /></TableCell>
                <TableCell><div className='h-4 w-36 rounded bg-muted animate-pulse' /></TableCell>
                <TableCell><div className='h-4 w-24 rounded bg-muted animate-pulse' /></TableCell>
                <TableCell className='text-right'><div className='h-4 w-20 rounded bg-muted animate-pulse ml-auto' /></TableCell>
                <TableCell />
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center text-muted-foreground py-8'>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            items.map((client) => (
              <TableRow
                key={client.id}
                className='cursor-pointer'
                onClick={() => router.push(ROUTES.dashboard.clientDetail(client.id))}
              >
                <TableCell>{client.code}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>
                  {client.lastSaleDate
                    ? new Date(client.lastSaleDate).toLocaleDateString('ko-KR')
                    : '-'}
                </TableCell>
                <TableCell className='text-destructive font-medium text-right'>
                  {client.totalBalance.toLocaleString('ko-KR')}원
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className='flex justify-end gap-1'>
                    <Button size='sm' variant='ghost' onClick={() => onEditOpen(client)}>
                      수정
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='text-destructive hover:text-destructive'
                      onClick={() => onDeleteRequest(client.id)}
                    >
                      삭제
                    </Button>
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
