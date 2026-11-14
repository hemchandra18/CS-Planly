import { useState } from 'react';
import type { NavId } from '../dashboardState';
import { LEARNING_CATS } from '../dashboardState';

interface DashSidebarProps {
  activeNav: NavId;
  onNavChange: (id: NavId) => void;
  learningOpen: boolean;
  onLearningToggle: () => void;
  learningFilter: string | null;
  onLearningFilter: (cat: string | null) => void;
  userName?: string;
  onSettingsClick?: () => void;
  onSignOut?: () => void;
}

export function DashSidebar({
  activeNav,
  onNavChange,
  learningOpen,
  onLearningToggle,
  learningFilter,
  onLearningFilter,
  userName = 'Hemchandra',
  onSettingsClick,
  onSignOut,
}: DashSidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'HE';
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        <div className="brand-mark">✓</div>
        <div className="brand-name">Planly</div>
      </div>

      {/* Nav */}
      <nav id="navList">
        {/* Dashboard */}
        <button
          className={`nav-item ${activeNav === 'dashboard' && !learningOpen ? 'active' : ''}`}
          onClick={() => {
            onNavChange('dashboard');
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
          </svg>
          Dashboard
        </button>

        {/* Today */}
        <button
          className={`nav-item ${activeNav === 'today' ? 'active' : ''}`}
          onClick={() => onNavChange('today')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
          Today
        </button>

        {/* Plans */}
        <button
          className={`nav-item ${activeNav === 'plans' ? 'active' : ''}`}
          onClick={() => onNavChange('plans')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2 3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
          </svg>
          Plans
        </button>

        {/* Calendar */}
        <button
          className={`nav-item ${activeNav === 'calendar' ? 'active' : ''}`}
          onClick={() => onNavChange('calendar')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4M8 14h2M14 14h2M8 18h2" />
          </svg>
          Calendar
        </button>

        {/* Tasks */}
        <button
          className={`nav-item ${activeNav === 'tasks' ? 'active' : ''}`}
          onClick={() => onNavChange('tasks')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 11l3 3 8-8M3 12a9 9 0 1 1 5.5 8.3" />
          </svg>
          Tasks
        </button>

        {/* Goals */}
        <button
          className={`nav-item ${activeNav === 'goals' ? 'active' : ''}`}
          onClick={() => onNavChange('goals')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="12" cy="12" r=".6" fill="currentColor" />
          </svg>
          Goals
        </button>

        {/* Insights */}
        <button
          className={`nav-item ${activeNav === 'insights' ? 'active' : ''}`}
          onClick={() => onNavChange('insights')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 20V10M12 20V4M20 20v-7" />
          </svg>
          Insights
        </button>

        {/* Learning Accordion Group */}
        <div className="nav-group">
          <button
            className={`nav-item ${activeNav === 'dashboard' && learningOpen ? 'active' : ''}`}
            onClick={onLearningToggle}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5v-15Z" />
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            </svg>
            Learning
            <svg
              className={`chev ${learningOpen ? 'open' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="13"
              height="13"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div className={`nav-sub ${learningOpen ? 'open' : ''}`}>
            {LEARNING_CATS.map((cat) => (
              <button
                key={cat.key}
                className={`nav-sub-item ${learningFilter === cat.key ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLearningFilter(cat.key);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="sidebar-spacer" />

      {/* User Row with Popup Menu */}
      <div
        className="user-row"
        id="userRow"
        onClick={(e) => {
          e.stopPropagation();
          setUserMenuOpen(!userMenuOpen);
        }}
      >
        <div className="avatar">{getInitials(userName)}</div>
        <div className="user-meta">
          <div className="name">{userName}</div>
          <div className="plan">Free plan</div>
        </div>
        <div className={`menu-dd ${userMenuOpen ? 'open' : ''}`} id="userMenu">
          <button
            onClick={() => {
              setUserMenuOpen(false);
              onSettingsClick?.();
            }}
          >
            Profile
          </button>
          <button
            onClick={() => {
              setUserMenuOpen(false);
              onSettingsClick?.();
            }}
          >
            Settings
          </button>
          <button
            onClick={() => {
              setUserMenuOpen(false);
              onSignOut?.();
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
