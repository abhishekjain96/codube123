"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { SiteV2 } from "@/lib/siteTypes";
import { SiteCtx } from "./kit";
import { REGISTRY } from "./sections";

const hex = (v: string | undefined, fb: string) => (v && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fb);
const RADII: Record<string, string> = { sharp: "6px", soft: "18px", round: "28px" };
const FONTS: Record<string, string> = {
  modern: "var(--font-inter), system-ui, sans-serif",
  elegant: "var(--font-playfair), Georgia, serif",
  bold: "var(--font-space), system-ui, sans-serif",
  friendly: "var(--font-poppins), system-ui, sans-serif",
};

export default function SiteRendererV2({
  site,
  initialSlug = "/",
  page: pageProp,
  onPageChange,
}: {
  site: SiteV2;
  initialSlug?: string;
  page?: string;
  onPageChange?: (slug: string) => void;
}) {
  // the builder can control the page from outside; /demo pages control it themselves
  const [localSlug, setLocalSlug] = useState(initialSlug);
  const slug = pageProp ?? localSlug;
  const rootRef = useRef<HTMLDivElement>(null);

  const t = site.theme ?? {};
  const dark = !!t.dark;
  const radius = RADII[t.radius ?? "soft"] ?? RADII.soft;

  const vars = {
    "--p": hex(t.primary, "#2563eb"),
    "--s": hex(t.secondary, "#7c3aed"),
    "--bg": dark ? "#0a0a12" : "#ffffff",
    "--alt": dark ? "#10101c" : "#f8fafc",
    "--card": dark ? "#15152a" : "#ffffff",
    "--bd": dark ? "rgba(255,255,255,.09)" : "rgba(15,23,42,.08)",
    "--mu": dark ? "#a1a1b5" : "#64748b",
    "--tx": dark ? "#ffffff" : "#0f172a",
    "--r": radius,
    "--br": t.radius === "round" ? "9999px" : radius,
    "--hf": FONTS[t.font ?? "modern"] ?? FONTS.modern,
  } as CSSProperties;

  const page = site.pages.find((p) => p.slug === slug) ?? site.pages[0];
  if (!page) return null;

  function go(href: string) {
    if (!href || /^(https?:|mailto:|tel:)/.test(href)) return;
    const clean = href.split("#")[0] || "/";
    if (site.pages.some((p) => p.slug === clean)) {
      setLocalSlug(clean);
      onPageChange?.(clean);
      requestAnimationFrame(() => rootRef.current?.scrollIntoView({ block: "start" }));
    }
  }

  return (
    <SiteCtx.Provider value={{ brand: site.brand, go, slug: page.slug }}>
      <div
        ref={rootRef}
        className="@container"
        style={{ ...vars, background: "var(--bg)", color: "var(--tx)", fontFamily: FONTS.modern }}
      >
        {page.sections.map((b, i) => {
          const C = REGISTRY[b.type];
          if (!C) {
            // the AI used a section type we have no component for
            return (
              <div
                key={`${page.slug}-${i}`}
                className="px-6 py-10 text-center text-xs"
                style={{ background: "var(--alt)", color: "var(--mu)", borderTop: "1px dashed var(--bd)" }}
              >
                Unsupported section: “{b.type}”
              </div>
            );
          }
          return <C key={`${page.slug}-${i}`} p={b.props ?? {}} />;
        })}
      </div>
    </SiteCtx.Provider>
  );
}