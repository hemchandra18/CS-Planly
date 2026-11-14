/* ═══════════════════════════════════════════════════════
   Planly CS — Auth UI (Light Mode)
   Left: ~34% Light-Mode Panel (#F8FAFC)
   Right: ~66% Preserved Galaxy Canvas + Floating Astronaut
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import { GalaxyBackground } from "@/components/GalaxyBackground";

export interface AuthUIProps {
  initialIsSignIn?: boolean;
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
      />
    </svg>
  );
}

// ── Sign In Form ─────────────────────────────────────

function SignInForm({
  onGoogle,
  googleLoading,
}: {
  onGoogle: () => void;
  googleLoading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Sign in failed");
      return;
    }
    toast.success("Welcome back!");
    const dest = (location.state as { from?: { pathname?: string } } | null)
      ?.from?.pathname;
    navigate(dest || ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <form onSubmit={handleSignIn} autoComplete="on" className="w-full">
      {/* Decorative Accent Pill */}
      <div
        className="bg-[#3478F6] rounded-full"
        style={{ width: "28px", height: "4px", marginBottom: "16px" }}
      />

      {/* Heading Section: 8px between Welcome and Heading, 8px between Heading and Subtitle, 26px to Email */}
      <div style={{ marginBottom: "26px" }}>
        <p
          className="text-xs sm:text-sm font-medium text-[#718096] leading-none select-none"
          style={{ marginBottom: "8px" }}
        >
          Welcome back
        </p>
        <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight leading-tight m-0">
          Login to your <span className="text-[#3478F6]">account</span>
        </h1>
        <p
          className="text-xs sm:text-sm text-[#718096] leading-normal"
          style={{ marginTop: "8px" }}
        >
          Continue your learning journey
        </p>
      </div>

      {/* Email Input Field (~52px tall, 16px to Password) */}
      <div
        style={{ height: "52px", marginBottom: "16px" }}
        className="w-full rounded-xl border border-[#DCE3ED] bg-white px-3.5 flex items-center gap-3 transition-all focus-within:border-[#3478F6] focus-within:ring-2 focus-within:ring-[#3478F6]/20"
      >
        <Mail className="h-4 w-4 shrink-0 text-[#718096]" />
        <div className="flex-1 min-w-0">
          <label
            htmlFor="signin-email"
            className="block text-[11px] font-medium text-[#718096] leading-none mb-0.5 select-none"
          >
            Email
          </label>
          <input
            id="signin-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="john.snow@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ outline: "none", boxShadow: "none" }}
            className="w-full bg-transparent text-sm text-[#111827] placeholder:text-[#94A3B8] outline-none focus:outline-none focus-visible:outline-none border-none focus:ring-0 focus-visible:ring-0 leading-none py-0.5"
          />
        </div>
      </div>

      {/* Password Input Field (~52px tall, 16px to Remember Row) */}
      <div
        style={{ height: "52px", marginBottom: "16px" }}
        className="w-full rounded-xl border border-[#DCE3ED] bg-white px-3.5 flex items-center gap-3 transition-all focus-within:border-[#3478F6] focus-within:ring-2 focus-within:ring-[#3478F6]/20"
      >
        <Lock className="h-4 w-4 shrink-0 text-[#718096]" />
        <div className="flex-1 min-w-0">
          <label
            htmlFor="signin-password"
            className="block text-[11px] font-medium text-[#718096] leading-none mb-0.5 select-none"
          >
            Password
          </label>
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ outline: "none", boxShadow: "none" }}
            className="w-full bg-transparent text-sm text-[#111827] placeholder:text-[#94A3B8] outline-none focus:outline-none focus-visible:outline-none border-none focus:ring-0 focus-visible:ring-0 leading-none py-0.5"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-[#718096] hover:text-[#111827] transition-colors p-1 cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Remember Me and Forgot Password Row (20px to Login Button) */}
      <div
        style={{ marginBottom: "20px" }}
        className="flex items-center justify-between"
      >
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-[#DCE3ED] text-[#3478F6] focus:ring-[#3478F6] accent-[#3478F6] cursor-pointer"
          />
          <span className="text-xs text-[#718096] font-normal">Remember me</span>
        </label>
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-xs font-medium text-[#3478F6] hover:underline transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Primary Login Button (20px from Remember Row, ~50px tall, 20px to OR Divider) */}
      <button
        type="submit"
        disabled={loading}
        style={{ height: "50px", marginBottom: "20px" }}
        className="w-full bg-[#3478F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl shadow-[0_4px_14px_rgba(52,120,246,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Logging in…</span>
          </div>
        ) : (
          <>
            <span>Login now</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Clean Full-Width OR Divider (20px from Login button, 20px to Google button) */}
      <div
        style={{ marginBottom: "20px" }}
        className="flex items-center gap-3 w-full select-none"
        aria-hidden="true"
      >
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[11px] font-semibold text-[#94A3B8] tracking-wider uppercase px-1">
          OR
        </span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      {/* Google Sign-In Button (~50px tall) */}
      <button
        type="button"
        onClick={onGoogle}
        disabled={googleLoading}
        style={{ height: "50px" }}
        className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-[#111827] font-medium text-sm rounded-xl border border-[#DCE3ED] shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <div className="flex items-center gap-2 text-xs text-[#718096]">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Connecting to Google…</span>
          </div>
        ) : (
          <>
            <GoogleIcon />
            <span>Or sign in with Google</span>
          </>
        )}
      </button>
    </form>
  );
}

