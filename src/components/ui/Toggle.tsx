/* ═══════════════════════════════════════════════════════
   CS-Planly — Toggle Component v2
   ═══════════════════════════════════════════════════════ */

import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <label
      className={cn(
        'flex items-center justify-between gap-4 cursor-pointer',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      <div className="flex flex-col">
        {label && (
          <span className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
            {label}
          </span>
        )}
        {description && (
          <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative w-10 h-[22px] rounded-full transition-colors duration-[var(--duration-fast)] shrink-0 cursor-pointer',
          checked
            ? 'bg-[var(--color-accent)]'
            : 'bg-[var(--color-bg-elevated)]',
          'focus-visible:outline-1.5 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]'
        )}
      >
        <span
          className={cn(
            'absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-[var(--duration-fast)]',
            checked && 'translate-x-[18px]'
          )}
        />
      </button>
    </label>
  );
}
