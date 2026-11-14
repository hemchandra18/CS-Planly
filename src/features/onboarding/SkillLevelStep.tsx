/* CS-Planly — Skill Level Step (UI Polish) */
import { useNavigate } from 'react-router-dom';
import { ROUTES, SKILL_LEVEL_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import type { SkillLevel } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export function SkillLevelStep() {
  const navigate = useNavigate();
  const { answers, setSkillLevel } = useOnboarding();

  return (
    <div>
      <h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] font-bold text-[var(--color-text-display)] tracking-[-0.02em] mb-2">
        How would you rate
        <br />
        your current level?
      </h2>
      <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mb-6">
        We'll adjust the depth and pace accordingly
      </p>

      <div className="space-y-2.5">
        {SKILL_LEVEL_OPTIONS.map((option) => {
          const isSelected = answers.skillLevel === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSkillLevel(option.value as SkillLevel)}
              className={`w-full text-left border rounded-[var(--radius-lg)] p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[rgba(112,148,219,0.18)] shadow-[0_0_0_1px_var(--color-accent),0_0_16px_rgba(112,148,219,0.2)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <span className="block text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
                {option.label}
              </span>
              <span className="block text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">
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
        disabled={!answers.skillLevel}
        onClick={() => navigate(ROUTES.ONBOARDING_TIME)}
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
      >
        Continue
      </Button>
    </div>
  );
}
