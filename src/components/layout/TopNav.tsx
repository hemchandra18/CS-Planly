import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { Flame, Trophy, Bell, PanelLeft, Sparkles, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useCopilot } from '@/contexts/CopilotContext';
import { AvatarMenu } from './AvatarMenu';
import { SearchModal } from '../common/SearchModal';
import { cn } from '@/lib/utils';
const STREAK_DAYS = 12;
const XP_TOTAL = 3450;

interface TopNavProps {
  userName?: string;
}

export function TopNav({ userName = 'Alex' }: TopNavProps) {
  const { user, signOut } = useAuth();
  const { isOpen, toggleSidebar } = useSidebar();
  const { isOpen: isCopilotOpen, toggleCopilot } = useCopilot();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const displayName = user?.user_metadata?.full_name || userName || 'Alex Rivera';
  const displayEmail = user?.email || 'alex.rivera@example.com';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-slate-800 bg-slate-900/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950/90">
        {!isOpen ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-50 dark:hover:bg-zinc-800"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="size-4" />
            </button>
            <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-2 text-slate-50">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary-500 text-white">
                <span className="grid size-3 grid-cols-2 gap-0.5">
                  <span className="rounded-sm bg-white" />
                  <span className="rounded-sm bg-white" />
                  <span className="rounded-sm bg-white" />
                  <span className="rounded-sm bg-white" />
                </span>
              </span>
              <span className="hidden font-sans text-sm font-bold tracking-tight sm:inline">Planly</span>
            </NavLink>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200 dark:border-zinc-700 dark:bg-zinc-900/80"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate">Search topics, problems, and roadmaps</span>
          <kbd className="ml-auto hidden rounded-md border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-slate-400 sm:inline">
            ⌘K
          </kbd>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-400 sm:inline-flex">
            <Flame className="size-3.5" />
            <span>{STREAK_DAYS}</span>
          </div>
          <div className="hidden items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 md:inline-flex">
            <Trophy className="size-3.5" />
            <span>{XP_TOTAL} XP</span>
          </div>
          <button
            type="button"
            onClick={toggleCopilot}
            className={cn(
              'inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-semibold transition-colors',
              isCopilotOpen
                ? 'border-primary-500/40 bg-primary-500/20 text-primary-200'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-primary-500/30 hover:text-slate-50 dark:bg-zinc-900'
            )}
          >
            <Sparkles className="size-3.5 text-primary-400" />
            <span className="hidden sm:inline">Co-pilot</span>
          </button>
          <button
            type="button"
            className="relative inline-flex size-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-50 dark:bg-zinc-900"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="size-3.5" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary-500" />
          </button>
          <div className="shrink-0">
            {user ? (
              <AvatarMenu userName={displayName} userEmail={displayEmail} onLogout={() => signOut()} />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-lg border border-primary-500/30 bg-primary-500/20 text-xs font-semibold text-primary-200">
                AR
              </div>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
