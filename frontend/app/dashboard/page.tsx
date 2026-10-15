"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUp, Clock, Layers, LogOut, Search, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { getToken, getUser, listProjects, logout, type Project } from "@/lib/api";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Preview({ p }: { p: Project }) {
  const bg = p.dark ? "#0b0b14" : "#ffffff";
  const fg = p.dark ? "#ffffff" : "#0f172a";
  const accent = /^#[0-9a-fA-F]{6}$/.test(p.accent) ? p.accent : "#2563eb";
  return (
    <div className="relative h-36 overflow-hidden rounded-xl border border-white/10 p-3" style={{ background: bg, color: fg }}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40" style={{ background: accent }} />
      <div className="relative flex items-center justify-between">
        <span className="h-3.5 w-3.5 rounded" style={{ background: accent }} />
        <span className="flex gap-1.5 opacity-40">
          <span className="h-0.5 w-4 rounded bg-current" />
          <span className="h-0.5 w-4 rounded bg-current" />
          <span className="h-0.5 w-4 rounded bg-current" />
        </span>
      </div>
      <p className="relative mt-4 line-clamp-2 text-[13px] font-extrabold leading-tight">{p.heading}</p>
      <span className="relative mt-2 block h-1 w-2/3 rounded bg-current opacity-20" />
      <span className="relative mt-3 inline-block h-3.5 w-12 rounded-full" style={{ background: accent }} />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [name, setName] = useState("");
  const [hello, setHello] = useState("Welcome back");
  const [query, setQuery] = useState("");
  const [idea, setIdea] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setName(getUser()?.name?.split(" ")[0] ?? "");
    setHello(greeting());
    listProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, [router]);

  function onLogout() {
    logout();
    router.push("/");
  }

  function create() {
    const text = idea.trim();
    if (!text) return;
    try {
      sessionStorage.setItem("codube_prompt", text);
    } catch {}
    router.push("/generating");
  }

  const stats = useMemo(() => {
    const list = projects ?? [];
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const recent = list.filter((p) => new Date(p.createdAt).getTime() > weekAgo).length;
    const latest = list[0] ? new Date(list[0].createdAt).toLocaleDateString() : "None yet";
    return [
      { label: "Total projects", value: String(list.length), icon: Layers },
      { label: "Created this week", value: String(recent), icon: Sparkles },
      { label: "Last project", value: latest, icon: Clock },
    ];
  }, [projects]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!projects) return null;
    return q ? projects.filter((p) => `${p.heading} ${p.idea}`.toLowerCase().includes(q)) : projects;
  }, [projects, query]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06060b] text-white">
      <div className="aurora pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-70" />
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[420px]" />

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#06060b]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-white">
            <Logo />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
              {(name[0] ?? "A").toUpperCase()}
            </span>
            <button onClick={onLogout} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-slate-300 transition hover:bg-white/5">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-12">
        <h1 className="rise text-3xl font-extrabold tracking-tight sm:text-4xl">
          {hello}
          {name ? `, ${name}` : ""} <span className="text-brand-gradient">✦</span>
        </h1>
        <p className="rise mt-2 text-slate-400" style={{ animationDelay: "80ms" }}>What are we building today?</p>

        <div className="rise relative mt-8 max-w-3xl" style={{ animationDelay: "140ms" }}>
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-violet-500/20 blur-2xl" />
          <div className="relative rounded-2xl bg-gradient-to-r from-orange-500/50 via-purple-500/50 to-violet-500/50 p-px">
            <div className="flex items-start gap-3 rounded-[15px] bg-[#0b0b14] p-4">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    create();
                  }
                }}
                rows={2}
                placeholder="Describe a new website idea..."
                className="min-h-[52px] flex-1 resize-none bg-transparent px-1 text-base text-white outline-none placeholder:text-slate-500"
              />
              <button onClick={create} aria-label="Create" className="btn-shine flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-orange-500/40 transition hover:scale-105">
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <div key={label} className="rise glass flex items-center gap-4 rounded-2xl p-4" style={{ animationDelay: `${200 + i * 70}ms` }}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-violet-300">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Your projects</h2>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus-within:border-violet-400/50">
            <Search size={15} className="text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              className="w-44 bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>

        {shown === null ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((n) => (
              <div key={n} className="glass animate-pulse rounded-2xl p-4">
                <div className="h-36 rounded-xl bg-white/5" />
                <div className="mt-4 h-4 w-2/3 rounded bg-white/5" />
                <div className="mt-2 h-3 w-full rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="glass mt-6 rounded-2xl border-dashed p-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-indigo-500/30">
              <Sparkles size={20} />
            </span>
            <p className="mt-4 font-semibold">{query ? "No projects match your search" : "No projects yet"}</p>
            <p className="mt-1 text-sm text-slate-500">{query ? "Try a different word." : "Describe your first idea in the box above."}</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <Link
                key={p.id}
                href={`/builder/${p.id}`}
                className="rise glass group rounded-2xl p-4 transition duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-2xl hover:shadow-orange-500/10"
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <Preview p={p} />
                <p className="mt-4 line-clamp-1 font-semibold">{p.brand || p.heading}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.idea}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 font-medium text-orange-300 transition group-hover:gap-2">
                    Open <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}