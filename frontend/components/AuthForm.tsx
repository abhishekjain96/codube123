"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import Logo from "./Logo";
import { GoogleIcon, GitHubIcon } from "./icons";
import { ApiError, login, signup } from "@/lib/api";

const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/60 focus:bg-white/[0.06]";

const perks = [
  "A full multi-page website from one sentence",
  "Click to edit any text, image or item",
  "Login, signup and dashboard pages included",
  "Production code only after you approve",
];

function messageFor(err: unknown, isSignup: boolean) {
  if (err instanceof ApiError) {
    if (err.status === 409) return "An account with this email already exists.";
    if (err.status === 401) return "Invalid email or password.";
    if (err.status === 400)
      return isSignup
        ? "Please check your details. The password needs at least 8 characters."
        : "Please enter your email and password.";
  }
  return "Could not reach the Codube server. Is the backend running?";
}

export default function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setIdea(sessionStorage.getItem("codube_prompt") ?? sessionStorage.getItem("acoopa_prompt") ?? "");
    } catch {}
  }, []);

  const strength = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) s++;
    return password ? Math.max(s, 1) : 0;
  }, [password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) await signup(name, email, password);
      else await login(email, password);
      router.push(idea ? "/generating" : "/dashboard");
    } catch (err) {
      setError(messageFor(err, isSignup));
      setLoading(false);
    }
  }

  const social =
    "relative flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-slate-400";

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[#06060b] text-white lg:grid-cols-2">
      {/* form side */}
      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="aurora pointer-events-none absolute inset-0 opacity-60 lg:hidden" />
        <div className="relative w-full max-w-md">
          <Link href="/" className="mb-8 inline-block text-white">
            <Logo />
          </Link>

          {idea && (
            <div className="mb-6 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4 text-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-300">
                <Sparkles size={13} /> Your idea is saved
              </p>
              <p className="mt-1 line-clamp-2 text-slate-300">{idea}</p>
            </div>
          )}

          <h1 className="text-3xl font-extrabold tracking-tight">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-slate-400">
            {isSignup ? "Start building your website in under a minute." : "Log in to continue building."}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button type="button" disabled title="Coming soon" className={social}>
              <GoogleIcon /> Google
              <span className="absolute -right-1 -top-2 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-amber-300">Soon</span>
            </button>
            <button type="button" disabled title="Coming soon" className={social}>
              <GitHubIcon /> GitHub
              <span className="absolute -right-1 -top-2 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-amber-300">Soon</span>
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px flex-1 bg-white/10" /> or with email <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {isSignup && (
              <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={input} />
            )}
            <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={input} />

            <div className="relative">
              <input
                required
                type={show ? "text" : "password"}
                minLength={isSignup ? 8 : undefined}
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "Password (min 8 characters)" : "Password"}
                className={`${input} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {isSignup && password && (
              <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1.5">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{ background: n <= strength ? ["#ef4444", "#f59e0b", "#22c55e"][strength - 1] : "rgba(255,255,255,0.1)" }}
                    />
                  ))}
                </div>
                <span className="w-14 text-right text-xs text-slate-500">{["", "Weak", "Okay", "Strong"][strength]}</span>
              </div>
            )}

            {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">{error}</p>}

            <button
              disabled={loading}
              className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:opacity-95 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isSignup ? "Already have an account? " : "New to Codube? "}
            <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-orange-300 transition hover:text-orange-200">
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>

      {/* showcase side */}
      <div className="relative hidden items-center justify-center overflow-hidden border-l border-white/[0.06] p-12 lg:flex">
        <div className="aurora pointer-events-none absolute inset-0" />
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative w-full max-w-md">
          <div className="glass anim-bob rounded-2xl bg-[#0b0b14]/80 p-4 shadow-2xl shadow-orange-500/20 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </span>
              <span className="text-[11px] text-slate-500">your-site.codube.app</span>
              <span className="w-10" />
            </div>
            <div className="mt-4 grid grid-cols-[1.2fr_0.8fr] gap-4">
              <div>
                <span className="inline-block rounded-full bg-brand-gradient px-2 py-0.5 text-[9px] font-semibold">AI designed</span>
                <p className="mt-2 text-lg font-bold leading-tight">Your idea, as a real website</p>
                <span className="mt-2 block h-1 w-3/4 rounded bg-white/15" />
                <span className="mt-1.5 block h-1 w-1/2 rounded bg-white/15" />
                <span className="mt-3 inline-block h-5 w-16 rounded-md bg-brand-gradient" />
              </div>
              <div className="rounded-xl bg-brand-gradient" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Home", "Shop", "Dashboard"].map((p) => (
                <span key={p} className="rounded-lg border border-white/[0.07] bg-white/[0.03] py-2 text-center text-[11px] text-slate-300">{p}</span>
              ))}
            </div>
          </div>

          <ul className="mt-10 space-y-3.5">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}