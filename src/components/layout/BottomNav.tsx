/* ═══════════════════════════════════════════════════════
   CS-Planly — Bottom Navigation Bar v3 (Framer-inspired)
   ═══════════════════════════════════════════════════════ */

import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { LayoutDashboard, FolderOpen, BarChart3, Settings } from 'lucide-react';

const tabs = [
  { to: ROUTES.DASHBOARD, label: 'Today', icon: LayoutDashboard },
  { to: ROUTES.PLAN, label: 'Plan', icon: FolderOpen },
  { to: ROUTES.PROGRESS, label: 'Progress', icon: BarChart3 },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="mobile-only fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] bg-[rgba(0,0,0,0.92)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-around h-[var(--bottom-nav-height)] px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 py-2 px-3 min-w-[56px] rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)]',
                  isActive
                    ? 'text-white'
                    : 'text-[var(--color-text-tertiary)]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
