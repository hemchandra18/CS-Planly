/* ═══════════════════════════════════════════════════════
   CS-Planly — Landing Page v3 (Framer-inspired)
   Multi-section cinematic landing with galaxy CTA
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { WorkflowSection } from './WorkflowSection';

/* ── Pill Button ────────────────────────────────────── */

function PillButton({ children, variant = 'primary', to, onClick, className = '', state }: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  to?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  state?: unknown;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`pill-btn pill-btn-${variant} ${className}`}
      >
        <span>{children}</span>
        <span className="pill-btn-dots">
          <span />
          <span />
        </span>
      </button>
    );
  }

  return (
    <Link to={to || '#'} state={state} className={`pill-btn pill-btn-${variant} ${className}`}>
      <span>{children}</span>
      <span className="pill-btn-dots">
        <span />
        <span />
      </span>
    </Link>
  );
}

/* ── Section Reveal Wrapper ─────────────────────────── */

function RevealSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as RefObject<Element>, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
/* ═══════════════════════════════════════════════════════
   Main Landing Page Component
   ═══════════════════════════════════════════════════════ */

export function LandingPage() {
  const [phase, setPhase] = useState(0);

  const handleScrollToThirdPage = (e: React.MouseEvent) => {
    e.preventDefault();
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };
  const ctaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) { setPhase(3); return; }
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
    ];
    return () => {
      timers.forEach(clearTimeout);
      if (ctaTimerRef.current) clearTimeout(ctaTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen env-cinematic overflow-x-hidden flex flex-col space-y-20 md:space-y-28">
      <GalaxyBackground />
      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="landing-section relative z-10 py-20 md:py-32 max-w-5xl">
          <AnimatePresence>
            {phase >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-8"
              >
                {APP_NAME} · Personal study workspace
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold text-white tracking-[-0.04em] leading-[1.05] mb-6">
                  Build a plan that <br />
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(56,189,248,0.3)]">
                    moves with you.
                  </span>
                </h1>

                <p className="text-[var(--text-lg)] text-[var(--color-text-secondary)] max-w-xl leading-relaxed mb-10">
                  Planly turns your computer-science goals into a personalized study roadmap
                  with daily tasks, progress tracking, and flexible revision.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-4"
              >
                <PillButton onClick={handleScrollToThirdPage} variant="primary">
                  Build my plan
                </PillButton>
                <PillButton to={ROUTES.LOGIN} state={{ fromLanding: true }} variant="secondary">
                  Sign In
                </PillButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — INTERACTIVE WORKFLOW
         ═══════════════════════════════════════════════ */}
      <WorkflowSection />

      {/* ═══════════════════════════════════════════════
          SECTION 3 — CTA WITH GALAXY VISUAL & FOOTER
         ═══════════════════════════════════════════════ */}
      <section id="cta-section" className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        {/* CTA Content (Centered) */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-16 md:py-24 relative z-10">
          <RevealSection className="max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-[clamp(2.4rem,6vw,4.4rem)] font-bold text-white tracking-[-0.035em] leading-[1.08] mb-5">
              Know exactly what <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(56,189,248,0.3)]">
                to study next.
              </span>
            </h2>

            <p className="text-[var(--text-base)] md:text-[var(--text-lg)] text-[var(--color-text-secondary)] max-w-xl leading-relaxed mb-9">
              Start with your goals. Planly turns them into an adaptive roadmap, daily tasks, and spaced revision.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <PillButton to={ROUTES.SIGNUP} state={{ fromLanding: true }} variant="primary">
                Create my plan
              </PillButton>
              <PillButton to={ROUTES.LOGIN} state={{ fromLanding: true }} variant="secondary">
                Sign In
              </PillButton>
            </div>
          </RevealSection>
        </div>

        {/* ── Giant Centered Brand Watermark (Integrated & Masked) ── */}
        <div className="relative w-full overflow-hidden pointer-events-none select-none flex justify-center items-end z-[2] -mb-3 md:-mb-6">
          <span
            className="text-[clamp(5.5rem,19vw,16rem)] font-black tracking-[-0.05em] leading-none uppercase text-center block"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 25px rgba(99,102,241,0.1))',
            }}
          >
            Planly
          </span>
        </div>
      </section>
    </div>
  );
}
