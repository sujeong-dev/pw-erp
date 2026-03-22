'use client'

import { useState } from "react";
import { useDeleteOrder } from "./useDeleteOrder";

export function useOrderDeleteDialog() {
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  function handleDelete() {
    if (!deleteOrderId) return;
    deleteOrder(deleteOrderId, { onSuccess: () => setDeleteOrderId(null) });
  }

  return { deleteOrderId, setDeleteOrderId, isDeleting, handleDelete };
}
