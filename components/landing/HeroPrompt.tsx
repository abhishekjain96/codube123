"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe, Sparkles, Terminal } from "lucide-react";

const promptChips = [
  "A modern coffee shop website",
  "A SaaS landing page",
  "A dashboard for doctors",
];

const urlChips = [
  { label: "https://www.airbnb.com", desc: "Vacation Rentals" },
  { label: "https://linear.app", desc: "SaaS Dev Tool" },
  { label: "https://stripe.com", desc: "Fintech Payments" },
];

export default function HeroPrompt({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"prompt" | "url">("prompt");
  const [url, setUrl] = useState("https://www.airbnb.com");
  const [urlInstructions, setUrlInstructions] = useState(
    "Create a similar booking experience with premium design, custom branding, and transparent pricing."
  );

  function submit() {
    if (mode === "prompt") {
      const text = value.trim();
      if (!text) return;
      try {
        sessionStorage.setItem("codube_prompt", text);
        sessionStorage.removeItem("codube_url");
      } catch {}
      router.push("/generating");
    } else {
      const targetUrl = url.trim();
      if (!targetUrl) return;
      try {
        sessionStorage.setItem("codube_url", targetUrl);
        sessionStorage.setItem("codube_instructions", urlInstructions.trim());
        sessionStorage.setItem(
          "codube_prompt",
          `URL: ${targetUrl} | ${urlInstructions.trim()}`
        );
      } catch {}
      router.push("/generating");
    }
  }

  return (
    <div className="relative mx-auto max-w-2xl text-left">
      {/* Aurora glow around container */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-violet-600/25 via-fuchsia-600/20 to-orange-500/25 blur-2xl" />

      <div className="relative rounded-2xl bg-gradient-to-r from-violet-500/40 via-fuchsia-500/30 to-orange-500/40 p-px shadow-2xl">
        <div className="rounded-[15px] bg-[#0b0b14]/95 p-4 backdrop-blur-xl sm:p-5">
          {/* Mode Switcher Tabs */}
          <div className="mb-3.5 flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="inline-flex rounded-xl bg-white/[0.05] p-1">
              <button
                type="button"
                onClick={() => setMode("prompt")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  mode === "prompt"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles size={13} className="text-orange-400" />
                Prompt
              </button>
              <button
                type="button"
                onClick={() => setMode("url")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  mode === "url"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe size={13} className="text-violet-300" />
                Website URL
              </button>
            </div>

            {mode === "url" && (
              <span className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
                <Terminal size={11} className="text-orange-400" />
                <span>REA Reverse Engineering</span>
              </span>
            )}
          </div>

          {/* Mode 1: Pure Prompt Input */}
          {mode === "prompt" ? (
            <div>
              <div className="flex items-start gap-3">
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  rows={2}
                  placeholder="Describe the app or website you want to build..."
                  className="min-h-[58px] flex-1 resize-none bg-transparent px-1 py-1 text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
                />
                <button
                  type="button"
                  onClick={submit}
                  aria-label="Generate with Codube"
                  className="btn-shine flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/40 transition hover:scale-105 active:scale-95"
                >
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                <span className="text-[11px] text-slate-500">Suggestions:</span>
                {promptChips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onChange(c)}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Mode 2: Website URL + REA Reverse Engineering Input */
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 focus-within:border-violet-500/60">
                <Globe size={16} className="text-violet-400 shrink-0" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.airbnb.com"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-start gap-3">
                <textarea
                  value={urlInstructions}
                  onChange={(e) => setUrlInstructions(e.target.value)}
                  rows={2}
                  placeholder="How should Codube adapt this website? (e.g. Change brand to StayLuxe, dark theme, add booking filter)"
                  className="min-h-[48px] flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-xs text-white outline-none placeholder:text-slate-500 focus:border-violet-500/60"
                />
                <button
                  type="button"
                  onClick={submit}
                  aria-label="Analyze URL and Generate"
                  className="btn-shine flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/40 transition hover:scale-105 active:scale-95"
                >
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Reference URL quick picks */}
              <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-2.5">
                <span className="text-[11px] text-slate-500">Popular references:</span>
                {urlChips.map((u) => (
                  <button
                    key={u.label}
                    type="button"
                    onClick={() => {
                      setUrl(u.label);
                      setUrlInstructions(
                        `Reverse engineer ${u.desc} with modern luxury aesthetic and full custom branding.`
                      );
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                  >
                    <span>{u.label.replace("https://www.", "")}</span>
                    <span className="text-[10px] text-violet-400">({u.desc})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}