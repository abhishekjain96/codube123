import type { SiteDoc } from "@/components/SiteRenderer";
import type { BinaryResult, ExportAnswers, PlanSummary } from "./types";

export function defaultAnswers(doc: SiteDoc): ExportAnswers {
  const brand = doc.brand || "My App";
  const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-app";
  return {
    projectName: slug,
    siteUrl: `https://${slug}.codube.app`,
    siteTitle: brand,
    siteDescription: doc.reply || `${brand} — built with Codube AI & REA.`,
    contactEmail: "hello@example.com",
    authPages: "include",
    deploy: "vercel",
  };
}

export function summarize(doc: SiteDoc, images: Record<string, string>): PlanSummary {
  const pages = doc.pages || [
    { slug: "home", name: "Home", sections: doc.sections || [] },
  ];
  let totalSections = 0;
  const typesSet = new Set<string>();
  let hasCart = false;
  let hasContact = false;
  let hasNewsletter = false;
  let hasAuthPages = false;

  const pageDetails = pages.map((p) => {
    const sc = p.sections?.length || 0;
    totalSections += sc;
    if (["login", "signup", "dashboard"].includes(p.slug.toLowerCase())) {
      hasAuthPages = true;
    }
    p.sections?.forEach((s) => {
      if (s.type) typesSet.add(s.type);
      if (s.type === "products") hasCart = true;
      if (s.type === "contact") hasContact = true;
      if (s.type === "cta" || s.type === "footer") hasNewsletter = true;
    });
    return {
      name: p.name || p.slug,
      slug: p.slug,
      path: `/${p.slug === "home" ? "" : p.slug}`,
      sections: sc,
    };
  });

  const imgCount = Object.keys(images).length;

  return {
    brand: doc.brand || "My App",
    totalPages: pages.length,
    totalSections,
    totalImages: Math.max(imgCount, 4),
    imagesReady: imgCount,
    imagesTotal: Math.max(imgCount, 4),
    imagesIncluded: Math.max(imgCount, 4),
    hasCart,
    hasContact,
    hasNewsletter,
    hasAuthPages,
    pages: pageDetails,
    types: Array.from(typesSet),
  };
}

export async function readTemplate(path: string): Promise<string> {
  try {
    const res = await fetch(`/export-template/${path}`);
    if (res.ok) return await res.text();
  } catch {}
  return "";
}

export async function fetchBinary(url: string): Promise<BinaryResult> {
  try {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return {
      bytes: new Uint8Array(buf),
      mime: res.headers.get("content-type") || "application/octet-stream",
    };
  } catch {
    return {
      bytes: new Uint8Array(),
      mime: "application/octet-stream",
    };
  }
}

export function downloadBytes(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes as any], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