// ── Sign Up Form ─────────────────────────────────────

function SignUpForm({
  onGoogle,
  googleLoading,
}: {
  onGoogle: () => void;
  googleLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (error) {
      toast.error(error.message || "Sign up failed");
      return;
    }
    toast.success("Account created! Let's build your plan.");
    navigate(ROUTES.CREATE_PLAN, { replace: true });
  };

  return (
    <form onSubmit={handleSignUp} autoComplete="on" className="w-full">
      {/* Decorative Accent Pill */}
      <div
        className="bg-[#3478F6] rounded-full"
        style={{ width: "28px", height: "4px", marginBottom: "16px" }}
      />

      {/* Heading Section: 8px between Welcome and Heading, 8px between Heading and Subtitle, 26px to Name */}
      <div style={{ marginBottom: "26px" }}>
        <p
          className="text-xs sm:text-sm font-medium text-[#718096] leading-none select-none"
          style={{ marginBottom: "8px" }}
        >
          Start for free
        </p>
        <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight leading-tight m-0">
          Create your <span className="text-[#3478F6]">account</span>
        </h1>
        <p
          className="text-xs sm:text-sm text-[#718096] leading-normal"
          style={{ marginTop: "8px" }}
        >
          Start your personalized CS learning journey
        </p>
      </div>

      {/* Full Name Input Field (~52px tall, 16px to Email) */}
      <div
        style={{ height: "52px", marginBottom: "16px" }}
        className="w-full rounded-xl border border-[#DCE3ED] bg-white px-3.5 flex items-center gap-3 transition-all focus-within:border-[#3478F6] focus-within:ring-2 focus-within:ring-[#3478F6]/20"
      >
        <User className="h-4 w-4 shrink-0 text-[#718096]" />
        <div className="flex-1 min-w-0">
          <label
            htmlFor="signup-name"
            className="block text-[11px] font-medium text-[#718096] leading-none mb-0.5 select-none"
          >
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="John Snow"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ outline: "none", boxShadow: "none" }}
            className="w-full bg-transparent text-sm text-[#111827] placeholder:text-[#94A3B8] outline-none focus:outline-none focus-visible:outline-none border-none focus:ring-0 focus-visible:ring-0 leading-none py-0.5"
          />
        </div>
      </div>

      {/* Email Input Field (~52px tall, 16px to Password) */}
      <div
        style={{ height: "52px", marginBottom: "16px" }}
        className="w-full rounded-xl border border-[#DCE3ED] bg-white px-3.5 flex items-center gap-3 transition-all focus-within:border-[#3478F6] focus-within:ring-2 focus-within:ring-[#3478F6]/20"
      >
        <Mail className="h-4 w-4 shrink-0 text-[#718096]" />
        <div className="flex-1 min-w-0">
          <label
            htmlFor="signup-email"
            className="block text-[11px] font-medium text-[#718096] leading-none mb-0.5 select-none"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="john.snow@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ outline: "none", boxShadow: "none" }}
            className="w-full bg-transparent text-sm text-[#111827] placeholder:text-[#94A3B8] outline-none focus:outline-none focus-visible:outline-none border-none focus:ring-0 focus-visible:ring-0 leading-none py-0.5"
          />
        </div>
      </div>

      {/* Password Input Field (~52px tall, 20px to Submit button) */}
      <div
        style={{ height: "52px", marginBottom: "20px" }}
        className="w-full rounded-xl border border-[#DCE3ED] bg-white px-3.5 flex items-center gap-3 transition-all focus-within:border-[#3478F6] focus-within:ring-2 focus-within:ring-[#3478F6]/20"
      >
        <Lock className="h-4 w-4 shrink-0 text-[#718096]" />
        <div className="flex-1 min-w-0">
          <label
            htmlFor="signup-password"
            className="block text-[11px] font-medium text-[#718096] leading-none mb-0.5 select-none"
          >
            Password
          </label>
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ outline: "none", boxShadow: "none" }}
            className="w-full bg-transparent text-sm text-[#111827] placeholder:text-[#94A3B8] outline-none focus:outline-none focus-visible:outline-none border-none focus:ring-0 focus-visible:ring-0 leading-none py-0.5"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-[#718096] hover:text-[#111827] transition-colors p-1 cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Primary Sign Up Button (20px from Password, ~50px tall, 20px to OR Divider) */}
      <button
        type="submit"
        disabled={loading}
        style={{ height: "50px", marginBottom: "20px" }}
        className="w-full bg-[#3478F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl shadow-[0_4px_14px_rgba(52,120,246,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Creating account…</span>
          </div>
        ) : (
          <>
            <span>Join free today</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Clean Full-Width OR Divider (20px from Sign Up button, 20px to Google button) */}
      <div
        style={{ marginBottom: "20px" }}
        className="flex items-center gap-3 w-full select-none"
        aria-hidden="true"
      >
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[11px] font-semibold text-[#94A3B8] tracking-wider uppercase px-1">
          OR
        </span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      {/* Google Sign-In Button (~50px tall) */}
      <button
        type="button"
        onClick={onGoogle}
        disabled={googleLoading}
        style={{ height: "50px" }}
        className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-[#111827] font-medium text-sm rounded-xl border border-[#DCE3ED] shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <div className="flex items-center gap-2 text-xs text-[#718096]">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Connecting to Google…</span>
          </div>
        ) : (
          <>
            <GoogleIcon />
            <span>Or sign in with Google</span>
          </>
        )}
      </button>
    </form>
  );
}

