/* CS-Planly — Target Date Step (UI Polish) */
import { useNavigate } from 'react-router-dom';
import { ROUTES, TARGET_DATE_PRESETS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { format, addDays } from 'date-fns';
import { ArrowRight, Calendar } from 'lucide-react';

export function TargetDateStep() {
  const navigate = useNavigate();
  const { answers, setTargetDate } = useOnboarding();

  return (
    <div>
      <h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] font-bold text-[var(--color-text-display)] tracking-[-0.02em] mb-2">
        When do you want
        <br />
        to finish?
      </h2>
      <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mb-6">
        Set a target or go at your own pace
      </p>

      <div className="space-y-2.5">
        {TARGET_DATE_PRESETS.map((option) => {
          const date = format(addDays(new Date(), option.days), 'yyyy-MM-dd');
          const selected = answers.targetDate === date;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setTargetDate(date)}
              className={`w-full border rounded-[var(--radius-lg)] p-4 text-left transition-all cursor-pointer flex items-center gap-3 ${
                selected
                  ? 'border-[var(--color-accent)] bg-[rgba(112,148,219,0.18)] shadow-[0_0_0_1px_var(--color-accent),0_0_16px_rgba(112,148,219,0.2)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <Calendar className={`w-4 h-4 shrink-0 ${selected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-tertiary)]'}`} />
              <div className="min-w-0">
                <span className="block text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
                  {option.label}
                </span>
                <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                  Finish by {format(addDays(new Date(), option.days), 'MMM d, yyyy')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        className="mt-8"
        fullWidth
        size="lg"
        onClick={() => navigate(ROUTES.ONBOARDING_LANGUAGE)}
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
      >
        Continue
      </Button>
    </div>
  );
}
