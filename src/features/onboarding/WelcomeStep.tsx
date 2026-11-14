/* CS-Planly — Welcome Step (UI Polish) */
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function WelcomeStep() {
  return (
    <div className="text-center py-8">
      {/* Subtle icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 mb-8">
        <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
      </div>

      <h1 className="text-[var(--text-4xl)] md:text-[var(--text-5xl)] font-bold text-[var(--color-text-display)] tracking-[-0.03em] leading-[1.1] mb-5">
        Let's build your
        <br />
        study plan
      </h1>

      <p className="text-[var(--text-base)] text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed mb-12">
        Answer a few quick questions so we can create a plan that fits your
        goals, timeline, and skill level.
      </p>

      <Link to="/onboarding/role">
        <Button
          size="lg"
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Let's go
        </Button>
      </Link>
    </div>
  );
}
