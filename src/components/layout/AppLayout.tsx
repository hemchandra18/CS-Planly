/* ═══════════════════════════════════════════════════════
   Planly — App Layout Shell
   Sidebar flush to the left, top, and bottom of the page
   ═══════════════════════════════════════════════════════ */

import { Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { CopilotPanel } from './CopilotPanel';
import { CopilotModal } from '../common/CopilotModal';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CopilotProvider } from '@/contexts/CopilotContext';

interface AppLayoutProps {
  userName?: string;
}

export function AppLayout({ userName = 'User' }: AppLayoutProps) {
  const location = useLocation();

  // The main dashboard has its own complete multi-column layout
  if (location.pathname === ROUTES.DASHBOARD) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <CopilotProvider>
        <div className="relative z-10 flex h-full max-h-full w-full flex-col overflow-hidden bg-slate-900 font-sans text-slate-100 dark:bg-zinc-950 dark:text-zinc-100">
          <div className="flex h-full min-h-0 flex-1 overflow-hidden">
            <DesktopSidebar />

            <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-slate-900 dark:bg-zinc-950">
              <TopNav userName={userName} />
              <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 pb-20 sm:px-6 md:pb-8 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">
                  <Outlet />
                </div>
              </main>
            </div>

            {/* Collapsible Right Copilot Panel */}
            <CopilotPanel />
          </div>

          <BottomNav />

          {/* AI Co-pilot Focus Modal (MorphOrb) */}
          <CopilotModal />
        </div>
      </CopilotProvider>
    </SidebarProvider>
  );
}
