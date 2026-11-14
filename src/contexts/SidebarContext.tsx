/* ═══════════════════════════════════════════════════════
   Planly — Sidebar Context & State Provider
   Manages responsive collapsible sidebar state across desktop & mobile
   ═══════════════════════════════════════════════════════ */

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('planly_sidebar_open');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('planly_sidebar_open', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const openSidebar = () => {
    setIsOpen(true);
    try {
      localStorage.setItem('planly_sidebar_open', JSON.stringify(true));
    } catch {}
  };

  const closeSidebar = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('planly_sidebar_open', JSON.stringify(false));
    } catch {}
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, openSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
