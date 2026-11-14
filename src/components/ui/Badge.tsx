/* ═══════════════════════════════════════════════════════
   CS-Planly — Badge Component v2
   ═══════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'accent' | 'warm' | 'success' | 'warning' | 'error' | 'ghost';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]',
  accent:
    'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
  warm:
    'bg-[var(--color-warm-muted)] text-[var(--color-warm)]',
  success:
    'bg-[var(--color-success-muted)] text-[var(--color-success)]',
  warning:
    'bg-[var(--color-warning-muted)] text-[var(--color-warning)]',
  error:
    'bg-[var(--color-error-muted)] text-[var(--color-error)]',
  ghost:
    'bg-transparent text-[var(--color-text-tertiary)]',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[var(--text-xs)] gap-1',
  md: 'px-2.5 py-1 text-[var(--text-sm)] gap-1.5',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-[var(--radius-sm)] whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