// ── Auth Form Container ──────────────────────────────

function AuthFormContainer({
  isSignIn,
}: {
  isSignIn: boolean;
}) {
  const { signInWithOAuth } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await signInWithOAuth("google");
      if (error) {
        toast.error(error.message || "Failed to start Google sign-in");
        setGoogleLoading(false);
      } else {
        toast.success("Signed in with Google!");
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error initiating Google sign-in");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isSignIn ? (
        <SignInForm onGoogle={handleGoogle} googleLoading={googleLoading} />
      ) : (
        <SignUpForm onGoogle={handleGoogle} googleLoading={googleLoading} />
      )}
    </div>
  );
}

// ── Bouncing Astronaut ───────────────────────────────

const ASTRO_WIDTH = 220;
const ASTRO_HEIGHT = 235;

function BouncingAstronaut() {
  const ref = React.useRef<HTMLImageElement>(null);
  const state = React.useRef({
    x: 40,
    y: 30,
    vx: 0.6,
    vy: 0.45,
    rotation: 0,
    rotationSpeed: 0.12,
  });

  useEffect(() => {
    let raf: number;

    const animate = () => {
      const s = state.current;
      const el = ref.current;
      if (!el) {
        raf = requestAnimationFrame(animate);
        return;
      }

      const parent = el.parentElement;
      if (!parent) {
        raf = requestAnimationFrame(animate);
        return;
      }

      const maxX = Math.max(0, parent.clientWidth - ASTRO_WIDTH);
      const maxY = Math.max(0, parent.clientHeight - ASTRO_HEIGHT);

      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.rotationSpeed;

      // Bounce off edges of the right panel
      if (s.x <= 0 || s.x >= maxX) {
        s.vx *= -1;
        s.rotationSpeed *= -1;
        s.x = Math.max(0, Math.min(s.x, maxX));
      }
      if (s.y <= 0 || s.y >= maxY) {
        s.vy *= -1;
        s.rotationSpeed *= -1;
        s.y = Math.max(0, Math.min(s.y, maxY));
      }

      el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rotation}deg)`;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <img
      ref={ref}
      src="/images/astronaut-float.png"
      alt=""
      aria-hidden="true"
      className="absolute top-0 left-0 pointer-events-none select-none"
      style={{
        width: ASTRO_WIDTH,
        height: ASTRO_HEIGHT,
        objectFit: "contain",
        filter:
          "drop-shadow(0 12px 28px rgba(0,0,0,0.65)) drop-shadow(0 0 15px rgba(56,189,248,0.25))",
        willChange: "transform",
      }}
    />
  );
}

// ── AuthUI (Main Export) ─────────────────────────────

export function AuthUI({ initialIsSignIn = true }: AuthUIProps) {
  const [isSignIn, setIsSignIn] = useState(initialIsSignIn);
  const toggleForm = () => setIsSignIn((prev) => !prev);

  return (
    <div className="relative z-10 flex min-h-screen w-full overflow-hidden bg-transparent">
      {/* Background: Authentic Milky Way Galaxy & Interactive Stars Canvas */}
      <GalaxyBackground />

      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        input:focus,
        input:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }
      `}</style>

      {/* Left — 34% Solid Light-Mode Panel (#F8FAFC) */}
      <aside
        className="relative z-20 flex min-h-screen w-full lg:w-[34%] xl:w-[34%] shrink-0 flex-col justify-between bg-[#F8FAFC] border-r border-[#E5E7EB] shadow-xl overflow-y-auto"
        style={{
          paddingLeft: "48px",
          paddingRight: "48px",
          paddingTop: "36px",
          paddingBottom: "28px",
        }}
      >
        <div className="w-full flex flex-col justify-between flex-1 min-h-0">
          {/* Top Branding: PLANLY // CS */}
          <div className="shrink-0 mb-4">
            <Link
              to={ROUTES.LANDING}
              className="inline-flex items-center text-sm font-mono font-bold tracking-[0.14em] transition-opacity hover:opacity-80"
            >
              <span className="text-[#111827]">PLANLY</span>
              <span className="text-[#3478F6] ml-1.5">// CS</span>
            </Link>
          </div>

          {/* Center: Auth Form Container (Vertically balanced and centered) */}
          <div className="my-auto py-2 w-full">
            <AuthFormContainer isSignIn={isSignIn} />
          </div>

          {/* Bottom Registration Footer with subtle divider */}
          <div className="shrink-0 border-t border-[#E5E7EB] pt-4 text-center text-xs text-[#718096] mt-4">
            <span>{isSignIn ? "Don't have an account?" : "Already have an account?"}</span>{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-[#3478F6] font-medium hover:underline cursor-pointer ml-1 transition-colors"
            >
              {isSignIn ? "Join free today" : "Sign in here"}
            </button>
          </div>
        </div>
      </aside>

      {/* Right — 66% Preserved Galaxy Canvas & Floating Astronaut */}
      <section className="hidden md:block relative flex-1 min-h-screen overflow-hidden bg-transparent">
        <BouncingAstronaut />
      </section>
    </div>
  );
}
