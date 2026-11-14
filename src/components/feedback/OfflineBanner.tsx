/* ═══════════════════════════════════════════════════════
   CS-Planly — Offline Banner Component v2
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -32, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-[var(--z-toast)] flex items-center justify-center gap-2 py-2 px-4 bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-b border-[var(--color-warning)]/20"
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span className="text-[var(--text-xs)] font-medium">
            You're offline. Some features may be unavailable.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
