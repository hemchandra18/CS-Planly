/* ═══════════════════════════════════════════════════════
   CS-Planly — Input Component v2
   ═══════════════════════════════════════════════════════ */

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, fullWidth = true, className, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={cn(
              'w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-md)]',
              'px-3.5 py-2.5 text-[var(--text-base)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
              'transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]',
              'hover:border-[var(--color-border-hover)]',
              'focus:outline-none focus:border-[var(--color-border-focus)]',
              icon ? 'pl-10' : '',
              isPassword ? 'pr-10' : '',
              error ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : '',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[var(--text-xs)] text-[var(--color-error)] mt-0.5">{error}</p>
        )}
        {hint && !error && (
          <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
