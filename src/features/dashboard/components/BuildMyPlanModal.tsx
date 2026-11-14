/* ═══════════════════════════════════════════════════════
   Planly — BuildMyPlanModal
   Full-screen cinematic glassmorphic onboarding overlay
   for new users to configure and generate their study plan.
   ═══════════════════════════════════════════════════════ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Briefcase, 
  Building2, 
  Globe,
  Code2, 
  Check, 
  CheckCircle2, 
  Layers, 
  Database, 
  Network, 
  Cpu, 
  Server, 
  Monitor, 
  Binary,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generateAndPersistPlan, createSamplePlan } from '@/lib/planGenerator';
import type { 
  TargetRole, 
  ExperienceLevel, 
  CompanyType, 
  CompanyRegion, 
  Goal, 
  ProgrammingLanguage, 
  SkillLevel,
  OnboardingAnswers 
} from '@/lib/types';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';

interface BuildMyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: () => void;
}

/* ── Step Definitions ── */
const STEPS = [
  { id: 1, title: 'Target Role', subtitle: 'What career position are you preparing for?' },
  { id: 2, title: 'Target Companies', subtitle: 'Which company tier or culture fits your goals?' },
  { id: 3, title: 'Core Subjects', subtitle: 'Select curriculum areas you want in your plan' },
  { id: 4, title: 'Schedule & Commitment', subtitle: 'How much time can you dedicate daily?' },
  { id: 5, title: 'Primary Language', subtitle: 'Select your coding interview language' },
];

