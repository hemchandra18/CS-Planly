import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { archiveActivePlan } from '@/lib/progress';
import { createSamplePlan } from '@/lib/planGenerator';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    const result = await signOut();
    if (!result.error) navigate(ROUTES.LOGIN, { replace: true });
  }

  async function resetPlan() {
    if (!user || !window.confirm('Reset your plan and onboarding answers so you can test the flow again?')) return;
    try {
      await archiveActivePlan(user.id);
    } catch {
      // Continue even if archive fails
    }
    localStorage.removeItem(`planly_onboarding_${user.id}`);
    localStorage.removeItem('planly:onboarding-draft');
    try {
      await setDoc(doc(db, 'profiles', user.id), {
        onboarding_completed: false,
        target_role: null,
        experience_level: null,
        company_type: null,
        company_region: null,
        goal: null,
        selected_subjects: [],
        skill_level: null,
        daily_hours: 2,
        target_date: null,
        preferred_language: null,
        include_videos: true,
        include_problems: true,
        weekend_breaks: false,
        revision_days: true,
      }, { merge: true });
    } catch (e) {
      console.warn('Error resetting profile in Firestore:', e);
    }
    navigate('/onboarding/welcome', { replace: true });
  }
  async function createSample() { if (!user) return; const result = await createSamplePlan(user.id); if (result.error) toast.error(result.error.message); else { toast.success('Sample plan created with 3 topics for today.'); navigate(ROUTES.DASHBOARD, { replace: true }); } }
  return <div className="space-y-10"><h1 className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-display)]">Settings</h1><section className="space-y-4"><h2 className="text-[var(--text-xs)] font-medium text-[var(--color-text-tertiary)] uppercase">Appearance</h2><div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4"><Toggle checked={resolvedTheme === 'dark'} onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} label="Dark mode" description={`Current: ${theme}`} /></div></section><section className="space-y-4"><h2 className="text-[var(--text-xs)] font-medium text-[var(--color-text-tertiary)] uppercase">Testing</h2><div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 space-y-3"><p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Create three sample topics for today so you can test task actions and progress.</p><Button variant="secondary" onClick={createSample}>Create sample plan</Button><p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Clear your current plan and restart onboarding.</p><Button variant="secondary" onClick={resetPlan} icon={<RefreshCcw className="w-4 h-4" />}>Reset plan and onboarding</Button></div></section><section className="space-y-4"><h2 className="text-[var(--text-xs)] font-medium text-[var(--color-text-tertiary)] uppercase">Account</h2><div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 space-y-3"><p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">{user?.email}</p><Button variant="secondary" onClick={handleSignOut}>Sign out</Button></div></section></div>;
}
