"use client";

import { DateFilter, SearchInput } from "@/src/shared/ui";

type Props = {
  codeSearch: string;
  onCodeChange: (v: string) => void;
  clientSearch: string;
  onClientChange: (v: string) => void;
  dateFilter: Date | undefined;
  onDateChange: (d: Date | undefined) => void;
};

export function OrdersFilters({
  codeSearch,
  onCodeChange,
  clientSearch,
  onClientChange,
  dateFilter,
  onDateChange,
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
      <DateFilter
        value={dateFilter}
        onChange={onDateChange}
        placeholder='주문 날짜'
      />
    </div>
  );
}
