"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

import { useContext, useState, type ReactNode } from "react";
import { Check, Menu, X } from "lucide-react";
import { CtaButton, GRAD, Heading, Icon, Img, Reveal, Section, SiteCtx, type Cta } from "./kit";
import { ChevronDown} from "lucide-react";

type P = Record<string, any>;
const img = (p: P) => p.image ?? p.imageUrl;

/* ---------- navbar ---------- */
function Navbar({ p }: { p: P }) {
  const { brand, go, slug } = useContext(SiteCtx);
  const [open, setOpen] = useState(false);
  const links: Cta[] = p.links ?? [];
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur"
      style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)", borderBottom: "1px solid var(--bd)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 @2xl:px-10">
        <button type="button" onClick={() => go("/")} className="flex items-center gap-2">
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: GRAD }}>
              {brand.name?.[0]}
            </span>
          )}
          <span className="text-lg font-extrabold" style={{ fontFamily: "var(--hf)" }}>{brand.name}</span>
        </button>

        <nav className="hidden items-center gap-7 text-sm @2xl:flex">
          {links.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => go(l.href)}
              className="transition hover:opacity-60"
              style={{ color: l.href === slug ? "var(--p)" : "var(--mu)", fontWeight: l.href === slug ? 600 : 400 }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {p.loginLabel && (
            <button type="button" onClick={() => go("/login")} className="hidden text-sm font-medium @2xl:block">
              {p.loginLabel}
            </button>
          )}
          <span className="hidden @2xl:block"><CtaButton cta={p.cta} /></span>
          <button type="button" className="@2xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-1 px-6 pb-4 @2xl:hidden">
          {links.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => { go(l.href); setOpen(false); }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm"
              style={{ color: "var(--mu)" }}
            >
              {l.label}
            </button>
          ))}
          <div className="pt-2"><CtaButton cta={p.cta} /></div>
        </div>
      )}
    </header>
  );
}

/* ---------- heroes ---------- */
function Blobs() {
  return (
    <>
      <div className="anim-blob pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ background: "var(--p)" }} />
      <div className="anim-blob pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full opacity-25 blur-3xl" style={{ background: "var(--s)", animationDelay: "-6s" }} />
    </>
  );
}

function Badge({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <span className="mb-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "color-mix(in srgb, var(--p) 12%, transparent)", color: "var(--p)" }}>
      {text}
    </span>
  );
}

