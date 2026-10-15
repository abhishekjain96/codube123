"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import HeroPrompt from "./HeroPrompt";
import Showcase from "./Showcase";

const perks = ["Free to start", "No credit card required", "Code only after you approve"];

const floatingCards = [
  { label: "AI Design", icon: "✦", color: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/30" },
  { label: "Click to Edit", icon: "⌖", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/30" },
  { label: "Live Preview", icon: "◎", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30" },
];

export default function Hero() {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="relative overflow-hidden">
      {/* Aurora background */}
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="bg-grid pointer-events-none absolute inset-0" />

      {/* Decorative blobs */}
      <div className="anim-blob pointer-events-none absolute left-[-20%] top-10 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      <div className="anim-blob pointer-events-none absolute right-[-10%] top-20 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" style={{ animationDelay: "3s" }} />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-28">
        {/* Status pill */}
        <p className="rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="ping-soft absolute inset-0 rounded-full bg-orange-400" />
            <span className="relative h-2 w-2 rounded-full bg-orange-400" />
          </span>
          The visual-first AI website builder
          <span className="hidden items-center gap-1 text-orange-400 sm:flex">
            <ChevronRight size={12} /> New
          </span>
        </p>

        {/* Headline */}
        <h1
          className="rise mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Turn one sentence into a
          <br />
          <span className="shimmer-text">premium website.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="rise mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Codube designs a complete multi-page site, lets you edit every part by clicking, and writes
          production code <span className="text-orange-400 font-medium">only after you approve</span>.
        </p>

        {/* Feature pills */}
        <div
          className="rise mt-6 flex flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "200ms" }}
        >
          {floatingCards.map((c) => (
            <span
              key={c.label}
              className={`flex items-center gap-1.5 rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-medium text-white ${c.border} ${c.color}`}
            >
              <span className="text-sm">{c.icon}</span>
              {c.label}
            </span>
          ))}
        </div>

        {/* Prompt box */}
        <div className="rise mt-10" style={{ animationDelay: "240ms" }}>
          <HeroPrompt value={prompt} onChange={setPrompt} />
        </div>

        {/* Perks */}
        <ul
          className="rise mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500"
          style={{ animationDelay: "320ms" }}
        >
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-1.5">
              <Check size={14} className="text-orange-400" /> {p}
            </li>
          ))}
        </ul>

        <Showcase prompt={prompt} />
      </div>
    </section>
  );
}