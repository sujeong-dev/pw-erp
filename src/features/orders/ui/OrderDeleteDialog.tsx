"use client";

import { ConfirmDialog } from "@/src/shared/ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
};

export function OrderDeleteDialog({ open, onOpenChange, onConfirm, isPending }: Props) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='정말 취소하시겠습니까?'
      description='취소된 주문은 복구할 수 없습니다.'
      confirmLabel='삭제'
      cancelLabel='취소'
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
