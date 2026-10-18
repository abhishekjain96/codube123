"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  Clock,
  Code2,
  ExternalLink,
  Eye,
  Globe,
  Layers,
  LogOut,
  Pencil,
  Rocket,
  Search,
  Sparkles,
  Terminal,
  Trash2,
  Zap,
} from "lucide-react";
import Logo from "@/components/Logo";
import { deleteProject, getToken, getUser, listProjects, logout, type Project } from "@/lib/api";

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
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-lg" style={{ background: accent }} />
      <div className="relative flex items-center justify-between">
        <span className="h-3.5 w-3.5 rounded" style={{ background: accent }} />
        <span className="flex gap-1.5 opacity-40">
          <span className="h-0.5 w-4 rounded bg-current" />
          <span className="h-0.5 w-4 rounded bg-current" />
          <span className="h-0.5 w-4 rounded bg-current" />
        </span>
      </div>
      <p className="relative mt-4 line-clamp-2 text-[13px] font-extrabold leading-tight">{p.brand || p.heading}</p>
      <span className="relative mt-2 block h-1 w-2/3 rounded bg-current opacity-20" />
      <div className="relative mt-3 flex items-center justify-between">
        <span className="inline-block h-3.5 w-12 rounded-full" style={{ background: accent }} />
        {p.reaMetadata && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-violet-400">
            <Globe size={11} /> REA Extracted
          </span>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [name, setName] = useState("");
  const [hello, setHello] = useState("Welcome back");
  const [query, setQuery] = useState("");

  // Dual Creation Modes
  const [createMode, setCreateMode] = useState<"url" | "prompt">("url");
  const [targetUrl, setTargetUrl] = useState("https://linear.app");
  const [urlPrompt, setUrlPrompt] = useState(
    "Redesign as a futuristic dark-mode AI developer tool with responsive bento grids and interactive pricing."
  );
  const [idea, setIdea] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  function handleCreate() {
    if (createMode === "url") {
      const u = targetUrl.trim();
      if (!u) return;
      try {
        sessionStorage.setItem("codube_url", u);
        sessionStorage.setItem("codube_instructions", urlPrompt.trim());
        sessionStorage.setItem("codube_prompt", `URL: ${u} | ${urlPrompt.trim()}`);
      } catch {}
      router.push("/generating");
    } else {
      const text = idea.trim();
      if (!text) return;
      try {
        sessionStorage.setItem("codube_prompt", text);
        sessionStorage.removeItem("codube_url");
      } catch {}
      router.push("/generating");
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      setProjects((prev) => (prev ? prev.filter((p) => p.id !== id) : []));
    } catch {
      alert("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  }

  const stats = useMemo(() => {
    const list = projects ?? [];
    const reaCount = list.filter((p) => !!p.reaMetadata || !!p.sourceUrl).length;
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const recent = list.filter((p) => new Date(p.createdAt).getTime() > weekAgo).length;
    return [
      { label: "Total Projects", value: String(list.length), icon: Layers },
      { label: "REA Extractions", value: String(reaCount), icon: Globe },
      { label: "Created This Week", value: String(recent), icon: Sparkles },
    ];
  }, [projects]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!projects) return null;
    return q ? projects.filter((p) => `${p.heading} ${p.brand || ""} ${p.idea}`.toLowerCase().includes(q)) : projects;
  }, [projects, query]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06060b] text-white">
      <div className="aurora pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-70" />
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[480px]" />

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#06060b]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-white">
            <Logo />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
              {(name[0] ?? "A").toUpperCase()}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="rise text-3xl font-extrabold tracking-tight sm:text-4xl">
              {hello}
              {name ? `, ${name}` : ""} <span className="text-brand-gradient">✦</span>
            </h1>
            <p className="rise mt-2 text-slate-400" style={{ animationDelay: "80ms" }}>
              Reverse engineer any website or generate high-converting production Next.js apps with AI.
            </p>
          </div>
        </div>

        {/* Dual Mode Creation Box */}
        <div className="rise relative mt-8 max-w-3xl" style={{ animationDelay: "140ms" }}>
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-violet-600/25 via-fuchsia-600/20 to-orange-500/25 blur-2xl" />
          <div className="relative rounded-2xl bg-gradient-to-r from-violet-500/40 via-fuchsia-500/30 to-orange-500/40 p-px shadow-2xl">
            <div className="rounded-[15px] bg-[#0b0b14]/95 p-5 backdrop-blur-xl">
              {/* Mode Tabs */}
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="inline-flex rounded-xl bg-white/[0.05] p-1">
                  <button
                    type="button"
                    onClick={() => setCreateMode("url")}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                      createMode === "url"
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Globe size={13} className="text-orange-400" />
                    Website URL (REA Reverse Engineering)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateMode("prompt")}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                      createMode === "prompt"
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sparkles size={13} className="text-violet-300" />
                    Prompt / Idea
                  </button>
                </div>

                <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
                  <Terminal size={11} className="text-orange-400" />
                  <span>REA Scraper & Redesign Engine</span>
                </span>
              </div>

              {/* Mode 1: URL Reverse Engineering */}
              {createMode === "url" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 focus-within:border-violet-500">
                    <Globe size={16} className="text-violet-400 shrink-0" />
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://linear.app, https://stripe.com, https://airbnb.com"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <textarea
                      value={urlPrompt}
                      onChange={(e) => setUrlPrompt(e.target.value)}
                      rows={2}
                      placeholder="How should Codube adapt this website? (e.g. Redesign for dark cyberpunk aesthetic, change branding, add pricing table)"
                      className="min-h-[52px] flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-xs text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreate}
                      aria-label="Reverse Engineer and Redesign"
                      className="btn-shine flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/40 transition hover:scale-105 active:scale-95"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>

                  {/* Popular URL chips */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-2.5">
                    <span className="text-[11px] text-slate-500">Presets:</span>
                    {[
                      { url: "https://linear.app", desc: "Linear (SaaS Dev Tool)" },
                      { url: "https://stripe.com", desc: "Stripe (Fintech Infrastructure)" },
                      { url: "https://airbnb.com", desc: "Airbnb (Vacation Rentals)" },
                      { url: "https://supabase.com", desc: "Supabase (Cloud Platform)" },
                    ].map((u) => (
                      <button
                        key={u.url}
                        type="button"
                        onClick={() => {
                          setTargetUrl(u.url);
                          setUrlPrompt(
                            `Reverse engineer ${u.desc} with modern luxury dark glassmorphism, responsive bento grids, and high-conversion copy.`
                          );
                        }}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                      >
                        {u.url.replace("https://", "")}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Mode 2: Prompt / Idea */
                <div>
                  <div className="flex items-start gap-3">
                    <textarea
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleCreate();
                        }
                      }}
                      rows={2}
                      placeholder="Describe a new website idea (e.g. Modern AI marketing agency with interactive pricing and bento grid)..."
                      className="min-h-[58px] flex-1 resize-none bg-transparent px-1 text-sm text-white outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreate}
                      aria-label="Create from idea"
                      className="btn-shine flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-orange-500/40 transition hover:scale-105"
                    >
                      <ArrowUp size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
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

        {/* Project Section Header */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Your Projects</h2>
            <p className="text-xs text-slate-400">Manage, preview, edit, inspect code, and deploy your web applications</p>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus-within:border-violet-400/50">
            <Search size={15} className="text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-44 bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>

        {/* Project Grid */}
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
            <p className="mt-1 text-sm text-slate-500">
              {query ? "Try a different search keyword." : "Enter a website URL or prompt above to reverse-engineer your first app."}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <div
                key={p.id}
                className="rise glass group flex flex-col justify-between rounded-2xl p-4 transition duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-violet-600/10"
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <div>
                  <Link href={`/builder/${p.id}`} className="block">
                    <Preview p={p} />
                  </Link>

                  <div className="mt-3 flex items-start justify-between gap-2">
                    <Link href={`/builder/${p.id}`} className="hover:text-violet-300 transition">
                      <p className="line-clamp-1 font-bold text-white text-base">{p.brand || p.heading}</p>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, p.id)}
                      disabled={deletingId === p.id}
                      title="Delete project"
                      className="rounded-lg p-1.5 text-slate-500 opacity-60 hover:bg-rose-500/10 hover:text-rose-400 hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{p.idea}</p>
                </div>

                <div className="mt-5 border-t border-white/[0.06] pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/builder/${p.id}`}
                        className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <Eye size={11} />
                        <span>Preview</span>
                      </Link>
                      <Link
                        href={`/builder/${p.id}`}
                        className="btn-shine flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm shadow-violet-600/30 transition hover:opacity-90"
                      >
                        <Pencil size={11} />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}