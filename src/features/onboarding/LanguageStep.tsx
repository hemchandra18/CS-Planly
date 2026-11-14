/* CS-Planly — Language Step (UI Polish) */
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_OPTIONS, ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import type { ProgrammingLanguage } from '@/lib/types';
import { ArrowRight, Code2 } from 'lucide-react';

export function LanguageStep() {
  const navigate = useNavigate();
  const { answers, setLanguage } = useOnboarding();

  return (
    <div>
      <h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] font-bold text-[var(--color-text-display)] tracking-[-0.02em] mb-2">
        Which language do you
        <br />
        want to practice in?
      </h2>
      <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mb-6">
        Code examples will use your chosen language
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {LANGUAGE_OPTIONS.map((option) => {
          const isSelected = answers.preferredLanguage === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setLanguage(option.value as ProgrammingLanguage)}
              className={`border rounded-[var(--radius-lg)] p-4 text-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[rgba(112,148,219,0.18)] shadow-[0_0_0_1px_var(--color-accent),0_0_16px_rgba(112,148,219,0.2)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <Code2 className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-tertiary)]'}`} />
              <span className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        className="mt-8"
        fullWidth
        size="lg"
        disabled={!answers.preferredLanguage}
        onClick={() => navigate(ROUTES.ONBOARDING_PREFERENCES)}
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
      >
        Continue
      </Button>
    </div>
  );
}
