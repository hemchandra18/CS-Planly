/* CS-Planly — Daily Time Step (UI Polish) */
import { useNavigate } from 'react-router-dom';
import { DAILY_TIME_OPTIONS, ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowRight } from 'lucide-react';

export function DailyTimeStep() {
  const navigate = useNavigate();
  const { answers, setDailyHours } = useOnboarding();

  return (
    <div>
      <h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] font-bold text-[var(--color-text-display)] tracking-[-0.02em] mb-2">
        How much time can you
        <br />
        dedicate daily?
      </h2>
      <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mb-6">
        Even 1 hour a day adds up significantly
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {DAILY_TIME_OPTIONS.map((option) => {
          const isSelected = answers.dailyHours === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setDailyHours(option.value)}
              className={`border rounded-[var(--radius-lg)] p-4 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[rgba(112,148,219,0.18)] shadow-[0_0_0_1px_var(--color-accent),0_0_16px_rgba(112,148,219,0.2)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <span className="block text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">
                {option.label}
              </span>
              <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        className="mt-8"
        fullWidth
        size="lg"
        onClick={() => navigate(ROUTES.ONBOARDING_TARGET)}
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
      >
        Continue
      </Button>
    </div>
  );
}
