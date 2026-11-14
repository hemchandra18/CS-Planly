import { useRef, useEffect } from 'react';
import type {
  TaskItem,
  PlanItem,
  GoalItem,
  ProgressState,
  LearningResource,
} from '../dashboardState';
import { LEARNING_CATS, LEARNING_DATA } from '../dashboardState';
import { TaskRow } from './TaskRow';
import { DonutChart } from './DonutChart';
import { ResourceCard } from './ResourceCard';

interface DashboardViewProps {
  userName: string;
  tasks: TaskItem[];
  plans: PlanItem[];
  goals: GoalItem[];
  progress: ProgressState;
  selectedSeg: (keyof ProgressState) | null;
  onSelectSeg: (seg: (keyof ProgressState) | null) => void;
  onToggleTask: (id: number) => void;
  onOpenTask: (id: number) => void;
  onOpenPlan: (id: number) => void;
  onOpenGoal: (id: number) => void;
  onOpenQuick: (kind: 'plan' | 'task' | 'goal' | 'tomorrow') => void;
  learningFilter: string | null;
  onLearningFilter: (cat: string | null) => void;
  onOpenResource: (resource: LearningResource, category: string) => void;
}

export function DashboardView({
  userName,
  tasks,
  plans,
  goals,
  progress,
  selectedSeg,
  onSelectSeg,
  onToggleTask,
  onOpenTask,
  onOpenPlan,
  onOpenGoal,
  onOpenQuick,
  learningFilter,
  onLearningFilter,
  onOpenResource,
}: DashboardViewProps) {
  const todayTasks = tasks.filter((t) => t.when === 'today');
  const laterTasks = tasks.filter((t) => t.when === 'later');
  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;

  const resourceGridRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  // Drag-scroll handler for the horizontal learning resources grid
  useEffect(() => {
    const el = resourceGridRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragMovedRef.current = false;
      el.classList.add('dragging');
      startXRef.current = e.pageX;
      startScrollRef.current = el.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.pageX - startXRef.current;
      if (Math.abs(dx) > 4) dragMovedRef.current = true;
      el.scrollLeft = startScrollRef.current - dx;
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        el.classList.remove('dragging');
      }
    };

    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Filtered resources
  const cats = learningFilter
    ? [learningFilter]
    : LEARNING_CATS.map((c) => c.key);

  const resourceList: { resource: LearningResource; category: string }[] = [];
  cats.forEach((k) => {
    const catLabel = LEARNING_CATS.find((c) => c.key === k)?.label || k;
    const items = LEARNING_DATA[k] || [];
    items.forEach((r) => {
      resourceList.push({ resource: r, category: catLabel });
    });
  });

  return (
    <>
      {/* Greeting */}
      <div className="greeting">
        <h1>Good afternoon, {userName} 👋</h1>
        <p>Your day, planned clearly.</p>
      </div>

      {/* Focus & Later Tasks Card */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-head">
          <div className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4.5" />
            </svg>
            Today's focus
          </div>
        </div>
        {todayTasks.length > 0 ? (
          todayTasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={onToggleTask}
              onClick={onOpenTask}
            />
          ))
        ) : (
          <div className="empty-state">No matching tasks.</div>
        )}

        <div className="card-head" style={{ marginTop: '20px' }}>
          <div className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 11l3 3 8-8M3 12a9 9 0 1 1 5.5 8.3" />
            </svg>
            Later today
          </div>
        </div>
        {laterTasks.length > 0 ? (
          laterTasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={onToggleTask}
              onClick={onOpenTask}
            />
          ))
        ) : (
          <div className="empty-state">No matching tasks.</div>
        )}
      </div>

      {/* Grid 2: Plan Progress + Upcoming Plans */}
      <div className="grid2">
        <DonutChart
          progress={progress}
          selectedSeg={selectedSeg}
          onSelectSeg={onSelectSeg}
        />

        <div className="card">
          <div className="card-head">
            <div className="card-title">Upcoming plans</div>
          </div>
          {plans.map((p) => {
            const chipLabel =
              p.chip === 'today'
                ? 'Today'
                : p.chip === 'tmrw'
                  ? 'Tomorrow'
                  : p.sub.split(' · ')[0];
            const subLabel =
              p.chip === 'date' ? p.sub.split(' · ')[1] : p.sub;

            return (
              <div
                key={p.id}
                className="plan-item"
                onClick={() => onOpenPlan(p.id)}
              >
                <span className={`plan-chip ${p.chip}`}>{chipLabel}</span>
                <div className="plan-info">
                  <div className="t">{p.title}</div>
                  <div className="s">{subLabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Goals Card */}
      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-head">
          <div className="card-title">Weekly goals</div>
          <div className="meta">
            {goals.filter((g) => g.pct >= 100).length} of {goals.length}
          </div>
        </div>
        {goals.map((g) => (
          <div
            key={g.id}
            className="goal-row"
            onClick={() => onOpenGoal(g.id)}
          >
            <div className="goal-top">
              <span className="name">{g.name}</span>
              <span className="frac">{g.pct}%</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${g.pct}%`, background: g.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add */}
      <div className="section-title">Quick add</div>
      <div className="quick-grid">
        <div
          className="quick-card"
          onClick={() => onOpenQuick('plan')}
        >
          <div
            className="quick-icon"
            style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
          </div>
          <h4>Create a plan</h4>
          <p>Plan a day, project, or focus block.</p>
          <div className="quick-link">Create a plan →</div>
        </div>

        <div
          className="quick-card"
          onClick={() => onOpenQuick('task')}
        >
          <div
            className="quick-icon"
            style={{ background: 'var(--mint-bg)', color: 'var(--mint)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 11l3 3 8-8M3 12a9 9 0 1 1 5.5 8.3" />
            </svg>
          </div>
          <h4>Add a task</h4>
          <p>Quickly capture a task for later or today.</p>
          <div className="quick-link">Add a task →</div>
        </div>

        <div
          className="quick-card"
          onClick={() => onOpenQuick('goal')}
        >
          <div
            className="quick-icon"
            style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4.5" />
            </svg>
          </div>
          <h4>Set a goal</h4>
          <p>Define a goal and track your progress.</p>
          <div className="quick-link">Set a goal →</div>
        </div>

        <div
          className="quick-card"
          onClick={() => onOpenQuick('tomorrow')}
        >
          <div
            className="quick-icon"
            style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
          </div>
          <h4>Plan tomorrow</h4>
          <p>Prepare your next day in a few minutes.</p>
          <div className="quick-link">Plan tomorrow →</div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="section-title">Weekly summary</div>
      <div className="note-card">
        <div className="h">
          Focus time logged<span>This week</span>
        </div>
        <p>14.5 hours across 9 deep work sessions — up 2 hours from last week.</p>
      </div>
      <div className="note-card">
        <div className="h">
          Tasks completed<span>This week</span>
        </div>
        <p>
          {completedCount} of {totalCount} planned tasks closed out so far
          today.
        </p>
      </div>
      <div className="note-card">
        <div className="h">
          Notes to self<span>Pinned</span>
        </div>
        <p>
          Block Friday afternoon for design review follow-ups before they pile
          into next week.
        </p>
      </div>

      {/* Recent Activity */}
      <div className="section-title">Recent activity</div>
      <div className="card">
        <div className="activity-row">
          <span
            className="activity-dot"
            style={{ background: 'var(--mint)' }}
          />
          <div>
            <div className="activity-text">
              Marked <b>Plan tomorrow</b> as done
            </div>
            <div className="activity-time">Today · 1:48 PM</div>
          </div>
        </div>
        <div className="activity-row">
          <span
            className="activity-dot"
            style={{ background: 'var(--amber)' }}
          />
          <div>
            <div className="activity-text">
              Started <b>Finish portfolio case study</b>
            </div>
            <div className="activity-time">Today · 1:10 PM</div>
          </div>
        </div>
        <div className="activity-row">
          <span
            className="activity-dot"
            style={{ background: 'var(--blue)' }}
          />
          <div>
            <div className="activity-text">
              Added event <b>Design review</b> to tomorrow
            </div>
            <div className="activity-time">Today · 11:22 AM</div>
          </div>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="section-title" id="learningSection">
        Learning resources
      </div>

      {/* Tabs */}
      <div className="learning-tabs">
        {[{ key: null, label: 'All resources' }, ...LEARNING_CATS]
          .slice()
          .reverse()
          .map((t) => (
            <button
              key={t.label}
              className={`learning-tab ${learningFilter === t.key ? 'active' : ''}`}
              onClick={() => onLearningFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
      </div>

      {/* Horizontal Draggable Grid */}
      <div
        className="resource-grid"
        ref={resourceGridRef}
      >
        {resourceList.map(({ resource, category }) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            category={category}
            onClick={() => {
              if (dragMovedRef.current) {
                dragMovedRef.current = false;
                return;
              }
              onOpenResource(resource, category);
            }}
          />
        ))}
      </div>
    </>
  );
}
