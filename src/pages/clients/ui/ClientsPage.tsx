"use client";

import { useState } from "react";
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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ROUTES } from "@/src/shared/config";
import { SearchInput } from "@/src/shared/ui";

const mockClients = [
  { id: "C001", name: "한국무역(주)", lastOrderDate: "2026-03-15", unpaidBalance: 1500000 },
  { id: "C002", name: "대성산업", lastOrderDate: "2026-03-14", unpaidBalance: 0 },
  { id: "C003", name: "서울전자(주)", lastOrderDate: "2026-03-12", unpaidBalance: 320000 },
  { id: "C004", name: "미래물산", lastOrderDate: "2026-03-11", unpaidBalance: 870000 },
  { id: "C005", name: "동아상사", lastOrderDate: "2026-03-10", unpaidBalance: 0 },
  { id: "C006", name: "태양무역", lastOrderDate: "2026-03-09", unpaidBalance: 450000 },
  { id: "C007", name: "국제기업(주)", lastOrderDate: "2026-03-08", unpaidBalance: 0 },
  { id: "C008", name: "한빛산업", lastOrderDate: "2026-03-07", unpaidBalance: 125000 },
  { id: "C009", name: "성진상사", lastOrderDate: "2026-03-06", unpaidBalance: 2300000 },
  { id: "C010", name: "우리물산", lastOrderDate: "2026-03-05", unpaidBalance: 0 },
  { id: "C011", name: "현대유통", lastOrderDate: "2026-03-04", unpaidBalance: 670000 },
  { id: "C012", name: "신한기업", lastOrderDate: "2026-03-03", unpaidBalance: 0 },
  { id: "C013", name: "대한상사", lastOrderDate: "2026-03-02", unpaidBalance: 980000 },
  { id: "C014", name: "하늘무역(주)", lastOrderDate: "2026-03-01", unpaidBalance: 0 },
  { id: "C015", name: "청솔산업", lastOrderDate: "2026-02-28", unpaidBalance: 550000 },
];

const PAGE_SIZE = 10;

export function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", manager: "", contact: "" });

  const filtered = mockClients.filter((c) => c.name.includes(search));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  return (
    <main className='flex flex-col gap-6 p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>거래처 관리</h1>
        <Button onClick={() => setOpen(true)} className='cursor-pointer'>
          <Plus className='size-4' />
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
        onChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="거래처명 검색"
        className="w-72"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>거래처 ID</TableHead>
            <TableHead>거래처명</TableHead>
            <TableHead>최근 거래일</TableHead>
            <TableHead className='text-right'>미수금 잔액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((client) => (
            <TableRow
              key={client.id}
              className='cursor-pointer'
              onClick={() =>
                router.push(ROUTES.dashboard.clientDetail(client.id))
              }
            >
              <TableCell>{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.lastOrderDate}</TableCell>
              <TableCell className='text-destructive font-medium text-right'>
                {client.unpaidBalance.toLocaleString('ko-KR')}원
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={
                  page === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className='cursor-pointer'
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
}
