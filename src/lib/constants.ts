/* ═══════════════════════════════════════════════════════
   CS-Planly — App-wide Constants
   ═══════════════════════════════════════════════════════ */

import type { Goal, SkillLevel, ProgrammingLanguage, TargetRole, ExperienceLevel, CompanyType, CompanyRegion } from './types';

// ── App Info ─────────────────────────────────────────

export const APP_NAME = 'CS-Planly';
export const APP_TAGLINE = 'Build your path. Master the code.';
export const APP_DESCRIPTION = 'Your personalized CS study plan — structured, daily, and built for you.';

// ── Routes ───────────────────────────────────────────

export const ROUTES = {
  LANDING: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  AUTH_CALLBACK: '/auth/callback',

  ONBOARDING_WELCOME: '/onboarding/welcome',
  ONBOARDING_ROLE: '/onboarding/role',
  ONBOARDING_EXPERIENCE: '/onboarding/experience',
  ONBOARDING_COMPANY: '/onboarding/company',
  ONBOARDING_REGION: '/onboarding/region',
  ONBOARDING_GOAL: '/onboarding/goal',
  ONBOARDING_SUBJECTS: '/onboarding/subjects',
  ONBOARDING_LEVEL: '/onboarding/level',
  ONBOARDING_TIME: '/onboarding/time',
  ONBOARDING_TARGET: '/onboarding/target',
  ONBOARDING_LANGUAGE: '/onboarding/language',
  ONBOARDING_PREFERENCES: '/onboarding/preferences',
  ONBOARDING_SUMMARY: '/onboarding/summary',
  ONBOARDING_GENERATING: '/onboarding/generating',
  ONBOARDING_READY: '/onboarding/ready',

  DASHBOARD: '/dashboard',
  CREATE_PLAN: '/create-plan',
  TOPIC: '/topic/:topicId',
  PLAN: '/plan',
  PROGRESS: '/progress',
  SUBJECT_DETAIL: '/progress/:subjectId',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// ── Onboarding Steps ─────────────────────────────────

export const ONBOARDING_STEPS = [
  { path: ROUTES.ONBOARDING_ROLE, label: 'Role', step: 1 },
  { path: ROUTES.ONBOARDING_EXPERIENCE, label: 'Experience', step: 2 },
  { path: ROUTES.ONBOARDING_COMPANY, label: 'Companies', step: 3 },
  { path: ROUTES.ONBOARDING_REGION, label: 'Region', step: 4 },
  { path: ROUTES.ONBOARDING_GOAL, label: 'Goal', step: 5 },
  { path: ROUTES.ONBOARDING_SUBJECTS, label: 'Subjects', step: 6 },
  { path: ROUTES.ONBOARDING_LEVEL, label: 'Skill Level', step: 7 },
  { path: ROUTES.ONBOARDING_TIME, label: 'Daily Time', step: 8 },
  { path: ROUTES.ONBOARDING_TARGET, label: 'Target Date', step: 9 },
  { path: ROUTES.ONBOARDING_LANGUAGE, label: 'Language', step: 10 },
  { path: ROUTES.ONBOARDING_PREFERENCES, label: 'Preferences', step: 11 },
] as const;

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length;

// ── Goal Options ─────────────────────────────────────

export const GOAL_OPTIONS: Array<{
  value: Goal;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'placement',
    label: 'Placement / Interview Prep',
    description: 'SDE roles at product companies',
    icon: 'Building2',
  },
  {
    value: 'gate',
    label: 'GATE Exam',
    description: 'CS/IT GATE preparation',
    icon: 'GraduationCap',
  },
  {
    value: 'competitive',
    label: 'Competitive Programming',
    description: 'Codeforces, CodeChef, LeetCode contests',
    icon: 'Zap',
  },
  {
    value: 'self-learning',
    label: 'Self-Learning / Upskilling',
    description: 'Structured CS fundamentals at my own pace',
    icon: 'Brain',
  },
];

export const TARGET_ROLE_OPTIONS: Array<{ value: TargetRole; label: string }> = [
  { value: 'sde-intern', label: 'SDE Intern' },
  { value: 'software-engineer', label: 'Software Engineer' },
];

export const EXPERIENCE_OPTIONS: Array<{ value: ExperienceLevel; label: string }> = [
  { value: '0-2-years', label: '0 - 2 years' },
  { value: '2-5-years', label: '2 - 5 years' },
  { value: '5-plus-years', label: '5+ years' },
];

export const COMPANY_TYPE_OPTIONS: Array<{ value: CompanyType; label: string }> = [
  { value: 'startups', label: 'Startups' },
  { value: 'faang', label: 'FAANG' },
  { value: 'product-companies', label: 'All Product Based Companies' },
  { value: 'open-to-all', label: 'Open to all' },
];

export const COMPANY_REGION_OPTIONS: Array<{ value: CompanyRegion; label: string }> = [
  { value: 'india', label: 'India' },
  { value: 'us-europe-others', label: 'US/Europe/Others' },
];

// ── Skill Level Options ──────────────────────────────

export const SKILL_LEVEL_OPTIONS: Array<{
  value: SkillLevel;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: "I'm just starting out or know very little",
    icon: 'Sprout',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'I know basics — arrays, loops, simple problems — but need depth',
    icon: 'TreePine',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: "I'm comfortable with most topics but want structured revision + harder problems",
    icon: 'TreeDeciduous',
  },
];

// ── Programming Language Options ─────────────────────

export const LANGUAGE_OPTIONS: Array<{
  value: ProgrammingLanguage;
  label: string;
  icon: string;
}> = [
  { value: 'cpp', label: 'C++', icon: 'Code2' },
  { value: 'java', label: 'Java', icon: 'Coffee' },
  { value: 'python', label: 'Python', icon: 'Terminal' },
  { value: 'javascript', label: 'JavaScript', icon: 'Braces' },
];

// ── Daily Time Options ───────────────────────────────

export const DAILY_TIME_OPTIONS = [
  { value: 1, label: '1 hr', description: 'Light study' },
  { value: 2, label: '2 hrs', description: 'Steady pace' },
  { value: 3, label: '3 hrs', description: 'Focused grind' },
  { value: 4, label: '4 hrs', description: 'Serious prep' },
  { value: 5, label: '5+ hrs', description: 'Full-time mode' },
] as const;

export const SUBJECT_OPTIONS = [
  { value: 'dsa', label: 'Data Structures & Algorithms', description: 'Problem solving, algorithms, and interview patterns' },
  { value: 'core-cs', label: 'Core Computer Science', description: 'OS, DBMS, networks, and system fundamentals' },
  { value: 'math', label: 'Discrete Mathematics', description: 'Logic, probability, and mathematical foundations' },
  { value: 'design', label: 'System Design', description: 'Design scalable software systems' },
] as const;

// ── Target Date Presets ──────────────────────────────

export const TARGET_DATE_PRESETS = [
  { label: '1 month', days: 30 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
  { label: 'No deadline', days: 180 },
] as const;

// ── Misc ─────────────────────────────────────────────

export const MIN_PASSWORD_LENGTH = 8;
export const MIN_PLAN_DAYS = 14;
export const MAX_PLAN_DAYS = 365;
export const REVISION_INTERVAL_DAYS = 7;
export const REVISION_RESCHEDULE_DAYS = 3;
export const MAX_TOASTS = 3;
export const TOAST_DURATION_MS = 4000;
