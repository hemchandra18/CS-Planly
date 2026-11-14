/* ═══════════════════════════════════════════════════════
   CS-Planly — Reset Password Page
   ═══════════════════════════════════════════════════════ */

import { motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmation) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Password updated successfully.');
    navigate(ROUTES.DASHBOARD, { replace: true });
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-black">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-sky-500/10 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative w-full max-w-md mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-sky-500/10 to-indigo-600/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 bg-[#0A0D14]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80"
        >
          <div className="text-center mb-8">
            <Link
              to={ROUTES.LANDING}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all mb-4 group"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 group-hover:scale-125 transition-transform" />
              <span className="text-xs font-mono font-semibold tracking-wider text-sky-300">
                PLANLY // CS
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Set new password
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              Choose a strong password with at least 8 characters
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
              icon={<Lock className="w-4 h-4" />}
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              minLength={8}
              icon={<Lock className="w-4 h-4" />}
            />
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-black font-semibold shadow-lg shadow-sky-500/20"
            >
              Update password
            </Button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center justify-center gap-1.5 text-xs text-neutral-400 hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

