/* eslint-disable @typescript-eslint/no-explicit-any */
export type Link = { label: string; href: string };
export type Block = { type: string; props: Record<string, any> };
export type Page = { slug: string; title?: string; sections: Block[] };

export type SiteV2 = {
  brand: { name: string; tagline?: string; logoUrl?: string };
  theme: {
    primary?: string;
    secondary?: string;
    dark?: boolean;
    font?: string;
    radius?: string;
  };
  nav?: Link[];
  pages: Page[];
};
/** Returns the site only if it is the new multi-page format (sections carry `props`). */
export function parseSiteV2(raw: string | null | undefined): SiteV2 | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
    const ok =
      Array.isArray(d.pages) &&
      d.pages.length > 0 &&
      d.pages.some((p: { sections?: { props?: unknown }[] }) =>
        p.sections?.some((s) => s && typeof s.props === "object")
      );
    return ok ? (d as SiteV2) : null;
  } catch {
    return null;
  }
}