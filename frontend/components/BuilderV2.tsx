"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Bot, ChevronDown, Code2, Eye, Loader2, Lock, Monitor, Pencil, Smartphone, Sparkles, Zap } from "lucide-react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import SiteRendererV2 from "./site/SiteRendererV2";
import { chatProjectV2 } from "@/lib/api";
import { parseSiteV2, type SiteV2 } from "@/lib/siteTypes";

type Msg = { role: "user" | "ai"; text: string };

const suggestions = ["Make the theme dark", "Rewrite this page's headline", "Add a FAQ section", "Use warmer colors"];

const MODELS = [
  { id: "auto",   label: "Auto (Best)",       desc: "Always picks the best model",  icon: "⚡" },
  { id: "gpt4o",  label: "GPT-4o",            desc: "OpenAI's Most Powerful",       icon: "🌐" },
  { id: "claude", label: "Claude 3.5 Sonnet", desc: "Anthropic's Flagship Model",   icon: "🌟" },
  { id: "gemini", label: "Gemini 2.0 Flash",  desc: "Google's Fastest Model",       icon: "💎" },
] as const;
type ModelId = typeof MODELS[number]["id"];

const AI_CHIPS = [
  ["Make it more premium", "Add animations", "Improve the hero"],
  ["Add social proof", "Simplify the copy", "Add a FAQ section"],
  ["Make it darker", "Add a CTA button", "Change the font"],
  ["Add pricing table", "Show team members", "Add testimonials"],
];

