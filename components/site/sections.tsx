"use client";

import React, { useContext } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { Icon, Img, Section, SiteCtx } from "./kit";

export function NavbarSection({ p }: { p: any }) {
  const { brand, go } = useContext(SiteCtx);
  const links: Array<{ label: string; href: string }> = p.links || [];
  const cta = p.cta || { label: "Get Started", href: "#cta" };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--bd)] bg-[var(--bg)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button onClick={() => go("/")} className="flex items-center gap-2 text-lg font-bold text-[var(--tx)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--p)] to-[var(--s)] text-white shadow-md">
            <Sparkles size={16} />
          </span>
          <span>{brand.name || "Brand"}</span>
        </button>

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link, i) => (
            <button
              key={i}
              onClick={() => go(link.href)}
              className="text-xs font-semibold text-[var(--mu)] transition hover:text-[var(--tx)]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => go(cta.href)}
          className="rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, var(--p), var(--s))" }}
        >
          {cta.label}
        </button>
      </div>
    </header>
  );
}

export function HeroSplitSection({ p }: { p: any }) {
  const { go } = useContext(SiteCtx);
  return (
    <Section>
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-left">
            {p.badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--p)]/30 bg-[var(--p)]/10 px-3 py-1 text-xs font-semibold text-[var(--p)]">
                {p.badge}
              </span>
            )}
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl text-[var(--tx)]">
              {p.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--mu)] sm:text-lg">
              {p.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.primaryCta && (
                <button
                  onClick={() => go(p.primaryCta.href)}
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105"
                  style={{ background: "linear-gradient(135deg, var(--p), var(--s))" }}
                >
                  {p.primaryCta.label}
                </button>
              )}
              {p.secondaryCta && (
                <button
                  onClick={() => go(p.secondaryCta.href)}
                  className="rounded-xl border border-[var(--bd)] bg-[var(--card)] px-6 py-3 text-sm font-semibold text-[var(--tx)] transition hover:bg-white/10"
                >
                  {p.secondaryCta.label}
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <Img src={p.imageUrl} alt={p.imageAlt} className="h-80 sm:h-96 w-full shadow-2xl" />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function HeroCenterSection({ p }: { p: any }) {
  const { go } = useContext(SiteCtx);
  return (
    <Section>
      <div className="mx-auto max-w-4xl text-center">
        {p.badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--p)]/30 bg-[var(--p)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--p)]">
            {p.badge}
          </span>
        )}
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl text-[var(--tx)]">
          {p.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--mu)] sm:text-lg">
          {p.subtitle}
        </p>
        {p.primaryCta && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => go(p.primaryCta.href)}
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--p), var(--s))" }}
            >
              {p.primaryCta.label}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}

export function StatsSection({ p }: { p: any }) {
  const items: Array<{ value: string; label: string }> = p.items || [];
  return (
    <Section alt>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-[var(--bd)] bg-[var(--card)] p-6 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-[var(--p)] sm:text-4xl">{it.value}</p>
              <p className="mt-1 text-xs font-medium text-[var(--mu)]">{it.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function FeaturesBentoSection({ p }: { p: any }) {
  const items: Array<{ icon?: string; title: string; description: string }> = p.items || [];
  return (
    <Section>
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-[var(--tx)]">{p.title}</h2>
          {p.subtitle && <p className="mt-3 text-sm text-[var(--mu)] sm:text-base">{p.subtitle}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-[var(--bd)] bg-[var(--card)] p-6 transition hover:border-[var(--p)]/40 hover:-translate-y-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--p)]/10 text-[var(--p)]">
                <Icon name={it.icon} size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-[var(--tx)]">{it.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--mu)]">{it.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ProductGridSection({ p }: { p: any }) {
  const items: Array<{ title: string; description: string; price?: string; badge?: string }> = p.items || [];
  return (
    <Section alt>
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-[var(--tx)]">{p.title}</h2>
          {p.subtitle && <p className="mt-3 text-sm text-[var(--mu)] sm:text-base">{p.subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-[var(--bd)] bg-[var(--card)] p-5 shadow-sm transition hover:scale-[1.02]">
              {it.badge && (
                <span className="mb-3 inline-block rounded-full bg-[var(--p)]/15 px-2.5 py-0.5 text-[10px] font-bold text-[var(--p)]">
                  {it.badge}
                </span>
              )}
              <h3 className="text-base font-bold text-[var(--tx)]">{it.title}</h3>
              <p className="mt-2 text-xs text-[var(--mu)] line-clamp-2">{it.description}</p>
              {it.price && (
                <p className="mt-4 text-sm font-extrabold text-[var(--p)]">{it.price}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function TestimonialsSection({ p }: { p: any }) {
  const items: Array<{ quote: string; name: string; role?: string }> = p.items || [];
  return (
    <Section>
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-[var(--tx)]">{p.title}</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-[var(--bd)] bg-[var(--card)] p-6 shadow-sm">
              <p className="text-sm italic text-[var(--tx)] leading-relaxed">“{it.quote}”</p>
              <div className="mt-4 border-t border-[var(--bd)] pt-3">
                <p className="text-xs font-bold text-[var(--tx)]">{it.name}</p>
                {it.role && <p className="text-[11px] text-[var(--mu)]">{it.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function CtaBannerSection({ p }: { p: any }) {
  const { go } = useContext(SiteCtx);
  const cta = p.cta || { label: "Get Started Free", href: "/" };
  return (
    <Section alt>
      <div className="mx-auto max-w-5xl rounded-3xl p-10 sm:p-14 text-center text-white shadow-2xl" style={{ background: "linear-gradient(135deg, var(--p), var(--s))" }}>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{p.title}</h2>
        {p.subtitle && <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base opacity-90">{p.subtitle}</p>}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => go(cta.href)}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-xl transition hover:scale-105"
          >
            <span>{cta.label}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Section>
  );
}

export function FooterSection({ p }: { p: any }) {
  const { brand, go } = useContext(SiteCtx);
  const columns: Array<{ title: string; links: Array<{ label: string; href: string }> }> = p.columns || [];

  return (
    <footer className="border-t border-[var(--bd)] bg-[var(--bg)] py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between gap-8">
        <div>
          <p className="text-lg font-bold text-[var(--tx)]">{brand.name || "Brand"}</p>
          <p className="mt-1 text-xs text-[var(--mu)] max-w-sm">{p.tagline || brand.tagline || ""}</p>
        </div>
        <div className="flex gap-10">
          {columns.map((col, i) => (
            <div key={i}>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--tx)] mb-2">{col.title}</p>
              <div className="space-y-1">
                {col.links.map((link, j) => (
                  <button key={j} onClick={() => go(link.href)} className="block text-xs text-[var(--mu)] hover:text-[var(--tx)]">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export const REGISTRY: Record<string, React.ComponentType<{ p: any }>> = {
  navbar: NavbarSection,
  "hero-split": HeroSplitSection,
  "hero-center": HeroCenterSection,
  stats: StatsSection,
  "features-bento": FeaturesBentoSection,
  "product-grid": ProductGridSection,
  testimonials: TestimonialsSection,
  "cta-banner": CtaBannerSection,
  footer: FooterSection,
};
