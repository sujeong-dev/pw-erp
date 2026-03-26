'use client';

import type { DateRange } from 'react-day-picker';
import { SearchInput, DateRangeFilter, SelectFilter } from '@/src/shared/ui';

type Props = {
  clientName: string;
  onClientNameChange: (v: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (r: DateRange | undefined) => void;
  creditType: string;
  onCreditTypeChange: (v: string) => void;
  method: string;
  onMethodChange: (v: string) => void;
};

export function PaymentsFilters({
  clientName, onClientNameChange,
  dateRange, onDateRangeChange,
  creditType, onCreditTypeChange,
  method, onMethodChange,
}: Props) {
  return (
    <div className='flex items-center gap-3 flex-wrap'>
      <SearchInput value={clientName} onChange={onClientNameChange} placeholder='거래처 검색' className='w-56' />
      <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
      <SelectFilter
        value={creditType}
        onChange={onCreditTypeChange}
        options={[
          { value: 'all', label: '유형 전체' },
          { value: 'DEPOSIT', label: '입금' },
          { value: 'REFUND', label: '환불' },
        ]}
        className='w-32'
      />
      <SelectFilter
        value={method}
        onChange={onMethodChange}
        options={[
          { value: 'all', label: '방법 전체' },
          { value: 'CASH', label: '현금' },
          { value: 'BILL', label: '어음' },
        ]}
        className='w-36'
      />
    </div>
  );
}
