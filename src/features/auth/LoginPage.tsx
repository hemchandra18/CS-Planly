/* ═══════════════════════════════════════════════════════
   CS-Planly — Login Page
   ═══════════════════════════════════════════════════════ */

import { AuthUI } from '@/components/ui/auth-ui';

export function LoginPage() {
  return <AuthUI initialIsSignIn={true} />;
}

