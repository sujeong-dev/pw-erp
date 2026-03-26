'use client';

import { useState } from 'react';
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
import { useClients } from '@/src/features/clients';
import { useCreatePayment } from '../model/useCreatePayment';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const emptyForm = { clientId: '', amount: '', method: '', memo: '' };

export function CreatePaymentDialog({ open, setOpen }: Props) {
  const [form, setForm] = useState({ ...emptyForm });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);

  const { data } = useClients({});
  const clients = data?.items ?? [];

  const { mutate, isPending } = useCreatePayment();

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) {
      setForm({ ...emptyForm });
      setDate(undefined);
    }
  }

  const isValid = !!form.clientId && !!date && !!form.amount && !!form.method;

  function handleSubmit() {
    if (!isValid) return;
    mutate(
      {
        clientId: form.clientId,
        date: format(date!, 'yyyy-MM-dd'),
        amount: Number(form.amount),
        method: form.method as 'CASH' | 'BILL',
        memo: form.memo || undefined,
      },
      { onSuccess: () => handleOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>입금 등록</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label>거래처</Label>
            <Select value={form.clientId} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v }))}>
              <SelectTrigger className='cursor-pointer'>
                <SelectValue placeholder='거래처 선택' />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label>수금 일자</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button type='button' variant='outline' className='justify-start gap-2 cursor-pointer'>
                  <CalendarIcon className='size-4' />
                  {date ? format(date, 'yyyy-MM-dd') : '날짜 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={(d) => { setDate(d); setDateOpen(false); }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='payment-amount'>금액</Label>
            <Input
              id='payment-amount'
              type='number'
              placeholder='금액 입력'
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label>수금방법</Label>
            <Select value={form.method} onValueChange={(v) => setForm((f) => ({ ...f, method: v }))}>
              <SelectTrigger className='cursor-pointer'>
                <SelectValue placeholder='수금방법 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='CASH'>현금</SelectItem>
                <SelectItem value='BILL'>어음</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='payment-memo'>메모</Label>
            <Textarea
              id='payment-memo'
              placeholder='메모 입력'
              value={form.memo}
              onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => handleOpenChange(false)} className='cursor-pointer'>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending} className='cursor-pointer'>
            {isPending ? '등록 중...' : '등록'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
