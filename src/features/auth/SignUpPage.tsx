/* ═══════════════════════════════════════════════════════
   CS-Planly — Sign Up Page
   ═══════════════════════════════════════════════════════ */

import { AuthUI } from '@/components/ui/auth-ui';

export function SignUpPage() {
  return <AuthUI initialIsSignIn={false} />;
}

