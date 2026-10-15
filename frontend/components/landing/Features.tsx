"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
import { Eye, Layers, MessageSquare, MousePointer2, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

type Icon = ComponentType<{ size?: number }>;

function Tile({
  icon: Icon, title, text, badge, className = "", children,
}: { icon: Icon; title: string; text: string; badge?: string; className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={`spot glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 ${className}`}
    >
      <div className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-orange-500/30">
          <Icon size={18} />
        </span>
        {badge && (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
            {badge}
          </span>
        )}
      </div>
      <h3 className="relative mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
      {children && <div className="relative mt-6 flex-1">{children}</div>}
    </div>
  );
}

export default function Features() {
  return (
    <section id="product" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Product</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Everything a real website needs. Nothing you have to code.
        </h2>
      </ScrollReveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScrollReveal className="sm:col-span-2 lg:row-span-2" delay={0}>
          <Tile icon={MousePointer2} title="Click anything to edit" text="Text, images, prices, testimonials, FAQs. Every single item can be edited, copied or deleted, with no prompt needed.">
            <div className="rounded-2xl border border-white/10 bg-[#0b0b14] px-5 pb-6 pt-14">
              <div className="relative inline-block">
                <p className="text-2xl font-bold text-white">
                  Handmade jewelry, <span className="text-brand-gradient">delivered</span>
                </p>
                <span className="pointer-events-none absolute -inset-1.5 rounded-md border border-sky-400" />
                <span className="absolute -left-2 -top-2 h-2 w-2 rounded-sm bg-sky-400" />
                <span className="absolute -right-2 -top-2 h-2 w-2 rounded-sm bg-sky-400" />
                <span className="absolute -bottom-2 -left-2 h-2 w-2 rounded-sm bg-sky-400" />
                <span className="absolute -bottom-2 -right-2 h-2 w-2 rounded-sm bg-sky-400" />
                <div className="anim-bob absolute -top-11 left-0 flex items-center gap-1 rounded-lg bg-slate-800 p-1 text-[10px] font-medium text-slate-200 shadow-xl">
                  <span className="rounded-md bg-sky-500 px-2 py-1 text-white">Edit</span>
                  <span className="px-2 py-1">Rewrite</span>
                  <span className="px-2 py-1">Duplicate</span>
                  <span className="rounded-md px-2 py-1 text-red-400">Delete</span>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm text-slate-500">Small batches, honest prices and free shipping across India.</p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white">Shop now</span>
                <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300">Our story</span>
              </div>
            </div>
          </Tile>
        </ScrollReveal>

        <ScrollReveal className="sm:col-span-2" delay={70}>
          <Tile icon={Layers} title="Pages, login and dashboard included" text="Not a single scrolling page. Get Home, About, Shop, Contact, plus working login, signup and dashboard screens.">
            <div className="flex flex-wrap gap-2">
              {["Home", "Shop", "About", "Contact", "Login", "Signup", "Dashboard"].map((p, i) => (
                <span key={p} className={`rounded-full border px-3 py-1 text-xs ${i === 0 ? "border-violet-400/50 bg-violet-500/15 text-violet-200" : "border-white/10 bg-white/[0.03] text-slate-400"}`}>
                  {p}
                </span>
              ))}
            </div>
          </Tile>
        </ScrollReveal>

        <ScrollReveal delay={140}>
          <Tile icon={Sparkles} title="Real AI images" text="Images are generated to match your content. Regenerate one, upload your own, or remove it.">
            <div className="grid grid-cols-3 gap-1.5">
              {["#3b82f6,#8b5cf6", "#f43f5e,#f59e0b", "#14b8a6,#3b82f6"].map((g, i) => (
                <div key={i} className="aspect-square rounded-lg" style={{ background: `linear-gradient(135deg, ${g.split(",")[0]}, ${g.split(",")[1]})`, opacity: 0.9 }} />
              ))}
            </div>
          </Tile>
        </ScrollReveal>

        <ScrollReveal delay={210}>
          <Tile icon={MessageSquare} title="Or just ask" text="Chat to change a whole page, or ask AI about one single section.">
            <div className="space-y-2 text-[11px]">
              <div className="ml-auto w-fit max-w-[90%] rounded-xl rounded-br-sm bg-brand-gradient px-3 py-2 text-white">Make the hero feel more premium</div>
              <div className="w-fit max-w-[90%] rounded-xl rounded-bl-sm bg-white/[0.06] px-3 py-2 text-slate-300">Done. Updated colors and headline.</div>
            </div>
          </Tile>
        </ScrollReveal>

        <ScrollReveal className="sm:col-span-2" delay={0}>
          <Tile icon={ShieldCheck} title="Approve first, code later" text="Edit until it feels like the real product. Production code is generated only after you say yes, so you never pay for rework.">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {["Design", "Edit", "Approve", "Code"].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 font-medium ${i < 3 ? "bg-emerald-500/10 text-emerald-300" : "bg-white/[0.05] text-slate-400"}`}>
                    {i < 3 ? "✓ " : ""}{s}
                  </span>
                  {i < 3 && <span className="text-slate-600">→</span>}
                </span>
              ))}
            </div>
          </Tile>
        </ScrollReveal>

        <ScrollReveal delay={70}>
          <Tile icon={Eye} title="Preview like a visitor" text="Switch to preview and click through every page, form and button.">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-2/3 rounded-full bg-brand-gradient" />
            </div>
          </Tile>
        </ScrollReveal>

        <ScrollReveal delay={140}>
          <Tile icon={Rocket} title="Export and host" text="Download your site today. One-click hosting and GitHub export are on the way." badge="Hosting soon" />
        </ScrollReveal>
      </div>
    </section>
  );
}