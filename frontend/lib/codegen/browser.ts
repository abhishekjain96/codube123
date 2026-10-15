import type { SiteDoc } from "@/components/SiteRenderer";
import { slugify } from "./build";
import type { BinaryResult, ExportAnswers } from "./types";

/** Reads one of the export templates from /public/export-template. */
export async function readTemplate(path: string): Promise<string> {
  const res = await fetch(`/export-template/${path}.tpl`);
  if (!res.ok) throw new Error(`Missing template: ${path}`);
  return res.text();
}

export async function fetchBinary(url: string): Promise<BinaryResult> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not download ${url}`);
  return { bytes: new Uint8Array(await res.arrayBuffer()), type: res.headers.get("content-type") ?? "" };
}

export function downloadBytes(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const AUTH = new Set(["login", "signup", "dashboard"]);

export type DocSummary = {
  brand: string;
  pages: { name: string; slug: string; sections: number }[];
  types: string[];
  hasAuthPages: boolean;
  hasCart: boolean;
  hasContact: boolean;
  hasNewsletter: boolean;
  imagesTotal: number;
  imagesReady: number;
};

/** Pages of the document, for both the old one-page shape and the new multi-page shape. */
function pagesOf(doc: SiteDoc) {
  if (doc.pages?.length) return doc.pages;
  const all = doc.sections ?? [];
  return [{ slug: "home", name: "Home", sections: all.filter((s) => s.type !== "navbar" && s.type !== "footer") }];
}

export function summarize(doc: SiteDoc, images: Record<string, string>): DocSummary {
  const pages = pagesOf(doc);
  const types = new Set<string>();
  const refs = new Set<string>();
  if (doc.logo) refs.add(doc.logo);
  for (const pg of pages) {
    for (const s of pg.sections) {
      types.add(s.type);
      if (s.image) refs.add(s.image);
      for (const it of s.items ?? []) if (it.image) refs.add(it.image);
    }
  }
  const ready = [...refs].filter((r) => r.startsWith("upload:") || !!images[r]).length;
  const footer = doc.footer ?? doc.sections?.find((s) => s.type === "footer");
  return {
    brand: doc.brand ?? "My Site",
    pages: pages.map((p) => ({ name: p.name, slug: p.slug, sections: p.sections.length })),
    types: [...types],
    hasAuthPages: pages.some((p) => AUTH.has(slugify(p.slug || p.name))),
    hasCart: types.has("products"),
    hasContact: types.has("contact"),
    hasNewsletter: !!footer?.newsletter,
    imagesTotal: refs.size,
    imagesReady: ready,
  };
}

/** Sensible starting answers, taken from the design. */
export function defaultAnswers(doc: SiteDoc): ExportAnswers {
  const pages = pagesOf(doc);
  const brand = doc.brand ?? doc.navbar?.brand ?? "My Site";
  const hero = pages.flatMap((p) => p.sections).find((s) => s.type === "hero");
  const emailItem = pages
    .flatMap((p) => p.sections)
    .filter((s) => s.type === "contact")
    .flatMap((s) => s.items ?? [])
    .find((it) => /@/.test(it.description ?? ""));
  const email = emailItem?.description?.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0] ?? "";
  return {
    projectName: slugify(brand),
    siteTitle: brand,
    siteDescription: (hero?.subtitle ?? `${brand} website`).slice(0, 160),
    siteUrl: "",
    contactEmail: email,
    authPages: "include",
    deploy: "vercel",
  };
}
