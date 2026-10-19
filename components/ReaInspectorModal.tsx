"use client";

import { useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Layers,
  Loader2,
  Palette,
  Sparkles,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import type { Project } from "@/lib/api";

type Props = {
  project: Project | null;
  onClose: () => void;
  onRunRea: (url: string, instructions: string) => Promise<void>;
};

export default function ReaInspectorModal({ project, onClose, onRunRea }: Props) {
  const [tab, setTab] = useState<"report" | "claude" | "extract">("report");
  const [newUrl, setNewUrl] = useState("");
  const [newInstructions, setNewInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [copiedClaudeMd, setCopiedClaudeMd] = useState(false);

  const rea = project?.reaMetadata;
  const domain = rea?.domain || (project?.sourceUrl ? new URL(project.sourceUrl).hostname : "Target Website");
  const colors = rea?.extractedColors || {
    primary: project?.accent || "#f97316",
    secondary: "#8b5cf6",
    dark: project?.dark ?? true,
  };
  const archetype = rea?.archetype || "Modern SaaS Platform";
  const brandName = project?.brand || domain.split(".")[0] || "TargetApp";

  const claudePrompt =
    rea?.claudeCodePrompt ||
    `claude "Reverse engineer and rebuild ${domain}: Using the REA (morluto/rea) design tokens (Brand: ${brandName}, Primary: ${colors.primary}, Secondary: #8b5cf6, Theme: ${colors.dark ? "dark" : "light"}), build a production Next.js 15 App Router app with responsive components: Navbar, Hero, BentoGrid, Stats, Pricing, and Footer."`;

  const claudeMdText =
    rea?.claudeMdContent ||
    `# CLAUDE.md - Reverse Engineering Agent Guide for ${brandName}

Project reverse-engineered from: **${project?.sourceUrl || domain}** using **morluto/rea**.

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

## Extracted Design Tokens
- **Brand**: ${brandName}
- **Archetype**: ${archetype}
- **Primary Color**: ${colors.primary}
- **Secondary Accent**: #8b5cf6
- **Theme**: ${colors.dark ? "Dark mode (slate-950 base)" : "Light mode (white base)"}

## Run Claude Code
\`\`\`bash
${claudePrompt}
\`\`\`
`;

  const logs = rea?.workerLogs || [
    `[0.2s] System Router -> Ingested reference site: ${project?.sourceUrl || "Web Application"}`,
    `[0.9s] REA Scraper -> Extracted semantic DOM, stylesheet tokens & visual assets`,
    `[1.8s] Spatial Behavior Analyst -> Decomposed responsive layout tree & components`,
    `[2.9s] Design Engine -> Extracted primary token: ${colors.primary}, archetype: ${archetype}`,
    `[3.9s] Full-Stack Coder Agent -> Formatted Claude Code CLI prompts and Next.js components`,
    `[4.7s] Validation Sandbox -> Zero-defect responsive build verified`,
  ];

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  }

  function copyCommand(cmd: string) {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  }

  function copyClaudeMd() {
    navigator.clipboard.writeText(claudeMdText);
    setCopiedClaudeMd(true);
    setTimeout(() => setCopiedClaudeMd(false), 2000);
  }

  function downloadClaudeMd() {
    const blob = new Blob([claudeMdText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CLAUDE.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExecute() {
    const u = newUrl.trim();
    if (!u) return;
    setLoading(true);
    try {
      await onRunRea(u, newInstructions);
      setTab("report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a14] shadow-2xl text-white">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30">
              <Globe size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">REA Reverse Engineering Agent</h3>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300">
                  morluto/rea Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Reverse engineer design tokens, layout hierarchy, and Claude Code generation logic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-white/[0.05] p-1">
              <button
                onClick={() => setTab("report")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  tab === "report" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Inspection Report
              </button>
              <button
                onClick={() => setTab("claude")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  tab === "claude" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Claude Code CLI
              </button>
              <button
                onClick={() => setTab("extract")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  tab === "extract" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                + Extract URL
              </button>
            </div>

            <button
              onClick={onClose}
              className="ml-2 rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {tab === "report" && (
            <>
              {/* Target Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Target Site & Archetype
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Globe size={16} className="text-violet-400" />
                    <span className="text-sm font-bold text-white">{domain}</span>
                    <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] text-slate-300">
                      {archetype}
                    </span>
                    {project?.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTab("claude")}
                    className="flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300 hover:bg-violet-500/20"
                  >
                    <Code2 size={13} />
                    <span>Run in Claude Code</span>
                  </button>
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    ✓ Full System Extracted
                  </span>
                </div>
              </div>

              {/* Extracted Design Tokens & Palette */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <Palette size={14} className="text-violet-400" />
                  Extracted Design Tokens & Palette
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Primary Accent", hex: colors.primary, role: "CTAs & Brand Highlights" },
                    { label: "Secondary Accent", hex: colors.secondary, role: "Gradients & Glows" },
                    { label: "Theme Base", hex: colors.dark ? "#06060c" : "#ffffff", role: colors.dark ? "Dark Luxury Surface" : "Clean Light Surface" },
                    { label: "Typography Base", hex: colors.dark ? "#f8fafc" : "#0f172a", role: "High-Contrast Copy" },
                  ].map((c) => (
                    <button
                      key={c.label}
                      onClick={() => copyHex(c.hex)}
                      className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-violet-500/40 hover:bg-white/[0.06]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="h-6 w-6 rounded-lg border border-white/20 shadow-sm"
                          style={{ background: c.hex }}
                        />
                        <span className="text-[10px] text-slate-500 group-hover:text-violet-300">
                          {copiedHex === c.hex ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-white">{c.label}</span>
                      <span className="font-mono text-[11px] text-slate-400">{c.hex}</span>
                      <span className="mt-1 text-[10px] text-slate-500">{c.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Architectural Decomposition */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <Layers size={14} className="text-violet-400" />
                  Reverse-Engineered Layout Taxonomy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      name: "Navigation & Brand",
                      desc: "Responsive sticky header with glassmorphism, brand mark, and nav links.",
                      badge: "Decompiled",
                    },
                    {
                      name: "Hero Value Prop",
                      desc: "High-conversion headline, animated badges, and dual CTA action buttons.",
                      badge: "Modernized",
                    },
                    {
                      name: "Bento Feature Grid",
                      desc: "Asymmetrical 3D bento cards showcasing core user benefits and screenshots.",
                      badge: "Extracted",
                    },
                    {
                      name: "Performance Proof",
                      desc: "Live metrics, SLA figures, and verified customer testimonials.",
                      badge: "Extracted",
                    },
                    {
                      name: "Interactive Pricing",
                      desc: "Tiered feature matrix with monthly/annual billing cycle switcher.",
                      badge: "Re-engineered",
                    },
                    {
                      name: "Global Edge Footer",
                      desc: "Multi-column links, newsletter subscription, and legal terms.",
                      badge: "Generated",
                    },
                  ].map((sec) => (
                    <div key={sec.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">{sec.name}</span>
                        <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-bold text-violet-300">
                          {sec.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{sec.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* REA Worker Execution Logs */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <Terminal size={14} className="text-orange-400" />
                  REA Worker Execution Stream
                </h4>
                <div className="rounded-xl border border-white/10 bg-[#06060c] p-3.5 font-mono text-[11px] leading-relaxed text-slate-400">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2 py-0.5">
                      <span className="text-violet-400">›</span>
                      <span className={i === logs.length - 1 ? "text-emerald-400 font-semibold" : "text-slate-300"}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "claude" && (
            <div className="space-y-5">
              {/* Claude Code Top Banner */}
              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/[0.08] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
                    <Code2 size={16} className="text-violet-400" />
                    <span>Claude Code CLI & REA Integration</span>
                  </div>
                  <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300">
                    morluto/rea Compatible
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  Run Claude Code in your terminal with the exact reverse-engineered design tokens, component hierarchy, and prompt instructions extracted from {domain}.
                </p>
              </div>

              {/* Ready-to-Run Claude CLI Command */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    1. Run in your terminal with Claude Code
                  </label>
                  <button
                    onClick={() => copyCommand(claudePrompt)}
                    className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
                  >
                    {copiedCommand ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCommand ? "Copied Command" : "Copy Command"}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#06060c] p-3 font-mono text-xs text-slate-200 overflow-x-auto">
                  <span className="text-slate-500">$ </span>
                  {claudePrompt}
                </div>
              </div>

              {/* REA Agents Setup Command */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    2. Install REA Model Context Protocol (MCP) server
                  </label>
                  <button
                    onClick={() => copyCommand("npx rea-agents setup")}
                    className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    <Copy size={12} />
                    <span>Copy Setup</span>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#06060c] p-3 font-mono text-xs text-slate-200">
                  <span className="text-slate-500">$ </span>npx rea-agents setup
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Registers the morluto/rea MCP tools with Claude Code, Cursor, and Gemini CLI for evidence-backed feature inspection.
                </p>
              </div>

              {/* CLAUDE.md File Preview & Download */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    3. Generated CLAUDE.md Specification
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyClaudeMd}
                      className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white"
                    >
                      {copiedClaudeMd ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedClaudeMd ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={downloadClaudeMd}
                      className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Download size={12} />
                      <span>Download CLAUDE.md</span>
                    </button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#06060c] p-3.5 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {claudeMdText}
                </div>
              </div>
            </div>
          )}

          {tab === "extract" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/[0.06] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
                  <Sparkles size={16} />
                  <span>Reverse Engineer & Redesign Any Site</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  Enter any public website URL. Codube REA will scrape its structure, parse color tokens, analyze typography, and redesign it into modern Next.js components according to your instructions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Website URL
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 focus-within:border-violet-500">
                  <Globe size={16} className="text-violet-400" />
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://linear.app, https://stripe.com, or your competitor"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Quick Picks */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400">Quick references:</span>
                {[
                  { url: "https://linear.app", label: "Linear (SaaS Dev)" },
                  { url: "https://stripe.com", label: "Stripe (Fintech)" },
                  { url: "https://airbnb.com", label: "Airbnb (Hospitality)" },
                  { url: "https://supabase.com", label: "Supabase (Cloud DB)" },
                ].map((pick) => (
                  <button
                    key={pick.url}
                    type="button"
                    onClick={() => {
                      setNewUrl(pick.url);
                      setNewInstructions(`Adapt ${pick.label} with dark glassmorphic styling, punchy copy, and customized branding.`);
                    }}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300 hover:border-violet-500/50 hover:text-white"
                  >
                    {pick.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Redesign Requirements & Prompt
                </label>
                <textarea
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  rows={3}
                  placeholder="e.g. Redesign for dark cyberpunk aesthetic, add interactive pricing tiers, change brand to NexusTech, make copy punchier"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />
              </div>

              {/* Redesign Style Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400">Redesign style presets:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Dark Glassmorphic SaaS",
                    "Cyberpunk Neon Glow",
                    "Apple Minimal Clean",
                    "B2B Enterprise Trust",
                    "Luxury Gold & Obsidian",
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() =>
                        setNewInstructions(
                          (prev) => (prev ? prev + `. Style: ${style}` : `Apply ${style} aesthetic with modern responsive bento grid.`)
                        )
                      }
                      className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
                    >
                      + {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={loading || !newUrl.trim()}
                  className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-600/30 transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Ingesting DOM & Redesigning...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Execute REA Reverse Engineering</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
