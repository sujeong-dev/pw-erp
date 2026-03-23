'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TablePagination } from '@/src/shared/ui';
import { usePagination } from '@/src/shared/lib/hooks';
import {
  useClients,
  useClientsSearch,
  useClientEdit,
  useClientDeleteDialog,
  CreateClientDialog,
  EditClientDialog,
  ClientDeleteDialog,
  ClientsSearch,
} from '@/src/features/clients';
import { ClientsTable } from '@/src/widgets/clients-table';

const PAGE_SIZE = 10;

export function ClientPage() {
  const { search, setSearch, debouncedSearch } = useClientsSearch();
  const { page, setPage, reset } = usePagination();

  const { data, isLoading } = useClients({
    name: debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;

  const {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    editingClient,
    handleEditOpen,
    handleEditClose,
  } = useClientEdit();
  const { deleteClientId, setDeleteClientId, isDeleting, handleDelete } =
    useClientDeleteDialog();

  return (
    <main className='flex flex-col gap-6 p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>거래처 관리</h1>
        <Button onClick={() => setIsRegisterModalOpen(true)}>
          <Plus className='size-4' />
          거래처 등록
        </Button>
      </div>

      <ClientsSearch
        value={search}
        onChange={(v) => {
          setSearch(v);
          reset();
        }}
      />

      <ClientsTable
        items={items}
        isLoading={isLoading}
        onEditOpen={handleEditOpen}
        onDeleteRequest={setDeleteClientId}
      />

      <TablePagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CreateClientDialog
        open={isRegisterModalOpen}
        setOpen={setIsRegisterModalOpen}
      />
      <EditClientDialog client={editingClient} onClose={handleEditClose} />
      <ClientDeleteDialog
        open={!!deleteClientId}
        onOpenChange={(o) => !o && setDeleteClientId(null)}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </main>
  );
}
