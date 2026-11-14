/* ═══════════════════════════════════════════════════════
   CS-Planly — Skeleton Component v2
   ═══════════════════════════════════════════════════════ */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Skeleton({
  width,
  height = '1rem',
  rounded = 'md',
  className,
}: SkeletonProps) {
  const roundedClasses = {
    sm: 'rounded-[var(--radius-sm)]',
    md: 'rounded-[var(--radius-md)]',
    lg: 'rounded-[var(--radius-lg)]',
    xl: 'rounded-[var(--radius-xl)]',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn('skeleton', roundedClasses[rounded], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/* ── Preset Skeletons ────────────────────────────────── */

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.75rem"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <Skeleton width="2rem" height="2rem" rounded="full" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton height="0.75rem" width="60%" />
          <Skeleton height="0.625rem" width="40%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTopicCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex items-center gap-4',
        className
      )}
    >
      <Skeleton width="1.25rem" height="1.25rem" rounded="sm" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton height="0.875rem" width="70%" />
        <Skeleton height="0.625rem" width="40%" />
      </div>
      <Skeleton height="0.625rem" width="2.5rem" />
    </div>
  );
}
