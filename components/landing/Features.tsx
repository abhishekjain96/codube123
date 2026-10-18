"use client";

import { Check, Code2, Edit3, Globe, Play, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background radial gradient */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header: Turn any idea into a working app */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Turn{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              any idea
            </span>{" "}
            into a working app
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Codube combines the power of AI with a visual editor, so you can go from
            concept to live application without writing code, and still get the full
            source code when you&apos;re ready.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass rounded-2xl p-6 transition duration-300 hover:border-violet-500/40 hover:-translate-y-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Globe size={20} />
            </span>
            <h3 className="mt-4 font-bold text-white">Use a prompt or URL</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Describe your idea or use any existing website as a reference to reverse-engineer.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 transition duration-300 hover:border-violet-500/40 hover:-translate-y-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Play size={20} />
            </span>
            <h3 className="mt-4 font-bold text-white">Live preview</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Get a working, interactive preview in seconds with functional components.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 transition duration-300 hover:border-violet-500/40 hover:-translate-y-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Edit3 size={20} />
            </span>
            <h3 className="mt-4 font-bold text-white">Edit everything</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Change text, images, colors, sections and more with a visual editor or AI.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 transition duration-300 hover:border-violet-500/40 hover:-translate-y-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Code2 size={20} />
            </span>
            <h3 className="mt-4 font-bold text-white">Generate code</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              When you&apos;re happy, get clean, production-ready code to download or deploy.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DEEP-DIVE 1: Take inspiration from any website (URL TO APP)   */}
        {/* ============================================================== */}
        <div className="mt-24 sm:mt-32 grid items-center gap-10 lg:grid-cols-2">
          {/* Visual: Browser with Airbnb -> StayFinder */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-3xl bg-violet-600/15 blur-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-[#0a0a14] p-4 shadow-2xl">
              {/* Browser Search Bar */}
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <Globe size={15} className="text-violet-400" />
                <span className="flex-1 text-xs text-slate-300 font-mono">
                  https://www.airbnb.com
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500 text-white">
                  →
                </span>
              </div>

              {/* Reverse-Engineered StayFinder Preview */}
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#07070b] p-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-xs font-bold text-white tracking-tight">
                    StayFinder
                  </span>
                  <div className="flex gap-3 text-[10px] text-slate-400">
                    <span className="text-white">Stays</span>
                    <span>Experiences</span>
                    <span>Online Experiences</span>
                  </div>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white">
                    Sign in
                  </span>
                </div>

                {/* Property Cards */}
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02]">
                    <div className="relative h-20 w-full bg-slate-800">
                      <Image
                        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80"
                        alt="Modern Villa"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2 text-left">
                      <p className="line-clamp-1 text-[11px] font-bold text-white">Modern Villa</p>
                      <p className="text-[10px] text-orange-400 font-semibold">₹8,500 <span className="text-slate-500 font-normal">/ night</span></p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02]">
                    <div className="relative h-20 w-full bg-slate-800">
                      <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80"
                        alt="Mountain Retreat"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2 text-left">
                      <p className="line-clamp-1 text-[11px] font-bold text-white">Mountain Retreat</p>
                      <p className="text-[10px] text-orange-400 font-semibold">₹6,200 <span className="text-slate-500 font-normal">/ night</span></p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02]">
                    <div className="relative h-20 w-full bg-slate-800">
                      <Image
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
                        alt="Beach House"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2 text-left">
                      <p className="line-clamp-1 text-[11px] font-bold text-white">Beach House</p>
                      <p className="text-[10px] text-orange-400 font-semibold">₹7,100 <span className="text-slate-500 font-normal">/ night</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy & Details */}
          <div className="order-1 text-left lg:order-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              <Sparkles size={12} className="text-orange-400" />
              URL TO APP
            </span>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Take inspiration from any website.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Give Codube a website URL, and it will analyze the design, layout and
              structure to create an editable version for you. Then customize it to
              match your needs.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {[
                "Recreate modern designs",
                "Adapt sections and components",
                "Customize with your own content",
                "Make it unique and production ready",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                    <Check size={13} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DEEP-DIVE 2: Edit. Add. Delete. Your app, your way.            */}
        {/* ============================================================== */}
        <div className="mt-28 sm:mt-36 grid items-center gap-10 lg:grid-cols-2">
          {/* Copy & Details */}
          <div className="text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-300">
              <Sparkles size={12} className="text-orange-400" />
              VISUAL EDITOR
            </span>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Edit. Add. Delete.
              <br />
              Your app, your way.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Click on any element and make changes instantly. Use the visual editor
              or simply ask AI to do it for you.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {[
                "Edit text, images, colors and layout",
                "Add or remove sections",
                "Adjust for mobile and desktop",
                "See changes in real time",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-400">
                    <Check size={13} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual: Click-to-edit canvas with floating inspector */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-fuchsia-600/15 blur-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-[#0a0a14] p-5 shadow-2xl">
              {/* Canvas Preview Area */}
              <div className="rounded-xl border border-white/[0.08] bg-[#07070b] p-5 text-left">
                <div className="inline-block rounded-xl border border-violet-500/80 bg-violet-500/10 p-3 shadow-lg">
                  <h4 className="text-xl font-bold text-white">Your Daily Ritual.</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Exceptional coffee. Thoughtfully crafted. Made for your everyday moments.
                  </p>
                  <button className="mt-3 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
                    Explore Menu →
                  </button>
                </div>
              </div>

              {/* Floating Inspector Panel */}
              <div className="mt-4 rounded-xl border border-white/10 bg-[#12121f] p-4 text-left shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-bold text-white">
                  <span>Edit Section</span>
                  <div className="flex gap-2 text-[11px] text-slate-400">
                    <span className="text-violet-400 font-semibold">Content</span>
                    <span>Design</span>
                  </div>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 font-medium">Heading</label>
                    <input
                      readOnly
                      value="Your Daily Ritual."
                      className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-medium">Font</label>
                      <div className="mt-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-300">
                        Inter
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-medium">Color</label>
                      <div className="mt-1 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-300">
                        <span className="h-3 w-3 rounded-full bg-white" />
                        <span>#FFFFFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DEEP-DIVE 3: Get clean, production-ready code. (GENERATE/DEPLOY)*/}
        {/* ============================================================== */}
        <div className="mt-28 sm:mt-36 grid items-center gap-10 lg:grid-cols-2">
          {/* Visual: IDE with Code / Preview / Deploy */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-3xl bg-blue-600/15 blur-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-[#090912] shadow-2xl overflow-hidden text-left font-mono text-xs">
              {/* Header Tabs */}
              <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0c0c18] px-4 py-2.5">
                <div className="flex gap-2">
                  <span className="rounded bg-violet-600/30 px-2.5 py-1 text-[11px] font-semibold text-violet-300">
                    Code
                  </span>
                  <span className="rounded px-2.5 py-1 text-[11px] text-slate-400">Preview</span>
                  <span className="rounded px-2.5 py-1 text-[11px] text-slate-400">Deploy</span>
                </div>
                <span className="rounded-lg bg-violet-600 px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-violet-600/30">
                  Generate Code
                </span>
              </div>

              {/* IDE Content: File Tree + Code Editor */}
              <div className="grid grid-cols-[140px_1fr] bg-[#07070d]">
                {/* File Tree */}
                <div className="border-r border-white/[0.06] p-3 text-[11px] text-slate-400 space-y-1.5">
                  <div className="text-white font-semibold flex items-center gap-1">▾ project</div>
                  <div className="pl-3 space-y-1">
                    <div className="text-slate-300">▾ src</div>
                    <div className="pl-3 text-slate-400">▸ components</div>
                    <div className="pl-3 text-slate-400">▸ pages</div>
                    <div className="pl-3 text-slate-400">▸ api</div>
                    <div className="pl-3 text-violet-400 font-semibold">page.tsx</div>
                    <div className="text-slate-400">package.json</div>
                    <div className="text-slate-400">next.config.js</div>
                  </div>
                </div>

                {/* Syntax Editor */}
                <div className="p-3 text-[11px] leading-relaxed text-slate-300 font-mono overflow-x-auto">
                  <p><span className="text-violet-400">export default function</span> <span className="text-amber-300">App</span>() &#123;</p>
                  <p className="pl-3"><span className="text-violet-400">return</span> (</p>
                  <p className="pl-6">&lt;<span className="text-blue-400">div</span> <span className="text-slate-400">className</span>=<span className="text-emerald-300">&quot;min-h-screen&quot;</span>&gt;</p>
                  <p className="pl-9">&lt;<span className="text-amber-300">Navbar</span> /&gt;</p>
                  <p className="pl-9">&lt;<span className="text-amber-300">Hero</span> /&gt;</p>
                  <p className="pl-9">&lt;<span className="text-amber-300">Features</span> /&gt;</p>
                  <p className="pl-9">&lt;<span className="text-amber-300">Testimonials</span> /&gt;</p>
                  <p className="pl-9">&lt;<span className="text-amber-300">Footer</span> /&gt;</p>
                  <p className="pl-6">&lt;/<span className="text-blue-400">div</span>&gt;</p>
                  <p className="pl-3">);</p>
                  <p>&#125;</p>

                  <div className="mt-4 flex justify-end">
                    <button className="flex items-center gap-1.5 rounded-lg bg-white text-slate-950 px-3 py-1.5 text-[11px] font-bold shadow-lg hover:bg-slate-200">
                      ▲ Deploy to Vercel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy & Details */}
          <div className="order-1 text-left lg:order-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={12} className="text-orange-400" />
              GENERATE & DEPLOY
            </span>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get clean, production-ready code.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Once you&apos;re satisfied with the preview, Codube generates the full source
              code for your project. Download it or deploy it directly to your preferred
              platform.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {[
                "Clean and scalable code",
                "Frontend and backend (if needed)",
                "Download or deploy with one click",
                "Works with modern tech stacks",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    <Check size={13} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}