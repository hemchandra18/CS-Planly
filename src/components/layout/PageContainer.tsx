/* ═══════════════════════════════════════════════════════
   CS-Planly — Page Container Component
   ═══════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}

/**
 * Content wrapper with max-width constraint.
 * Use narrow=true for auth/onboarding pages.
 */
export function PageContainer({
  children,
  narrow = false,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        narrow ? 'max-w-[var(--max-width-narrow)]' : 'max-w-[var(--max-width-content)]',
        className
      )}
    >
      {children}
    </div>
  );
}
