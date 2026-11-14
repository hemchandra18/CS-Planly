/* CS-Planly — Subjects Step (UI Polish) */
import { useNavigate } from 'react-router-dom';
import { SUBJECT_OPTIONS, ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowRight, Check } from 'lucide-react';

export function SubjectsStep() {
  const navigate = useNavigate();
  const { answers, setSubjects } = useOnboarding();

  function toggle(value: string) {
    setSubjects(
      answers.selectedSubjects.includes(value)
        ? answers.selectedSubjects.filter((item) => item !== value)
        : [...answers.selectedSubjects, value]
    );
  }

  return (
    <div>
      <h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] font-bold text-[var(--color-text-display)] tracking-[-0.02em] mb-2">
        Which subjects do you
        <br />
        want to cover?
      </h2>
      <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mb-6">
        Choose one or more areas to focus on
      </p>

      <div className="space-y-2.5">
        {SUBJECT_OPTIONS.map((option) => {
          const isSelected = answers.selectedSubjects.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`w-full text-left border rounded-[var(--radius-lg)] p-4 transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[rgba(112,148,219,0.18)] shadow-[0_0_0_1px_var(--color-accent),0_0_16px_rgba(112,148,219,0.2)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              {/* Checkbox indicator */}
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-[var(--radius-sm)] border shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                    : 'border-[var(--color-border-hover)] bg-transparent'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </span>

              <div className="min-w-0">
                <span className="block text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
                  {option.label}
                </span>
                <span className="block text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">
                  {option.description}
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
        disabled={!answers.selectedSubjects.length}
        onClick={() => navigate(ROUTES.ONBOARDING_LEVEL)}
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
      >
        Continue
      </Button>
    </div>
  );
}
