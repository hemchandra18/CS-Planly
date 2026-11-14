/* ═══════════════════════════════════════════════════════
   CS-Planly — Plan Reveal Screen v2
   ~60% visual intensity. The moment of achievement.
   ═══════════════════════════════════════════════════════ */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function PlanRevealScreen() {
  return (
    <div className="min-h-screen env-onboarding flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-md"
      >
        {/* Success indicator — subtle accent dot */}
        <div className="w-3 h-3 rounded-full bg-[var(--color-accent)] mx-auto mb-10 shadow-[0_0_16px_rgba(120,150,200,0.3)]" />

        <h2 className="text-[var(--text-4xl)] font-bold text-[var(--color-text-display)] tracking-[-0.03em] leading-[1.1] mb-4">
          Your plan is ready
        </h2>

        <p className="text-[var(--text-base)] text-[var(--color-text-secondary)] mb-12 leading-relaxed">
          We've created a personalized study path based on your goals. Let's begin.
        </p>

        <Link to={ROUTES.DASHBOARD}>
          <Button size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
            Start studying
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
