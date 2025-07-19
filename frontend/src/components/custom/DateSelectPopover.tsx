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
            'w-[240px] justify-start text-left font-normal bg-input text-text-primary border-border hover:bg-secondary-light hover:border-accent rounded-lg transition-colors',
            !dateRange.from && 'text-text-muted',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-text-muted" />
          <span className="truncate">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-border shadow-lg" align="start">
        <div className="p-4 bg-card rounded-lg">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'transition-colors',
                mode === 'today' 
                  ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
                  : 'text-text-primary hover:bg-secondary border-border hover:border-accent'
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
                  ? 'bg-[#0D3F32] text-white border-[#0D3F32] hover:bg-[#0D3F32]/90' 
                  : 'text-[#0D3F32] hover:bg-[#E6F1EC] border-[#E6F1EC] hover:border-[#009B6B]'
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
                  ? 'bg-[#0D3F32] text-white border-[#0D3F32] hover:bg-[#0D3F32]/90' 
                  : 'text-[#0D3F32] hover:bg-[#E6F1EC] border-[#E6F1EC] hover:border-[#009B6B]'
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
                  ? 'bg-[#0D3F32] text-white border-[#0D3F32] hover:bg-[#0D3F32]/90' 
                  : 'text-[#0D3F32] hover:bg-[#E6F1EC] border-[#E6F1EC] hover:border-[#009B6B]'
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
            className="rounded-lg border border-border p-4 [--rdp-background-color:transparent]"
            classNames={{
              table: 'w-full',
              head_row: 'w-full',
              row: 'w-full',
              head_cell: 'text-text-muted text-sm font-normal p-2',
              cell: 'p-0',
              day: 'h-9 w-9 p-0 font-normal rounded-md hover:bg-secondary',
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
              day_range_middle: 'bg-secondary text-text-primary',
              day_range_start: 'bg-primary text-primary-foreground hover:bg-primary/90',
              day_range_end: 'bg-primary text-primary-foreground hover:bg-primary/90',
              day_today: 'bg-background text-text-primary font-medium',
              day_outside: 'text-text-muted opacity-50',
              day_disabled: 'text-text-muted opacity-30',
              nav_button: 'opacity-100 hover:bg-secondary rounded-md p-1',
              nav_button_previous: 'absolute left-3',
              nav_button_next: 'absolute right-3',
              caption: 'flex justify-center py-2 relative items-center text-text-primary',
            }}
            showOutsideDays
            pagedNavigation
            navLayout='around'
            captionLayout='dropdown'
            fixedWeeks
            autoFocus
            // showWeekNumber
            title='Select Date Range'
            footer={
              <div className="flex justify-between mt-4 text-sm border-t border-border pt-3">
                <div className="px-3 py-2 bg-background rounded-lg text-text-primary">
                  {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Start date'}
                </div>
                <div className="px-3 py-2 bg-background rounded-lg text-text-primary">
                  {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'End date'}
                </div>
              </div>
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}