export function BuildMyPlanModal({ isOpen, onClose, onPlanGenerated }: BuildMyPlanModalProps) {
  const { user, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);

  // Form State
  const [targetRole, setTargetRole] = useState<TargetRole>('software-engineer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('0-2-years');
  const [companyType, setCompanyType] = useState<CompanyType>('faang');
  const [companyRegion, setCompanyRegion] = useState<CompanyRegion>('india');
  const [goal, setGoal] = useState<Goal>('placement');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'sub-dsa',
    'sub-system-design',
    'sub-os',
    'sub-dbms',
  ]);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [targetDaysCount, setTargetDaysCount] = useState<number>(90);
  const [weekendBreaks, setWeekendBreaks] = useState(true);
  const [revisionDays, setRevisionDays] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState<ProgrammingLanguage>('python');

  if (!isOpen) return null;

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((s) => s !== id)
          : prev
        : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleGeneratePlan();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationPhase(1);

    const targetDateStr = format(addDays(new Date(), targetDaysCount), 'yyyy-MM-dd');

    const answers: OnboardingAnswers = {
      targetRole,
      experienceLevel,
      companyType,
      companyRegion,
      goal,
      selectedSubjects,
      skillLevel,
      dailyHours,
      targetDate: targetDateStr,
      preferredLanguage,
      includeVideos: true,
      includeProblems: true,
      weekendBreaks,
      revisionDays,
    };

    // Staggered generation animation phases
    setTimeout(() => setGenerationPhase(2), 800);
    setTimeout(() => setGenerationPhase(3), 1600);

    try {
      if (user?.id && user.id !== 'demo-student-id') {
        // Update user profile in Firebase / localStorage
        localStorage.setItem(`planly_onboarding_${user.id}`, 'true');
        try {
          await setDoc(doc(db, 'profiles', user.id), {
            target_role: targetRole,
            experience_level: experienceLevel,
            company_type: companyType,
            company_region: companyRegion,
            goal,
            selected_subjects: selectedSubjects,
            skill_level: skillLevel,
            daily_hours: dailyHours,
            target_date: targetDateStr,
            preferred_language: preferredLanguage,
            weekend_breaks: weekendBreaks,
            revision_days: revisionDays,
            onboarding_completed: true,
          }, { merge: true });
        } catch (e) {
          console.warn('Error saving plan answers to Firestore:', e);
        }

        // Generate and persist study plan
        const { error } = await generateAndPersistPlan(user.id, answers);
        if (error) {
          console.warn('Real plan generation warning, falling back to sample plan:', error);
          await createSamplePlan(user.id);
        }
      } else {
        // Fallback for demo mode
        localStorage.setItem('planly_demo_user_plan_configured', 'true');
      }

      await refreshProfile();
      setTimeout(() => {
        setIsGenerating(false);
        toast.success('Your adaptive study plan has been generated!');
        onPlanGenerated();
      }, 2200);
    } catch (err: any) {
      console.error('Error generating plan:', err);
      toast.error('Plan generated with standard template.');
      setIsGenerating(false);
      onPlanGenerated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* ── Dark Backdrop Blur ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* ── Modal Container ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl rounded-3xl bg-zinc-950/90 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── Header Bar ── */}
        <div className="relative px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Build My Plan
              </h2>
              <p className="text-xs text-zinc-400">
                Step {currentStep} of {STEPS.length} · {STEPS[currentStep - 1].title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close for now"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* ── Progress Track ── */}
        <div className="w-full bg-white/[0.04] h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500"
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* ── Body: Form Steps or Generating State ── */}
        <div className="relative p-6 sm:p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              /* ── Generation Animation Screen ── */
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative size-20 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-sky-400/20 border border-blue-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.25)]">
                  <Loader2 className="size-8 text-sky-400 animate-spin" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                    Synthesizing Your Curriculum
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    {generationPhase === 1 && 'Aligning role competencies and company interview patterns…'}
                    {generationPhase === 2 && 'Structuring topics, problem sets, and revision cadence…'}
                    {generationPhase === 3 && 'Finalizing your personalized daily schedule…'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Curriculum Engine Active</span>
                </div>
              </motion.div>
            ) : (
              /* ── Active Step Views ── */
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {STEPS[currentStep - 1].title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    {STEPS[currentStep - 1].subtitle}
                  </p>
                </div>

                {/* ── STEP 1: Target Role & Experience ── */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'software-engineer', label: 'Software Engineer (SDE)', icon: Server, desc: 'Full-time core engineering & systems' },
                        { id: 'sde-intern', label: 'SDE Intern', icon: Briefcase, desc: 'College student & internship preparation' },
                      ].map((role) => {
                        const Icon = role.icon;
                        const isSelected = targetRole === role.id;
                        return (
                          <div
                            key={role.id}
                            onClick={() => setTargetRole(role.id as TargetRole)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-zinc-400'}`}>
                                <Icon className="size-5" />
                              </div>
                              {isSelected && <CheckCircle2 className="size-4 text-blue-400" />}
                            </div>
                            <h4 className="text-sm font-semibold text-white">{role.label}</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">{role.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        Experience Level
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { id: '0-2-years', label: '0 – 2 Years', desc: 'Entry / Junior' },
                          { id: '2-5-years', label: '2 – 5 Years', desc: 'Mid-Level' },
                          { id: '5-plus-years', label: '5+ Years', desc: 'Senior / Lead' },
                        ].map((exp) => (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() => setExperienceLevel(exp.id as ExperienceLevel)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              experienceLevel === exp.id
                                ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                                : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-semibold">{exp.label}</div>
                            <div className="text-[10px] text-zinc-500">{exp.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                          Primary Goal
                        </label>
                        <select
                          value={goal}
                          onChange={(e) => setGoal(e.target.value as Goal)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="placement">Campus / Placement Hiring</option>
                          <option value="competitive">Competitive Programming & Off-Campus</option>
                          <option value="self-learning">Career Switch / Self-Learning</option>
                          <option value="gate">GATE / Higher Studies</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                          Skill Level
                        </label>
                        <select
                          value={skillLevel}
                          onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="beginner">Beginner (Foundations first)</option>
                          <option value="intermediate">Intermediate (Standard depth)</option>
                          <option value="advanced">Advanced (Fast-paced mastery)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Target Companies ── */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'faang', label: 'FAANG & Tier 1 Big Tech', icon: Building2, desc: 'Google, Meta, Amazon, Microsoft, Apple' },
                        { id: 'startups', label: 'High-Growth Tech Startups', icon: Sparkles, desc: 'Unicorns, Stripe, Uber, modern scaleups' },
                        { id: 'product-companies', label: 'Product Companies', icon: Layers, desc: 'Adobe, Atlassian, Cisco, Oracle' },
                        { id: 'open-to-all', label: 'Open to All Opportunities', icon: Globe, desc: 'Comprehensive foundation for all hiring tests' },
                      ].map((comp) => {
                        const Icon = comp.icon;
                        const isSelected = companyType === comp.id;
                        return (
                          <div
                            key={comp.id}
                            onClick={() => setCompanyType(comp.id as CompanyType)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-zinc-400'}`}>
                                <Icon className="size-5" />
                              </div>
                              {isSelected && <CheckCircle2 className="size-4 text-blue-400" />}
                            </div>
                            <h4 className="text-sm font-semibold text-white">{comp.label}</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">{comp.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        Geographic Target
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { id: 'india', label: 'India / APAC' },
                          { id: 'us-europe-others', label: 'US / Europe / Remote Global' },
                        ].map((reg) => (
                          <button
                            key={reg.id}
                            type="button"
                            onClick={() => setCompanyRegion(reg.id as CompanyRegion)}
                            className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                              companyRegion === reg.id
                                ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                                : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {reg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Core Subjects ── */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-400">
                      Select which curriculum modules to include in your personalized roadmap:
                    </p>

                    <div className="space-y-2.5">
                      {[
                        { id: 'sub-dsa', label: 'Data Structures & Algorithms', icon: Binary, topics: 'Arrays, Trees, Graphs, DP, Heaps, Two-Pointer' },
                        { id: 'sub-system-design', label: 'System Design & Architecture', icon: Cpu, topics: 'HLD, LLD, Caching, Load Balancing, Rate Limiters' },
                        { id: 'sub-os', label: 'Operating Systems', icon: Monitor, topics: 'Processes, Concurrency, Memory Management, Deadlocks' },
                        { id: 'sub-dbms', label: 'Database Management Systems', icon: Database, topics: 'SQL, Indexing, Transactions, ACID, Normalization' },
                        { id: 'sub-networks', label: 'Computer Networks', icon: Network, topics: 'TCP/IP, HTTP/HTTPS, DNS, WebSockets, Security' },
                      ].map((subject) => {
                        const Icon = subject.icon;
                        const isSelected = selectedSubjects.includes(subject.id);
                        return (
                          <div
                            key={subject.id}
                            onClick={() => toggleSubject(subject.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-zinc-400'}`}>
                                <Icon className="size-4" />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-white">{subject.label}</h4>
                                <p className="text-xs text-zinc-400 mt-0.5">{subject.topics}</p>
                              </div>
                            </div>

                            <div className={`size-5 rounded-lg border flex items-center justify-center transition-all ${
                              isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-700 bg-zinc-900'
                            }`}>
                              {isSelected && <Check className="size-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Schedule & Commitment ── */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    {/* Daily Hours Commitment */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        Daily Study Time
                      </label>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { hours: 1, label: '1 hour/day', sub: 'Light' },
                          { hours: 2, label: '2 hours/day', sub: 'Balanced' },
                          { hours: 3, label: '3 hours/day', sub: 'Intensive' },
                          { hours: 4, label: '4+ hours/day', sub: 'Hardcore' },
                        ].map((h) => (
                          <button
                            key={h.hours}
                            type="button"
                            onClick={() => setDailyHours(h.hours)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              dailyHours === h.hours
                                ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                                : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <div className="text-sm font-bold text-white">{h.hours} hr{h.hours > 1 ? 's' : ''}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">{h.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Timeline */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        Target Timeline
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { days: 30, label: '30 Days', desc: 'Crash Prep' },
                          { days: 60, label: '60 Days', desc: 'Standard Track' },
                          { days: 90, label: '90 Days', desc: 'Comprehensive' },
                        ].map((timeline) => (
                          <button
                            key={timeline.days}
                            type="button"
                            onClick={() => setTargetDaysCount(timeline.days)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              targetDaysCount === timeline.days
                                ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                                : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <div className="text-sm font-bold text-white">{timeline.label}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">{timeline.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cadence Preferences */}
                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <div
                        onClick={() => setWeekendBreaks(!weekendBreaks)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          weekendBreaks ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/10'
                        }`}
                      >
                        <span className="text-xs font-medium text-white">Weekend rest breaks</span>
                        <div className={`size-4 rounded border flex items-center justify-center ${
                          weekendBreaks ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-700'
                        }`}>
                          {weekendBreaks && <Check className="size-2.5 stroke-[3]" />}
                        </div>
                      </div>

                      <div
                        onClick={() => setRevisionDays(!revisionDays)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          revisionDays ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/10'
                        }`}
                      >
                        <span className="text-xs font-medium text-white">Spaced revision days</span>
                        <div className={`size-4 rounded border flex items-center justify-center ${
                          revisionDays ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-700'
                        }`}>
                          {revisionDays && <Check className="size-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 5: Primary Language ── */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-400">
                      Problems, snippets, and solutions will be personalized to this language:
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'python', label: 'Python', desc: 'Readable, clean, standard for DSA & AI' },
                        { id: 'java', label: 'Java', desc: 'Enterprise favorite & Big Tech standard' },
                        { id: 'cpp', label: 'C++', desc: 'Maximum performance & competitive speed' },
                        { id: 'javascript', label: 'JavaScript / TypeScript', desc: 'Web ecosystem, fullstack, modern runtime' },
                      ].map((lang) => {
                        const isSelected = preferredLanguage === lang.id;
                        return (
                          <div
                            key={lang.id}
                            onClick={() => setPreferredLanguage(lang.id as ProgrammingLanguage)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Code2 className={`size-5 ${isSelected ? 'text-blue-400' : 'text-zinc-400'}`} />
                              {isSelected && <CheckCircle2 className="size-4 text-blue-400" />}
                            </div>
                            <h4 className="text-sm font-semibold text-white">{lang.label}</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">{lang.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer Navigation Bar ── */}
        {!isGenerating && (
          <div className="relative px-6 py-4 border-t border-white/[0.08] bg-zinc-950/60 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentStep === 1
                  ? 'opacity-30 cursor-not-allowed text-zinc-500'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ChevronLeft className="size-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Skip for now
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all active:scale-[0.98]"
              >
                <span>{currentStep === STEPS.length ? 'Generate My Plan' : 'Continue'}</span>
                {currentStep === STEPS.length ? (
                  <Sparkles className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
