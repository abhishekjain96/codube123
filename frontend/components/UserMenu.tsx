"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import { getToken, getUser, logout } from "@/lib/api";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// undefined on the server (not known yet), null when logged out, otherwise the saved user
function snapshot(): string | null {
  if (!getToken()) return null;
  const u = getUser();
  return u ? JSON.stringify(u) : null;
}

export default function UserMenu({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, snapshot, () => undefined);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function onLogout() {
    logout();
    listeners.forEach((l) => l());
    setOpen(false);
    router.push("/");
  }

  // keeps the space reserved so the navbar doesn't jump while loading
  if (raw === undefined) return <div className="h-9 w-44" />;

  if (raw === null) {
    return (
      <div className="flex items-center gap-2.5">
        <Link
          href="/login"
          className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white sm:block"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="flex items-center gap-1.5 rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:opacity-90"
        >
          Start Building <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const user = JSON.parse(raw) as { name?: string; email: string };
  const initial = (user.name?.[0] ?? user.email[0]).toUpperCase();

  return (
    <div className="flex items-center gap-2.5">
      {!compact && (
        <Link
          href="/dashboard"
          className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:border-orange-500/40 hover:bg-white/[0.1] hover:text-white sm:flex"
        >
          <LayoutDashboard size={15} className="text-orange-400" />
          <span>Dashboard</span>
        </Link>
      )}

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Account menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:scale-105"
        >
          {initial}
        </button>

        {open && (
          <div className="absolute right-0 top-11 z-50 w-60 rounded-2xl border border-white/10 bg-[#0d0d18] p-2 text-sm shadow-2xl shadow-black/80 backdrop-blur-xl">
            <div className="border-b border-white/[0.08] px-3 py-2.5">
              <p className="truncate font-semibold text-white">{user.name || "User"}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
            <div className="mt-1 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-medium text-slate-200 transition hover:bg-orange-500/10 hover:text-orange-300"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                  <LayoutDashboard size={15} />
                </span>
                <span>Dashboard</span>
              </Link>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                  <LogOut size={15} />
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
