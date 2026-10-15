import JSZip from "jszip";
import type { Item, Section, SiteDoc } from "@/components/SiteRenderer";
import type {
  BinaryResult,
  CheckResult,
  ExportAnswers,
  FileKind,
  GenEvent,
  GenFile,
  PlanSummary,
  PlannedFile,
} from "./types";

export type GenOptions = {
  doc: SiteDoc;
  answers: ExportAnswers;
  /** AI image prompt to image url (absolute) for images that are ready */
  images: Record<string, string>;
  apiBase: string;
  readTemplate: (path: string) => Promise<string>;
  fetchBinary: (url: string) => Promise<BinaryResult>;
  signal?: AbortSignal;
  now?: Date;
  /** Plan only: list the files and warnings without downloading images or writing anything. */
  dryRun?: boolean;
};

/* ------------------------------------------------------------------ */
/* constants                                                            */
/* ------------------------------------------------------------------ */

const NEXT_VERSION = "16.3.8";
const REACT_VERSION = "19.3.0";
const LUCIDE_VERSION = "^1.52.0";

const SECTION_TYPES = [
  "hero", "stats", "features", "bento", "marquee", "steps", "products", "split",
  "team", "testimonials", "pricing", "faq", "contact", "cta", "auth", "dashboard",
] as const;

const SECTION_COMPONENT: Record<string, string> = {
  hero: "Hero", stats: "Stats", features: "Features", bento: "Bento", marquee: "Marquee",
  steps: "Steps", products: "Products", split: "Split", team: "Team",
  testimonials: "Testimonials", pricing: "Pricing", faq: "Faq", contact: "Contact",
  cta: "Cta", auth: "Auth", dashboard: "Dashboard",
};

const BANDED = new Set([
  "stats", "features", "bento", "steps", "products", "split", "team",
  "testimonials", "pricing", "faq", "contact",
]);

const AUTH_SLUGS = new Set(["login", "signup", "dashboard"]);

const FONT_MAP = {
  modern: { fn: "Inter", varName: "--font-inter", css: "var(--font-inter), system-ui, sans-serif" },
  elegant: { fn: "Playfair_Display", varName: "--font-playfair", css: "var(--font-playfair), Georgia, serif" },
  bold: { fn: "Space_Grotesk", varName: "--font-space", css: "var(--font-space), system-ui, sans-serif" },
  friendly: { fn: "Poppins", varName: "--font-poppins", css: "var(--font-poppins), system-ui, sans-serif" },
} as const;
type FontKey = keyof typeof FONT_MAP;

const RADII = { sharp: "6px", soft: "16px", round: "28px" } as const;
type RadiusKey = keyof typeof RADII;

/* ------------------------------------------------------------------ */
/* small helpers                                                        */
/* ------------------------------------------------------------------ */

export function slugify(s: string) {
  return (
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "page"
  );
}

function pascal(slug: string) {
  const p = slug
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return /^[A-Za-z]/.test(p) ? p : `P${p}`;
}

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;
const strs = (v: unknown): string[] | undefined =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x.trim()) : undefined;
const hex = (v: unknown, fallback: string) =>
  typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;

function pkgName(name: string) {
  return slugify(name).slice(0, 60) || "my-site";
}

function indent(json: unknown) {
  return JSON.stringify(json, null, 2);
}

function ext(type: string, url: string) {
  if (/png/i.test(type)) return "png";
  if (/jpe?g/i.test(type)) return "jpg";
  if (/webp/i.test(type)) return "webp";
  const m = url.match(/\.(png|jpe?g|webp)(\?|$)/i);
  if (m) return m[1].toLowerCase().replace("jpeg", "jpg");
  return "png";
}

