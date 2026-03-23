'use client';

import { SearchInput, DateFilter, SelectFilter } from '@/src/shared/ui';

type Props = {
  clientName: string;
  onClientNameChange: (v: string) => void;
  startDate: Date | undefined;
  onStartDateChange: (d: Date | undefined) => void;
  endDate: Date | undefined;
  onEndDateChange: (d: Date | undefined) => void;
  creditType: string;
  onCreditTypeChange: (v: string) => void;
};

export function PaymentsFilters({
  clientName, onClientNameChange,
  startDate, onStartDateChange,
  endDate, onEndDateChange,
  creditType, onCreditTypeChange,
}: Props) {
  return (
    <div className='flex items-center gap-3 flex-wrap'>
      <SearchInput value={clientName} onChange={onClientNameChange} placeholder='거래처 검색' className='w-56' />
      <DateFilter value={startDate} onChange={onStartDateChange} placeholder='시작일' />
      <DateFilter value={endDate} onChange={onEndDateChange} placeholder='종료일' />
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
    </div>
  );
}
