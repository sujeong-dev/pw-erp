"use client";

import { useState } from "react";
import { format, subWeeks, subMonths } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ko } from 'date-fns/locale';

type Props = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
};

const PRESETS = [
  { label: '1주', getRange: () => ({ from: subWeeks(new Date(), 1), to: new Date() }) },
  { label: '1개월', getRange: () => ({ from: subMonths(new Date(), 1), to: new Date() }) },
  { label: '3개월', getRange: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
  { label: '6개월', getRange: () => ({ from: subMonths(new Date(), 6), to: new Date() }) },
];

export function DateRangeFilter({ value, onChange, placeholder = '전체 기간', className }: Props) {
  const [open, setOpen] = useState(false);

  const displayText = value?.from
    ? value.to
      ? `${format(value.from, 'yyyy.MM.dd')} - ${format(value.to, 'yyyy.MM.dd')}`
      : format(value.from, 'yyyy.MM.dd')
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className={`w-64 justify-start gap-2 cursor-pointer ${className ?? ''}`}>
          <CalendarIcon className='size-4 shrink-0' />
          <span className='truncate'>{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        {value && (
          <div className='border-b p-2 flex justify-end'>
            <Button
              variant='ghost'
              size='sm'
              className='cursor-pointer text-muted-foreground'
              onClick={() => { onChange(undefined); setOpen(false); }}
            >
              <X className='size-4' />
            </Button>
          </div>
        )}
        <Calendar
          locale={ko}
          mode='range'
          numberOfMonths={2}
          defaultMonth={subMonths(new Date(), 1)}
          selected={value}
          onSelect={onChange}
          disabled={{ after: new Date() }}
        />
        <div className='border-t p-3 flex gap-2'>
          {PRESETS.map(({ label, getRange }) => (
            <Button
              key={label}
              variant='outline'
              size='sm'
              className='cursor-pointer flex-1'
              onClick={() => onChange(getRange())}
            >
              {label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
