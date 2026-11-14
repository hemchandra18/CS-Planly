import type {
  TaskItem,
  PlanItem,
  GoalItem,
  NavId,
} from '../dashboardState';
import { TaskRow } from './TaskRow';

interface OtherViewsProps {
  view: NavId;
  tasks: TaskItem[];
  plans: PlanItem[];
  goals: GoalItem[];
  onToggleTask: (id: number) => void;
  onOpenTask: (id: number) => void;
  onOpenPlan: (id: number) => void;
  onOpenGoal: (id: number) => void;
}

export function OtherViews({
  view,
  tasks,
  plans,
  goals,
  onToggleTask,
  onOpenTask,
  onOpenPlan,
  onOpenGoal,
}: OtherViewsProps) {
  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;

  if (view === 'today') {
    const today = tasks.filter((t) => t.when === 'today');
    const todayPlans = plans.filter((p) => p.chip === 'today');

    return (
      <>
        <div className="greeting">
          <h1>Today</h1>
          <p>
            {today.length} tasks, {todayPlans.length} event scheduled.
          </p>
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-head">
            <div className="card-title">Today's tasks</div>
          </div>
          {today.length > 0 ? (
            today.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                onToggle={onToggleTask}
                onClick={onOpenTask}
              />
            ))
          ) : (
            <div className="empty-state">No tasks for today.</div>
          )}
        </div>

        <div className="card" style={{ marginTop: '18px' }}>
          <div className="card-head">
            <div className="card-title">Today's schedule</div>
          </div>
          {todayPlans.length > 0 ? (
            todayPlans.map((p) => (
              <div
                key={p.id}
                className="plan-item"
                onClick={() => onOpenPlan(p.id)}
              >
                <span className="plan-chip today">Today</span>
                <div className="plan-info">
                  <div className="t">{p.title}</div>
                  <div className="s">{p.sub}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">Nothing scheduled.</div>
          )}
        </div>
      </>
    );
  }

  if (view === 'plans') {
    return (
      <>
        <div className="greeting" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>Plans</h1>
            <p>Saved plans and curriculum roadmaps.</p>
          </div>
          <a
            href="/create-plan"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#5b8def',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(91, 141, 239, 0.3)',
            }}
          >
            + Create New Plan
          </a>
        </div>
        <div className="card" style={{ marginTop: '20px' }}>
          {plans.map((p) => (
            <div
              key={p.id}
              className="plan-item"
              onClick={() => onOpenPlan(p.id)}
            >
              <span className={`plan-chip ${p.chip}`}>
                {p.chip === 'today'
                  ? 'Today'
                  : p.chip === 'tmrw'
                    ? 'Tomorrow'
                    : 'Later'}
              </span>
              <div className="plan-info">
                <div className="t">{p.title}</div>
                <div className="s">{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (view === 'calendar') {
    return (
      <>
        <div className="greeting">
          <h1>Calendar</h1>
          <p>All upcoming events in one view.</p>
        </div>
        <div className="card" style={{ marginTop: '20px' }}>
          {plans.map((p) => (
            <div
              key={p.id}
              className="plan-item"
              onClick={() => onOpenPlan(p.id)}
            >
              <span className={`plan-chip ${p.chip}`}>
                {p.chip === 'today'
                  ? 'Today'
                  : p.chip === 'tmrw'
                    ? 'Tomorrow'
                    : 'Later'}
              </span>
              <div className="plan-info">
                <div className="t">{p.title}</div>
                <div className="s">{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (view === 'tasks') {
    return (
      <>
        <div className="greeting">
          <h1>Tasks</h1>
          <p>
            {completedCount} of {totalCount} complete.
          </p>
        </div>
        <div className="card" style={{ marginTop: '20px' }}>
          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={onToggleTask}
              onClick={onOpenTask}
            />
          ))}
        </div>
      </>
    );
  }

  if (view === 'goals') {
    return (
      <>
        <div className="greeting">
          <h1>Goals</h1>
          <p>Track progress across your active goals.</p>
        </div>
        <div className="card" style={{ marginTop: '20px' }}>
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
      </>
    );
  }

  if (view === 'insights') {
    return (
      <>
        <div className="greeting">
          <h1>Insights</h1>
          <p>A quick look at your productivity.</p>
        </div>
        <div className="stat-grid" style={{ marginTop: '20px' }}>
          <div className="stat-card">
            <div className="v">14.5h</div>
            <div className="l">Focus time this week</div>
          </div>
          <div className="stat-card">
            <div className="v">
              {completedCount}/{totalCount}
            </div>
            <div className="l">Tasks completed today</div>
          </div>
          <div className="stat-card">
            <div className="v">6 days</div>
            <div className="l">Current planning streak</div>
          </div>
        </div>

        <div className="section-title">Weekly trend</div>
        <div className="note-card">
          <div className="h">
            Mon–Fri completion rate<span>This week</span>
          </div>
          <p>
            Averaging 82% task completion, best on Tuesday (100%) and lowest on
            Thursday (60%).
          </p>
        </div>
      </>
    );
  }

  return null;
}
