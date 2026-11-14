/* ═══════════════════════════════════════════════════════
   CS-Planly — OAuth Callback Page
   Handles Google/GitHub OAuth redirection and onboarding check
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Completing authentication…');
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;
      if (user) {
        setMessage('Checking your profile…');
        try {
          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data()?.onboarding_completed) {
            toast.success('Signed in successfully!');
          } else {
            toast.success('Welcome! Let’s set up your personalized plan.');
          }
        } catch {
          // Ignore
        }
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        // Fallback after short delay if no user detected
        const timer = setTimeout(() => {
          if (active) {
            navigate(ROUTES.LOGIN, { replace: true });
          }
        }, 3000);
        return () => clearTimeout(timer);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden px-4">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 shadow-lg shadow-sky-500/10">
          <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-sky-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium text-white/90">{message}</span>
        </div>
        <p className="text-xs text-white/40">Please wait while we set up your session</p>
      </div>
    </div>
  );
}
