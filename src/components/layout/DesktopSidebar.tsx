import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  BookOpen,
  Code2,
  Map,
  RefreshCw,
  MessagesSquare,
  BarChart3,
  HelpCircle,
  Settings,
  PanelLeftClose,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

const PRIMARY_NAV = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: ROUTES.PLAN, label: 'Prep Hub', icon: BookOpen, end: true },
  { to: ROUTES.PLAN, label: 'Practice', icon: Code2, end: false },
  { to: `${ROUTES.DASHBOARD}#roadmaps`, label: 'Roadmaps', icon: Map, end: false },
  { to: `${ROUTES.DASHBOARD}#cheatsheets`, label: 'Revision', icon: RefreshCw, end: false },
  { to: `${ROUTES.DASHBOARD}#interviews`, label: 'Interviews', icon: MessagesSquare, end: false },
  { to: ROUTES.PROGRESS, label: 'Progress', icon: BarChart3, end: true },
] as const;

const UTILITY_NAV = [
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  { to: ROUTES.SETTINGS, label: 'Help', icon: HelpCircle },
] as const;

export function DesktopSidebar() {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden dark:bg-zinc-950/70"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-950 transition-all duration-300 lg:static',
          'dark:border-zinc-800 dark:bg-zinc-950',
          isOpen ? 'w-56 translate-x-0 px-3 py-2 opacity-100' : 'pointer-events-none w-0 -translate-x-full p-0 opacity-0 lg:translate-x-0'
        )}
      >
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-1 dark:border-zinc-800">
            <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-2 text-slate-50">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary-500 text-white">
                <svg viewBox="0 0 24 24" fill="none" className="size-3.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 2 10 5-10 5-10-5Z" />
                  <path d="m2 12 10 5 10-5" />
                  <path d="m2 17 10 5 10-5" />
                </svg>
              </span>
              <span className="font-sans text-sm font-bold tracking-tight">Planly</span>
            </NavLink>
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 dark:hover:bg-zinc-800"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="size-4" />
            </button>
          </div>

          <nav className="sidebar-scrollbar flex flex-1 flex-col justify-between overflow-y-auto py-4">
            <div className="space-y-1">
              {PRIMARY_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => {
                      const showActive = isActive && item.end;
                      return cn(
                        'flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
                        showActive
                          ? 'bg-primary-500/20 text-slate-50 dark:bg-primary-500/25 dark:text-white'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100 dark:hover:bg-zinc-900'
                      );
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            'size-4 shrink-0',
                            isActive && item.end
                              ? 'text-primary-400'
                              : 'text-slate-500'
                          )}
                        />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="space-y-1 border-t border-slate-800 pt-3 dark:border-zinc-800">
              {UTILITY_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 dark:hover:bg-zinc-900"
                  >
                    <Icon className="size-4 shrink-0 text-slate-500" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
