/* ═══════════════════════════════════════════════════════
   CS-Planly — Shared TypeScript Types
   ═══════════════════════════════════════════════════════ */

// ── Auth & User ──────────────────────────────────────

export type Goal = 'placement' | 'gate' | 'competitive' | 'self-learning';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProgrammingLanguage = 'cpp' | 'java' | 'python' | 'javascript';
export type TopicStatus = 'pending' | 'done' | 'revision' | 'skipped';
export type DayType = 'study' | 'rest' | 'revision';
export type PlanStatus = 'active' | 'archived';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TargetRole = 'sde-intern' | 'software-engineer';
export type ExperienceLevel = '0-2-years' | '2-5-years' | '5-plus-years';
export type CompanyType = 'startups' | 'faang' | 'product-companies' | 'open-to-all';
export type CompanyRegion = 'india' | 'us-europe-others';

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  emailVerified: boolean;
  targetRole?: TargetRole;
  experienceLevel?: ExperienceLevel;
  companyType?: CompanyType;
  companyRegion?: CompanyRegion;
  goal?: Goal;
  selectedSubjects: string[];
  skillLevel?: SkillLevel;
  dailyHours: number;
  targetDate?: string;
  preferredLanguage?: ProgrammingLanguage;
  includeVideos: boolean;
  includeProblems: boolean;
  weekendBreaks: boolean;
  revisionDays: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Onboarding ──────────────────────────────────────

export interface OnboardingAnswers {
  targetRole: TargetRole | null;
  experienceLevel: ExperienceLevel | null;
  companyType: CompanyType | null;
  companyRegion: CompanyRegion | null;
  goal: Goal | null;
  selectedSubjects: string[];
  skillLevel: SkillLevel | null;
  dailyHours: number;
  targetDate: string | null;
  preferredLanguage: ProgrammingLanguage | null;
  includeVideos: boolean;
  includeProblems: boolean;
  weekendBreaks: boolean;
  revisionDays: boolean;
}

// ── Content Architecture: Striver A2Z Model ──────────
// Hierarchy: Subject → Section → Topic → Concept → Problem

export type SubjectCategory = 'dsa' | 'core-cs' | 'math' | 'design';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: SubjectCategory;
  displayOrder: number;
  sections?: Section[];
}

export interface Section {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  displayOrder: number;
  topics?: TopicData[];
}

export interface TopicResource {
  type: 'video' | 'article';
  title: string;
  url: string;
  platform: string;
  duration?: string;
}

export interface TopicProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  platform: 'leetcode' | 'gfg' | 'codeforces';
  externalUrl: string;
  problemNumber?: string;
  displayOrder: number;
}

export interface TopicCodeSnippets {
  cpp?: string;
  java?: string;
  python?: string;
  javascript?: string;
}

export interface Concept {
  explanation: string;           // Markdown: what it is, when/why, complexity
  examples: string[];            // Markdown worked examples
  codeSnippets: TopicCodeSnippets; // Static, read-only code (NOT editable in V1)
}

export interface TopicData {
  id: string;
  sectionId: string;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  concept: Concept;
  resources: TopicResource[];
  problems: TopicProblem[];
  prerequisites: string[];       // Topic IDs
  displayOrder: number;
}

/** @deprecated Use TopicData — kept for backward compatibility during migration */
export type MasterTopic = TopicData;

// ── Study Plan ──────────────────────────────────────

export interface StudyPlan {
  id: string;
  userId: string;
  status: PlanStatus;
  totalTopics: number;
  totalDays: number;
  startDate: string;
  targetDate?: string;
  generatedAt: string;
  planConfig: OnboardingAnswers;
}

export interface PlanDay {
  id: string;
  planId: string;
  dayNumber: number;
  calendarDate: string;
  dayType: DayType;
}

export interface PlanTopic {
  id: string;
  dayId: string;
  topicId: string;
  displayOrder: number;
  status: TopicStatus;
  completedAt?: string;
  userNotes?: string;
  // Joined data
  topic?: TopicData;
}

// ── Progress & Stats ─────────────────────────────────

export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  activityDate: string;
  topicsCompleted: number;
  minutesStudied: number;
}

export interface ProgressStats {
  totalTopics: number;
  completedTopics: number;
  skippedTopics: number;
  revisionTopics: number;
  overallPercent: number;
  daysRemaining: number;
  daysElapsed: number;
  pace: 'ahead' | 'on-track' | 'behind';
  paceMessage: string;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  color: string;
  total: number;
  completed: number;
  percent: number;
}

// ── Dashboard ────────────────────────────────────────

export interface TodaysPlanData {
  dayNumber: number;
  calendarDate: string;
  dayType: DayType;
  topics: PlanTopic[];
  completedCount: number;
  totalCount: number;
}

export interface QuickStatsData {
  currentStreak: number;
  topicsCompleted: number;
  overallPercent: number;
  daysRemaining: number;
}

export interface UpcomingDay {
  dayNumber: number;
  calendarDate: string;
  dayType: DayType;
  topicCount: number;
  subjectSummary: string;
}
