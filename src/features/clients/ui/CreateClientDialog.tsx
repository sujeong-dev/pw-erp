'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCreateClient } from '../model/useCreateClient';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function CreateClientDialog({ open, setOpen }: Props) {
  const [form, setForm] = useState({ name: '', contactName: '', contactPhone: '' });
  const { mutate: createClient, isPending } = useCreateClient();

  const handleSubmit = () => {
    createClient(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({ name: '', contactName: '', contactPhone: '' });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>거래처 등록</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='client-name'>거래처명</Label>
            <Input
              id='client-name'
              placeholder='거래처명 입력'
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='client-contact-name'>담당자</Label>
            <Input
              id='client-contact-name'
              placeholder='담당자 이름 입력'
              value={form.contactName}
              onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='client-contact-phone'>연락처</Label>
            <Input
              id='client-contact-phone'
              placeholder={`'-'는 제외하고 입력해주세요.`}
              value={form.contactPhone}
              onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? '등록 중...' : '등록'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
