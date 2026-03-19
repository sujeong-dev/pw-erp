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
import { SearchInput } from "@/src/shared/ui";
import { useDebounce, usePagination } from "@/src/shared/lib/hooks";
import { useClients } from "@/src/features/clients";

const PAGE_SIZE = 10;

export function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { page, goPrev, goNext, reset } = usePagination();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", manager: "", contact: "" });

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
          <Plus className="size-4" />
          거래처 등록
        </Button>
      </div>

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
                placeholder='연락처 입력'
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
            <Button onClick={() => setOpen(false)} className='cursor-pointer'>
              등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SearchInput
        value={search}
        onChange={(v: string) => setSearch(v)}
        placeholder="거래처명 검색"
        className="w-72"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>거래처 코드</TableHead>
            <TableHead>거래처명</TableHead>
            <TableHead>최근 거래일</TableHead>
            <TableHead className='text-right'>미수금 잔액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-28 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-36 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-24 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell className="text-right"><div className="h-4 w-20 rounded bg-muted animate-pulse ml-auto" /></TableCell>
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
                      ? new Date(client.lastSaleDate).toLocaleDateString('ko-KR')
                      : '-'}
                  </TableCell>
                  <TableCell className='text-destructive font-medium text-right'>
                    {client.totalBalance.toLocaleString('ko-KR')}원
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
                className={!hasPrev ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={goNext}
                aria-disabled={!hasNext}
                className={!hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
}
