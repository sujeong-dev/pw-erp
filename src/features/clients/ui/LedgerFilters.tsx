'use client';

import { format } from 'date-fns';
import { SearchInput, DateFilter, SelectFilter } from '@/src/shared/ui';
import { STATUS_DISPLAY } from '@/src/shared/constants';

type Props = {
  code: string;
  onCodeChange: (v: string) => void;
  startDate: Date | undefined;
  onStartDateChange: (d: Date | undefined) => void;
  endDate: Date | undefined;
  onEndDateChange: (d: Date | undefined) => void;
  type: string;
  onTypeChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
};

export function LedgerFilters({ code, onCodeChange, startDate, onStartDateChange, endDate, onEndDateChange, type, onTypeChange, status, onStatusChange }: Props) {
  return (
    <div className='flex items-center gap-3 flex-wrap'>
      <SearchInput value={code} onChange={onCodeChange} placeholder='매출 코드 검색' />
      <DateFilter value={startDate} onChange={onStartDateChange} placeholder='시작일' />
      <DateFilter value={endDate} onChange={onEndDateChange} placeholder='종료일' />
      <SelectFilter
        value={type}
        onChange={onTypeChange}
        options={[
          { value: 'all', label: '구분 전체' },
          { value: 'SALES', label: '매출' },
          { value: 'PAYMENT', label: '수금' },
        ]}
        className='w-32'
      />
      <SelectFilter
        value={status}
        onChange={onStatusChange}
        options={[
          { value: 'all', label: '상태 전체' },
          { value: 'UNPAID', label: STATUS_DISPLAY.UNPAID },
          { value: 'PAID', label: STATUS_DISPLAY.PAID },
          { value: 'PARTIAL', label: STATUS_DISPLAY.PARTIAL },
          { value: 'CANCEL', label: STATUS_DISPLAY.CANCEL },
        ]}
        className='w-36'
      />
    </div>
  );
}
