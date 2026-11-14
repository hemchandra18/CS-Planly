/* ═══════════════════════════════════════════════════════
   CS-Planly — Interactive Animated Workflow Section
   Left-Edge Tactile Paper Sheet Edition with Slide & Curl Spring Animation
   ═══════════════════════════════════════════════════════ */

import { motion, useReducedMotion } from 'framer-motion';
import { 
  Sparkles, 
  ChevronDown, 
  Target, 
  Clock, 
  Cpu, 
  CalendarCheck, 
  Repeat, 
  Flame, 
  BookOpen 
} from 'lucide-react';

export function WorkflowSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="workflow-section" className="workflow-section relative min-h-screen flex flex-col justify-center items-center py-12 md:py-16 w-full overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-items-center gap-8 xl:gap-12">
        
          {/* ── Left Column: Clean Floating Comparison Card ── */}
          <div className="flex justify-center w-full">
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              style={{ 
                willChange: 'transform, opacity',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                paddingLeft: '32px',
                paddingRight: '32px',
                paddingTop: '30px',
                paddingBottom: '22px'
              }}
              className="w-full max-w-[580px] rounded-3xl bg-gradient-to-b from-slate-900/60 via-slate-950/70 to-black/80 border border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden"
            >
            {/* Subtle Ambient Cosmic Corner Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-500/[0.12] to-sky-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* ── Section 1: Header (Badge + Heading) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.14] w-fit shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                <span className="text-[11px] font-mono tracking-widest font-bold text-slate-300 uppercase">
                  BEFORE VS. AFTER
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl xl:text-[2.2rem] font-extrabold text-white tracking-[-0.03em] leading-tight">
                Scattered bookmarks vs. <br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(56,189,248,0.35)]">
                  your adaptive study plan
                </span>
              </h2>
            </div>

            {/* ── Section 2: Before Card (Studying on your own) ── */}
            <div 
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '18px 22px' }}
              className="rounded-2xl bg-gradient-to-br from-red-500/[0.07] to-red-950/[0.15] border border-red-500/20 backdrop-blur-xl transition-all duration-300 hover:border-red-500/35"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-300">
                  Studying on your own
                </span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="text-xs sm:text-sm text-slate-300/90">
                <li className="flex items-center gap-2.5">
                  <span className="text-red-400 font-extrabold text-base leading-none">›</span>
                  <span>50+ scattered tabs, bookmarks, and tutorial playlists</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-400 font-extrabold text-base leading-none">›</span>
                  <span>Guessing what to practice every single evening</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-400 font-extrabold text-base leading-none">›</span>
                  <span>Concepts fade away with zero scheduled revision</span>
                </li>
              </ul>
            </div>

            {/* ── Section 3: After Card (With Planly) ── */}
            <div 
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '18px 22px' }}
              className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.12] via-blue-950/[0.2] to-purple-950/[0.25] border border-indigo-400/35 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.18)] transition-all duration-300 hover:border-indigo-400/55"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-200">
                  With Planly
                </span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="text-xs sm:text-sm text-slate-100">
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-extrabold text-base leading-none">›</span>
                  <span>1 personalized roadmap calibrated to your target date</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-extrabold text-base leading-none">›</span>
                  <span>3 focused daily tasks ready every morning with zero guesswork</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-extrabold text-base leading-none">›</span>
                  <span>Automatic spaced repetition so key concepts stick permanently</span>
                </li>
              </ul>
            </div>

            {/* Scroll Downward Arrow Button — Perfectly Centered in Container */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '100%',
                paddingTop: '6px'
              }}
            >
              <button
                type="button"
                onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Scroll to next page"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '46px',
                  height: '46px',
                  borderRadius: '9999px',
                  cursor: 'pointer'
                }}
                className="border border-white/15 bg-white/[0.04] hover:bg-white/[0.12] hover:border-white/40 text-slate-300 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/20 group"
              >
                <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Right Column: Coordinated CS-Planly Engine Panel ── */}
        <div className="flex justify-center w-full">
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1
            }}
            style={{ 
              willChange: 'transform, opacity',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              gap: '6px',
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '30px',
              paddingBottom: '22px'
            }}
            className="w-full max-w-[580px] rounded-3xl bg-gradient-to-b from-slate-900/60 via-slate-950/70 to-black/80 border border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden select-none"
          >
            {/* Subtle Ambient Cosmic Corner Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-500/[0.12] to-sky-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* ── Tier 1: CS-Planly Engine Root ── */}
            <div className="z-10 relative w-full flex justify-center">
              <div className="architecture-widget architecture-node-engine w-full py-3.5 px-5 sm:px-6 rounded-2xl bg-white/[0.04] border border-white/[0.14] backdrop-blur-xl shadow-inner flex items-center justify-between transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-sky-300 shrink-0">
                    <Sparkles className="w-4 h-4 text-sky-300" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-white tracking-wide">
                        CS-Planly Engine
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    </div>
                    <span className="text-[11px] text-slate-300/80 font-mono tracking-widest font-bold uppercase block mt-0.5">
                      Intelligent Planner
                    </span>
                  </div>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10.5px] font-mono font-medium text-slate-300 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  ACTIVE
                </div>
              </div>
            </div>

            {/* SVG Connecting Curves: Tier 1 -> Tier 2 (Width: 600, Height: 40) */}
            <div className="relative w-full h-9 sm:h-10 pointer-events-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 40" fill="none">
                {/* Branch Left: (300, 0) -> (150, 40) */}
                <path
                  d="M 300 0 C 300 20, 150 20, 150 40"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 300 0 C 300 20, 150 20, 150 40"
                  stroke="rgba(147, 197, 253, 0.4)"
                  strokeWidth="1.25"
                  strokeDasharray="8 36"
                  className="animate-flow-dash"
                />
                {!shouldReduceMotion && (
                  <circle r="1.75" fill="#93c5fd" opacity="0.85" className="data-particle">
                    <animateMotion path="M 300 0 C 300 20, 150 20, 150 40" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Branch Right: (300, 0) -> (450, 40) */}
                <path
                  d="M 300 0 C 300 20, 450 20, 450 40"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 300 0 C 300 20, 450 20, 450 40"
                  stroke="rgba(147, 197, 253, 0.4)"
                  strokeWidth="1.25"
                  strokeDasharray="8 36"
                  className="animate-flow-dash"
                />
                {!shouldReduceMotion && (
                  <circle r="1.75" fill="#93c5fd" opacity="0.85" className="data-particle">
                    <animateMotion path="M 300 0 C 300 20, 450 20, 450 40" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>
            </div>

            {/* ── Tier 2: Refined Input Cards (Target Role & Study Cadence) ── */}
            <div className="z-10 grid grid-cols-2 gap-3 sm:gap-4 w-full">
              {/* Left Input: Target Role */}
              <div className="architecture-widget architecture-widget-input px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl group/role">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-indigo-300 shrink-0">
                    <Target className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide truncate group-hover/role:text-white transition-colors">Target Role</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/80" />
                    </div>
                    <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium truncate mt-0.5">
                      SDE-1 · Systems · Cloud
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Input: Study Cadence */}
              <div className="architecture-widget architecture-widget-input px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl group/cadence">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-sky-300 shrink-0">
                    <Clock className="w-4 h-4 text-sky-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide truncate group-hover/cadence:text-white transition-colors">Study Cadence</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" />
                    </div>
                    <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium truncate mt-0.5">
                      2h / Day · 90-Day Sprint
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Connecting Curves: Tier 2 -> Tier 3 (Width: 600, Height: 40) */}
            <div className="relative w-full h-9 sm:h-10 pointer-events-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 40" fill="none">
                {/* Converge Left: (150, 0) -> (300, 40) */}
                <path
                  d="M 150 0 C 150 20, 300 20, 300 40"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 150 0 C 150 20, 300 20, 300 40"
                  stroke="rgba(165, 180, 252, 0.4)"
                  strokeWidth="1.25"
                  strokeDasharray="8 36"
                  className="animate-flow-dash"
                />
                {!shouldReduceMotion && (
                  <circle r="1.75" fill="#a5b4fc" opacity="0.85" className="data-particle">
                    <animateMotion path="M 150 0 C 150 20, 300 20, 300 40" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Converge Right: (450, 0) -> (300, 40) */}
                <path
                  d="M 450 0 C 450 20, 300 20, 300 40"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 450 0 C 450 20, 300 20, 300 40"
                  stroke="rgba(147, 197, 253, 0.4)"
                  strokeWidth="1.25"
                  strokeDasharray="8 36"
                  className="animate-flow-dash"
                />
                {!shouldReduceMotion && (
                  <circle r="1.75" fill="#93c5fd" opacity="0.85" className="data-particle">
                    <animateMotion path="M 450 0 C 450 20, 300 20, 300 40" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>
            </div>

            {/* ── Tier 3: Smart Curriculum Balancer Hub ── */}
            <div className="z-10 w-full">
              <div className="architecture-widget architecture-widget-hub px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/[0.08] via-slate-900/60 to-purple-500/[0.08] border border-indigo-400/25 hover:border-indigo-400/40 backdrop-blur-xl flex items-center justify-between transition-all duration-300 group/hub">
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-300 shrink-0">
                    <Cpu className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide truncate group-hover/hub:text-indigo-100 transition-colors">
                      Smart Curriculum Balancer
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-mono tracking-wider text-slate-300/80 font-medium truncate mt-0.5 uppercase">
                      DSA · SYSTEM DESIGN · NETWORKS · OS
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/15 text-[9.5px] sm:text-[10.5px] font-mono font-semibold text-slate-300 tracking-wider flex items-center gap-1.5 shrink-0 ml-2 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_6px_rgba(129,140,248,0.8)]" />
                  AUTO-CALIBRATED
                </span>
              </div>
            </div>

            {/* SVG Connecting Line: Tier 3 -> Tier 4 (Width: 600, Height: 32) */}
            <div className="relative w-full h-8 sm:h-9 pointer-events-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 32" fill="none">
                <path
                  d="M 300 0 L 300 32"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 300 0 L 300 32"
                  stroke="rgba(110, 231, 183, 0.4)"
                  strokeWidth="1.25"
                  strokeDasharray="6 28"
                  className="animate-flow-dash"
                />
                {!shouldReduceMotion && (
                  <circle r="1.75" fill="#6ee7b7" opacity="0.85" className="data-particle">
                    <animateMotion path="M 300 0 L 300 32" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>
            </div>

            {/* ── Tier 4: Personalized Study Roadmap Active ── */}
            <div className="z-10 w-full flex justify-center">
              <div className="architecture-widget architecture-widget-roadmap w-full max-w-[440px] px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-500/[0.07] via-slate-900/50 to-emerald-500/[0.07] border border-emerald-500/25 hover:border-emerald-400/40 backdrop-blur-xl flex items-center justify-center gap-2.5 transition-all duration-300">
                <CalendarCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide text-center">
                  Personalized Study Roadmap Active
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              </div>
            </div>

            {/* SVG Connecting Curves: Tier 4 -> Tier 5 (3-Way Branch, Width: 600, Height: 40) */}
            <div className="relative w-full h-9 sm:h-10 pointer-events-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 40" fill="none">
                {/* Branch Left: (300, 0) -> (100, 40) */}
                <path
                  d="M 300 0 C 300 20, 100 20, 100 40"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 300 0 C 300 20, 100 20, 100 40"
                  stroke="rgba(147, 197, 253, 0.35)"
                  strokeWidth="1.25"
                  strokeDasharray="8 36"
                  className="animate-flow-dash"
                />
                {!shouldReduceMotion && (
                  <circle r="1.75" fill="#93c5fd" opacity="0.85" className="data-particle">
                    <animateMotion path="M 300 0 C 300 20, 100 20, 100 40" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Branch Center: (300, 0) -> (300, 40) */}
                <path
                  d="M 300 0 L 300 40"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 300 0 L 300 40"
                  stroke="rgba(165, 180, 252, 0.35)"
                  strokeWidth="1.25"
                  strokeDasharray="8 36"
                  className="animate-flow-dash"
                />
                {!shouldReduceMotion && (
                  <circle r="1.75" fill="#a5b4fc" opacity="0.85" className="data-particle">
                    <animateMotion path="M 300 0 L 300 40" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Branch Right: (300, 0) -> (500, 40) */}
                <path
                  d="M 300 0 C 300 20, 500 20, 500 40"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 300 0 C 300 20, 500 20, 500 40"
                  stroke="rgba(110, 231, 183, 0.35)"
                  strokeWidth="1.25"
                  strokeDasharray="8 36"
                  className="animate-flow-dash"
                />
                {!shouldReduceMotion && (
                  <circle r="1.75" fill="#6ee7b7" opacity="0.85" className="data-particle">
                    <animateMotion path="M 300 0 C 300 20, 500 20, 500 40" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>
            </div>

            {/* ── Tier 5: Three Output Action Pills ── */}
            <div className="z-10 grid grid-cols-3 gap-2.5 sm:gap-3 w-full">
              <div className="architecture-output py-2.5 px-2 sm:px-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-xl flex items-center justify-center gap-2 group/out1">
                <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-wider font-mono text-slate-300 truncate">
                  Daily Tasks
                </span>
              </div>

              <div className="architecture-output py-2.5 px-2 sm:px-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-xl flex items-center justify-center gap-2 group/out2">
                <Repeat className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-wider font-mono text-slate-300 truncate">
                  Spaced Review
                </span>
              </div>

              <div className="architecture-output py-2.5 px-2 sm:px-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-xl flex items-center justify-center gap-2 group/out3">
                <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-wider font-mono text-slate-300 truncate">
                  Streak Stats
                </span>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  </section>
);
}
