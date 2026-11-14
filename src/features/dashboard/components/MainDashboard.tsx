/* ═══════════════════════════════════════════════════════
   Planly — MainDashboard
   The actual post-onboarding dashboard showing today's
   plan, quick stats, progress bar, and upcoming topics.
   Rendered inside AppLayout (sidebar + top-nav already
   provided by the parent route).
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { loadProgressStats, loadAllPlanTopics } from '@/lib/progress';
import { ROUTES } from '@/lib/constants';
import type { ProgressStats, PlanTopic } from '@/lib/types';
import {
  Flame,
  CheckCircle2,
  Clock,
  CalendarDays,
  ChevronRight,
  BookOpen,
  BarChart3,
  Target,
  Sparkles,
} from 'lucide-react';

/* ── Greeting helper ── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ── Difficulty badge ── */
function DifficultyBadge({ d }: { d: string }) {
  const colors: Record<string, string> = {
    easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    hard: 'bg-red-500/15 text-red-400 border-red-500/25',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[d] ?? colors.medium}`}
    >
      {d}
    </span>
  );
}

export function MainDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [topics, setTopics] = useState<PlanTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([loadProgressStats(user.id), loadAllPlanTopics(user.id)]).then(
      ([statsResult, topicsResult]) => {
        setStats(statsResult.stats);
        setTopics(topicsResult.topics);
        setLoading(false);
      }
    );
  }, [user]);

  const displayName =
    user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  /* ── Today's topics (first pending batch, max 6) ── */
  const todayTopics = topics
    .filter((t) => t.status === 'pending')
    .slice(0, 6);
  const completedToday = topics.filter((t) => t.status === 'done').length;

  /* ── Quick stat cards data ── */
  const quickStats = [
    {
      label: 'Completed',
      value: stats?.completedTopics ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Days Left',
      value: stats?.daysRemaining ?? 0,
      icon: CalendarDays,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      label: 'Streak',
      value: stats?.daysElapsed ?? 0,
      icon: Flame,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Overall',
      value: `${stats?.overallPercent ?? 0}%`,
      icon: BarChart3,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
  ];

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-slate-800" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-800/60" />
          ))}
        </div>
        <div className="h-48 rounded-2xl bg-slate-800/60" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Greeting Header ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {getGreeting()}, {displayName} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          {stats
            ? stats.pace === 'ahead'
              ? "You're ahead of schedule — keep the momentum!"
              : stats.pace === 'behind'
                ? 'A little more consistency will get you back on track.'
                : "You're right on track with your study plan."
            : 'Your personalized study plan is ready.'}
        </p>
      </div>

      {/* ── Quick Stats Grid ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${bg}`}
          >
            <Icon className={`size-5 ${color}`} />
            <p className="text-[11px] uppercase tracking-widest text-slate-500 mt-4">
              {label}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1 tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </section>

      {/* ── Progress Bar ── */}
      {stats && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-sky-400" />
              <span className="text-sm font-semibold text-white">
                Overall Progress
              </span>
            </div>
            <Link
              to={ROUTES.PROGRESS}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
            >
              View details
              <ChevronRight className="size-3" />
            </Link>
          </div>

          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${stats.overallPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-slate-500">
            <span>
              {stats.completedTopics} of {stats.totalTopics} topics
            </span>
            <span>{stats.daysElapsed} days in</span>
          </div>
        </section>
      )}

      {/* ── Today's Plan ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-sky-400" />
            <h2 className="text-base font-semibold text-white">
              Today's Plan
            </h2>
            {completedToday > 0 && (
              <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {completedToday} done
              </span>
            )}
          </div>
          <Link
            to={ROUTES.PLAN}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
          >
            Full plan
            <ChevronRight className="size-3" />
          </Link>
        </div>

        {todayTopics.length > 0 ? (
          <div className="space-y-2.5">
            {todayTopics.map((item) => (
              <Link
                key={item.id}
                to={`/topic/${item.topicId}`}
                className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 group-hover:border-sky-500/30 group-hover:text-sky-400 transition-colors">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.topic?.title ?? item.topicId}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <DifficultyBadge
                        d={item.topic?.difficulty ?? 'medium'}
                      />
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="size-3" />
                        {item.topic?.estimatedMinutes ?? 30} min
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="size-4 shrink-0 text-slate-600 group-hover:text-sky-400 transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
            <Sparkles className="size-6 text-sky-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-white">
              All caught up for today!
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Check back tomorrow for your next set of topics.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

