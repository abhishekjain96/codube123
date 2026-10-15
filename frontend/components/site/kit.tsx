"use client";
/* eslint-disable @next/next/no-img-element */

import { createContext, useContext, type ReactNode } from "react";
import { icons, Sparkles, type LucideIcon } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

export type Cta = { label: string; href: string };
export type Brand = { name: string; tagline?: string; logoUrl?: string };

export const GRAD = "linear-gradient(135deg, var(--p), var(--s))";

export const SiteCtx = createContext<{
  brand: Brand;
  go: (href: string) => void;
  slug: string;
}>({ brand: { name: "" }, go: () => {}, slug: "/" });

const Reveal = ScrollReveal;
export { Reveal };

/** Lucide icon by kebab-case name, e.g. "shield-check" */
export function Icon({ name, size = 20 }: { name?: string; size?: number }) {
  const pascal = (name || "sparkles")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join("");
  const C = (icons as Record<string, LucideIcon>)[pascal] ?? Sparkles;
  return <C size={size} />;
}

/** Real image if we have one, otherwise a branded gradient placeholder */
export function Img({
  src,
  alt,
  className = "",
  flat = false,
}: {
  src?: string;
  alt?: string;
  className?: string;
  flat?: boolean;
}) {
  const style = flat ? undefined : { borderRadius: "var(--r)" };
  if (src) {
    return <img src={src} alt={alt ?? ""} loading="lazy" className={`object-cover ${className}`} style={style} />;
  }
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`} style={{ background: GRAD, ...style }}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #fff 0, transparent 45%)" }} />
      <span className="relative flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
        <Sparkles size={12} /> AI image
      </span>
    </div>
  );
}

export function Section({ alt = false, children }: { alt?: boolean; children: ReactNode }) {
  return (
    <section className="px-6 py-16 @2xl:px-10 @2xl:py-28" style={{ background: alt ? "var(--alt)" : "var(--bg)" }}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Heading({ title, subtitle }: { title?: string; subtitle?: string }) {
  if (!title) return null;
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <h2 className="text-3xl font-extrabold tracking-tight @2xl:text-5xl" style={{ fontFamily: "var(--hf)" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base @2xl:text-lg" style={{ color: "var(--mu)" }}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

export function CtaButton({
  cta,
  kind = "primary",
  invert = false,
}: {
  cta?: Cta;
  kind?: "primary" | "ghost";
  invert?: boolean;
}) {
  const { go } = useContext(SiteCtx);
  if (!cta?.label) return null;
  const style = invert
    ? { background: "#fff", color: "#0f172a" }
    : kind === "primary"
    ? { background: GRAD, color: "#fff", boxShadow: "0 14px 30px -14px var(--p)" }
    : { border: "1px solid var(--bd)", color: "var(--tx)" };
  return (
    <button
      type="button"
      onClick={() => go(cta.href)}
      className="px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
      style={{ ...style, borderRadius: "var(--br)" }}
    >
      {cta.label}
    </button>
  );
}