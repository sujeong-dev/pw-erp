'use client';

import { useState } from 'react';
import type { Client } from '../api';

export type EditableClient = {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
};

export function useClientEdit() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<EditableClient | null>(null);

  function handleEditOpen(client: Client) {
    setEditingClient({
      id: client.id,
      name: client.name,
      contactName: client.contactName,
      contactPhone: client.contactPhone,
    });
  }

  function handleEditClose() {
    setEditingClient(null);
  }

  return {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    editingClient,
    handleEditOpen,
    handleEditClose,
  };
}
