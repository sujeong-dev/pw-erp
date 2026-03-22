"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageItems(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const delta = 1;
  const rangeSet = new Set<number>();
  rangeSet.add(1);
  rangeSet.add(totalPages);
  for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
    rangeSet.add(i);
  }

  const sorted = Array.from(rangeSet).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const num of sorted) {
    if (num - prev > 1) result.push("ellipsis");
    result.push(num);
    prev = num;
  }
  return result;
}

export function TablePagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const pageItems = getPageItems(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => { e.preventDefault(); if (hasPrev) onPageChange(page - 1); }}
            aria-disabled={!hasPrev}
            className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {pageItems.map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={`e-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === page}
                onClick={(e) => { e.preventDefault(); onPageChange(item); }}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => { e.preventDefault(); if (hasNext) onPageChange(page + 1); }}
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
