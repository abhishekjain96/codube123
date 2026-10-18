"use client";

import { useState } from "react";
import { Code2, Eye, Sparkles, Zap } from "lucide-react";
import HeroPrompt from "./HeroPrompt";
import Showcase from "./Showcase";

const partners = [
  { name: "Vercel", icon: "▲" },
  { name: "Supabase", icon: "⚡" },
  { name: "OpenAI", icon: "✹" },
  { name: "Claude", icon: "✦" },
  { name: "Google Cloud", icon: "☁" },
  { name: "AWS", icon: "⬡" },
];

export default function Hero() {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14">
      {/* Dynamic Aurora & Grid */}
      <div className="aurora pointer-events-none absolute inset-0 opacity-80" />
      <div className="bg-grid pointer-events-none absolute inset-0" />

      {/* Ambient Neon Blobs */}
      <div className="anim-blob pointer-events-none absolute -left-20 top-20 h-[520px] w-[520px] rounded-full bg-violet-600/15 blur-[120px]" />
      <div
        className="anim-blob pointer-events-none absolute -right-20 top-40 h-[480px] w-[480px] rounded-full bg-orange-500/15 blur-[120px]"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        {/* Top Eyebrow Badge */}
        <div className="rise inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-md">
          <Sparkles size={13} className="text-orange-400" />
          <span>YOUR IDEAS, BUILT WITH AI</span>
        </div>

        {/* Hero Title */}
        <h1
          className="rise mt-7 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          From idea to{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            app.
          </span>
          <br />
          Before you write code.
        </h1>

        {/* Subtitle */}
        <p
          className="rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
          style={{ animationDelay: "150ms" }}
        >
          Describe what you want or use a website URL. Preview it live, edit
          everything, and generate production-ready code only when you&apos;re ready.
        </p>

        {/* Input box */}
        <div className="rise mt-10" style={{ animationDelay: "220ms" }}>
          <HeroPrompt value={prompt} onChange={setPrompt} />
        </div>

        {/* Three Pillars row */}
        <div
          className="rise mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400 sm:gap-10 sm:text-sm"
          style={{ animationDelay: "280ms" }}
        >
          <span className="flex items-center gap-2">
            <Zap size={15} className="text-orange-400" />
            <span>Live preview</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span className="flex items-center gap-2">
            <Eye size={15} className="text-violet-400" />
            <span>Visual editing</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span className="flex items-center gap-2">
            <Code2 size={15} className="text-blue-400" />
            <span>Production ready code</span>
          </span>
        </div>

        {/* High-Impact 3D Visual Editor Mockup */}
        <div className="mt-14 sm:mt-18">
          <Showcase prompt={prompt} />
        </div>

        {/* Trusted By Logos */}
        <div className="mt-16 sm:mt-24 border-t border-white/[0.06] pt-10">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
            Trusted by creators, developers and businesses
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                <span className="text-base text-violet-400">{p.icon}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}