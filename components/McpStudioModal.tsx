"use client";

import React, { useState } from "react";
import {
  Bot,
  Box,
  Check,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Globe,
  Layers,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Terminal,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { COMPONENT_DATABASE, getAllComponents, type ComponentSnippet } from "@/lib/mcp/componentDatabase";
import { AI_MODELS, getAllModels, type AiModelConfig } from "@/lib/agents/models";
import { runMultiAgentPipeline, type AgentActivity, type MultiAgentPipelineResult } from "@/lib/agents/orchestrator";
import {
  Card3DTilt,
  ThreeJsCyberSphere,
  AnimatedBeamsHub,
  FloatingIslandPreview,
  RoiPricingPreview,
} from "./site/AnimatedComponents";

type Props = {
  onClose: () => void;
  onInjectComponent?: (snippet: ComponentSnippet) => void;
  onApplySite?: (site: any) => void;
  accent?: string;
  initialPrompt?: string;
};

export default function McpStudioModal({
  onClose,
  onInjectComponent,
  onApplySite,
  accent = "#8b5cf6",
  initialPrompt = "",
}: Props) {
  const [activeTab, setActiveTab] = useState<"agents" | "components" | "fullstack" | "mcp_setup">("agents");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComponent, setSelectedComponent] = useState<ComponentSnippet>(COMPONENT_DATABASE["3d-card-effect"]);
  const [selectedModel, setSelectedModel] = useState<string>("claude-3-7-sonnet");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMcpConfig, setCopiedMcpConfig] = useState(false);
  const [injectedId, setInjectedId] = useState<string | null>(null);

  // Multi-Agent Pipeline state
  const [promptInput, setPromptInput] = useState(initialPrompt || "Next-level full-stack AI SaaS with 3D tilts and Postgres");
  const [urlInput, setUrlInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<MultiAgentPipelineResult | null>(null);
  const [applied, setApplied] = useState(false);

  const components = getAllComponents().filter((c) => {
    const matchesCat = selectedCategory === "all" || c.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQ =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.includes(q));
    return matchesCat && matchesQ;
  });

  const models = getAllModels();

  function copyCode(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  function handleInject(snippet: ComponentSnippet) {
    if (onInjectComponent) {
      onInjectComponent(snippet);
      setInjectedId(snippet.id);
      setTimeout(() => setInjectedId(null), 2500);
    }
  }

  async function handleRunPipeline() {
    if (!promptInput.trim() && !urlInput.trim()) return;
    setIsExecuting(true);
    setApplied(false);
    try {
      const res = await runMultiAgentPipeline(promptInput, urlInput.trim() || undefined, selectedModel);
      setPipelineResult(res);
    } catch (err) {
      console.error("Multi-agent execution error:", err);
    } finally {
      setIsExecuting(false);
    }
  }

  function handleApplyResult() {
    if (!pipelineResult || !onApplySite) return;
    onApplySite(pipelineResult.site);
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  }

  const mcpConfigCode = JSON.stringify(
    {
      mcpServers: {
        "codube-ui-vault": {
          command: "npx",
          args: ["-y", "tsx", "lib/mcp/server.ts"],
          env: {
            NODE_ENV: "production",
          },
        },
      },
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#090912] shadow-2xl">
        {/* Top Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0d0d18] px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg shadow-violet-600/30"
              style={{ backgroundImage: `linear-gradient(135deg, ${accent}, #6366f1)` }}
            >
              <Cpu size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Multi-Agent Squad & MCP Vault</h3>
                <span className="rounded-full border border-violet-500/40 bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300">
                  Claude Code + REA + Three.js
                </span>
              </div>
              <p className="text-xs text-slate-400">
                10,000x beyond basic templates: 6 collaborative AI models + modern animated component database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-white/[0.05] p-1">
              <button
                onClick={() => setActiveTab("agents")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === "agents"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Agent Team Cockpit
              </button>
              <button
                onClick={() => setActiveTab("components")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === "components"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Component Vault
              </button>
              <button
                onClick={() => setActiveTab("fullstack")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === "fullstack"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Full-Stack Postgres
              </button>
              <button
                onClick={() => setActiveTab("mcp_setup")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === "mcp_setup"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Claude MCP Setup
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
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: AGENT TEAM COCKPIT */}
          {activeTab === "agents" && (
            <div className="space-y-6">
              {/* Squad Header Banner */}
              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/[0.08] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                      <Bot size={22} />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Autonomous Multi-Agent Squad (6 Specialized Models in Parallel)
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Each agent executes a distinct discipline: system topology, live DOM reverse engineering, 3D WebGL tilts, Neon Postgres schemas, and copy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      All 6 Agents Online
                    </span>
                  </div>
                </div>
              </div>

              {/* 6 Specialized Agent Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  {
                    name: "System Architect",
                    model: "Claude 3.7 Sonnet (Claude Code)",
                    role: "Route Topology & Next.js 15 App Boundaries",
                    color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
                    tasks: ["Analyzes user intent & system boundaries", "Formulates multi-route architecture", "Orchestrates MCP tool execution"],
                  },
                  {
                    name: "Deep Web Decompiler",
                    model: "ParallelWeb System (morluto/rea)",
                    role: "Live DOM & CSS Reverse Engineering",
                    color: "border-violet-500/40 bg-violet-500/10 text-violet-300",
                    tasks: ["Scrapes live URLs (Linear, Stripe, Raycast)", "Extracts color tokens & typography", "Converts layout hierarchies to TSX"],
                  },
                  {
                    name: "3D Spatial & Motion",
                    model: "Wonder & Muse 3D Engine",
                    role: "Aceternity UI & Three.js WebGL Tilts",
                    color: "border-pink-500/40 bg-pink-500/10 text-pink-300",
                    tasks: ["Synthesizes 3D perspective cards", "Configures 60FPS WebGL mesh canvas", "Injects hover laser cursor highlights"],
                  },
                  {
                    name: "Full-Stack Backend",
                    model: "Jev Engine & Nemotron 70B Ultra",
                    role: "Neon Postgres Drizzle & Edge APIs",
                    color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
                    tasks: ["Generates Drizzle ORM schemas", "Constructs Next.js 15 edge route handlers", "Configures UUID primary keys & RLS"],
                  },
                  {
                    name: "Conversion Copywriter",
                    model: "Google Argon (Gemini 2.5 Flash)",
                    role: "High-Impact Value Copy & Micro-Interactions",
                    color: "border-sky-500/40 bg-sky-500/10 text-sky-300",
                    tasks: ["Generates punchy, high-converting copy", "Synthesizes scale-to-zero pricing plans", "Formulates authentic social proof metrics"],
                  },
                  {
                    name: "QA & Performance Auditor",
                    model: "Automated Sandbox VM",
                    role: "Zero Key Collisions & React 19 Style Auditor",
                    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
                    tasks: ["Verifies 100% unique React keys", "Sanitizes conflicting background styles", "Ensures WCAG AA accessibility"],
                  },
                ].map((a) => (
                  <div
                    key={a.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${a.color}`}>
                          {a.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{a.model.split(" ")[0]}</span>
                      </div>
                      <p className="text-xs font-semibold text-white">{a.role}</p>

                      <ul className="mt-2.5 space-y-1 text-[11px] text-slate-400">
                        {a.tasks.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-violet-400">›</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Execution Form */}
              <div className="rounded-2xl border border-white/10 bg-[#06060c] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Rocket size={14} className="text-orange-400" />
                    <span>Run Multi-Agent Team Pipeline</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Autonomous synthesis</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Website Vision or Prompt:
                    </label>
                    <input
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="e.g. AI Video Diffusion Studio with 4K renders, H100 GPU tiers"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Or Target Website to Reverse-Engineer (morluto/rea):
                    </label>
                    <div className="relative">
                      <Globe size={13} className="absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="e.g. linear.app, stripe.com, or raycast.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-8 pr-3 text-xs text-white outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 mr-1">Presets:</span>
                  {[
                    "AI Video Studio (4K 60FPS)",
                    "Global Fintech Ledger & Cards",
                    "Cybersecurity Zero-Trust Cloud",
                    "Developer Edge API Engine",
                    "https://linear.app",
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        if (preset.startsWith("http")) {
                          setUrlInput(preset);
                          setPromptInput("Reverse engineer and redesign into ultra-modern 3D SaaS");
                        } else {
                          setPromptInput(preset);
                          setUrlInput("");
                        }
                      }}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300 hover:border-violet-500/50 hover:text-white transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Lead Model:</span>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#0d0d18] px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500"
                    >
                      {models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.provider})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleRunPipeline}
                    disabled={isExecuting}
                    className="btn-shine flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-violet-600/30 transition hover:opacity-95 disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Squad Synthesizing Application...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} />
                        <span>Execute Multi-Agent Squad</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Pipeline Execution Stream */}
              {pipelineResult && (
                <div className="rounded-2xl border border-emerald-500/30 bg-[#06060c] p-6 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check size={14} />
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Multi-Agent Pipeline Complete: {pipelineResult.blueprint.brandName} (
                        {pipelineResult.blueprint.domainCategory})
                      </h4>
                    </div>

                    <button
                      onClick={handleApplyResult}
                      disabled={applied}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
                    >
                      {applied ? (
                        <>
                          <Check size={13} />
                          <span>Applied to Canvas!</span>
                        </>
                      ) : (
                        <>
                          <Rocket size={13} />
                          <span>Apply to Live Builder Canvas</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Blueprint Summary Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-mono">Archetype</p>
                      <p className="font-bold text-white mt-0.5 truncate">{pipelineResult.blueprint.archetype}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-mono">Routes</p>
                      <p className="font-bold text-violet-300 mt-0.5">
                        {pipelineResult.blueprint.routes.length} Next.js Routes
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-mono">Neon DB Tables</p>
                      <p className="font-bold text-cyan-300 mt-0.5">
                        {pipelineResult.blueprint.databaseTables.join(", ")}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-mono">Animated Modules</p>
                      <p className="font-bold text-emerald-300 mt-0.5">
                        {pipelineResult.blueprint.animatedComponents.length} 3D Components
                      </p>
                    </div>
                  </div>

                  {/* Live Stream of Agent Activities */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Agent Team Action Log
                    </span>
                    <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs pr-1">
                      {pipelineResult.activities.map((act, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                        >
                          <span
                            className="h-2 w-2 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: act.avatarColor }}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{act.agentName}</span>
                              <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                            </div>
                            <p className="text-slate-300 font-sans text-xs">{act.message}</p>
                            {act.toolCalls?.map((t, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 text-[10px] text-violet-300 bg-violet-500/10 rounded px-2 py-0.5 w-fit mt-1"
                              >
                                <Terminal size={10} />
                                <span>Tool: {t.tool}</span>
                                {t.resultSummary && <span>— {t.resultSummary}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPONENT VAULT */}
          {activeTab === "components" && (
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
              {/* Left Column: Component List & Filter */}
              <div className="space-y-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 3D, bento, beams, navbar..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {["all", "3d", "bento", "hero", "background", "conversion", "fullstack"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase transition ${
                        selectedCategory === cat
                          ? "bg-violet-600 text-white"
                          : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Component List */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {components.map((c) => {
                    const isSelected = selectedComponent.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedComponent(c)}
                        className={`w-full rounded-2xl border p-3.5 text-left transition ${
                          isSelected
                            ? "border-violet-500/60 bg-violet-600/15 ring-1 ring-violet-500/40"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{c.name}</span>
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-violet-300">
                            {c.source}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{c.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Interactive Preview & Source Code */}
              <div className="space-y-5 rounded-2xl border border-white/10 bg-[#06060c] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-extrabold text-white">{selectedComponent.name}</h4>
                      <span className="rounded-full border border-violet-500/40 bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300">
                        {selectedComponent.source}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedComponent.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyCode(selectedComponent.code)}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedCode ? "Copied" : "Copy TSX"}</span>
                    </button>

                    <button
                      onClick={() => handleInject(selectedComponent)}
                      className="btn-shine flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 hover:opacity-90 transition"
                    >
                      {injectedId === selectedComponent.id ? <Check size={13} /> : <Plus size={13} />}
                      <span>{injectedId === selectedComponent.id ? "Injected to Site!" : "Inject Component"}</span>
                    </button>
                  </div>
                </div>

                {/* Live Interactive Preview Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Live Interactive Canvas Preview
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">● 60 FPS Render</span>
                  </div>

                  <div className="relative min-h-[280px] rounded-2xl border border-white/10 bg-[#0a0a14] p-6 flex items-center justify-center overflow-hidden">
                    {selectedComponent.id === "3d-card-effect" && <Card3DTilt />}
                    {selectedComponent.id === "threejs-cyber-sphere" && <ThreeJsCyberSphere className="h-64 w-64" />}
                    {selectedComponent.id === "animated-beams" && <AnimatedBeamsHub />}
                    {selectedComponent.id === "floating-island-navbar" && <FloatingIslandPreview />}
                    {selectedComponent.id === "interactive-pricing-roi" && <RoiPricingPreview />}
                    {selectedComponent.id !== "3d-card-effect" &&
                      selectedComponent.id !== "threejs-cyber-sphere" &&
                      selectedComponent.id !== "animated-beams" &&
                      selectedComponent.id !== "floating-island-navbar" &&
                      selectedComponent.id !== "interactive-pricing-roi" && (
                        <div className="text-center space-y-3">
                          <Card3DTilt
                            title={selectedComponent.name}
                            subtitle={selectedComponent.description}
                            badge={selectedComponent.source}
                          />
                        </div>
                      )}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Engineering Specs & Features
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    {selectedComponent.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2.5 border border-white/5"
                      >
                        <Check size={13} className="text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Viewer */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Production TSX Source Code
                  </span>
                  <pre className="max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#040408] p-4 font-mono text-[11px] text-slate-300 leading-relaxed">
                    {selectedComponent.code}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FULL-STACK POSTGRES */}
          {activeTab === "fullstack" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.06] p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                    <Database size={18} />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full-Stack Database & API Architecture</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Bolt and Bubble lock you into static frontends. Our MCP pipeline delivers a complete production backend: Drizzle ORM schemas, Neon PostgreSQL tables, and Next.js 15 route handlers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">src/db/schema.ts (Drizzle + Postgres)</span>
                    <button
                      onClick={() => copyCode(COMPONENT_DATABASE["neon-postgres-schema"].code)}
                      className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                    >
                      <Copy size={12} /> Copy Schema
                    </button>
                  </div>
                  <pre className="max-h-80 overflow-auto rounded-xl border border-white/10 bg-[#06060c] p-4 font-mono text-[11px] text-slate-300">
                    {COMPONENT_DATABASE["neon-postgres-schema"].code}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">app/api/v1/projects/route.ts (Edge Handler)</span>
                    <button
                      onClick={() => copyCode(COMPONENT_DATABASE["nextjs-api-route-edge"].code)}
                      className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                    >
                      <Copy size={12} /> Copy API Handler
                    </button>
                  </div>
                  <pre className="max-h-80 overflow-auto rounded-xl border border-white/10 bg-[#06060c] p-4 font-mono text-[11px] text-slate-300">
                    {COMPONENT_DATABASE["nextjs-api-route-edge"].code}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLAUDE MCP SETUP */}
          {activeTab === "mcp_setup" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                    <Terminal size={18} />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Claude Code & Cursor MCP Integration</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Connect your local Claude Code CLI, Claude Desktop, or Cursor to this component vault via Model Context Protocol.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">claude_desktop_config.json</span>
                  <button
                    onClick={() => {
                      copyCode(mcpConfigCode);
                      setCopiedMcpConfig(true);
                      setTimeout(() => setCopiedMcpConfig(false), 2000);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedMcpConfig ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedMcpConfig ? "Copied" : "Copy Config"}</span>
                  </button>
                </div>
                <pre className="overflow-auto rounded-xl border border-white/10 bg-[#06060c] p-4 font-mono text-xs text-slate-300">
                  {mcpConfigCode}
                </pre>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-white">Terminal CLI Execution Command:</span>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#040408] p-3 font-mono text-xs text-slate-300">
                  <code>claude &quot;Inject the 3D Perspective Card Tilt component into app/page.tsx&quot;</code>
                  <button
                    onClick={() => copyCode(`claude "Inject the 3D Perspective Card Tilt component into app/page.tsx"`)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
