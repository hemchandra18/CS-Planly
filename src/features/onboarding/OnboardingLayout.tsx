/* ═══════════════════════════════════════════════════════
   CS-Planly — Onboarding Layout (UI Polish Pass)
   Centered panel with step indicator, dark workspace feel.
   ═══════════════════════════════════════════════════════ */

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { ArrowLeft } from 'lucide-react';

export function OnboardingLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current step from URL
  const currentStep = ONBOARDING_STEPS.find((s) =>
    location.pathname.includes(s.path.split('/').pop()!)
  );
  const stepNumber = currentStep?.step ?? 0;
  const isWelcome = location.pathname.includes('welcome');

  return (
    <OnboardingProvider>
      <div className="min-h-screen env-onboarding flex flex-col">
        {/* ── Top Bar: Progress + Step Counter ────────── */}
        {stepNumber > 0 && (
          <div className="relative z-10 w-full">
            {/* Progress bar */}
            <div className="h-[3px] bg-[var(--color-bg-elevated)]">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] rounded-r-full"
                initial={false}
                animate={{ width: `${(stepNumber / TOTAL_ONBOARDING_STEPS) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Step counter + back button row */}
            <div className="flex items-center justify-between px-6 py-4 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <span className="inline-flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-text-tertiary)] font-mono tabular-nums">
                <span className="text-[var(--color-accent)] font-medium">{stepNumber}</span>
                <span className="text-[var(--color-text-tertiary)]/40">/</span>
                {TOTAL_ONBOARDING_STEPS}
              </span>
            </div>
          </div>
        )}

        {/* ── Step Content — Centered in spacious dark panel ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
          <div className="w-full max-w-lg">
            {/* Wrap in a translucent dark glass panel for non-welcome steps */}
            {!isWelcome ? (
              <div className="rounded-[var(--radius-xl)] border border-white/10 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
}
