/* ═══════════════════════════════════════════════════════
   CS-Planly — 404 Not Found Page v2
   ═══════════════════════════════════════════════════════ */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)] px-6 text-center">
      <p className="text-[var(--text-6xl)] font-bold text-[var(--color-bg-elevated)] mb-6 tabular-nums tracking-[-0.04em]">
        404
      </p>
      <h1 className="text-[var(--text-xl)] font-semibold text-[var(--color-text-display)] mb-2">
        Page not found
      </h1>
      <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] max-w-sm mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center gap-3">
        <Link to={ROUTES.DASHBOARD}>
          <Button>Go to Dashboard</Button>
        </Link>
        <Button
          variant="ghost"
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
          onClick={() => window.history.back()}
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