function HeroSplit({ p }: { p: P }) {
  return (
    <section className="relative overflow-hidden px-6 py-16 @2xl:px-10 @2xl:py-28" style={{ background: "var(--bg)" }}>
      <Blobs />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 @4xl:grid-cols-2">
        <Reveal>
          <Badge text={p.badge} />
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight @2xl:text-6xl" style={{ fontFamily: "var(--hf)" }}>
            {p.title}
          </h1>
          <p className="mt-5 max-w-lg text-base @2xl:text-lg" style={{ color: "var(--mu)" }}>{p.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton cta={p.primaryCta} />
            <CtaButton cta={p.secondaryCta} kind="ghost" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl" style={{ background: GRAD }} />
            <Img src={img(p)} alt={p.imageAlt} className="relative aspect-[4/3] w-full shadow-2xl" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HeroCenter({ p }: { p: P }) {
  return (
    <section className="relative overflow-hidden px-6 py-20 text-center @2xl:px-10 @2xl:py-32" style={{ background: "var(--bg)" }}>
      <Blobs />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <Badge text={p.badge} />
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight @2xl:text-6xl" style={{ fontFamily: "var(--hf)" }}>
            {p.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base @2xl:text-lg" style={{ color: "var(--mu)" }}>{p.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaButton cta={p.primaryCta} />
            <CtaButton cta={p.secondaryCta} kind="ghost" />
          </div>
        </Reveal>
      </div>
      {img(p) && (
        <div className="relative mx-auto mt-14 max-w-5xl">
          <Img src={img(p)} alt={p.imageAlt} className="aspect-[16/8] w-full shadow-2xl" />
        </div>
      )}
    </section>
  );
}

/* ---------- stats ---------- */
function Stats({ p }: { p: P }) {
  const items: P[] = p.items ?? [];
  return (
    <Section alt>
      <div className="grid grid-cols-2 gap-8 text-center @4xl:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 80}>
            <p className="text-4xl font-extrabold @2xl:text-5xl" style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {it.value}
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--mu)" }}>{it.label}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- features ---------- */
function FeatureCard({ it, big }: { it: P; big: boolean }) {
  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden p-6 transition hover:-translate-y-1"
      style={{ background: "var(--card)", border: "1px solid var(--bd)", borderRadius: "var(--r)" }}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: GRAD }}>
        <Icon name={it.icon} size={20} />
      </span>
      <h3 className="mt-4 text-lg font-bold" style={{ fontFamily: "var(--hf)" }}>{it.title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--mu)" }}>{it.description}</p>
      {big && (
        <div className="mt-6 flex-1">
          <Img src={it.image} alt={it.title} className="h-full min-h-[160px] w-full" />
        </div>
      )}
    </div>
  );
}

function FeaturesBento({ p, plain = false }: { p: P; plain?: boolean }) {
  const items: P[] = p.items ?? [];
  const n = items.length;
  const span = (i: number) => {
    if (plain) return "";
    if (i === 0) return "@4xl:col-span-2 @4xl:row-span-2";
    if (n === 5 && i === 4) return "@4xl:col-span-2";
    return "";
  };
  return (
    <Section>
      <Heading title={p.title} subtitle={p.subtitle} />
      <div className="grid gap-4 @2xl:grid-cols-2 @4xl:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 70} className={`h-full ${span(i)}`}>
            <FeatureCard it={it} big={!plain && i === 0} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- products ---------- */
function ProductCard({ it }: { it: P }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="group h-full overflow-hidden transition hover:-translate-y-1" style={{ background: "var(--card)", border: "1px solid var(--bd)", borderRadius: "var(--r)" }}>
      <div className="relative overflow-hidden">
        <Img src={it.image} alt={it.title} flat className="aspect-[4/5] w-full transition duration-500 group-hover:scale-105" />
        {it.badge && (
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white" style={{ background: GRAD }}>
            {it.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold" style={{ fontFamily: "var(--hf)" }}>{it.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--mu)" }}>{it.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-extrabold">{it.price}</span>
          <button
            type="button"
            onClick={() => setAdded((a) => !a)}
            className="px-4 py-2 text-xs font-semibold transition"
            style={{
              borderRadius: "var(--br)",
              background: added ? "var(--tx)" : "transparent",
              color: added ? "var(--bg)" : "var(--tx)",
              border: "1px solid var(--bd)",
            }}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ p }: { p: P }) {
  const items: P[] = p.items ?? [];
  return (
    <Section alt>
      <Heading title={p.title} subtitle={p.subtitle} />
      <div className="grid gap-5 @2xl:grid-cols-2 @4xl:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 70} className="h-full">
            <ProductCard it={it} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- testimonials ---------- */
function Testimonials({ p }: { p: P }) {
  const items: P[] = p.items ?? [];
  return (
    <Section>
      <Heading title={p.title} />
      <div className="grid gap-5 @4xl:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 80} className="h-full">
            <figure className="flex h-full flex-col p-6" style={{ background: "var(--card)", border: "1px solid var(--bd)", borderRadius: "var(--r)" }}>
              <blockquote className="flex-1 text-sm leading-relaxed">&ldquo;{it.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {it.avatar ? (
                  <img src={it.avatar} alt={it.name} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: GRAD }}>
                    {it.name?.[0]}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold">{it.name}</p>
                  <p className="text-xs" style={{ color: "var(--mu)" }}>{it.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- cta + footer ---------- */
function CtaBanner({ p }: { p: P }) {
  return (
    <section className="px-6 py-16 @2xl:px-10 @2xl:py-24" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="relative overflow-hidden px-8 py-14 text-center text-white @2xl:px-16 @2xl:py-20" style={{ background: GRAD, borderRadius: "var(--r)" }}>
            <div className="anim-blob pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <h2 className="relative text-3xl font-extrabold tracking-tight @2xl:text-5xl" style={{ fontFamily: "var(--hf)" }}>{p.title}</h2>
            {p.subtitle && <p className="relative mx-auto mt-4 max-w-xl text-white/85">{p.subtitle}</p>}
            <div className="relative mt-8 flex justify-center"><CtaButton cta={p.cta} invert /></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ p }: { p: P }) {
  const { brand, go } = useContext(SiteCtx);
  const cols: P[] = p.columns ?? [];
  return (
    <footer className="px-6 py-14 @2xl:px-10" style={{ background: "var(--alt)", borderTop: "1px solid var(--bd)" }}>
      <div className="mx-auto grid max-w-6xl gap-10 @4xl:grid-cols-[1.4fr_2fr]">
        <div>
          <p className="text-xl font-extrabold" style={{ fontFamily: "var(--hf)" }}>{brand.name}</p>
          <p className="mt-2 max-w-xs text-sm" style={{ color: "var(--mu)" }}>{p.tagline ?? brand.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(p.socials ?? []).map((s: string) => (
              <span key={s} className="rounded-full px-3 py-1 text-xs capitalize" style={{ border: "1px solid var(--bd)", color: "var(--mu)" }}>{s}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 @2xl:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold">{c.title}</p>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--mu)" }}>
                {(c.links ?? []).map((l: Cta) => (
                  <li key={l.label}>
                    <button type="button" onClick={() => go(l.href)} className="transition hover:opacity-60">{l.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs" style={{ color: "var(--mu)" }}>
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </p>
    </footer>
  );
}
/* ---------- more sections ---------- */
const CARD = { background: "var(--card)", border: "1px solid var(--bd)", borderRadius: "var(--r)" } as const;
const FIELD = { background: "var(--bg)", color: "var(--tx)", borderColor: "var(--bd)", borderRadius: "var(--br)" } as const;
const FIELD_CLS = "w-full border px-4 py-3 text-sm outline-none transition focus:border-[var(--p)]";

function Pricing({ p }: { p: P }) {
  const items: P[] = p.items ?? [];
  return (
    <Section>
      <Heading title={p.title} subtitle={p.subtitle} />
      <div className="grid items-stretch gap-5 @4xl:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 80} className="h-full">
            <div
              className="relative flex h-full flex-col p-7"
              style={{
                ...CARD,
                border: it.highlighted ? "2px solid var(--p)" : CARD.border,
                boxShadow: it.highlighted ? "0 30px 60px -30px var(--p)" : undefined,
              }}
            >
              {it.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-semibold text-white" style={{ background: GRAD }}>
                  Most popular
                </span>
              )}
              <h3 className="font-bold" style={{ fontFamily: "var(--hf)" }}>{it.title}</h3>
              <p className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-extrabold">{it.price}</span>
                <span className="pb-1 text-sm" style={{ color: "var(--mu)" }}>{it.period}</span>
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--mu)" }}>{it.description}</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {(it.features ?? []).map((f: string) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: "var(--p)" }} /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <CtaButton cta={{ label: it.cta ?? "Get started", href: "/signup" }} kind={it.highlighted ? "primary" : "ghost"} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Faq({ p }: { p: P }) {
  const items: P[] = p.items ?? [];
  return (
    <Section alt>
      <Heading title={p.title} subtitle={p.subtitle} />
      <div className="mx-auto max-w-2xl space-y-3">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 50}>
            <details className="group px-5 py-4" style={CARD}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold">
                {it.question}
                <ChevronDown size={18} className="shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--mu)" }}>{it.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SplitImage({ p }: { p: P }) {
  return (
    <Section>
      <div className="grid items-center gap-12 @4xl:grid-cols-2">
        <Reveal className={p.reverse ? "@4xl:order-2" : ""}>
          <Img src={img(p)} alt={p.imageAlt} className="aspect-[4/3] w-full shadow-2xl" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="text-3xl font-extrabold tracking-tight @2xl:text-4xl" style={{ fontFamily: "var(--hf)" }}>{p.title}</h2>
          <p className="mt-4" style={{ color: "var(--mu)" }}>{p.text}</p>
          <ul className="mt-6 space-y-3">
            {(p.bullets ?? []).map((b: string) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: GRAD }}>
                  <Check size={12} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

function Gallery({ p }: { p: P }) {
  const items: P[] = p.items ?? [];
  return (
    <Section alt>
      <Heading title={p.title} subtitle={p.subtitle} />
      <div className="grid grid-cols-2 gap-4 @4xl:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={i} delay={(i % 3) * 70}>
            <div className="group relative overflow-hidden">
              <Img src={it.image} alt={it.caption} className="aspect-square w-full transition duration-500 group-hover:scale-105" />
              {it.caption && (
                <span className="absolute inset-x-3 bottom-3 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                  {it.caption}
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ContactForm({ p }: { p: P }) {
  const [sent, setSent] = useState(false);
  const rows = [["mail", p.email], ["phone", p.phone], ["map-pin", p.address]].filter((r) => r[1]);
  const fields: string[] = p.fields?.length ? p.fields : ["name", "email", "message"];
  return (
    <Section>
      <Heading title={p.title} subtitle={p.subtitle} />
      <div className="grid gap-8 @4xl:grid-cols-2">
        <div className="space-y-4">
          {rows.map(([icon, text]) => (
            <Reveal key={icon}>
              <div className="flex items-center gap-4 p-5" style={CARD}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: GRAD }}>
                  <Icon name={icon} size={18} />
                </span>
                <span className="text-sm">{text}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={100}>
          <form
            className="space-y-3 p-6"
            style={CARD}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {sent ? (
              <div className="py-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ background: GRAD }}>
                  <Check size={22} />
                </span>
                <p className="mt-4 font-bold">Message sent</p>
                <p className="mt-1 text-sm" style={{ color: "var(--mu)" }}>Preview only: nothing is saved yet.</p>
              </div>
            ) : (
              <>
                {fields.map((f) =>
                  f === "message" ? (
                    <textarea key={f} required rows={5} placeholder="How can we help?" className={FIELD_CLS} style={FIELD} />
                  ) : (
                    <input
                      key={f}
                      required
                      type={f === "email" ? "email" : f === "phone" ? "tel" : "text"}
                      placeholder={f[0].toUpperCase() + f.slice(1)}
                      className={FIELD_CLS}
                      style={FIELD}
                    />
                  )
                )}
                <button type="submit" className="w-full py-3 text-sm font-semibold text-white" style={{ background: GRAD, borderRadius: "var(--br)" }}>
                  Send message
                </button>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Auth({ p, mode }: { p: P; mode: "login" | "signup" }) {
  const { brand, go } = useContext(SiteCtx);
  const signup = mode === "signup";
  const perks: string[] = p.perks ?? [];
  return (
    <section className="grid min-h-[620px] @4xl:grid-cols-2" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--hf)" }}>
            {p.title ?? (signup ? "Create your account" : "Welcome back")}
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--mu)" }}>
            {p.subtitle ?? (signup ? "It only takes a minute." : "Log in to continue.")}
          </p>
          <form
            className="mt-7 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              go("/dashboard");
            }}
          >
            {signup && <input required placeholder="Full name" className={FIELD_CLS} style={FIELD} />}
            <input required type="email" placeholder="Email address" className={FIELD_CLS} style={FIELD} />
            <input required type="password" placeholder="Password" className={FIELD_CLS} style={FIELD} />
            <button type="submit" className="w-full py-3 text-sm font-semibold text-white" style={{ background: GRAD, borderRadius: "var(--br)" }}>
              {signup ? "Create account" : "Log in"}
            </button>
          </form>
          <p className="mt-6 text-sm" style={{ color: "var(--mu)" }}>
            {signup ? "Already have an account? " : "New here? "}
            <button type="button" onClick={() => go(signup ? "/login" : "/signup")} className="font-semibold" style={{ color: "var(--p)" }}>
              {signup ? "Log in" : "Sign up"}
            </button>
          </p>
          <p className="mt-5 text-xs" style={{ color: "var(--mu)" }}>Preview only: nothing is saved yet.</p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden @4xl:block">
        <Img src={img(p)} alt={brand.name} flat className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="text-2xl font-extrabold" style={{ fontFamily: "var(--hf)" }}>{brand.name}</p>
          {!signup && p.quote && <p className="mt-3 max-w-sm text-white/85">&ldquo;{p.quote}&rdquo;</p>}
          {signup && (
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              {perks.map((x) => (
                <li key={x} className="flex items-center gap-2"><Check size={15} /> {x}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function DashboardShell({ p }: { p: P }) {
  const { brand } = useContext(SiteCtx);
  const [tab, setTab] = useState(0);
  const side: P[] = p.sidebar ?? [];
  const stats: P[] = p.stats ?? [];
  const cols: string[] = p.tableColumns ?? [];
  const rows: unknown[][] = p.tableRows ?? [];
  const bars = [38, 62, 48, 80, 58, 92, 74];
  return (
    <section className="px-4 py-10 @2xl:px-8" style={{ background: "var(--alt)" }}>
      <div className="mx-auto grid max-w-6xl overflow-hidden @4xl:grid-cols-[220px_1fr]" style={CARD}>
        <aside className="p-5" style={{ borderRight: "1px solid var(--bd)" }}>
          <p className="text-lg font-extrabold" style={{ fontFamily: "var(--hf)" }}>{brand.name}</p>
          <ul className="mt-6 space-y-1">
            {side.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setTab(i)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition"
                  style={{
                    borderRadius: "var(--br)",
                    background: tab === i ? "color-mix(in srgb, var(--p) 14%, transparent)" : "transparent",
                    color: tab === i ? "var(--p)" : "var(--mu)",
                  }}
                >
                  <Icon name={s.icon} size={16} /> {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="p-6 @2xl:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold" style={{ fontFamily: "var(--hf)" }}>{side[tab]?.label ?? p.title}</h2>
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: "color-mix(in srgb, var(--p) 14%, transparent)", color: "var(--p)" }}>
              Sample data
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 @4xl:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="p-4" style={{ ...CARD, background: "var(--bg)" }}>
                <p className="text-xs" style={{ color: "var(--mu)" }}>{s.label}</p>
                <p className="mt-1 text-2xl font-extrabold" style={{ fontFamily: "var(--hf)" }}>{s.value}</p>
                {s.change && <p className="mt-1 text-xs font-semibold text-emerald-500">{s.change}</p>}
              </div>
            ))}
          </div>

          <div className="mt-5 p-5" style={{ ...CARD, background: "var(--bg)" }}>
            <p className="text-sm font-bold">Last 7 days</p>
            <div className="mt-4 flex h-32 items-end gap-3">
              {bars.map((h, i) => (
                <div key={i} className="flex-1" style={{ height: `${h}%`, background: GRAD, borderRadius: "8px 8px 2px 2px", opacity: 0.9 }} />
              ))}
            </div>
          </div>

          {cols.length > 0 && (
            <div className="mt-5 overflow-x-auto" style={{ ...CARD, background: "var(--bg)" }}>
              {p.tableTitle && <p className="px-4 pt-4 text-sm font-bold">{p.tableTitle}</p>}
              <table className="mt-2 w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr style={{ color: "var(--mu)", borderBottom: "1px solid var(--bd)" }}>
                    {cols.map((c) => (
                      <th key={c} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--bd)" : "none" }}>
                      {r.map((c, j) => (
                        <td key={j} className="px-4 py-3">{String(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
/* ---------- registry ---------- */
export const REGISTRY: Record<string, (props: { p: P }) => ReactNode> = {
  navbar: Navbar,
  "hero-split": HeroSplit,
  "hero-center": HeroCenter,
  stats: Stats,
  "features-bento": FeaturesBento,
  "features-grid": ({ p }) => <FeaturesBento p={p} plain />,
  "product-grid": ProductGrid,
  testimonials: Testimonials,
  "cta-banner": CtaBanner,
  footer: Footer,
  pricing: Pricing,
  faq: Faq,
  "split-image": SplitImage,
  gallery: Gallery,
  "contact-form": ContactForm,
  "auth-login": ({ p }) => <Auth p={p} mode="login" />,
  "auth-signup": ({ p }) => <Auth p={p} mode="signup" />,
  "dashboard-shell": DashboardShell,
};

