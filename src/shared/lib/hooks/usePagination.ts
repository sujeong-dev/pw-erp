"use client";

import { useState } from "react";

export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  return {
    page,
    setPage,
    goNext: () => setPage((p) => p + 1),
    goPrev: () => setPage((p) => Math.max(1, p - 1)),
    reset: () => setPage(1),
  };
}
