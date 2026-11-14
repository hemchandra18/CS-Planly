/* ═══════════════════════════════════════════════════════
   CS-Planly — Button Component v2
   Premium, minimal. No oversized pill-button overload.
   ═══════════════════════════════════════════════════════ */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-black font-semibold hover:bg-[var(--color-accent-hover)] shadow-sm',
  secondary:
    'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-surface-hover)] hover:border-[var(--color-border-hover)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]',
  danger:
    'bg-[var(--color-error)] text-white hover:brightness-110',
  success:
    'bg-[var(--color-success)] text-white hover:brightness-110',
  outline:
    'bg-transparent text-[var(--color-accent)] border border-[var(--color-accent)]/40 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-muted)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[var(--text-xs)] gap-1.5',
  md: 'h-9 px-4 text-[var(--text-sm)] gap-2',
  lg: 'h-10 px-5 text-[var(--text-base)] gap-2',
  xl: 'h-12 px-7 text-[var(--text-base)] gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)]',
          'transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] cursor-pointer',
          'focus-visible:outline-1.5 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          'active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
