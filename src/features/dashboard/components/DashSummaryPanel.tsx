import type {
  TaskItem,
  DeadlineItem,
  GoalItem,
} from '../dashboardState';

interface DashSummaryPanelProps {
  tasks: TaskItem[];
  deadlines: DeadlineItem[];
  goals: GoalItem[];
  onOpenDeadline: (id: number) => void;
  onOpenGoal: (id: number) => void;
}

export function DashSummaryPanel({
  tasks,
  deadlines,
  goals,
  onOpenDeadline,
  onOpenGoal,
}: DashSummaryPanelProps) {
  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const remaining = Math.max(totalCount - completedCount, 0);

  // Mini ring calculations: size 60, r 25, stroke-width 7
  const r = 25;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - pct / 100);

  return (
    <aside className="summary-panel" id="summaryPanel">
      <div className="summary-title">Planning summary</div>

      {/* Mini Card 1: Today's Progress */}
      <div className="mini-card">
        <div className="mini-head">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4.5" />
          </svg>
          Today's progress
        </div>
        <div className="mini-ring-row">
          <div className="mini-ring-wrap">
            <svg className="mini-ring" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r={r}
                fill="none"
                stroke="#23252c"
                strokeWidth="7"
              />
              <circle
                cx="30"
                cy="30"
                r={r}
                fill="none"
                stroke="#3ddc97"
                strokeWidth="7"
                strokeDasharray={circ}
                strokeDashoffset={off}
                strokeLinecap="round"
                transform="rotate(-90 30 30)"
              />
            </svg>
            <div className="mini-ring-stack">{pct}%</div>
          </div>
          <div className="mini-stat">
            {completedCount} of {totalCount} tasks done.{' '}
            <b>
              {remaining} task{remaining === 1 ? '' : 's'}
            </b>{' '}
            remaining.
          </div>
        </div>
      </div>

      {/* Mini Card 2: Upcoming Deadlines */}
      <div className="mini-card">
        <div className="mini-head">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
          Upcoming deadlines
        </div>
        <div className="mini-list">
          {deadlines.map((d) => (
            <div
              key={d.id}
              className="mini-row"
              onClick={() => onOpenDeadline(d.id)}
            >
              <span
                className="d"
                style={{
                  background:
                    d.when === 'Today'
                      ? 'var(--amber)'
                      : d.when === 'Tomorrow'
                        ? 'var(--blue)'
                        : 'var(--muted-2)',
                }}
              />
              <span className="label">{d.title}</span>
              <span className="val">{d.when}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Card 3: Weekly Goals */}
      <div className="mini-card">
        <div className="mini-head">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4.5" />
          </svg>
          Weekly goals
        </div>
        {goals.map((g) => (
          <div
            key={g.id}
            className="mini-goal"
            onClick={() => onOpenGoal(g.id)}
          >
            <div className="mini-goal-top">
              <span>{g.name}</span>
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

      {/* Mini Card 4: Reminders */}
      <div className="mini-card" style={{ marginBottom: 0 }}>
        <div className="mini-head">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          Reminders
        </div>
        <div className="reminder-row">
          <span className="reminder-dot" style={{ background: 'var(--red)' }} />
          <div className="reminder-text">
            <span className="t">Reply to client feedback</span>
            <span className="s">Due in 2 hours</span>
          </div>
        </div>
        <div className="reminder-row">
          <span
            className="reminder-dot"
            style={{ background: 'var(--amber)' }}
          />
          <div className="reminder-text">
            <span className="t">Prep for team sync</span>
            <span className="s">Starts at 4:00 PM</span>
          </div>
        </div>
        <div className="reminder-row">
          <span
            className="reminder-dot"
            style={{ background: 'var(--muted-2)' }}
          />
          <div className="reminder-text">
            <span className="t">Review weekly goals</span>
            <span className="s">Before Friday</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
