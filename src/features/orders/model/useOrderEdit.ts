'use client';

import { useState } from 'react';
import type { Order } from '../api';

export type EditableOrder = {
  id: string;
  clientId: string;
  date: string;
  itemName: string;
  tonnage: number;
  unitPrice: number;
  memo?: string;
};

export function useOrderEdit() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<EditableOrder | null>(null);

  function handleEditOpen(order: Order) {
    setEditingOrder({
      id: order.id,
      clientId: order.clientId,
      date: order.date,
      itemName: order.itemName,
      tonnage: order.tonnage,
      unitPrice: order.unitPrice,
      memo: order.memo ?? undefined,
    });
  }

  function handleEditClose() {
    setEditingOrder(null);
  }

  return {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    editingOrder,
    handleEditOpen,
    handleEditClose,
  };
}
