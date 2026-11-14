/* ═══════════════════════════════════════════════════════
   CS-Planly — DatePicker Component v2
   ═══════════════════════════════════════════════════════ */

import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from './Button';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  minDate?: string;
  maxDate?: string;
  presets?: Array<{ label: string; days: number }>;
  label?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  presets,
  label,
  className,
}: DatePickerProps) {
  const today = new Date();
  const min = minDate || format(addDays(today, 14), 'yyyy-MM-dd');
  const max = maxDate || format(addDays(today, 365), 'yyyy-MM-dd');

  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      {label && (
        <label className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}

      {/* Preset buttons */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const presetDate = format(addDays(today, preset.days), 'yyyy-MM-dd');
            const isActive = value === presetDate;
            return (
              <Button
                key={preset.label}
                variant={isActive ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onChange(isActive ? null : presetDate)}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Date input */}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          min={min}
          max={max}
          className={cn(
            'w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-md)]',
            'pl-10 pr-4 py-2.5 text-[var(--text-base)] text-[var(--color-text-primary)]',
            'transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]',
            'hover:border-[var(--color-border-hover)]',
            'focus:outline-none focus:border-[var(--color-border-focus)]',
            '[color-scheme:dark]'
          )}
        />
      </div>

      {value && (
        <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
          {Math.ceil((new Date(value).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days from now
        </p>
      )}
    </div>
  );
}