function normalizeDoc(doc: SiteDoc) {
  if (doc.pages?.length) {
    return { navbar: doc.navbar, footer: doc.footer, pages: doc.pages };
  }
  const all = doc.sections ?? [];
  return {
    navbar: all.find((s) => s.type === "navbar"),
    footer: all.find((s) => s.type === "footer"),
    pages: [
      {
        slug: "home",
        name: "Home",
        sections: all.filter((s) => s.type !== "navbar" && s.type !== "footer"),
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* the main generator                                                   */
/* ------------------------------------------------------------------ */

type PagePlan = { slug: string; name: string; path: string; sections: Section[] };
type Link = { label: string; href: string };
type Entry = { path: string; kind: FileKind; make: () => Promise<GenFile> };

export async function* generateProject(o: GenOptions): AsyncGenerator<GenEvent> {
  const { doc, answers } = o;
  const now = o.now ?? new Date();
  const check = () => {
    if (o.signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  };

  /* ---------- stage 1: read ---------- */
  yield { type: "stage", id: "read", status: "active" };
  const norm = normalizeDoc(doc);
  const brand = str(doc.brand) ?? str(norm.navbar?.brand) ?? "My Site";
  yield { type: "log", stage: "read", text: `Reading the design for "${brand}"` };

  const skipAuth = answers.authPages === "skip";
  const rawPages = norm.pages.filter((pg) => !(skipAuth && AUTH_SLUGS.has(slugify(pg.slug || pg.name))));
  const removedAuth = norm.pages.length - rawPages.length;
  const sectionCount = rawPages.reduce((n, pg) => n + pg.sections.length, 0);
  yield {
    type: "log",
    stage: "read",
    text: `Found ${rawPages.length} page${rawPages.length === 1 ? "" : "s"} and ${sectionCount} sections`,
  };
  if (removedAuth > 0) {
    yield { type: "log", stage: "read", text: `Leaving out ${removedAuth} login and dashboard page${removedAuth === 1 ? "" : "s"} as you asked` };
  }
  yield { type: "stage", id: "read", status: "done" };
  check();

  /* ---------- stage 2: plan ---------- */
  yield { type: "stage", id: "plan", status: "active" };

  // pages and routes
  const taken = new Set<string>();
  const pages: PagePlan[] = rawPages.map((pg, idx) => {
    let slug = slugify(pg.slug || pg.name);
    if (idx === 0 && !rawPages.some((p) => slugify(p.slug || p.name) === "home")) slug = "home";
    if (slug === "api") slug = "api-page";
    const base = slug;
    let n = 2;
    while (taken.has(slug)) slug = `${base}-${n++}`;
    taken.add(slug);
    return {
      slug,
      name: str(pg.name) ?? slug,
      path: slug === "home" ? "/" : `/${slug}`,
      sections: pg.sections ?? [],
    };
  });
  if (!pages.length) throw new Error("The site has no pages to export.");

  const pageBy = (slug: string) => pages.find((p) => p.slug === slug);
  const hasPage = (slug: string) => !!pageBy(slug);
  const contactEmail = answers.contactEmail.trim();
  const deadLinks: string[] = [];

  /** Turns a button or link label into a real address, the same way the preview does. */
  function resolve(label: string, where: string): string | null {
    const l = label.toLowerCase().trim();
    const exact = pages.find((p) => p.slug === l || p.name.toLowerCase() === l);
    if (exact) return exact.path;
    if (/log ?in|sign ?in/.test(l)) return skipAuth ? null : (pageBy("login")?.path ?? null);
    if (/sign ?up|register|create account/.test(l) && !skipAuth && hasPage("signup")) return pageBy("signup")!.path;
    if (/dashboard|account/.test(l)) return skipAuth ? null : (pageBy("dashboard")?.path ?? null);
    if (/join|get started|start|try/.test(l) && !skipAuth && hasPage("signup")) return pageBy("signup")!.path;
    if (/contact|book|talk|quote|reserve|demo|call|visit/.test(l) && hasPage("contact")) return pageBy("contact")!.path;
    const main = ["shop", "products", "menu", "services", "courses", "pricing"].find(hasPage);
    if (main && /shop|buy|order|menu|product|explore|browse|view|pricing|plans/.test(l)) return pageBy(main)!.path;
    if (hasPage("about") && /about|story|team|mission|learn|more|how it works|watch|discover/.test(l)) return pageBy("about")!.path;
    if (/contact|book|talk|quote|reserve|demo|call|visit|join|get started|start|order/.test(l)) {
      if (hasPage("contact")) return pageBy("contact")!.path;
      if (contactEmail) return `mailto:${contactEmail}`;
    }
    deadLinks.push(`"${label}" (${where})`);
    return "#";
  }

  const link = (label: string | undefined, where: string): Link | undefined => {
    if (!str(label)) return undefined;
    const href = resolve(label!, where);
    return href === null ? undefined : { label: label!, href };
  };

  // images
  type ImgRef = { ref: string; hint: string };
  const refs: ImgRef[] = [];
  const seen = new Set<string>();
  const addRef = (ref: string | undefined, hint: string) => {
    if (!ref || !ref.trim() || seen.has(ref)) return;
    seen.add(ref);
    refs.push({ ref, hint });
  };
  addRef(doc.logo, "logo");
  for (const pg of pages) {
    for (const s of pg.sections) {
      addRef(s.image, `${pg.slug}-${s.type}`);
      for (const it of s.items ?? []) {
        addRef(it.image, `${s.type}-${slugify(it.title ?? it.name ?? "item")}`);
      }
    }
  }

  const imageFiles = new Map<string, GenFile>(); // public path -> file
  const imagePath = new Map<string, string>(); // ref -> public path
  let pending = 0;
  let failed = 0;
  if (refs.length) {
    yield { type: "log", stage: "plan", text: `Preparing ${refs.length} image${refs.length === 1 ? "" : "s"}` };
  }
  let n = 0;
  for (const r of refs) {
    check();
    const url = r.ref.startsWith("upload:")
      ? r.ref.slice(7).startsWith("/") ? o.apiBase + r.ref.slice(7) : undefined
      : o.images[r.ref];
    if (!url) {
      pending++;
      yield { type: "log", stage: "plan", level: "warn", text: `Image for ${r.hint} is not ready yet, using a placeholder` };
      continue;
    }
    if (o.dryRun) {
      n++;
      const publicPath = `/images/${slugify(r.hint).slice(0, 36)}-${n}.png`;
      imageFiles.set(publicPath, { path: `public${publicPath}`, kind: "asset", bytes: new Uint8Array(0) });
      imagePath.set(r.ref, publicPath);
      continue;
    }
    try {
      const got = await o.fetchBinary(url);
      n++;
      const name = `${slugify(r.hint).slice(0, 36)}-${n}.${ext(got.type, url)}`;
      const publicPath = `/images/${name}`;
      imageFiles.set(publicPath, { path: `public/images/${name}`, kind: "asset", bytes: got.bytes });
      imagePath.set(r.ref, publicPath);
      yield { type: "log", stage: "plan", text: `Downloaded ${name} (${Math.round(got.bytes.length / 1024)} KB)` };
    } catch {
      failed++;
      yield { type: "log", stage: "plan", level: "warn", text: `Could not download the image for ${r.hint}, using a placeholder` };
    }
  }
  const img = (ref?: string) => (ref ? imagePath.get(ref) : undefined);

  // theme
  const t = doc.theme ?? {};
  const fontKey: FontKey = (["modern", "elegant", "bold", "friendly"] as const).includes(t.font as FontKey)
    ? (t.font as FontKey)
    : "modern";
  const radiusKey: RadiusKey = (["sharp", "soft", "round"] as const).includes(t.radius as RadiusKey)
    ? (t.radius as RadiusKey)
    : "soft";
  const theme = {
    accent: hex(t.accent, "#2563eb"),
    accent2: hex(t.accent2, "#7c3aed"),
    dark: !!t.dark,
    font: fontKey,
    radius: radiusKey,
  };

  // sections
  const skipped: string[] = [];
  const usedTypes = new Set<string>();
  let spotlight = false;

  const cleanItem = (it: Item, sectionType: string, where: string) => {
    const out: Record<string, unknown> = {};
    for (const k of ["icon", "emoji", "title", "description", "price", "badge", "value", "label", "quote", "name", "role", "question", "answer", "cta", "stat", "change"] as const) {
      const v = str(it[k]);
      if (v !== undefined) out[k] = v;
    }
    const feats = strs(it.features);
    if (feats?.length) out.features = feats;
    if (it.highlighted) out.highlighted = true;
    if (it.size === "large" || it.size === "small") out.size = it.size;
    const im = img(it.image);
    if (im) out.image = im;
    if (sectionType === "pricing") {
      const signup = pageBy("signup")?.path ?? pageBy("contact")?.path ?? "#";
      out.href = signup;
    }
    void where;
    return out;
  };

  const cleanSection = (s: Section, pg: PagePlan) => {
    if (!(SECTION_TYPES as readonly string[]).includes(s.type)) {
      skipped.push(`"${s.type}" on ${pg.name}`);
      return null;
    }
    usedTypes.add(s.type);
    const where = `${s.type} on ${pg.name}`;
    const out: Record<string, unknown> = { type: s.type };
    for (const k of ["variant", "badge", "title", "subtitle", "text", "layout", "visual"] as const) {
      const v = str(s[k]);
      if (v !== undefined) out[k] = v;
    }
    if (s.type === "hero" && s.variant === "spotlight") spotlight = true;
    if (s.reverse) out.reverse = true;
    if (s.mode === "login" || s.mode === "signup") out.mode = s.mode;
    const bullets = strs(s.bullets);
    if (bullets?.length) out.bullets = bullets;
    const floaters = strs(s.floaters);
    if (floaters?.length) out.floaters = floaters;
    const links = strs(s.links);
    if (links?.length) out.links = links;
    const headers = strs(s.headers);
    if (headers?.length) out.headers = headers;
    if (Array.isArray(s.rows)) out.rows = s.rows.map((r) => (Array.isArray(r) ? r.map((c) => String(c)) : []));
    const im = img(s.image);
    if (im) out.image = im;
    if (s.type === "auth") {
      const dash = pageBy("dashboard")?.path;
      const label = str(s.cta);
      if (label) out.cta = { label, href: dash ?? "#" };
    } else {
      const c1 = link(s.cta, where);
      const c2 = link(s.cta2, where);
      if (c1) out.cta = c1;
      if (c2) out.cta2 = c2;
    }
    if (Array.isArray(s.items)) out.items = s.items.map((it) => cleanItem(it, s.type, where));
    return out;
  };

  const pageData = pages.map((pg) => ({
    slug: pg.slug,
    path: pg.path,
    name: pg.name,
    sections: pg.sections.map((s) => cleanSection(s, pg)).filter((x): x is Record<string, unknown> => !!x),
  }));

  // navigation
  const navLinks: Link[] = [];
  for (const label of strs(norm.navbar?.links) ?? []) {
    const l = link(label, "the menu");
    if (l) navLinks.push(l);
  }
  const navCta = link(str(norm.navbar?.cta), "the menu button");
  if (!navLinks.length) {
    for (const pg of pages) if (pg.slug !== "home" && !AUTH_SLUGS.has(pg.slug)) navLinks.push({ label: pg.name, href: pg.path });
  }

  const footerSrc = norm.footer;
  const columns: { title: string; links: Link[] }[] = [];
  const srcCols = Array.isArray(footerSrc?.columns) ? footerSrc!.columns! : [];
  for (const c of srcCols) {
    const ls: Link[] = [];
    for (const label of strs(c.links) ?? []) {
      const l = link(label, "the footer");
      if (l) ls.push(l);
    }
    if (ls.length) columns.push({ title: str(c.title) ?? "Links", links: ls });
  }
  if (!columns.length) {
    const fl = strs(footerSrc?.links) ?? strs(norm.navbar?.links) ?? [];
    const ls: Link[] = [];
    for (const label of fl) {
      const l = link(label, "the footer");
      if (l) ls.push(l);
    }
    if (ls.length) columns.push({ title: "Explore", links: ls });
  }

  for (const sk of skipped) {
    yield { type: "log", stage: "plan", level: "warn", text: `Skipping unsupported section ${sk}` };
  }
  for (const dl of [...new Set(deadLinks)]) {
    yield { type: "log", stage: "plan", level: "warn", text: `No page matches ${dl}, the link will point to #` };
  }

  const hasCart = usedTypes.has("products");
  const hasContactSection = usedTypes.has("contact");
  const hasNewsletter = !!footerSrc?.newsletter;

  const site = {
    brand,
    ...(img(doc.logo) ? { logo: img(doc.logo) } : {}),
    theme,
    navbar: { links: navLinks, ...(navCta ? { cta: navCta } : {}) },
    footer: {
      ...(str(footerSrc?.text) ? { text: footerSrc!.text } : {}),
      newsletter: hasNewsletter,
      copyright: str(footerSrc?.copyright) ?? `© ${now.getFullYear()} ${brand}. All rights reserved.`,
      columns,
    },
    pages: pageData,
    features: { cart: hasCart },
  };

  // component files to include
  const components: string[] = ["Reveal", "ui", "Cart", "Navbar", "Footer", "theme"];
  const sectionFiles = [...usedTypes].map((tpe) => SECTION_COMPONENT[tpe]);
  if (["features", "bento", "team"].some((x) => usedTypes.has(x))) components.push("Glow");
  if (usedTypes.has("products")) components.push("AddButton");
  if (usedTypes.has("hero")) components.push("Spotlight"); // the hero file imports it

  const componentNames = [...sectionFiles];
  const imagesIncluded = imageFiles.size;
  yield { type: "log", stage: "plan", text: `Routes: ${pages.map((p) => p.path).join("  ")}` };
  yield { type: "log", stage: "plan", text: `Components: ${componentNames.join(", ") || "none"}` };
  if (hasNewsletter || hasContactSection) {
    yield { type: "log", stage: "plan", text: `Adding API routes for ${[hasContactSection ? "the contact form" : "", hasNewsletter ? "the newsletter box" : ""].filter(Boolean).join(" and ")}` };
  }
  check();

  /* ---------- build the list of files ---------- */
  const entries: Entry[] = [];
  const add = (path: string, kind: FileKind, text: () => Promise<string> | string) =>
    entries.push({ path, kind, make: async () => ({ path, kind, text: await text() }) });
  const tpl = (src: string, out: string, kind: FileKind) => add(out, kind, () => o.readTemplate(src));

  const name = pkgName(answers.projectName || brand);
  const siteBase = answers.siteUrl.trim().replace(/\/+$/, "") || "http://localhost:3000";
  const siteTitle = answers.siteTitle.trim() || brand;
  const siteDesc = answers.siteDescription.trim() || str(pageData[0]?.sections.find((s) => s.type === "hero")?.subtitle) || `${brand} website`;

  add("package.json", "config", () =>
    indent({
      name,
      version: "0.1.0",
      private: true,
      scripts: { dev: "next dev", build: "next build", start: "next start", lint: "eslint" },
      dependencies: {
        "lucide-react": LUCIDE_VERSION,
        next: NEXT_VERSION,
        react: REACT_VERSION,
        "react-dom": REACT_VERSION,
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        eslint: "^9",
        "eslint-config-next": NEXT_VERSION,
        tailwindcss: "^4",
        typescript: "^5",
      },
    }) + "\n",
  );
  add("tsconfig.json", "config", () =>
    indent({
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "react-jsx",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
      exclude: ["node_modules"],
    }) + "\n",
  );
  add("next.config.ts", "config", () =>
    `import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {};\n\nexport default nextConfig;\n`,
  );
  add("postcss.config.mjs", "config", () =>
    `const config = {\n  plugins: {\n    "@tailwindcss/postcss": {},\n  },\n};\n\nexport default config;\n`,
  );
  add("eslint.config.mjs", "config", () =>
    `import { defineConfig, globalIgnores } from "eslint/config";\nimport nextVitals from "eslint-config-next/core-web-vitals";\nimport nextTs from "eslint-config-next/typescript";\n\nconst eslintConfig = defineConfig([\n  ...nextVitals,\n  ...nextTs,\n  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),\n]);\n\nexport default eslintConfig;\n`,
  );
  add(".gitignore", "config", () =>
    ["/node_modules", "/.pnp", ".pnp.*", "/coverage", "/.next/", "/out/", "/build", ".DS_Store", "*.pem", "npm-debug.log*", ".env", ".env.local", ".env.*.local", ".vercel", "*.tsbuildinfo", "next-env.d.ts", ""].join("\n"),
  );
  add(".env.example", "config", () =>
    [
      "# Copy this file to .env.local and fill in your values.",
      "",
      "# The public address of your site (used for links and the sitemap)",
      `NEXT_PUBLIC_SITE_URL=${siteBase}`,
      "",
      "# Contact form: messages are emailed with Resend when these are set.",
      "# Without them, messages are only printed in the server log.",
      `CONTACT_EMAIL=${contactEmail}`,
      "RESEND_API_KEY=",
      "CONTACT_FROM=",
      "",
    ].join("\n"),
  );

  tpl("content/types.ts", "content/types.ts", "content");
  add("content/site.ts", "content", () =>
    `import type { Page, Site } from "./types";\n\n// All the text, links and images of your site live here.\nexport const site: Site = ${indent(site)};\n\nexport function getPage(slug: string): Page {\n  const page = site.pages.find((p) => p.slug === slug);\n  if (!page) throw new Error(\`Unknown page: \${slug}\`);\n  return page;\n}\n`,
  );

  const font = FONT_MAP[fontKey];
  const palette = theme.dark
    ? { bg: "#0a0a12", alt: "#10101c", card: "#15152a", border: "rgba(255,255,255,.09)", muted: "#9ca3af", text: "#ffffff" }
    : { bg: "#ffffff", alt: "#f8fafc", card: "#ffffff", border: "rgba(15,23,42,.08)", muted: "#64748b", text: "#0f172a" };
  add("app/globals.css", "page", () => `@import "tailwindcss";

:root {
  --accent: ${theme.accent};
  --accent2: ${theme.accent2};
  --bg: ${palette.bg};
  --alt: ${palette.alt};
  --card: ${palette.card};
  --border: ${palette.border};
  --muted: ${palette.muted};
  --text: ${palette.text};
  --radius: ${RADII[radiusKey]};
  --btn-radius: ${radiusKey === "round" ? "9999px" : RADII[radiusKey]};
  --font-heading: ${font.css};
  --font-body: ${FONT_MAP.modern.css};
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.95); }
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-14px) rotate(2deg); }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes pagein {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}
@keyframes rise-in {
  from { opacity: 0; transform: translate(var(--from-x, 0), var(--from-y, 0)) scale(var(--from-s, 1)); }
  to { opacity: 1; transform: none; }
}

.anim-blob { animation: blob 14s ease-in-out infinite; }
.anim-float { animation: float 6s ease-in-out infinite; }
.anim-marquee { animation: marquee 30s linear infinite; }
.anim-marquee-slow { animation: marquee 60s linear infinite; }
.anim-page { animation: pagein 0.5s ease both; }
.anim-in { animation: rise-in 0.8s ease-out both; animation-delay: var(--delay, 0s); }

@media (prefers-reduced-motion: reduce) {
  .anim-blob, .anim-float, .anim-marquee, .anim-marquee-slow, .anim-page, .anim-in { animation: none; }
}
`);

  const fontImports = fontKey === "modern" ? ["Inter"] : ["Inter", font.fn];
  const poppins = fontKey === "friendly" ? `, weight: ["400", "600", "700", "800"]` : "";
  add("app/layout.tsx", "page", () => {
    const decls = [
      `const inter = Inter({ subsets: ["latin"], variable: "${FONT_MAP.modern.varName}", display: "swap" });`,
      ...(fontKey === "modern" ? [] : [`const heading = ${font.fn}({ subsets: ["latin"]${poppins}, variable: "${font.varName}", display: "swap" });`]),
    ].join("\n");
    const cls = fontKey === "modern" ? "inter.variable" : "inter.variable} ${heading.variable";
    return `import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ${fontImports.join(", ")} } from "next/font/google";
import { CartProvider } from "@/components/site/Cart";
import "./globals.css";

${decls}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? ${JSON.stringify(siteBase)}),
  title: { default: ${JSON.stringify(siteTitle)}, template: ${JSON.stringify(`%s | ${brand}`)} },
  description: ${JSON.stringify(siteDesc)},
  openGraph: { title: ${JSON.stringify(siteTitle)}, description: ${JSON.stringify(siteDesc)}, type: "website" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={\`\${${cls}}\`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
`;
  });

  // routes
  const used = new Set<string>(["Page"]);
  for (const pg of pages) {
    const isHome = pg.slug === "home";
    let comp = `${pascal(pg.slug)}Page`;
    while (used.has(comp)) comp += "X";
    used.add(comp);
    const file = isHome ? "app/page.tsx" : `app/${pg.slug}/page.tsx`;
    add(file, "page", () => `${isHome ? "" : `import type { Metadata } from "next";\n`}import { PageView } from "@/components/site/Page";
import { getPage } from "@/content/site";
${isHome ? "" : `\nexport const metadata: Metadata = { title: ${JSON.stringify(pg.name)} };\n`}
export default function ${comp}() {
  return <PageView page={getPage(${JSON.stringify(pg.slug)})} />;
}
`);
  }
  add("app/not-found.tsx", "page", () => `import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
        404
      </p>
      <h1 className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)" }}>
        This page could not be found
      </h1>
      <Link href="/" className="text-sm font-semibold underline">
        Back to the home page
      </Link>
    </main>
  );
}
`);
  add("app/sitemap.ts", "page", () => `import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? ${JSON.stringify(siteBase)};

export default function sitemap(): MetadataRoute.Sitemap {
  return site.pages.map((p) => ({ url: \`\${base}\${p.path === "/" ? "" : p.path}\` }));
}
`);
  add("app/robots.ts", "page", () => `import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? ${JSON.stringify(siteBase)};

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: \`\${base}/sitemap.xml\` };
}
`);
  if (hasContactSection) tpl("app/api/contact.route.ts", "app/api/contact/route.ts", "api");
  if (hasNewsletter) tpl("app/api/newsletter.route.ts", "app/api/newsletter/route.ts", "api");

  const logoFile = doc.logo ? imageFiles.get(img(doc.logo) ?? "") : undefined;
  if (logoFile?.bytes && /\.(png|jpg)$/.test(logoFile.path)) {
    const e = logoFile.path.endsWith(".png") ? "png" : "jpg";
    entries.push({ path: `app/icon.${e}`, kind: "asset", make: async () => ({ path: `app/icon.${e}`, kind: "asset", bytes: logoFile.bytes }) });
  }

  // components
  for (const c of components) tpl(`components/site/${c}${c === "theme" ? ".ts" : ".tsx"}`, `components/site/${c}${c === "theme" ? ".ts" : ".tsx"}`, "component");
  add("components/site/Page.tsx", "component", () => {
    const imports = sectionFiles.map((c) => `import { ${c} } from "./sections/${c}";`).join("\n");
    const needsBand = [...usedTypes].some((x) => BANDED.has(x));
    const routesBlock = `
const routes = {
  login: site.pages.find((p) => p.slug === "login")?.path,
  signup: site.pages.find((p) => p.slug === "signup")?.path,
  dashboard: site.pages.find((p) => p.slug === "dashboard")?.path,
};
`;
    const cases = [...usedTypes]
      .map((tpe) => {
        const c = SECTION_COMPONENT[tpe];
        if (tpe === "auth") return `    case "auth":\n      return <Auth key={i} s={s} brand={site.brand} routes={routes} />;`;
        if (tpe === "dashboard") return `    case "dashboard":\n      return <Dashboard key={i} s={s} brand={site.brand} />;`;
        if (BANDED.has(tpe)) return `    case "${tpe}":\n      return (\n        <Band key={i} alt={alt}>\n          <${c} s={s} />\n        </Band>\n      );`;
        return `    case "${tpe}":\n      return <${c} key={i} s={s} />;`;
      })
      .join("\n");
    return `import type { ReactNode } from "react";
import type { Page } from "@/content/types";
import { site } from "@/content/site";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { P } from "./theme";
${needsBand ? 'import { Band } from "./ui";\n' : ""}${imports}
${usedTypes.has("auth") ? routesBlock : ""}
function renderSection(s: Page["sections"][number], i: number): ReactNode {
${needsBand ? "  const alt = i % 2 === 0;\n" : ""}  switch (s.type) {
${cases}
    default:
      return null;
  }
}

export function PageView({ page }: { page: Page }) {
  const hideNav = page.slug === "dashboard";
  const hideFooter = hideNav || page.slug === "login" || page.slug === "signup";
  return (
    <div className="@container" style={{ background: P.bg, color: P.text }}>
      {!hideNav && (
        <Navbar
          brand={site.brand}
          logo={site.logo}
          links={site.navbar.links}
          cta={site.navbar.cta}
          showCart={site.features.cart}
        />
      )}
      <main key={page.slug} className="anim-page">
        {page.sections.map(renderSection)}
      </main>
      {!hideFooter && <Footer brand={site.brand} footer={site.footer} />}
    </div>
  );
}
`;
  });
  for (const c of sectionFiles) tpl(`components/site/sections/${c}.tsx`, `components/site/sections/${c}.tsx`, "component");

  // images
  for (const f of imageFiles.values()) entries.push({ path: f.path, kind: "asset", make: async () => f });

  add("README.md", "doc", () => readme({ name, brand, pages, answers, hasContactSection, hasNewsletter, hasCart, imagesIncluded, imagesPending: pending + failed, spotlight, fontKey }));

  const planned: PlannedFile[] = entries.map((e) => ({ path: e.path, kind: e.kind }));
  const summary: PlanSummary = {
    pages: pages.map((p, i) => ({ name: p.name, path: p.path, sections: pageData[i].sections.length })),
    componentNames,
    imagesIncluded,
    imagesPending: pending,
    imagesFailed: failed,
  };
  yield { type: "log", stage: "plan", text: `${planned.length} files to write` };
  yield { type: "plan", files: planned, summary };
  yield { type: "stage", id: "plan", status: "done" };
  if (o.dryRun) return;
  check();

  /* ---------- stage 3: write ---------- */
  yield { type: "stage", id: "write", status: "active" };
  const written: GenFile[] = [];
  for (let i = 0; i < entries.length; i++) {
    check();
    const file = await entries[i].make();
    written.push(file);
    yield { type: "file", file, index: i + 1, total: entries.length };
  }
  yield { type: "stage", id: "write", status: "done" };

  /* ---------- stage 4: check ---------- */
  yield { type: "stage", id: "check", status: "active" };
  const checks = runChecks(written, { pages, deadLinks, skipped, pending, failed, imagesIncluded });
  yield { type: "checks", checks };
  yield { type: "stage", id: "check", status: "done" };
  check();

  /* ---------- stage 5: pack ---------- */
  yield { type: "stage", id: "pack", status: "active" };
  const zip = await buildZip(written, name);
  yield { type: "log", stage: "pack", text: `Packaged ${written.length} files (${Math.round(zip.length / 1024)} KB)` };
  yield { type: "stage", id: "pack", status: "done" };
  yield { type: "done", files: written, zip, zipName: `${name}.zip` };
}

/* ------------------------------------------------------------------ */
/* zip                                                                  */
/* ------------------------------------------------------------------ */

export async function buildZip(files: GenFile[], root: string): Promise<Uint8Array> {
  const zip = new JSZip();
  for (const f of files) {
    const p = `${root}/${f.path}`;
    if (f.bytes) zip.file(p, f.bytes, { binary: true });
    else zip.file(p, f.text ?? "");
  }
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

/* ------------------------------------------------------------------ */
/* static checks                                                        */
/* ------------------------------------------------------------------ */

type CheckCtx = {
  pages: PagePlan[];
  deadLinks: string[];
  skipped: string[];
  pending: number;
  failed: number;
  imagesIncluded: number;
};

function resolveImport(from: string, spec: string, paths: Set<string>): boolean {
  let base: string;
  if (spec.startsWith("@/")) base = spec.slice(2);
  else if (spec.startsWith(".")) {
    const parts = from.split("/").slice(0, -1);
    for (const seg of spec.split("/")) {
      if (seg === ".") continue;
      if (seg === "..") parts.pop();
      else parts.push(seg);
    }
    base = parts.join("/");
  } else return true; // a package, not our file
  return ["", ".ts", ".tsx", ".css", "/index.ts", "/index.tsx"].some((e) => paths.has(base + e));
}

export function runChecks(files: GenFile[], ctx: CheckCtx): CheckResult[] {
  const out: CheckResult[] = [];
  const byPath = new Map(files.map((f) => [f.path, f]));
  const paths = new Set(files.map((f) => f.path));

  // 1. no duplicates / empty
  const dupes = files.length - paths.size;
  const empty = files.filter((f) => (f.text !== undefined && !f.text.trim()) || (f.bytes && f.bytes.length === 0));
  out.push({
    id: "files",
    label: "Every file has content",
    status: dupes || empty.length ? "fail" : "pass",
    detail: dupes ? `${dupes} duplicate file paths` : empty.length ? `Empty: ${empty.map((f) => f.path).join(", ")}` : `${files.length} files written`,
  });

  // 2. project config
  let pkgOk = false;
  try {
    const pkg = JSON.parse(byPath.get("package.json")?.text ?? "");
    pkgOk = !!pkg.dependencies?.next && !!pkg.dependencies?.react && !!pkg.scripts?.build;
  } catch {}
  const required = ["tsconfig.json", "next.config.ts", "postcss.config.mjs", "app/layout.tsx", "app/globals.css"];
  const missing = required.filter((p) => !paths.has(p));
  out.push({
    id: "config",
    label: "Project setup is complete",
    status: pkgOk && !missing.length ? "pass" : "fail",
    detail: !pkgOk ? "package.json is missing something" : missing.length ? `Missing: ${missing.join(", ")}` : "package.json, TypeScript, Tailwind and Next.js config",
  });

  // 3. every page has a route
  const noRoute = ctx.pages.filter((p) => !paths.has(p.slug === "home" ? "app/page.tsx" : `app/${p.slug}/page.tsx`));
  out.push({
    id: "routes",
    label: "Every page has a route",
    status: noRoute.length ? "fail" : "pass",
    detail: noRoute.length ? `Missing: ${noRoute.map((p) => p.name).join(", ")}` : `${ctx.pages.length} routes`,
  });

  // 4. imports resolve
  const broken: string[] = [];
  const importRe = /(?:import|export)[^"'`;]*?from\s+["']([^"']+)["']|import\s+["']([^"']+)["']/g;
  for (const f of files) {
    if (!f.text || !/\.(tsx?|mts)$/.test(f.path)) continue;
    for (const m of f.text.matchAll(importRe)) {
      const spec = m[1] ?? m[2];
      if (spec && !resolveImport(f.path, spec, paths)) broken.push(`${f.path} → ${spec}`);
    }
  }
  out.push({
    id: "imports",
    label: "All imports point to real files",
    status: broken.length ? "fail" : "pass",
    detail: broken.length ? broken.slice(0, 4).join("; ") : "No missing files",
  });

  // 5. images referenced exist
  const site = byPath.get("content/site.ts")?.text ?? "";
  const referenced = [...site.matchAll(/"(\/images\/[^"]+)"/g)].map((m) => m[1]);
  const missingImg = referenced.filter((r) => !paths.has(`public${r}`));
  out.push({
    id: "images",
    label: "Images are included",
    status: missingImg.length ? "fail" : ctx.pending || ctx.failed ? "warn" : "pass",
    detail: missingImg.length
      ? `Missing: ${missingImg.join(", ")}`
      : ctx.pending || ctx.failed
        ? `${ctx.imagesIncluded} included, ${ctx.pending + ctx.failed} will show a placeholder (not ready or not downloadable)`
        : `${ctx.imagesIncluded} image${ctx.imagesIncluded === 1 ? "" : "s"} included`,
  });

  // 6. links
  out.push({
    id: "links",
    label: "Buttons and menu links go to real pages",
    status: ctx.deadLinks.length ? "warn" : "pass",
    detail: ctx.deadLinks.length ? `No matching page for ${[...new Set(ctx.deadLinks)].slice(0, 4).join(", ")}${new Set(ctx.deadLinks).size > 4 ? "…" : ""}` : "Every link has a destination",
  });

  // 7. sections
  out.push({
    id: "sections",
    label: "Every section type is supported",
    status: ctx.skipped.length ? "warn" : "pass",
    detail: ctx.skipped.length ? `Skipped ${ctx.skipped.slice(0, 3).join(", ")}` : "Nothing was left out",
  });

  return out;
}

/* ------------------------------------------------------------------ */
/* README                                                               */
/* ------------------------------------------------------------------ */

function readme(r: {
  name: string;
  brand: string;
  pages: PagePlan[];
  answers: ExportAnswers;
  hasContactSection: boolean;
  hasNewsletter: boolean;
  hasCart: boolean;
  imagesIncluded: number;
  imagesPending: number;
  spotlight: boolean;
  fontKey: FontKey;
}) {
  const deploy = {
    vercel: `## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New → Project** and import the repository.
3. Vercel detects Next.js by itself. Add the variables from \`.env.example\` under **Settings → Environment Variables**, then deploy.`,
    netlify: `## Deploy on Netlify

1. Push this folder to a GitHub repository.
2. In Netlify choose **Add new site → Import an existing project** and pick the repository.
3. Netlify detects Next.js by itself. Add the variables from \`.env.example\` under **Site configuration → Environment variables**, then deploy.`,
    node: `## Run on your own server

\`\`\`bash
npm install
npm run build
npm run start   # listens on port 3000, set PORT to change it
\`\`\`

Put a reverse proxy such as Nginx in front, and set the variables from \`.env.example\` in the server environment.`,
  }[r.answers.deploy];

  const demo = [
    r.hasCart ? "- The cart is a counter in memory. Connect a real cart and checkout (for example Razorpay or Stripe) in `components/site/Cart.tsx`." : "",
    pagesHave(r.pages, "login") || pagesHave(r.pages, "signup") ? "- The login and signup pages are UI only. Add your auth provider in `components/site/sections/Auth.tsx`." : "",
    pagesHave(r.pages, "dashboard") ? "- The dashboard shows made-up sample data. Replace it with your real data." : "",
    r.hasContactSection ? "- The contact form posts to `app/api/contact/route.ts`. Set `CONTACT_EMAIL` and `RESEND_API_KEY` to receive emails, otherwise messages are only printed in the server log." : "",
    r.hasNewsletter ? "- The newsletter box posts to `app/api/newsletter/route.ts`, which only logs the address for now. Connect your newsletter provider there." : "",
    r.imagesPending ? `- ${r.imagesPending} image${r.imagesPending === 1 ? "" : "s"} were not ready when you exported. They show a coloured placeholder. Add pictures to \`public/images\` and set the paths in \`content/site.ts\`.` : "",
  ].filter(Boolean).join("\n");

  return `# ${r.brand}

A Next.js website generated by [Acoopa](https://acoopa.app) from the design you approved.

- **Next.js ${NEXT_VERSION}** (App Router) with **TypeScript** and **Tailwind CSS 4**
- ${r.pages.length} page${r.pages.length === 1 ? "" : "s"}: ${r.pages.map((p) => `\`${p.path}\``).join(", ")}
- ${r.imagesIncluded} image${r.imagesIncluded === 1 ? "" : "s"} in \`public/images\`

## Run it on your computer

You need Node.js 20.9 or newer.

\`\`\`bash
npm install
cp .env.example .env.local
npm run dev
\`\`\`

Open http://localhost:3000.

## How the project is organised

| Path | What it is |
|---|---|
| \`content/site.ts\` | All text, links and image paths. **Edit your content here.** |
| \`content/types.ts\` | The TypeScript types for that content |
| \`app/\` | One folder per page, plus the layout, sitemap and API routes |
| \`app/globals.css\` | Your colours, corners and animations as CSS variables |
| \`components/site/\` | The building blocks: navbar, footer and one file per section |
| \`public/images/\` | Your pictures |

To change a colour, edit the variables at the top of \`app/globals.css\`. To change a heading or a button, edit \`content/site.ts\`. To add a page, create \`app/your-page/page.tsx\` like the existing ones and add it to \`content/site.ts\`.

## Before you launch

${demo || "- Nothing else is needed."}

${deploy}

## Useful commands

\`\`\`bash
npm run lint    # check the code
npm run build   # production build
\`\`\`
`;
}

function pagesHave(pages: PagePlan[], slug: string) {
  return pages.some((p) => p.slug === slug);
}
