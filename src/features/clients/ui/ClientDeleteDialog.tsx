'use client';

import { ConfirmDialog } from '@/src/shared/ui';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
};

export function ClientDeleteDialog({ open, onOpenChange, onConfirm, isPending }: Props) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='정말 삭제하시겠습니까?'
      description='삭제된 거래처는 복구할 수 없습니다.'
      confirmLabel='삭제'
      cancelLabel='취소'
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
