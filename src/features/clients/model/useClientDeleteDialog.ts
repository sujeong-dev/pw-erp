'use client';

import { useState } from 'react';
import { useDeleteClient } from './useDeleteClient';

export function useClientDeleteDialog() {
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  function handleDelete() {
    if (!deleteClientId) return;
    deleteClient(deleteClientId, { onSuccess: () => setDeleteClientId(null) });
  }

  return { deleteClientId, setDeleteClientId, isDeleting, handleDelete };
}
