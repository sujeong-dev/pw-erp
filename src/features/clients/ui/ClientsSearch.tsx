'use client';

import { SearchInput } from '@/src/shared/ui';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function ClientsSearch({ value, onChange }: Props) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder='거래처명 검색'
      className='w-72'
    />
  );
}
