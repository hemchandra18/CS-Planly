/* ═══════════════════════════════════════════════════════
   Planly — Dashboard Page
   Faithful React implementation of Planly — Dashboard_c.html
   ═══════════════════════════════════════════════════════ */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import './dashboard.css';

import type {
  NavId,
  TaskItem,
  PlanItem,
  GoalItem,
  DeadlineItem,
  ProgressState,
  NotificationItem,
  LearningResource,
} from './dashboardState';

import {
  INITIAL_TASKS,
  INITIAL_PLANS,
  INITIAL_DEADLINES,
  INITIAL_GOALS,
  INITIAL_PROGRESS,
  INITIAL_NOTIFICATIONS,
} from './dashboardState';

import { DashSidebar } from './components/DashSidebar';
import { DashTopbar } from './components/DashTopbar';
import { DashboardView } from './components/DashboardView';
import { OtherViews } from './components/OtherViews';
import { DashSummaryPanel } from './components/DashSummaryPanel';
import { DashCopilotPanel } from './components/DashCopilotPanel';
import { DashModals } from './components/DashModals';
import type { ActiveModal } from './components/DashModals';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  const [activeNav, setActiveNav] = useState<NavId>('dashboard');
  const [learningOpen, setLearningOpen] = useState(false);
  const [learningFilter, setLearningFilter] = useState<string | null>(null);

  // App Data State
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [plans, setPlans] = useState<PlanItem[]>(INITIAL_PLANS);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(INITIAL_DEADLINES);
  const [goals, setGoals] = useState<GoalItem[]>(INITIAL_GOALS);
  const [progress, setProgress] = useState<ProgressState>(INITIAL_PROGRESS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // UI Interactive State
  const [selectedSeg, setSelectedSeg] = useState<(keyof ProgressState) | null>(null);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [modal, setModal] = useState<ActiveModal>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Hemchandra';

  // Smooth scroll to learning section
  const scrollToLearning = () => {
    requestAnimationFrame(() => {
      const el = document.getElementById('learningSection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (contentRef.current) {
        contentRef.current.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    });
  };

  // ── Task Actions ──
  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextDone = !t.done;
          setProgress((p) => {
            if (nextDone) {
              return {
                ...p,
                completed: p.completed + 1,
                pending: Math.max(p.pending - 1, 0),
              };
            } else {
              return {
                ...p,
                completed: Math.max(p.completed - 1, 0),
                pending: p.pending + 1,
              };
            }
          });
          return { ...t, done: nextDone };
        }
        return t;
      })
    );
  };

  const handlePrioritizeTasks = () => {
    const priorityRank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    setTasks((prev) =>
      [...prev].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
    );
  };

  // ── Notification Actions ──
  const handleMarkNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ── Modal Actions ──
  const handleOpenTask = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) setModal({ type: 'task', task });
  };

  const handleOpenPlan = (id: number) => {
    const plan = plans.find((p) => p.id === id);
    if (plan) setModal({ type: 'plan', plan });
  };

  const handleOpenDeadline = (id: number) => {
    const deadline = deadlines.find((d) => d.id === id);
    if (deadline) setModal({ type: 'deadline', deadline });
  };

  const handleOpenGoal = (id: number) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) setModal({ type: 'goal', goal });
  };

  const handleOpenQuick = (kind: 'plan' | 'task' | 'goal' | 'tomorrow') => {
    if (kind === 'plan') {
      navigate(ROUTES.CREATE_PLAN);
      return;
    }
    setModal({ type: 'quick', kind });
  };

  const handleOpenResource = (resource: LearningResource, category: string) => {
    setModal({ type: 'resource', resource, category });
  };

  const handleCloseModal = () => {
    setModal(null);
  };

  // ── Item Mutations ──
  const handleReschedulePlan = (id: number) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, sub: p.sub.replace(/\d{1,2}:\d{2} (AM|PM)/, '5:00 PM') }
          : p
      )
    );
  };

  const handleCompletePlan = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditDeadline = (id: number, newTitle: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title: newTitle } : d))
    );
  };

  const handleRescheduleDeadline = (id: number) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, when: 'Next week' } : d))
    );
  };

  const handleCompleteDeadline = (id: number) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAdjustGoal = (id: number, delta: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, pct: Math.max(0, Math.min(100, g.pct + delta)) }
          : g
      )
    );
  };

  const handleSaveQuick = (
    kind: 'plan' | 'task' | 'goal' | 'tomorrow',
    f1: string,
    f2: string
  ) => {
    const now = Date.now();
    if (kind === 'task') {
      setTasks((prev) => [
        ...prev,
        {
          id: now,
          title: f1,
          cat: 'Planning',
          tagClass: 'plan',
          duration: f2 || '30m',
          priority: 'Medium',
          notes: 'Added via quick add.',
          done: false,
          when: 'later',
        },
      ]);
    } else if (kind === 'plan' || kind === 'tomorrow') {
      setPlans((prev) => [
        ...prev,
        {
          id: now,
          title: f1,
          chip: 'date',
          sub: `${f2 || 'Tomorrow'} · 9:00 AM`,
        },
      ]);
    } else if (kind === 'goal') {
      setGoals((prev) => [
        ...prev,
        {
          id: now,
          name: f1,
          pct: 0,
          color: 'var(--purple)',
        },
      ]);
    }
  };

  return (
    <div className="app">
      {/* ── Left Sidebar ── */}
      <DashSidebar
        activeNav={activeNav}
        onNavChange={(nav) => {
          setActiveNav(nav);
          setLearningOpen(false);
        }}
        learningOpen={learningOpen}
        onLearningToggle={() => {
          setLearningOpen((prev) => !prev);
          setActiveNav('dashboard');
          scrollToLearning();
        }}
        learningFilter={learningFilter}
        onLearningFilter={(cat) => {
          setLearningFilter(cat);
          setLearningOpen(true);
          setActiveNav('dashboard');
          scrollToLearning();
        }}
        userName={userName}
        onSettingsClick={() => navigate(ROUTES.SETTINGS)}
        onSignOut={() => signOut()}
      />

      {/* ── Center Column: Topbar + Main Content ── */}
      <div className="main-col">
        <DashTopbar
          tasks={tasks}
          plans={plans}
          goals={goals}
          deadlines={deadlines}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          copilotOpen={copilotOpen}
          onToggleCopilot={() => setCopilotOpen((prev) => !prev)}
          onOpenTask={handleOpenTask}
          onOpenPlan={handleOpenPlan}
          onOpenGoal={handleOpenGoal}
          onOpenDeadline={handleOpenDeadline}
        />

        <div className="content" id="content" ref={contentRef}>
          {activeNav === 'dashboard' ? (
            <DashboardView
              userName={userName}
              tasks={tasks}
              plans={plans}
              goals={goals}
              progress={progress}
              selectedSeg={selectedSeg}
              onSelectSeg={setSelectedSeg}
              onToggleTask={handleToggleTask}
              onOpenTask={handleOpenTask}
              onOpenPlan={handleOpenPlan}
              onOpenGoal={handleOpenGoal}
              onOpenQuick={handleOpenQuick}
              learningFilter={learningFilter}
              onLearningFilter={(cat) => setLearningFilter(cat)}
              onOpenResource={handleOpenResource}
            />
          ) : (
            <OtherViews
              view={activeNav}
              tasks={tasks}
              plans={plans}
              goals={goals}
              onToggleTask={handleToggleTask}
              onOpenTask={handleOpenTask}
              onOpenPlan={handleOpenPlan}
              onOpenGoal={handleOpenGoal}
            />
          )}
        </div>
      </div>

      {/* ── Right Fixed Summary Panel ── */}
      <DashSummaryPanel
        tasks={tasks}
        deadlines={deadlines}
        goals={goals}
        onOpenDeadline={handleOpenDeadline}
        onOpenGoal={handleOpenGoal}
      />

      {/* ── Right Sliding Copilot Panel ── */}
      <DashCopilotPanel
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        completedTasksCount={tasks.filter((t) => t.done).length}
        totalTasksCount={tasks.length}
        onPrioritizeTasks={handlePrioritizeTasks}
        tasks={tasks}
        goals={goals}
        userName={userName}
      />

      {/* ── Modal Dialog System ── */}
      <DashModals
        modal={modal}
        onClose={handleCloseModal}
        onToggleTask={handleToggleTask}
        onReschedulePlan={handleReschedulePlan}
        onCompletePlan={handleCompletePlan}
        onEditDeadline={handleEditDeadline}
        onRescheduleDeadline={handleRescheduleDeadline}
        onCompleteDeadline={handleCompleteDeadline}
        onAdjustGoal={handleAdjustGoal}
        onSaveQuick={handleSaveQuick}
      />
    </div>
  );
}
