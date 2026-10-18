"use client";

import { useState } from "react";
import Image from "next/image";
import { Layers, MousePointer2, Palette, Plus, Sparkles, Type } from "lucide-react";

export default function Showcase({ prompt }: { prompt: string }) {
  const isCustom = prompt.trim().length > 0;
  const [activeTab, setActiveTab] = useState<"design" | "content">("design");
  const [selectedColor, setSelectedColor] = useState("#f97316");

  const colors = ["#f97316", "#8b5cf6", "#3b82f6", "#10b981", "#ffffff"];

  const layers = [
    { name: "Navbar", active: false },
    { name: "Hero Section", active: true },
    { name: "Features", active: false },
    { name: "Gallery", active: false },
    { name: "Testimonials", active: false },
    { name: "Contact", active: false },
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-2">
      {/* Perspective ambient glow */}
      <div className="pointer-events-none absolute -inset-x-12 -top-10 bottom-0 bg-gradient-to-b from-violet-600/20 via-orange-500/10 to-transparent blur-3xl" />

      {/* Floating 3D Accent Cubes */}
      <div className="pointer-events-none absolute -left-8 top-12 h-16 w-16 rotate-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 opacity-70 shadow-2xl shadow-violet-500/50 blur-[1px] hidden sm:block anim-float" />
      <div
        className="pointer-events-none absolute -right-6 top-6 h-14 w-14 -rotate-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 opacity-70 shadow-2xl shadow-orange-500/50 blur-[1px] hidden sm:block anim-float"
        style={{ animationDelay: "2s" }}
      />

      {/* Main Perspective Container */}
      <div className="relative rounded-3xl border border-white/10 bg-[#07070d]/90 p-3 shadow-[0_30px_100px_-20px_rgba(139,92,246,0.35)] backdrop-blur-2xl transition duration-500 sm:p-5">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 px-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-3 rounded-md bg-white/[0.05] px-2.5 py-0.5 text-xs text-slate-400">
              brewhouse.codube.app
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live preview
            </span>
            <span className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-md shadow-violet-600/30">
              Publish
            </span>
          </div>
        </div>

        {/* 3-Column Layout: Layers Sidebar | Interactive Center Preview | Style Inspector */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[200px_1fr_220px]">
          {/* Left: Layers Panel */}
          <div className="hidden rounded-2xl border border-white/[0.06] bg-[#0c0c16] p-3 text-left lg:block">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Layers size={13} className="text-violet-400" />
              <span>Layers</span>
            </div>
            <div className="mt-3 space-y-1">
              {layers.map((l) => (
                <div
                  key={l.name}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                    l.active
                      ? "bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <span>{l.name}</span>
                  {l.active && <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />}
                </div>
              ))}
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-1.5 text-xs text-slate-400 hover:border-violet-500/40 hover:text-white">
              <Plus size={12} /> Add Section
            </button>
          </div>

          {/* Center: Live Site Preview */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050508] p-4 text-left sm:p-6">
            {/* Embedded Site Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <span className="text-sm font-extrabold tracking-tight text-white">
                BREW HOUSE<span className="text-orange-500">.</span>
              </span>
              <div className="hidden gap-5 text-xs font-medium text-slate-400 sm:flex">
                <span className="text-white">Home</span>
                <span>Menu</span>
                <span>About</span>
                <span>Contact</span>
              </div>
              <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white">
                Order
              </span>
            </div>

            {/* Embedded Hero Section (with Click-To-Edit Box) */}
            <div className="relative mt-6 grid items-center gap-6 sm:grid-cols-2">
              <div className="relative rounded-xl border border-violet-500/50 bg-violet-500/5 p-3 sm:p-4">
                <div className="absolute -top-3 left-3 flex items-center gap-1 rounded bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <MousePointer2 size={10} /> Selected: Hero Heading
                </div>
                <p className="text-xs font-semibold text-orange-400">Coffee Made Special.</p>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {isCustom ? prompt.slice(0, 45) : "Your Daily Ritual."}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Exceptional coffee. Thoughtfully crafted. Made for your everyday moments.
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/30">
                    Explore Menu →
                  </button>
                </div>
              </div>

              {/* Coffee Latte Photo */}
              <div className="relative h-44 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                <Image
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
                  alt="Craft Latte Art"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                  ★ 4.9 (1.2k reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Style & Content Inspector */}
          <div className="hidden rounded-2xl border border-white/[0.06] bg-[#0c0c16] p-3 text-left lg:block">
            <div className="flex rounded-lg bg-white/[0.04] p-0.5">
              <button
                onClick={() => setActiveTab("design")}
                className={`flex-1 rounded-md py-1 text-center text-xs font-medium transition ${
                  activeTab === "design" ? "bg-violet-600 text-white" : "text-slate-400"
                }`}
              >
                Design
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 rounded-md py-1 text-center text-xs font-medium transition ${
                  activeTab === "content" ? "bg-violet-600 text-white" : "text-slate-400"
                }`}
              >
                Content
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Palette size={12} className="text-orange-400" /> Accent Color
                </label>
                <div className="mt-1.5 flex items-center gap-1.5">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      style={{ background: c }}
                      className={`h-5 w-5 rounded-full transition ${
                        selectedColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0c0c16]" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Type size={12} className="text-violet-400" /> Typography
                </label>
                <div className="mt-1.5 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white">
                  <span>Inter (Modern)</span>
                  <span className="text-slate-500">Aa</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Section Radius</label>
                <div className="mt-1.5 grid grid-cols-3 gap-1 text-center text-[10px]">
                  <span className="rounded border border-white/10 p-1 text-slate-400">Sharp</span>
                  <span className="rounded border border-violet-500/50 bg-violet-500/20 p-1 font-semibold text-white">
                    Soft
                  </span>
                  <span className="rounded border border-white/10 p-1 text-slate-400">Round</span>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-3">
                <span className="flex items-center gap-1 text-[11px] font-medium text-orange-400">
                  <Sparkles size={11} /> AI Assistant Active
                </span>
                <p className="mt-1 text-[10px] text-slate-500">
                  Click any element in canvas or ask AI to restyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}