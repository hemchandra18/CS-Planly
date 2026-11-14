/* ═══════════════════════════════════════════════════════
   CS-Planly — React Entry Point
   ═══════════════════════════════════════════════════════ */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(20, 20, 25, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--color-text-primary)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
