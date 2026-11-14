/* ═══════════════════════════════════════════════════════
   CS-Planly — ProgressBar Component v2
   ═══════════════════════════════════════════════════════ */

import { cn } from '@/lib/utils';

type ProgressVariant = 'accent' | 'success' | 'warning' | 'error' | 'warm';
type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;         // 0–100
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const variantClasses: Record<ProgressVariant, string> = {
  accent: 'bg-[var(--color-accent)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  error: 'bg-[var(--color-error)]',
  warm: 'bg-[var(--color-warm)]',
};

const sizeClasses: Record<ProgressSize, string> = {
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
};

export function ProgressBar({
  value,
  variant = 'accent',
  size = 'md',
  showLabel = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full flex items-center gap-3', className)}>
      <div
        className={cn(
          'w-full bg-[var(--color-bg-elevated)] rounded-[var(--radius-full)] overflow-hidden',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-[var(--radius-full)]',
            variantClasses[variant],
            animated && 'transition-all duration-700 ease-out'
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[var(--text-xs)] font-medium text-[var(--color-text-secondary)] tabular-nums min-w-[3ch] text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
