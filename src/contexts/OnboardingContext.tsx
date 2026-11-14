import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { CompanyRegion, CompanyType, ExperienceLevel, Goal, OnboardingAnswers, ProgrammingLanguage, SkillLevel, TargetRole } from '@/lib/types';

const STORAGE_KEY = 'planly:onboarding-draft';
const defaultAnswers: OnboardingAnswers = { targetRole: null, experienceLevel: null, companyType: null, companyRegion: null, goal: null, selectedSubjects: [], skillLevel: null, dailyHours: 2, targetDate: null, preferredLanguage: null, includeVideos: true, includeProblems: true, weekendBreaks: false, revisionDays: true };

interface OnboardingContextValue {
  answers: OnboardingAnswers;
  saving: boolean;
  setTargetRole: (value: TargetRole) => void;
  setExperienceLevel: (value: ExperienceLevel) => void;
  setCompanyType: (value: CompanyType) => void;
  setCompanyRegion: (value: CompanyRegion) => void;
  setGoal: (goal: Goal) => void;
  setSubjects: (subjects: string[]) => void;
  setSkillLevel: (skillLevel: SkillLevel) => void;
  setDailyHours: (hours: number) => void;
  setTargetDate: (date: string | null) => void;
  setLanguage: (language: ProgrammingLanguage) => void;
  setPreferences: (preferences: Partial<Pick<OnboardingAnswers, 'includeVideos' | 'includeProblems' | 'weekendBreaks' | 'revisionDays'>>) => void;
  saveProfile: () => Promise<{ error: Error | null }>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

function readDraft(): OnboardingAnswers {
  try {
    const draft = localStorage.getItem(STORAGE_KEY);
    return draft ? { ...defaultAnswers, ...JSON.parse(draft) } : defaultAnswers;
  } catch { return defaultAnswers; }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<OnboardingAnswers>(readDraft);
  const [saving, setSaving] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); }, [answers]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const docRef = doc(db, 'profiles', user.id);
    getDoc(docRef)
      .then((snap) => {
        if (!active || !snap.exists()) return;
        const data = snap.data();
        setAnswers((current) => ({
          ...current,
          targetRole: data.target_role ?? current.targetRole,
          experienceLevel: data.experience_level ?? current.experienceLevel,
          companyType: data.company_type ?? current.companyType,
          companyRegion: data.company_region ?? current.companyRegion,
          goal: data.goal ?? current.goal,
          selectedSubjects: data.selected_subjects ?? current.selectedSubjects,
          skillLevel: data.skill_level ?? current.skillLevel,
          dailyHours: data.daily_hours ?? current.dailyHours,
          targetDate: data.target_date ?? current.targetDate,
          preferredLanguage: data.preferred_language ?? current.preferredLanguage,
          includeVideos: data.include_videos ?? current.includeVideos,
          includeProblems: data.include_problems ?? current.includeProblems,
          weekendBreaks: data.weekend_breaks ?? current.weekendBreaks,
          revisionDays: data.revision_days ?? current.revisionDays,
        }));
      })
      .catch((err) => {
        console.warn('Could not load profile from Firestore:', err);
      });
    return () => { active = false; };
  }, [user]);

  const value = useMemo<OnboardingContextValue>(() => ({
    answers,
    saving,
    setTargetRole: (targetRole) => setAnswers((current) => ({ ...current, targetRole })),
    setExperienceLevel: (experienceLevel) => setAnswers((current) => ({ ...current, experienceLevel })),
    setCompanyType: (companyType) => setAnswers((current) => ({ ...current, companyType })),
    setCompanyRegion: (companyRegion) => setAnswers((current) => ({ ...current, companyRegion })),
    setGoal: (goal) => setAnswers((current) => ({ ...current, goal })),
    setSubjects: (selectedSubjects) => setAnswers((current) => ({ ...current, selectedSubjects })),
    setSkillLevel: (skillLevel) => setAnswers((current) => ({ ...current, skillLevel })),
    setDailyHours: (dailyHours) => setAnswers((current) => ({ ...current, dailyHours })),
    setTargetDate: (targetDate) => setAnswers((current) => ({ ...current, targetDate })),
    setLanguage: (preferredLanguage) => setAnswers((current) => ({ ...current, preferredLanguage })),
    setPreferences: (preferences) => setAnswers((current) => ({ ...current, ...preferences })),
    async saveProfile() {
      if (!user) return { error: new Error('You must be signed in to save your profile.') };
      setSaving(true);
      try {
        const profilePayload = {
          id: user.id,
          full_name: user.user_metadata?.full_name ?? user.displayName ?? user.email?.split('@')[0] ?? 'Planly learner',
          target_role: answers.targetRole,
          experience_level: answers.experienceLevel,
          company_type: answers.companyType,
          company_region: answers.companyRegion,
          goal: answers.goal,
          selected_subjects: answers.selectedSubjects,
          skill_level: answers.skillLevel,
          daily_hours: answers.dailyHours,
          target_date: answers.targetDate,
          preferred_language: answers.preferredLanguage,
          include_videos: answers.includeVideos,
          include_problems: answers.includeProblems,
          weekend_breaks: answers.weekendBreaks,
          revision_days: answers.revisionDays,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        };

        localStorage.setItem(`planly_onboarding_${user.id}`, 'true');
        localStorage.setItem(`planly_profile_${user.id}`, JSON.stringify(profilePayload));

        try {
          await setDoc(doc(db, 'profiles', user.id), profilePayload, { merge: true });
        } catch (dbErr) {
          console.warn('Firestore write warning (saved to localStorage):', dbErr);
        }

        setSaving(false);
        localStorage.removeItem(STORAGE_KEY);
        return { error: null };
      } catch (err) {
        setSaving(false);
        return { error: err instanceof Error ? err : new Error(String(err)) };
      }
    },
  }), [answers, saving, user]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return context;
}
