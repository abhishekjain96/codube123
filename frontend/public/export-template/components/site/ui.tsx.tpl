import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { NavLink, Section } from "@/content/types";
import { Reveal } from "./Reveal";
import { P } from "./theme";

/** A link that looks like a button. */
export function ButtonLink({
  link,
  kind = "primary",
  full = false,
  children,
}: {
  link?: NavLink;
  kind?: "primary" | "ghost";
  full?: boolean;
  children?: ReactNode;
}) {
  if (!link) return null;
  const style: CSSProperties = {
    ...(kind === "primary"
      ? { background: P.grad, color: "#fff", boxShadow: `0 12px 30px -12px ${P.accent}` }
      : { border: `1px solid ${P.border}`, color: P.text, background: "transparent" }),
    borderRadius: P.btnRadius,
  };
  return (
    <Link
      href={link.href}
      className={`px-5 py-2.5 text-center text-sm font-semibold transition hover:-translate-y-0.5 active:translate-y-0 ${full ? "block w-full" : "inline-block"}`}
      style={style}
    >
      {children ?? link.label}
    </Link>
  );
}

/** A real <button> with the same look, for forms. */
export function SubmitButton({
  children,
  full = false,
  disabled = false,
}: {
  children: ReactNode;
  full?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`px-5 py-2.5 text-center text-sm font-semibold transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 ${full ? "block w-full" : "inline-block"}`}
      style={{
        background: P.grad,
        color: "#fff",
        boxShadow: `0 12px 30px -12px ${P.accent}`,
        borderRadius: P.btnRadius,
      }}
    >
      {children}
    </button>
  );
}

/** An image with a coloured fallback behind it. */
export function Pic({
  src,
  alt = "",
  className = "",
  style,
  fallback,
  children,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  fallback: ReactNode;
  children?: ReactNode;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <div className="absolute inset-0">{fallback}</div>
      {src && <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />}
      {children}
    </div>
  );
}

/** A full-width band with a centred column inside. */
export function Band({ alt, children }: { alt: boolean; children: ReactNode }) {
  return (
    <section className="px-6 py-16 @2xl:px-10 @2xl:py-24" style={{ background: alt ? P.alt : P.bg }}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

/** Section title and subtitle. */
export function Head({ s }: { s: Section }) {
  if (!s.title) return null;
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <h2
        className="block text-3xl font-extrabold tracking-tight @2xl:text-4xl"
        style={{ fontFamily: P.heading }}
      >
        {s.title}
      </h2>
      {s.subtitle && (
        <p className="mt-3" style={{ color: P.muted }}>
          {s.subtitle}
        </p>
      )}
    </Reveal>
  );
}
