/* ═══════════════════════════════════════════════════════
   CS-Planly — Card Component v2
   Intentional surfaces, not boxes everywhere.
   ═══════════════════════════════════════════════════════ */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'elevated' | 'bordered' | 'ghost' | 'glow';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: ReactNode;
  footer?: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-[var(--color-bg-surface)] border border-[var(--color-border)]',
  elevated:
    'bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-[var(--shadow-md)]',
  bordered:
    'bg-transparent border border-[var(--color-border)]',
  ghost:
    'bg-[var(--color-bg-surface)]/40',
  glow:
    'bg-[var(--color-bg-surface)] border border-[var(--color-accent)]/15 shadow-[var(--shadow-glow)]',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = false,
      padding = 'md',
      header,
      footer,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-lg)] transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]',
          variantClasses[variant],
          hoverable &&
            'cursor-pointer hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-surface-hover)]',
          className
        )}
        {...props}
      >
        {header && (
          <div
            className={cn(
              'border-b border-[var(--color-border)]',
              paddingClasses[padding]
            )}
          >
            {header}
          </div>
        )}
        <div className={paddingClasses[padding]}>{children}</div>
        {footer && (
          <div
            className={cn(
              'border-t border-[var(--color-border)]',
              paddingClasses[padding]
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
