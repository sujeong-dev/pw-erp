'use client';

import { useState, useEffect } from 'react';
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
import { useUpdateClient } from '../model/useUpdateClient';
import type { EditableClient } from '../model/useClientEdit';

type Props = {
  client: EditableClient | null;
  onClose: () => void;
};

export function EditClientDialog({ client, onClose }: Props) {
  const [form, setForm] = useState({ name: '', contactName: '', contactPhone: '' });
  const { mutate: updateClient, isPending } = useUpdateClient();

  useEffect(() => {
    if (client) {
      setForm({ name: client.name, contactName: client.contactName, contactPhone: client.contactPhone });
    }
  }, [client]);

  const handleSubmit = () => {
    if (!client) return;
    updateClient(
      { id: client.id, body: form },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open={!!client} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>거래처 수정</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='edit-name'>거래처명</Label>
            <Input
              id='edit-name'
              placeholder='거래처명 입력'
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='edit-contact-name'>담당자</Label>
            <Input
              id='edit-contact-name'
              placeholder='담당자 이름 입력'
              value={form.contactName}
              onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='edit-contact-phone'>연락처</Label>
            <Input
              id='edit-contact-phone'
              placeholder={`'-'는 제외하고 입력해주세요.`}
              value={form.contactPhone}
              onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? '수정 중...' : '수정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
