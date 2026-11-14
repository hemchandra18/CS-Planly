/* ═══════════════════════════════════════════════════════
   CS-Planly — Pill (Selectable Chip) Component v2
   ═══════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PillProps {
  selected?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Pill({
  selected = false,
  onClick,
  icon,
  children,
  className,
  disabled = false,
}: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium',
        'transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] cursor-pointer select-none',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        selected
          ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
          : 'bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]',
        'active:scale-[0.97]',
        className
      )}
    >
      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
      {!selected && icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
