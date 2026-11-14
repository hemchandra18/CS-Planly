/* ═══════════════════════════════════════════════════════
   CS-Planly — App Root Component + Router
   ═══════════════════════════════════════════════════════ */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingScreen } from '@/components/feedback/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';

// ── Lazy-loaded page components ─────────────────────

// Landing page
const LandingPage = lazy(() =>
  import('@/features/landing/LandingPage').then((m) => ({ default: m.LandingPage }))
);

// Auth pages
const SignUpPage = lazy(() =>
  import('@/features/auth/SignUpPage').then((m) => ({ default: m.SignUpPage }))
);
const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);
const AuthCallbackPage = lazy(() =>
  import('@/features/auth/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage }))
);

// Onboarding pages
const OnboardingLayout = lazy(() =>
  import('@/features/onboarding/OnboardingLayout').then((m) => ({ default: m.OnboardingLayout }))
);
const WelcomeStep = lazy(() =>
  import('@/features/onboarding/WelcomeStep').then((m) => ({ default: m.WelcomeStep }))
);
const RoleStep = lazy(() => import('@/features/onboarding/RoleStep').then((m) => ({ default: m.RoleStep })));
const ExperienceStep = lazy(() => import('@/features/onboarding/ExperienceStep').then((m) => ({ default: m.ExperienceStep })));
const CompanyStep = lazy(() => import('@/features/onboarding/CompanyStep').then((m) => ({ default: m.CompanyStep })));
const RegionStep = lazy(() => import('@/features/onboarding/RegionStep').then((m) => ({ default: m.RegionStep })));
const GoalStep = lazy(() =>
  import('@/features/onboarding/GoalStep').then((m) => ({ default: m.GoalStep }))
);
const SubjectsStep = lazy(() =>
  import('@/features/onboarding/SubjectsStep').then((m) => ({ default: m.SubjectsStep }))
);
const SkillLevelStep = lazy(() =>
  import('@/features/onboarding/SkillLevelStep').then((m) => ({ default: m.SkillLevelStep }))
);
const DailyTimeStep = lazy(() =>
  import('@/features/onboarding/DailyTimeStep').then((m) => ({ default: m.DailyTimeStep }))
);
const TargetDateStep = lazy(() =>
  import('@/features/onboarding/TargetDateStep').then((m) => ({ default: m.TargetDateStep }))
);
const LanguageStep = lazy(() =>
  import('@/features/onboarding/LanguageStep').then((m) => ({ default: m.LanguageStep }))
);
const PreferencesStep = lazy(() =>
  import('@/features/onboarding/PreferencesStep').then((m) => ({ default: m.PreferencesStep }))
);
const SummaryStep = lazy(() =>
  import('@/features/onboarding/SummaryStep').then((m) => ({ default: m.SummaryStep }))
);
const GeneratingScreen = lazy(() =>
  import('@/features/onboarding/GeneratingScreen').then((m) => ({ default: m.GeneratingScreen }))
);
const PlanRevealScreen = lazy(() =>
  import('@/features/onboarding/PlanRevealScreen').then((m) => ({ default: m.PlanRevealScreen }))
);

// Protected pages
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const CreatePlanPage = lazy(() =>
  import('@/features/plan/create/CreatePlanPage').then((m) => ({ default: m.CreatePlanPage }))
);
const TopicDetailPage = lazy(() =>
  import('@/features/topic/TopicDetailPage').then((m) => ({ default: m.TopicDetailPage }))
);
const PlanPage = lazy(() =>
  import('@/features/plan/PlanPage').then((m) => ({ default: m.PlanPage }))
);
const ProgressPage = lazy(() =>
  import('@/features/progress/ProgressPage').then((m) => ({ default: m.ProgressPage }))
);
const SubjectDetailPage = lazy(() =>
  import('@/features/progress/SubjectDetailPage').then((m) => ({ default: m.SubjectDetailPage }))
);
const SettingsPage = lazy(() =>
  import('@/features/profile/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

// Error pages
const NotFoundPage = lazy(() =>
  import('@/features/errors/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

// ── Route Guards ────────────────────────────────────

/**
 * AuthRedirectGuard — If user is authenticated, redirect to dashboard.
 * Otherwise, render auth pages. (Placeholder — real auth in Phase 3)
 */
function AuthRedirectGuard() {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

/**
 * AuthGuard — If user is NOT authenticated, redirect to login.
 */
function AuthGuard() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

/**
 * AppGuard — AuthGuard + onboarding check.
 */
function AppGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

// ── Router ──────────────────────────────────────────

const router = createBrowserRouter([
  // Landing page (public)
  {
    path: ROUTES.LANDING,
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <LandingPage />
      </Suspense>
    ),
  },
  // Dashboard route — renders immediately with full Planly layout
  {
    path: ROUTES.DASHBOARD,
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <DashboardPage />
      </Suspense>
    ),
  },
  // 3-Step Interactive Plan Creation Flow
  {
    path: ROUTES.CREATE_PLAN,
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <CreatePlanPage />
      </Suspense>
    ),
  },
  {
    path: '/plan/create',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <CreatePlanPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.AUTH_CALLBACK,
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <AuthCallbackPage />
      </Suspense>
    ),
  },

  // Auth routes (redirect if already authenticated)
  {
    element: <AuthRedirectGuard />,
    children: [
      { path: ROUTES.SIGNUP, element: <SignUpPage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
    ],
  },

  // Onboarding (authenticated but no plan yet)
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/onboarding',
        element: <OnboardingLayout />,
        children: [
          { index: true, element: <Navigate to="welcome" replace /> },
          { path: 'welcome', element: <WelcomeStep /> },
          { path: 'role', element: <RoleStep /> },
          { path: 'experience', element: <ExperienceStep /> },
          { path: 'company', element: <CompanyStep /> },
          { path: 'region', element: <RegionStep /> },
          { path: 'goal', element: <GoalStep /> },
          { path: 'subjects', element: <SubjectsStep /> },
          { path: 'level', element: <SkillLevelStep /> },
          { path: 'time', element: <DailyTimeStep /> },
          { path: 'target', element: <TargetDateStep /> },
          { path: 'language', element: <LanguageStep /> },
          { path: 'preferences', element: <PreferencesStep /> },
          { path: 'summary', element: <SummaryStep /> },
        ],
      },
      { path: ROUTES.ONBOARDING_GENERATING, element: <GeneratingScreen /> },
      { path: ROUTES.ONBOARDING_READY, element: <PlanRevealScreen /> },
    ],
  },

  // Protected routes (authenticated + has active plan)
  {
    element: <AppGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.TOPIC, element: <TopicDetailPage /> },
          { path: ROUTES.PLAN, element: <PlanPage /> },
          { path: ROUTES.PROGRESS, element: <ProgressPage /> },
          { path: ROUTES.SUBJECT_DETAIL, element: <SubjectDetailPage /> },
          { path: ROUTES.SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

// ── App Component ───────────────────────────────────

export function App() {
  return <RouterProvider router={router} />;
}
