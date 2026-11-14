/* ═══════════════════════════════════════════════════════
   CS-Planly — Avatar Menu Component v2
   ═══════════════════════════════════════════════════════ */

import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { cn, getInitials } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { Settings, LogOut } from 'lucide-react';

interface AvatarMenuProps {
  userName: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function AvatarMenu({ userName, userEmail, onLogout }: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-400/30 text-blue-200 flex items-center justify-center text-xs font-semibold hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer shadow-sm select-none"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {getInitials(userName)}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0c1220]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in divide-y divide-white/[0.06]">
          {/* User info */}
          <div className="px-3.5 py-3">
            <p className="text-xs font-semibold text-white truncate">
              {userName}
            </p>
            {userEmail && (
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {userEmail}
              </p>
            )}
          </div>

          {/* Menu items */}
          <div className="p-1.5 space-y-0.5">
            <NavLink
              to={ROUTES.SETTINGS}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-300 font-medium',
                'hover:bg-white/[0.06] hover:text-white transition-colors'
              )}
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              Settings
            </NavLink>

            {onLogout && (
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-red-400 font-medium',
                  'hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer'
                )}
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
