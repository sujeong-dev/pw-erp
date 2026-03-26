'use client';

import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { Order } from '../api';
import { useOrderRefund } from '../model/useOrderRefund';

function makeSchema(paidAmount: number) {
  return z.object({
    date: z.date({ error: '날짜를 선택해주세요.' }),
    amount: z
      .number({ error: '금액을 입력해주세요.' })
      .min(1, '1원 이상 입력해주세요.')
      .max(paidAmount, `최대 ${paidAmount.toLocaleString('ko-KR')}원까지 입력 가능합니다.`),
    method: z.enum(['CASH', 'BILL'], { error: '방법을 선택해주세요.' }),
    memo: z.string().optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

type Props = {
  order: Order | null;
  onClose: () => void;
};

export function OrderRefundDialog({ order, onClose }: Props) {
  const [dateOpen, setDateOpen] = useState(false);
  const { mutate: refund, isPending } = useOrderRefund();

  const schema = useMemo(() => makeSchema(order?.paidAmount ?? 0), [order?.paidAmount]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function handleClose() {
    onClose();
    reset();
  }

  function onSubmit(values: FormValues) {
    if (!order) return;
    refund(
      {
        clientId: order.clientId,
        date: format(values.date, 'yyyy-MM-dd'),
        amount: values.amount,
        salesId: order.id,
        method: values.method,
        memo: values.memo,
      },
      { onSuccess: () => { handleClose(); } }
    );
  }

  return (
    <Dialog open={order !== null} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>환불</DialogTitle>
        </DialogHeader>

        <form
          id='order-refund-form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-4 py-2'
        >
          {/* 날짜 */}
          <div className='flex flex-col gap-1.5'>
            <Label>날짜</Label>
            <Controller
              name='date'
              control={control}
              render={({ field }) => (
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className='justify-start gap-2 cursor-pointer'
                    >
                      <CalendarIcon className='size-4' />
                      {field.value ? format(field.value, 'yyyy-MM-dd') : '날짜 선택'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={(d) => {
                        field.onChange(d);
                        setDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className='text-destructive text-xs'>{errors.date.message}</p>
            )}
          </div>

          {/* 금액 */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='refund-amount'>
              금액
              {order && (
                <span className='ml-1 text-muted-foreground font-normal'>
                  (최대 {order.paidAmount.toLocaleString('ko-KR')}원)
                </span>
              )}
            </Label>
            <Input
              id='refund-amount'
              type='number'
              placeholder='환불 금액 입력'
              aria-invalid={!!errors.amount}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className='text-destructive text-xs'>{errors.amount.message}</p>
            )}
          </div>

          {/* 방법 */}
          <div className='flex flex-col gap-1.5'>
            <Label>방법</Label>
            <Controller
              name='method'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='cursor-pointer'>
                    <SelectValue placeholder='방법 선택' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='CASH'>현금</SelectItem>
                    <SelectItem value='BILL'>어음</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.method && (
              <p className='text-destructive text-xs'>{errors.method.message}</p>
            )}
          </div>

          {/* 메모 */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='refund-memo'>메모</Label>
            <Textarea
              id='refund-memo'
              placeholder='메모 입력 (선택)'
              {...register('memo')}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            className='cursor-pointer'
          >
            닫기
          </Button>
          <Button
            type='submit'
            form='order-refund-form'
            variant='destructive'
            disabled={isPending}
            className='cursor-pointer'
          >
            {isPending ? '처리 중...' : '환불'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
