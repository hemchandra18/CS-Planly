import { useState, useEffect, useRef } from 'react';
import type {
  TaskItem,
  PlanItem,
  GoalItem,
  DeadlineItem,
  NotificationItem,
} from '../dashboardState';

interface DashTopbarProps {
  tasks: TaskItem[];
  plans: PlanItem[];
  goals: GoalItem[];
  deadlines: DeadlineItem[];
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: number) => void;
  copilotOpen: boolean;
  onToggleCopilot: () => void;
  onOpenTask: (id: number) => void;
  onOpenPlan: (id: number) => void;
  onOpenGoal: (id: number) => void;
  onOpenDeadline: (id: number) => void;
}

export function DashTopbar({
  tasks,
  plans,
  goals,
  deadlines,
  notifications,
  onMarkNotificationRead,
  copilotOpen,
  onToggleCopilot,
  onOpenTask,
  onOpenPlan,
  onOpenGoal,
  onOpenDeadline,
}: DashTopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);

  const topbarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (topbarRef.current && !topbarRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setNotifOpen(false);
        setCalOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const hasUnread = notifications.some((n) => !n.read);

  // Search hits
  const q = searchQuery.trim().toLowerCase();
  const hitTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q)) : [];
  const hitPlans = q ? plans.filter((p) => p.title.toLowerCase().includes(q)) : [];
  const hitGoals = q ? goals.filter((g) => g.name.toLowerCase().includes(q)) : [];
  const hitDeadlines = q ? deadlines.filter((d) => d.title.toLowerCase().includes(q)) : [];
  const totalHits = hitTasks.length + hitPlans.length + hitGoals.length + hitDeadlines.length;

  return (
    <div className="topbar" ref={topbarRef}>
      {/* Search Bar */}
      <div className="search-wrap">
        <div className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="searchInput"
            placeholder="Search plans, tasks, goals…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim()) setSearchOpen(true);
            }}
          />
        </div>

        {/* Live Search Dropdown */}
        {searchOpen && searchQuery.trim() && (
          <div className="search-dd open" id="searchDD">
            {totalHits === 0 ? (
              <div className="search-empty">No results found.</div>
            ) : (
              <>
                {hitTasks.length > 0 && (
                  <div className="search-group">
                    <h5>Tasks</h5>
                    {hitTasks.map((t) => (
                      <div
                        key={t.id}
                        className="search-hit"
                        onClick={() => {
                          onOpenTask(t.id);
                          setSearchOpen(false);
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                )}

                {hitPlans.length > 0 && (
                  <div className="search-group">
                    <h5>Plans</h5>
                    {hitPlans.map((p) => (
                      <div
                        key={p.id}
                        className="search-hit"
                        onClick={() => {
                          onOpenPlan(p.id);
                          setSearchOpen(false);
                        }}
                      >
                        {p.title}
                      </div>
                    ))}
                  </div>
                )}

                {hitGoals.length > 0 && (
                  <div className="search-group">
                    <h5>Goals</h5>
                    {hitGoals.map((g) => (
                      <div
                        key={g.id}
                        className="search-hit"
                        onClick={() => {
                          onOpenGoal(g.id);
                          setSearchOpen(false);
                        }}
                      >
                        {g.name}
                      </div>
                    ))}
                  </div>
                )}

                {hitDeadlines.length > 0 && (
                  <div className="search-group">
                    <h5>Deadlines</h5>
                    {hitDeadlines.map((d) => (
                      <div
                        key={d.id}
                        className="search-hit"
                        onClick={() => {
                          onOpenDeadline(d.id);
                          setSearchOpen(false);
                        }}
                      >
                        {d.title}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Top Actions */}
      <div className="top-actions">
        {/* Notifications Icon + Dropdown */}
        <div className="icon-wrap">
          <button
            className="icon-btn"
            id="bellBtn"
            title="Notifications"
            onClick={(e) => {
              e.stopPropagation();
              setNotifOpen(!notifOpen);
              setCalOpen(false);
              setSearchOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            {hasUnread && <span className="dot" id="bellDot" />}
          </button>

          <div className={`dropdown ${notifOpen ? 'open' : ''}`} id="notifDD">
            <div className="dropdown-head">Notifications</div>
            <div id="notifList">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-row ${n.read ? 'read' : ''}`}
                  onClick={() => onMarkNotificationRead(n.id)}
                >
                  <span className="d" />
                  <div>
                    <div className="nt">{n.text}</div>
                    <div className="ntime">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Events Icon + Dropdown */}
        <div className="icon-wrap">
          <button
            className="icon-btn"
            id="calBtn"
            title="Upcoming events"
            onClick={(e) => {
              e.stopPropagation();
              setCalOpen(!calOpen);
              setNotifOpen(false);
              setSearchOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
          </button>

          <div className={`dropdown ${calOpen ? 'open' : ''}`} id="calDD">
            <div className="dropdown-head">Upcoming events</div>
            <div id="calList">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className="notif-row"
                  onClick={() => {
                    onOpenPlan(p.id);
                    setCalOpen(false);
                  }}
                >
                  <span className="d" style={{ background: 'var(--blue)' }} />
                  <div>
                    <div className="nt">{p.title}</div>
                    <div className="ntime">{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copilot Toggle Button */}
        <button
          className={`copilot-btn ${copilotOpen ? 'on' : ''}`}
          id="copilotToggle"
          onClick={onToggleCopilot}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
            <circle cx="12" cy="12" r="3.2" />
          </svg>
          Copilot
        </button>
      </div>
    </div>
  );
}
