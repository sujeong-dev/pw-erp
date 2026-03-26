"use client";

import type { DateRange } from "react-day-picker";
import { DateRangeFilter, SearchInput, SelectFilter } from "@/src/shared/ui";

const STATUS_OPTIONS = [
  { value: 'all', label: '상태 전체' },
  { value: 'UNPAID', label: '미수금' },
  { value: 'PAID', label: '완납' },
  { value: 'PARTIAL', label: '부분납' },
  { value: 'CANCEL', label: '취소' },
];

type Props = {
  codeSearch: string;
  onCodeChange: (v: string) => void;
  clientSearch: string;
  onClientChange: (v: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (r: DateRange | undefined) => void;
  status: string;
  onStatusChange: (v: string) => void;
};

export function OrdersFilters({
  codeSearch,
  onCodeChange,
  clientSearch,
  onClientChange,
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className='flex items-center gap-3'>
      <SearchInput
        value={codeSearch}
        onChange={onCodeChange}
        placeholder='코드 검색'
        className='w-40'
      />
      <SearchInput
        value={clientSearch}
        onChange={onClientChange}
        placeholder='거래처 검색'
        className='w-56'
      />
      <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
      <SelectFilter
        value={status}
        onChange={onStatusChange}
        options={STATUS_OPTIONS}
        placeholder='상태 전체'
        className='w-36'
      />
    </div>
  );
}
