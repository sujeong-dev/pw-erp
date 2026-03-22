"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DateFilterProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
};

export function DateFilter({ value, onChange, placeholder = "날짜 선택" }: DateFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-44 justify-start gap-2 cursor-pointer'
        >
          <CalendarIcon className='size-4' />
          {value ? format(value, 'yyyy-MM-dd') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        {value && (
          <div className='border-b p-2 flex justify-end'>
            <Button
              variant='ghost'
              size='sm'
              className='cursor-pointer text-muted-foreground'
              onClick={() => onChange(undefined)}
            >
              <X className='size-4' />
            </Button>
          </div>
        )}
        <Calendar
          mode='single'
          captionLayout='dropdown'
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}
