'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DayPicker } from 'react-day-picker';

// Import styles for react-day-picker
import 'react-day-picker/dist/style.css';

type DateMode = 'today' | 'week' | 'month' | 'year' | 'custom' | '';

interface DateSelectorPopoverProps {
  dateRange: {
    from?: Date | null;
    to?: Date | null;
  };
  onDateChange: (dateRange: { from?: Date | null; to?: Date | null }) => void;
  className?: string;
}

export default function DateSelectorPopover({ 
  dateRange, 
  onDateChange,
  className = ''
}: DateSelectorPopoverProps) {
  const today = new Date();
  const [mode, setMode] = useState<DateMode>('');

  const handlePredefinedSelect = (type: DateMode) => {
    setMode(type);
    switch (type) {
      case 'today':
        onDateChange({
          from: today,
          to: today,
        });
        break;
      case 'week':
        onDateChange({
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 }),
        });
        break;
      case 'month':
        onDateChange({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
      case 'year':
        onDateChange({
          from: startOfYear(today),
          to: endOfYear(today),
        });
        break;
      case 'custom':
        onDateChange({ from: undefined, to: undefined });
        break;
    }
  };

  const formatDateRange = () => {
    if (!dateRange.from) return 'Select date range';
    if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy');
    if (isSameDay(dateRange.from, dateRange.to)) {
      return format(dateRange.from, 'MMM d, yyyy');
    }
    return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal bg-[#1b1b1b] text-[#e2e2e2] border-text-primary hover:bg-[#2a2a2a] hover:text-white',
            !dateRange.from && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#868686]" />
          <span className="truncate">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'transition-colors',
                mode === 'today' 
                  ? 'bg-primary text-white border-primary hover:bg-primary/90' 
                  : 'text-black hover:bg-[#2a2a2a] border-primary hover:text-white'
              )}
              onClick={() => handlePredefinedSelect('today')}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'transition-colors',
                mode === 'week' 
                  ? 'bg-primary text-white border-primary hover:bg-primary/90' 
                  : 'text-black hover:bg-[#2a2a2a] border-primary hover:text-white'
              )}
              onClick={() => handlePredefinedSelect('week')}
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'transition-colors',
                mode === 'month' 
                  ? 'bg-primary text-white border-primary hover:bg-primary/90' 
                  : 'text-black hover:bg-[#2a2a2a] border-primary hover:text-white'
              )}
              onClick={() => handlePredefinedSelect('month')}
            >
              This Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'transition-colors',
                mode === 'year' 
                  ? 'bg-[#1b1b1b] text-white border-primary hover:bg-primary/90' 
                  : 'text-black hover:bg-[#2a2a2a] border-primary hover:text-white'
              )}
              onClick={() => handlePredefinedSelect('year')}
            >
              This Year
            </Button>
          </div>
          <DayPicker
            mode="range"
            selected={{
              from: dateRange.from || undefined,
              to: dateRange.to || undefined
            }}
            onSelect={(range) => {
              if (!range) {
                onDateChange({ from: null, to: null });
                return;
              }
              
              if (range.from && range.to) {
                onDateChange({ from: range.from, to: range.to });
                setMode('custom');
              } else if (range.from) {
                onDateChange({ from: range.from, to: null });
              } else {
                onDateChange({ from: null, to: null });
              }
            }}
            className="rounded-md border border-[#3a3a3a]  p-3"
            classNames={{
              month: 'w-full',
              table: 'w-full',
              head_row: 'w-full',
              row: 'w-full',
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
              day_outside: 'text-muted-foreground opacity-50',
              day_disabled: 'text-muted-foreground opacity-50',
              head_cell: 'text-muted-foreground text-sm font-normal',
              nav_button: 'opacity-100 hover: rounded-md',
              nav_button_previous: 'absolute left-3',
              nav_button_next: 'absolute right-3',
              caption: 'flex justify-center py-2 relative items-center',
            }}
            showOutsideDays
            fixedWeeks
          />
          <div className="flex justify-between mt-4 text-sm">
            <div className="px-2 py-1  rounded">
              {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Start date'}
            </div>
            <div className="px-2 py-1  rounded">
              {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'End date'}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}