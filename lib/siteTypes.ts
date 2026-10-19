export type FontChoice = "modern" | "elegant" | "bold" | "friendly";
export type RadiusChoice = "sharp" | "soft" | "round";

export interface SectionV2 {
  type: string;
  props: Record<string, any>;
}

export interface PageV2 {
  slug: string;
  title?: string;
  name?: string;
  sections: SectionV2[];
}

export interface SiteV2 {
  brand: {
    name: string;
    tagline?: string;
    logoUrl?: string;
  };
  theme: {
    primary?: string;
    secondary?: string;
    accent?: string;
    accent2?: string;
    dark?: boolean;
    font?: FontChoice;
    radius?: RadiusChoice;
  };
  nav?: Array<{ label: string; href: string }>;
  pages: PageV2[];
}

export function parseSiteV2(raw: string | null | undefined): SiteV2 | null {
  if (!raw) return null;
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    const text = raw.slice(start, end + 1);
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.pages)) {
      return parsed as SiteV2;
    }
  } catch {}
  return null;
}
