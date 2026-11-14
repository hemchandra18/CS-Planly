/* ═══════════════════════════════════════════════════════
   CS-Planly — Tooltip Component v2
   ═══════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: ReactNode;
  className?: string;
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({
  content,
  position = 'top',
  delay = 400,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-[var(--z-tooltip)] px-2.5 py-1.5',
            'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]',
            'text-[var(--text-xs)] font-medium rounded-[var(--radius-sm)] shadow-[var(--shadow-md)]',
            'whitespace-nowrap pointer-events-none',
            'animate-fade-in',
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
