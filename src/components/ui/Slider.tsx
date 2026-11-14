/* ═══════════════════════════════════════════════════════
   CS-Planly — Slider Component v2
   ═══════════════════════════════════════════════════════ */

import { cn } from '@/lib/utils';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  valueLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  valueLabel,
  disabled = false,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {(label || valueLabel) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">
              {label}
            </span>
          )}
          {valueLabel && (
            <span className="text-[var(--text-sm)] font-semibold text-[var(--color-accent)] tabular-nums">
              {valueLabel}
            </span>
          )}
        </div>
      )}
      <div className="relative w-full h-8 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            'w-full h-1.5 appearance-none rounded-full cursor-pointer',
            'bg-[var(--color-bg-elevated)]',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-[var(--color-accent)]',
            '[&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)]',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:duration-150',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-4',
            '[&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-[var(--color-accent)]',
            '[&::-moz-range-thumb]:border-none',
            '[&::-moz-range-thumb]:cursor-pointer',
          )}
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${percentage}%, var(--color-bg-elevated) ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
}
