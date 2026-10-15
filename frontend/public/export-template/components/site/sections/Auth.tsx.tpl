"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Section } from "@/content/types";
import { SubmitButton } from "../ui";
import { P, inputStyle } from "../theme";

type Routes = { login?: string; signup?: string; dashboard?: string };

/**
 * A login or signup screen. It is UI only: connect your own auth provider
 * (for example Auth.js or Clerk) inside onSubmit.
 */
export function Auth({ s, brand, routes }: { s: Section; brand: string; routes: Routes }) {
  const router = useRouter();
  const signup = s.mode === "signup";
  const [done, setDone] = useState(false);
  const other = signup ? routes.login : routes.signup;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (routes.dashboard) router.push(routes.dashboard);
    else setDone(true);
  }

  return (
    <section className="grid min-h-[620px] @3xl:grid-cols-2" style={{ background: P.bg }}>
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <h1
            className="block text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: P.heading }}
          >
            {s.title ?? (signup ? "Create your account" : "Welcome back")}
          </h1>
          <p className="mt-2 text-sm" style={{ color: P.muted }}>
            {s.subtitle ?? (signup ? "It only takes a minute." : "Log in to continue.")}
          </p>
          <form className="mt-7 space-y-3" onSubmit={onSubmit}>
            {signup && (
              <input
                required
                name="name"
                placeholder="Full name"
                autoComplete="name"
                className="w-full border px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            )}
            <input
              required
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              className="w-full border px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              autoComplete={signup ? "new-password" : "current-password"}
              className="w-full border px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
            <SubmitButton full>{s.cta?.label ?? (signup ? "Create account" : "Log in")}</SubmitButton>
          </form>
          {done && (
            <p className="mt-3 text-sm" role="status" style={{ color: P.accent }}>
              Signed in (demo).
            </p>
          )}
          {other && (
            <p className="mt-6 text-sm" style={{ color: P.muted }}>
              {signup ? "Already have an account? " : "New here? "}
              <Link href={other} className="font-semibold" style={{ color: P.accent }}>
                {signup ? "Log in" : "Sign up"}
              </Link>
            </p>
          )}
          <p className="mt-6 text-xs" style={{ color: P.muted }}>
            Demo only: nothing is saved. Connect your auth provider in components/site/sections/Auth.tsx.
          </p>
        </div>
      </div>
      <div
        className="relative hidden items-center justify-center overflow-hidden p-12 text-white @3xl:flex"
        style={{ background: P.grad }}
      >
        <div className="anim-blob pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative max-w-sm">
          <p className="text-2xl font-extrabold" style={{ fontFamily: P.heading }}>
            {brand}
          </p>
          {s.text && <p className="mt-4 block text-lg leading-relaxed text-white/90">{s.text}</p>}
        </div>
      </div>
    </section>
  );
}
