/* ═══════════════════════════════════════════════════════
   CS-Planly — Loading Screen v2 (Full-page branded loader)
   Minimal, calm. No pulsing glow circus.
   ═══════════════════════════════════════════════════════ */

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[var(--color-bg-void)] flex flex-col items-center justify-center z-[var(--z-modal)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Logo mark — simple text, no box */}
        <span className="text-[var(--text-lg)] font-mono font-bold text-[var(--color-accent)] tracking-wider">
          CS
        </span>

        {/* Subtle loading indicator — thin bar */}
        <div className="w-16 h-[1px] bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
          <motion.div
            className="h-full w-6 bg-[var(--color-accent)]/60 rounded-full"
            animate={{ x: [0, 40, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
