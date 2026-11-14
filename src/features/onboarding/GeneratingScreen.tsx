/* ═══════════════════════════════════════════════════════
   CS-Planly — Generating Screen v2
   ~60% visual intensity. The plan is being created.
   ═══════════════════════════════════════════════════════ */

import { motion } from 'framer-motion';

export function GeneratingScreen() {
  return (
    <div className="min-h-screen env-onboarding flex items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-sm">
        {/* Subtle breathing indicator */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-[var(--color-accent)]/30 mx-auto mb-10"
        />

        <h2 className="text-[var(--text-3xl)] font-bold text-[var(--color-text-display)] tracking-[-0.02em] mb-4">
          Building your
          <br />
          study plan
        </h2>

        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Analyzing your goals and creating a personalized path…
        </p>
      </div>
    </div>
  );
}
