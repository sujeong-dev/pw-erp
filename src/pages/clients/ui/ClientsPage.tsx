"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ROUTES } from "@/src/shared/config";
import { SearchInput, ConfirmDialog } from "@/src/shared/ui";
import { useDebounce, usePagination } from "@/src/shared/lib/hooks";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient, type Client } from "@/src/features/clients";

const PAGE_SIZE = 10;

export function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { page, goPrev, goNext, reset } = usePagination();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", manager: "", contact: "" });
  const { mutate: createClient, isPending } = useCreateClient();

  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState({ name: "", manager: "", contact: "" });
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();

  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  const openEdit = (client: Client) => {
    setEditClient(client);
    setEditForm({ name: client.name, manager: client.contactName, contact: client.contactPhone });
  };

  const handleUpdate = () => {
    if (!editClient) return;
    updateClient(
      { id: editClient.id, body: { name: editForm.name, contactName: editForm.manager, contactPhone: editForm.contact } },
      { onSuccess: () => setEditClient(null) }
    );
  };

  const handleDelete = () => {
    if (!deleteClientId) return;
    deleteClient(deleteClientId, { onSuccess: () => setDeleteClientId(null) });
  };

  const handleSubmit = () => {
    createClient(
      { name: form.name, contactName: form.manager, contactPhone: form.contact },
      {
        onSuccess: () => {
          setOpen(false);
          setForm({ name: "", manager: "", contact: "" });
        },
      }
    );
  };

  const { data = [], isLoading } = useClients({
    name: debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const hasPrev = page > 1;
  const hasNext = data.length === PAGE_SIZE;

  return (
    <main className='flex flex-col gap-6 p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>거래처 관리</h1>
        <Button onClick={() => setOpen(true)} className='cursor-pointer'>
          <Plus className='size-4' />
          거래처 등록
        </Button>
      </div>

      {/* 거래처 등록 dialog */}
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='client-manager'>담당자</Label>
              <Input
                id='client-manager'
                placeholder='담당자 이름 입력'
                value={form.manager}
                onChange={(e) =>
                  setForm((f) => ({ ...f, manager: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='client-contact'>연락처</Label>
              <Input
                id='client-contact'
                placeholder={`'-'는 제외하고 입력해주세요.`}
                value={form.contact}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contact: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setOpen(false)}
              className='cursor-pointer'
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className='cursor-pointer'
            >
              {isPending ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 거래처 수정 dialog */}
      <Dialog
        open={!!editClient}
        onOpenChange={(v) => !v && setEditClient(null)}
      >
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
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='edit-manager'>담당자</Label>
              <Input
                id='edit-manager'
                placeholder='담당자 이름 입력'
                value={editForm.manager}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, manager: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='edit-contact'>연락처</Label>
              <Input
                id='edit-contact'
                placeholder={`'-'는 제외하고 입력해주세요.`}
                value={editForm.contact}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, contact: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditClient(null)}
              className='cursor-pointer'
            >
              취소
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className='cursor-pointer'
            >
              {isUpdating ? '수정 중...' : '수정'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 거래처 삭제 confirm dialog */}
      <ConfirmDialog
        open={!!deleteClientId}
        onOpenChange={(v) => !v && setDeleteClientId(null)}
        title='정말 삭제하시겠습니까?'
        description='삭제된 거래처는 복구할 수 없습니다.'
        confirmLabel='삭제'
        cancelLabel='취소'
        onConfirm={handleDelete}
        isPending={isDeleting}
      />

      <SearchInput
        value={search}
        onChange={(v: string) => setSearch(v)}
        placeholder='거래처명 검색'
        className='w-72'
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>거래처 코드</TableHead>
            <TableHead>거래처명</TableHead>
            <TableHead>최근 거래일</TableHead>
            <TableHead className='text-right'>미수금 잔액</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className='h-4 w-28 rounded bg-muted animate-pulse' />
                  </TableCell>
                  <TableCell>
                    <div className='h-4 w-36 rounded bg-muted animate-pulse' />
                  </TableCell>
                  <TableCell>
                    <div className='h-4 w-24 rounded bg-muted animate-pulse' />
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='h-4 w-20 rounded bg-muted animate-pulse ml-auto' />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))
            : data.map((client) => (
                <TableRow
                  key={client.id}
                  className='cursor-pointer'
                  onClick={() =>
                    router.push(ROUTES.dashboard.clientDetail(client.id))
                  }
                >
                  <TableCell>{client.code}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>
                    {client.lastSaleDate
                      ? new Date(client.lastSaleDate).toLocaleDateString(
                          'ko-KR',
                        )
                      : '-'}
                  </TableCell>
                  <TableCell className='text-destructive font-medium text-right'>
                    {client.totalBalance.toLocaleString('ko-KR')}원
                  </TableCell>
                  <TableCell className='text-right'>
                    <div
                      className='flex justify-end gap-1'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size='sm'
                        variant='ghost'
                        className='cursor-pointer'
                        onClick={() => openEdit(client)}
                      >
                        수정
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='cursor-pointer text-destructive hover:text-destructive'
                        onClick={() => setDeleteClientId(client.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {(hasPrev || hasNext) && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={goPrev}
                aria-disabled={!hasPrev}
                className={
                  !hasPrev ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={goNext}
                aria-disabled={!hasNext}
                className={
                  !hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
}
