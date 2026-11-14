/* ═══════════════════════════════════════════════════════
   CS-Planly — Empty State Component v2
   ═══════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-20 px-6',
        className
      )}
    >
      {icon && (
        <div className="mb-5 text-[var(--color-text-tertiary)]">{icon}</div>
      )}
      <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] max-w-sm mb-8">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