export default function BuilderV2({ id, initial }: { id: string; initial: SiteV2 }) {
  const [site, setSite]         = useState(initial);
  const [slug, setSlug]         = useState(initial.pages[0]?.slug ?? "/");
  const [device, setDevice]     = useState<"desktop" | "mobile">("desktop");
  const [canvasTab, setCanvasTab] = useState<"preview" | "code">("preview");
  const [mode, setMode]         = useState<"edit" | "preview">("edit");
  const [input, setInput]       = useState("");
  const [thinking, setThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>("auto");
  const [modelOpen, setModelOpen]         = useState(false);
  const [aiChips, setAiChips]             = useState<string[]>([]);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "Your website is ready. Use the page tabs to look at every page. Tell me what to change, and I will update the page you are viewing.",
    },
  ]);

  const bottom   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Close model dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setModelOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const page = site.pages.find((p) => p.slug === slug) ?? site.pages[0];

  async function send(text: string = input) {
    const message = text.trim();
    if (!message || thinking || !page) return;
    setInput("");
    setAiChips([]);
    setMessages((m) => [...m, { role: "user", text: message }]);
    setThinking(true);
    try {
      const res = await chatProjectV2(id, page.slug, message);
      const next = parseSiteV2(res.siteJson);
      if (!next) throw new Error("bad site");
      setSite(next);
      setMessages((m) => [...m, { role: "ai", text: `Done. I updated the ${page.title ?? page.slug} page.` }]);
      setAiChips(AI_CHIPS[Math.floor(Math.random() * AI_CHIPS.length)]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Sorry, I could not apply that change. Please try again." }]);
    } finally {
      setThinking(false);
    }
  }

  const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex h-screen flex-col bg-[#060608] text-white">
      {/* ── TOP HEADER ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0a0a10]/80 px-4 backdrop-blur-xl">
        <Link href="/dashboard"><Logo /></Link>

        {/* Center: Preview / Code canvas tabs + device + edit/preview */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs font-medium">
            <button
              onClick={() => setCanvasTab("preview")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${canvasTab === "preview" ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
            >
              <Eye size={13} /> Preview
            </button>
            <button
              onClick={() => setCanvasTab("code")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${canvasTab === "code" ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
            >
              <Code2 size={13} /> Code
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                aria-label={d}
                className={`rounded-lg p-1.5 transition ${device === d ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
              >
                {d === "desktop" ? <Monitor size={16} /> : <Smartphone size={16} />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs font-medium">
            {([["edit", "Edit", Pencil], ["preview", "Preview", Eye]] as const).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setMode(key as "edit" | "preview")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${mode === key ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Generate Code + UserMenu */}
        <div className="flex items-center gap-2">
          <button
            className="btn-shine flex items-center gap-1.5 rounded-xl bg-brand-gradient px-4 py-1.5 text-sm font-semibold text-white shadow-orange transition hover:opacity-90"
          >
            <Zap size={14} /> Generate Code
          </button>
          <UserMenu compact />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[320px_1fr]">
        {/* ── CHAT SIDEBAR ── */}
        <aside className="hidden min-h-0 flex-col border-r border-white/[0.06] bg-[#0a0a10] lg:flex">
          {/* Chat header with model selector */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-gradient">
                <Sparkles size={13} />
              </div>
              Codube AI
            </div>
            {/* Model selector */}
            <div className="relative" ref={modelRef}>
              <button
                onClick={() => setModelOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Bot size={12} />
                {MODELS.find((m) => m.id === selectedModel)?.label ?? "Auto"}
                <ChevronDown size={11} className={`transition-transform ${modelOpen ? "rotate-180" : ""}`} />
              </button>
              {modelOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-[#0d0d18] p-1.5 shadow-2xl shadow-black/50">
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                      className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition hover:bg-white/[0.06] ${selectedModel === m.id ? "bg-white/[0.06]" : ""}`}
                    >
                      <span className="mt-0.5 text-base">{m.icon}</span>
                      <span>
                        <span className="block text-xs font-semibold text-white">{m.label}</span>
                        <span className="block text-[10px] text-slate-500">{m.desc}</span>
                      </span>
                      {selectedModel === m.id && <span className="ml-auto mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />}
                    </button>
                  ))}
                  <p className="mt-1.5 border-t border-white/[0.06] px-3 pt-2 text-[10px] text-slate-600">Model changes apply from your next message</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-brand-gradient text-white"
                    : "bg-white/[0.06] text-slate-200"
                }`}
              >
                {m.text}
              </div>
            ))}

            {/* Premium thinking animation */}
            {thinking && (
              <div className="rounded-2xl border border-orange-500/20 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-orange-500/30" />
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-purple-600">
                      <Sparkles size={14} className="text-white" />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Codube is designing…</p>
                    <p className="text-[10px] text-slate-500">AI is updating your website</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Reading your request", delay: "0ms" },
                    { label: "Updating layout & content", delay: "300ms" },
                    { label: "Applying styles & images", delay: "600ms" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-purple-500"
                          style={{
                            animation: `thinking-bar 1.8s ease-in-out ${step.delay} infinite`,
                            width: "60%",
                          }}
                        />
                      </div>
                      <span className="w-36 truncate text-[10px] text-slate-500">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI suggestion chips */}
            {aiChips.length > 0 && !thinking && (
              <div className="space-y-1.5">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  <Sparkles size={10} className="text-orange-400" /> Suggestions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {aiChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => send(chip)}
                      disabled={thinking}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300 disabled:opacity-40"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottom} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.06] p-3">
            {/* Default suggestion chips */}
            {aiChips.length === 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={thinking}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-500 transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-300 disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 transition focus-within:border-orange-500/50">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                disabled={thinking}
                placeholder="Ask Codube to change this page..."
                className="max-h-24 min-h-[36px] flex-1 resize-none overflow-y-auto bg-transparent px-1 text-sm text-white outline-none placeholder:text-slate-600 disabled:opacity-60"
              />
              <button
                onClick={() => send()}
                disabled={thinking}
                aria-label="Send"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-orange transition hover:opacity-90 disabled:opacity-60"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── CANVAS ── */}
        <section className="min-h-0 overflow-auto bg-[#07070d] p-4 sm:p-6">
          {/* Code "Awaiting Approval" view */}
          {canvasTab === "code" && (
            <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Lock size={32} className="text-slate-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">No code generated yet</p>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Design and edit your website first. When you&apos;re happy with the preview, click{" "}
                  <span className="font-medium text-orange-400">Generate Code</span> to produce production-ready Next.js code.
                </p>
              </div>
              <button
                className="btn-shine flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-orange"
              >
                <Zap size={15} /> Approve &amp; Generate Code
              </button>
              <p className="text-xs text-slate-700">Approval required • No AI credits used for generation</p>
            </div>
          )}

          {/* Preview canvas */}
          {canvasTab === "preview" && (
            <>
              {/* Page tabs */}
              <div className={`mx-auto mb-3 flex flex-wrap gap-1.5 ${device === "mobile" ? "max-w-[380px]" : "max-w-6xl"}`}>
                {site.pages.map((pg) => (
                  <button
                    key={pg.slug}
                    onClick={() => setSlug(pg.slug)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      pg.slug === page?.slug
                        ? "bg-white/10 text-white ring-1 ring-white/20"
                        : "bg-white/[0.04] text-slate-500 ring-1 ring-white/10 hover:bg-white/[0.07] hover:text-slate-300"
                    }`}
                  >
                    {pg.title ?? pg.slug}
                  </button>
                ))}
              </div>

              {/* Site preview with generation overlay */}
              <div className={`relative mx-auto overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50 transition-all duration-300 ${device === "mobile" ? "max-w-[380px]" : "max-w-6xl"}`}>
                <SiteRendererV2 site={site} page={page?.slug} onPageChange={setSlug} />

                {/* ── Generation overlay (Bolt/Claude style) ── */}
                {thinking && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-[#07070d]/80 backdrop-blur-sm">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" style={{ animationDuration: "1.5s" }} />
                      <span className="absolute inset-2 animate-ping rounded-full bg-purple-500/20" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-purple-600 shadow-2xl shadow-orange-500/40">
                        <Sparkles size={28} className="animate-pulse text-white" />
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-white">Codube is redesigning…</p>
                      <p className="mt-1 text-sm text-slate-400">AI is applying your changes</p>
                    </div>
                    <div className="w-64 space-y-3">
                      {[
                        { label: "Parsing your request", done: true },
                        { label: "Redesigning sections", done: false },
                        { label: "Updating copy & images", done: false },
                      ].map((step, i) => (
                        <div key={i}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-slate-400">{step.label}</span>
                            {step.done && <span className="text-[10px] text-emerald-400">✓</span>}
                          </div>
                          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-purple-500"
                              style={{
                                animation: step.done ? "none" : `thinking-bar 1.8s ease-in-out ${i * 300}ms infinite`,
                                width: step.done ? "100%" : "60%",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-64 space-y-2 opacity-40">
                      {[80, 60, 90, 50].map((w, i) => (
                        <div
                          key={i}
                          className="h-2 rounded-full bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                          style={{ width: `${w}%`, animation: `thinking-bar 2.2s ease-in-out ${i * 200}ms infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}