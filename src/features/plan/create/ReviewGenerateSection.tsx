/* ═══════════════════════════════════════════════════════
   Planly — ReviewGenerateSection (Step 3/3)
   ═══════════════════════════════════════════════════════ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generateAndPersistPlan, createSamplePlan } from '@/lib/planGenerator';
import { toast } from 'sonner';
import type { AboutYouData } from './AboutYouSection';
import type { ScheduleData } from './ScheduleSection';
import type { OnboardingAnswers } from '@/lib/types';

interface ReviewGenerateSectionProps {
  aboutYou: AboutYouData;
  schedule: ScheduleData;
  onBack: () => void;
  onPlanGenerated: () => void;
}

const roleLabels: Record<string, string> = {
  'sde-intern': 'SDE Intern',
  'software-engineer': 'Software Engineer',
};
const expLabels: Record<string, string> = {
  '0-2-years': '0 – 2 years',
  '2-5-years': '2 – 5 years',
  '5-plus-years': '5+ years',
};
const companyLabels: Record<string, string> = {
  startups: 'Startups',
  faang: 'FAANG',
  'product-companies': 'All Product Based Companies',
  'open-to-all': 'Open to all',
};
const regionLabels: Record<string, string> = {
  india: 'India',
  'us-europe-others': 'US / Europe / Others',
};
const langLabels: Record<string, string> = {
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  javascript: 'JavaScript / TypeScript',
};
const timelineLabels: Record<string, string> = {
  '30-days': '30 Days',
  '60-days': '60 Days',
  '90-days': '90 Days',
  custom: 'Custom Date',
};

const phaseMessages = [
  'Aligning role competencies and interview patterns…',
  'Structuring topics, problem sets, and revision cadence…',
  'Finalizing your personalized daily schedule…',
];

export function ReviewGenerateSection({
  aboutYou,
  schedule,
  onBack,
  onPlanGenerated,
}: ReviewGenerateSectionProps) {
  const { user, refreshProfile } = useAuth();

  const [isGenerating, setIsGenerating] = useState(false);
  const [phase, setPhase] = useState(0);

  const timelineDays =
    schedule.timelinePreset === 'custom'
      ? null
      : parseInt(schedule.timelinePreset);

  const targetDateStr =
    schedule.customDate ??
    format(addDays(new Date(), timelineDays ?? 90), 'yyyy-MM-dd');

  const summaryRows: { label: string; value: string }[] = [
    { label: 'Role', value: roleLabels[aboutYou.role] ?? aboutYou.role },
  ];
  if (aboutYou.role === 'software-engineer' && aboutYou.experience) {
    summaryRows.push({ label: 'Experience', value: expLabels[aboutYou.experience] ?? aboutYou.experience });
  }
  summaryRows.push(
    { label: 'Target Companies', value: companyLabels[aboutYou.targetCompany] ?? aboutYou.targetCompany },
    { label: 'Region', value: regionLabels[aboutYou.region] ?? aboutYou.region },
    { label: 'Language', value: langLabels[schedule.language] ?? schedule.language },
    { label: 'Daily Study Time', value: `${schedule.dailyHours} hour${schedule.dailyHours > 1 ? 's' : ''} / day` },
    {
      label: 'Timeline',
      value:
        schedule.timelinePreset === 'custom'
          ? `Custom — ${schedule.customDate ?? 'TBD'}`
          : timelineLabels[schedule.timelinePreset] ?? schedule.timelinePreset,
    },
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    setPhase(0);

    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 1800);

    const answers: OnboardingAnswers = {
      targetRole: aboutYou.role,
      experienceLevel: aboutYou.experience ?? null,
      companyType: aboutYou.targetCompany,
      companyRegion: aboutYou.region,
      goal: 'placement',
      selectedSubjects: ['sub-dsa', 'sub-system-design', 'sub-os', 'sub-dbms'],
      skillLevel: 'intermediate',
      dailyHours: schedule.dailyHours,
      targetDate: targetDateStr,
      preferredLanguage: schedule.language,
      includeVideos: true,
      includeProblems: true,
      weekendBreaks: true,
      revisionDays: true,
    };

    try {
      if (user?.id && user.id !== 'demo-student-id') {
        // User is already authenticated: save directly & skip auth!
        await setDoc(
          doc(db, 'profiles', user.id),
          {
            target_role: aboutYou.role,
            experience_level: aboutYou.experience ?? null,
            company_type: aboutYou.targetCompany,
            company_region: aboutYou.region,
            daily_hours: schedule.dailyHours,
            target_date: targetDateStr,
            preferred_language: schedule.language,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
          },
          { merge: true }
        );

        const { error } = await generateAndPersistPlan(user.id, answers);
        if (error) {
          console.warn('Plan generation warning, using sample plan:', error);
          await createSamplePlan(user.id);
        }

        await refreshProfile();
        setTimeout(() => {
          setIsGenerating(false);
          toast.success('Your personalized study plan is ready!');
          onPlanGenerated(); // directly to /dashboard!
        }, 2200);
      } else {
        localStorage.setItem('planly_pending_onboarding_answers', JSON.stringify(answers));
        localStorage.setItem('planly_demo_user_plan_configured', 'true');
        setTimeout(() => {
          setIsGenerating(false);
          toast.success('Your personalized study plan is ready!');
          onPlanGenerated();
        }, 2200);
      }
    } catch (err) {
      console.error('Error generating plan:', err);
      setIsGenerating(false);
      onPlanGenerated();
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  /* ── Generating Phase Animation ── */
  if (isGenerating) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: '#121318',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: '20px',
          padding: '48px 30px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          textAlign: 'center',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 28px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15), rgba(56,189,248,0.15))',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(56,189,248,0.2)',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{
              width: '28px',
              height: '28px',
              border: '2.5px solid rgba(56,189,248,0.2)',
              borderTopColor: '#38bdf8',
              borderRadius: '50%',
            }}
          />
        </div>

        <h3
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '0 0 10px',
          }}
        >
          Synthesizing Your Curriculum
        </h3>

        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: '14px',
              color: '#9ba2b2',
              margin: '0 0 24px',
              minHeight: '20px',
            }}
          >
            {phaseMessages[phase]}
          </motion.p>
        </AnimatePresence>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#64748b',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#34d399',
              animation: 'pulse 1.5s infinite',
            }}
          />
          <span>AI Curriculum Engine Active</span>
        </div>
      </div>
    );
  }

  /* ── Step 3 Review Summary Card ── */
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '580px',
        backgroundColor: '#121318',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        borderRadius: '20px',
        padding: '28px 30px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        textAlign: 'left',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <h2
          style={{
            fontSize: '23px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Review & Generate
        </h2>
        <span
          style={{
            backgroundColor: '#1f222b',
            color: '#9ba2b2',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '8px',
            padding: '5px 12px',
          }}
        >
          3/3 Step
        </span>
      </div>

      <div style={{ paddingTop: '20px', paddingBottom: '4px' }}>
        <p
          style={{
            fontSize: '13px',
            color: '#64748b',
            margin: '0 0 16px',
          }}
        >
          Here's a quick look at your selections. Hit <strong style={{ color: '#94a3b8' }}>Generate</strong> when you're ready!
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            overflow: 'hidden',
          }}
        >
          {summaryRows.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 18px',
                backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                borderBottom:
                  i < summaryRows.length - 1
                    ? '1px solid rgba(255, 255, 255, 0.05)'
                    : 'none',
              }}
            >
              <span
                style={{
                  fontSize: '13.5px',
                  color: '#9ba2b2',
                  fontWeight: 400,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontSize: '13.5px',
                  color: '#ffffff',
                  fontWeight: 500,
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          paddingTop: '22px',
          marginTop: '22px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            height: '42px',
            padding: '0 22px',
            borderRadius: '10px',
            backgroundColor: '#16181f',
            border: '1px solid #2e323d',
            color: '#ffffff',
            fontSize: '14.5px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleGenerate}
          style={{
            height: '42px',
            padding: '0 26px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
            border: 'none',
            color: '#ffffff',
            fontSize: '14.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✦</span>
          Generate My Plan
        </button>
      </div>
    </div>
  );
}
