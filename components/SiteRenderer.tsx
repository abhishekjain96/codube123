"use client";
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Bold, Check, ChevronDown, ChevronUp, Copy, Image as ImageIcon, Italic, Menu, Palette, Plus, RotateCcw, ShoppingCart, Sparkles, Star, Trash2, Underline, X } from "lucide-react";

export type Item = {
  image?: string; icon?: string; emoji?: string; title?: string; description?: string; price?: string;
  badge?: string; value?: string; label?: string; quote?: string; name?: string; role?: string;
  question?: string; answer?: string; features?: string[]; highlighted?: boolean; cta?: string;
  size?: string; stat?: string; change?: string;
};
export type Column = { title: string; links: string[] };
export type Section = {
  type: string; variant?: string; image?: string; brand?: string; links?: string[]; badge?: string;
  title?: string; subtitle?: string; text?: string; cta?: string; cta2?: string; layout?: string;
  visual?: string; reverse?: boolean; bullets?: string[]; items?: Item[]; floaters?: string[];
  mode?: string; columns?: Column[]; newsletter?: boolean; copyright?: string;
  headers?: string[]; rows?: string[][];
};
export type Theme = {
  accent?: string; accent2?: string; dark?: boolean; font?: string; radius?: string;
  textColor?: string; mutedColor?: string; headingColor?: string;
  motion?: "subtle" | "lively"; ctaModal?: boolean;
};
export type PageDoc = { slug: string; name: string; sections: Section[] };
export type SiteDoc = {
  logo?: string; reply?: string; brand?: string; theme?: Theme;
  navbar?: Section; footer?: Section; pages?: PageDoc[]; sections?: Section[];
};

/** Where an edited value lives. page can also be "_root", "_navbar" or "_footer". */
export type Loc = { page: string; section: number; item?: number; field: string; idx?: number; col?: number };
export type EditApi = {
  editing: boolean;
  setValue: (loc: Loc, value: unknown) => void;
  addString: (loc: Loc, value: string) => void;
  removeItem: (page: string, section: number, item: number) => void;
  duplicateItem: (page: string, section: number, item: number) => void;
  addItem: (page: string, section: number) => void;
  removeColumn: (col: number) => void;
  addColumn: () => void;
  moveSection: (page: string, index: number, dir: -1 | 1) => void;
  removeSection: (page: string, index: number) => void;
  duplicateSection: (page: string, index: number) => void;
  askAi: (page: string, index: number) => void;
  editImage: (loc: Loc, current?: string) => void;
};

export function isLeadCta(text?: string) {
  if (!text) return false;
  return /contact|book|get started|sign up|join|demo|talk|quote|order|reserve|start/i.test(text);
}

export function parseSite(raw: string | null | undefined): SiteDoc | null {
  if (!raw) return null;
  const text = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  const attempts = [text, text.replace(/,\s*([}\]])/g, "$1")];
  for (const t of attempts) {
    try {
      const d = JSON.parse(t);
      if (Array.isArray(d.sections) || Array.isArray(d.pages)) {
        // Detect and convert SiteV2 format if sections use `props`
        const isV2 =
          Array.isArray(d.pages) &&
          d.pages.some((pg: { sections?: { props?: unknown }[] }) =>
            pg.sections?.some((sec) => sec && typeof sec.props === "object")
          );
        if (isV2) {
          const brandName =
            typeof d.brand === "object" && d.brand !== null
              ? (d.brand as { name?: string }).name ?? "Codube"
              : typeof d.brand === "string"
              ? d.brand
              : "Codube";
          const pages: PageDoc[] = d.pages.map((pg: { slug?: string; title?: string; name?: string; sections?: { type: string; props?: Record<string, unknown> }[] }) => {
            const rawSlug = pg.slug ?? "home";
            const slug = rawSlug === "/" ? "home" : String(rawSlug).replace(/^\//, "");
            const name = pg.title ?? pg.name ?? (slug === "home" ? "Home" : slug);
            const sections: Section[] = (pg.sections ?? []).map((sec) => {
              const props = sec.props ?? {};
              const ctaVal = typeof props.cta === "object" && props.cta !== null ? (props.cta as { label?: string }).label : props.cta;
              const cta2Val = typeof props.cta2 === "object" && props.cta2 !== null ? (props.cta2 as { label?: string }).label : props.cta2;
              return {
                type: sec.type,
                ...props,
                cta: typeof ctaVal === "string" ? ctaVal : undefined,
                cta2: typeof cta2Val === "string" ? cta2Val : undefined,
              } as Section;
            });
            return { slug, name, sections };
          });
          const navLinks = Array.isArray(d.nav)
            ? d.nav.map((n: { label?: string } | string) => (typeof n === "object" && n !== null ? n.label ?? "" : String(n)))
            : pages.map((p) => p.name);
          return {
            brand: brandName,
            theme: {
              accent: d.theme?.primary ?? d.theme?.accent ?? "#f97316",
              accent2: d.theme?.secondary ?? d.theme?.accent2 ?? "#8b5cf6",
              dark: !!d.theme?.dark,
              font: d.theme?.font ?? "modern",
              radius: d.theme?.radius ?? "soft",
            },
            navbar: { type: "navbar", brand: brandName, links: navLinks },
            pages,
          } as SiteDoc;
        }
        return d as SiteDoc;
      }
    } catch {}
  }
  return null;
}

/** Works for both the old one-page shape and the new multi-page shape. */
export function normalize(doc: SiteDoc): { navbar?: Section; footer?: Section; pages: PageDoc[] } {
  if (doc.pages?.length) return { navbar: doc.navbar, footer: doc.footer, pages: doc.pages };
  const all = doc.sections ?? [];
  return {
    navbar: all.find((s) => s.type === "navbar"),
    footer: all.find((s) => s.type === "footer"),
    pages: [{ slug: "home", name: "Home", sections: all.filter((s) => s.type !== "navbar" && s.type !== "footer") }],
  };
}

type Pal = {
  accent: string; accent2: string; bg: string; alt: string; card: string; border: string;
  muted: string; text: string; radius: string; btnRadius: string; heading: string;
  grad: string; tint: string;
};

const hex = (v: string | undefined, fallback: string) =>
  v && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;

const RADII: Record<string, string> = { sharp: "6px", soft: "16px", round: "28px" };
const FONTS: Record<string, string> = {
  modern: "var(--font-inter), system-ui, sans-serif",
  elegant: "var(--font-playfair), Georgia, serif",
  bold: "var(--font-space), system-ui, sans-serif",
  friendly: "var(--font-poppins), system-ui, sans-serif",
  handwriting: "var(--font-caveat), cursive, sans-serif",
};

const cardStyle = (p: Pal) => ({ background: p.card, border: `1px solid ${p.border}`, borderRadius: p.radius });
const gradText = (p: Pal): CSSProperties => ({
  background: p.grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
});
const inputStyle = (p: Pal): CSSProperties => ({
  borderColor: p.border, borderRadius: p.btnRadius, background: p.bg, color: p.text,
});

const ImgCtx = createContext<Record<string, string>>({});
const BaseCtx = createContext("");
const EditCtx = createContext<EditApi | null>(null);
const SecCtx = createContext<{ page: string; index: number }>({ page: "home", index: 0 });
type OnNav = (label: string) => void;

/* ---------- editing building blocks ---------- */

function useEd() {
  const edit = useContext(EditCtx);
  const sec = useContext(SecCtx);
  const loc = (field: string, extra: Partial<Loc> = {}): Loc => ({ page: sec.page, section: sec.index, field, ...extra });
  return { edit, sec, on: !!edit?.editing, loc };
}

type TagName = "span" | "p" | "h1" | "h2" | "h3" | "div";

const COLOR_SWATCHES = [
  { name: "White", hex: "#ffffff" },
  { name: "Silver", hex: "#e2e8f0" },
  { name: "Slate", hex: "#94a3b8" },
  { name: "Flame", hex: "#f97316" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Cyan", hex: "#38bdf8" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Gold", hex: "#f59e0b" },
  { name: "Pink", hex: "#ec4899" },
];

/** Plain text in preview mode, click-to-edit text with rich formatting toolbar in edit mode. */
function Ed({
  f, i, idx, col, as = "span", value, className = "", style, clearable = false, addLabel = "text", addDefault = "New text",
}: {
  f: string; i?: number; idx?: number; col?: number; as?: TagName; value?: string; className?: string;
  style?: CSSProperties; clearable?: boolean; addLabel?: string; addDefault?: string;
}) {
  const { edit, on, loc } = useEd();
  const Tag = as;
  const where = loc(f, { item: i, idx, col });

  const [active, setActive] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#f97316");
  const [posBottom, setPosBottom] = useState(false);
  const elRef = useRef<HTMLElement>(null);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  if (clearable && !value) {
    if (!on || !edit) return null;
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          edit.setValue(where, addDefault);
        }}
        className="rounded-full border border-dashed border-sky-400 px-2.5 py-0.5 text-[11px] font-medium text-sky-500 transition hover:bg-sky-50"
      >
        + {addLabel}
      </button>
    );
  }
  if (value === undefined || value === null) return null;

  const isHtml = typeof value === "string" && /<[a-z][\s\S]*>/i.test(value);
  if (!on || !edit) {
    if (isHtml) return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: value }} />;
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  function applyColor(color: string) {
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    const hasSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed && elRef.current?.contains(sel.anchorNode);

    if (hasSelection && sel) {
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.style.color = color;
      span.appendChild(range.extractContents());
      range.insertNode(span);
      sel.removeAllRanges();
    } else if (elRef.current) {
      elRef.current.style.color = color;
    }

    if (elRef.current) {
      edit?.setValue(where, elRef.current.innerHTML);
    }
    setColorOpen(false);
  }

  function clearFormatting() {
    if (elRef.current) {
      elRef.current.removeAttribute("style");
      const plain = (elRef.current.textContent || "").trim();
      elRef.current.innerHTML = plain;
      edit?.setValue(where, plain);
    }
    setColorOpen(false);
    setAiOpen(false);
  }

  function applyGradient() {
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    const hasSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed && elRef.current?.contains(sel.anchorNode);
    const gradCss = "background: linear-gradient(135deg, #f97316, #8b5cf6); -webkit-background-clip: text; color: transparent; font-weight: bold; display: inline-block;";

    if (hasSelection && sel) {
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.setAttribute("style", gradCss);
      span.appendChild(range.extractContents());
      range.insertNode(span);
      sel.removeAllRanges();
    } else if (elRef.current) {
      elRef.current.setAttribute("style", gradCss);
    }

    if (elRef.current) {
      edit?.setValue(where, elRef.current.innerHTML);
    }
  }

  function applyFormat(cmd: "bold" | "italic" | "underline") {
    document.execCommand(cmd, false);
    if (elRef.current) {
      edit?.setValue(where, elRef.current.innerHTML);
    }
  }

  function applyAiRewrite(type: "catchy" | "shorter" | "pro" | "cta" | "emoji") {
    if (!elRef.current) return;
    const current = (elRef.current.textContent || "").trim();
    if (!current) return;

    let rewritten = current;
    if (type === "catchy") {
      const prefixes = ["Next-Gen", "High-Performance", "The Ultimate", "Modern"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      rewritten = current.includes("–") ? current : `${prefix} ${current} ✦`;
    } else if (type === "shorter") {
      const words = current.split(/\s+/);
      rewritten = words.slice(0, Math.max(2, Math.ceil(words.length * 0.65))).join(" ");
    } else if (type === "pro") {
      rewritten = `Enterprise-Grade ${current.replace(/^(the|a|an)\s+/i, "")}`;
    } else if (type === "cta") {
      rewritten = `Start with ${current.replace(/^(start|get|try|see|explore)\s+/i, "")} →`;
    } else if (type === "emoji") {
      const emojis = ["⚡", "✨", "🚀", "💡", "🔥", "✦", "🌟", "🎯"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      rewritten = `${emoji} ${current}`;
    }

    elRef.current.innerHTML = rewritten;
    edit?.setValue(where, rewritten);
    setAiOpen(false);
  }

  return (
    <span className="relative inline-block max-w-full">
      {active && (
        <span
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`absolute ${posBottom ? "top-full mt-2" : "-top-11"} left-0 z-50 flex items-center gap-1 rounded-xl border border-white/20 bg-[#0d0d18]/95 px-2 py-1 shadow-2xl shadow-black/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap select-none font-sans font-normal not-italic text-xs text-white`}
        >
          {/* Color dropdown button */}
          <span className="relative inline-block">
            <button
              type="button"
              onClick={() => { setColorOpen((o) => !o); setAiOpen(false); }}
              title="Font Color (selected text or whole)"
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${colorOpen ? "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}
            >
              <Palette size={13} className="text-orange-400" />
              <span>Color</span>
            </button>

            {colorOpen && (
              <span className="absolute left-0 top-full mt-2 z-50 block w-60 rounded-2xl border border-white/15 bg-[#0f0f1c] p-3 text-left shadow-2xl shadow-black/90 backdrop-blur-2xl">
                <span className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
                  <span className="text-[11px] font-semibold text-white">Font Color</span>
                  <button
                    type="button"
                    onClick={clearFormatting}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                </span>
                <span className="mt-1 block text-[10px] text-slate-400">
                  Highlight text to color a word, or click below to color all:
                </span>

                <span className="mt-2 grid grid-cols-5 gap-1.5">
                  {COLOR_SWATCHES.map((s) => (
                    <button
                      key={s.hex}
                      type="button"
                      title={s.name}
                      onClick={() => applyColor(s.hex)}
                      className="group relative flex h-7 w-full items-center justify-center rounded-lg border border-white/10 transition hover:scale-105 hover:border-white/30"
                      style={{ background: s.hex }}
                    >
                      <span className="opacity-0 group-hover:opacity-100">
                        <Check size={12} className={s.hex === "#ffffff" ? "text-slate-900" : "text-white"} />
                      </span>
                    </button>
                  ))}
                </span>

                <span className="mt-2.5 flex items-center gap-2 border-t border-white/[0.08] pt-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#hex"
                    className="w-20 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 text-xs text-white outline-none focus:border-orange-500/60 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => applyColor(customColor)}
                    className="flex-1 rounded-lg bg-brand-gradient py-1 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    Apply
                  </button>
                </span>
              </span>
            )}
          </span>

          <span className="h-4 w-px bg-white/15" />

          {/* Gradient text button */}
          <button
            type="button"
            onClick={applyGradient}
            title="Make Gradient Text"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent font-bold">✦ Grad</span>
          </button>

          <span className="h-4 w-px bg-white/15" />

          {/* Bold, Italic, Underline */}
          <button
            type="button"
            onClick={() => applyFormat("bold")}
            title="Bold"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Bold size={12} />
          </button>
          <button
            type="button"
            onClick={() => applyFormat("italic")}
            title="Italic"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-xs italic text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Italic size={12} />
          </button>
          <button
            type="button"
            onClick={() => applyFormat("underline")}
            title="Underline"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-xs underline text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Underline size={12} />
          </button>

          <span className="h-4 w-px bg-white/15" />

          {/* AI Rewrite Assistant */}
          <span className="relative inline-block">
            <button
              type="button"
              onClick={() => { setAiOpen((o) => !o); setColorOpen(false); }}
              title="Emergent AI Rewrite Assistant"
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${aiOpen ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40" : "text-purple-300 hover:bg-purple-500/10"}`}
            >
              <Sparkles size={12} className="text-purple-400" />
              <span>AI</span>
            </button>

            {aiOpen && (
              <span className="absolute left-0 top-full mt-2 z-50 block w-48 rounded-2xl border border-white/15 bg-[#0f0f1c] p-1.5 text-left shadow-2xl shadow-black/90 backdrop-blur-2xl">
                <span className="block px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  AI Rewrites
                </span>
                {[
                  { key: "catchy", label: "Catchier Headline", icon: "⚡" },
                  { key: "shorter", label: "Make Shorter", icon: "🎯" },
                  { key: "pro", label: "Professional SaaS", icon: "💼" },
                  { key: "cta", label: "Action CTA", icon: "🚀" },
                  { key: "emoji", label: "Add Emojis", icon: "✨" },
                ].map((act) => (
                  <button
                    key={act.key}
                    type="button"
                    onClick={() => applyAiRewrite(act.key as any)}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <span>{act.icon}</span>
                    <span>{act.label}</span>
                  </button>
                ))}
              </span>
            )}
          </span>
        </span>
      )}

      <Tag
        ref={elRef as any}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className={`${className} cursor-text rounded-sm outline-none transition hover:outline hover:outline-1 hover:outline-dashed hover:outline-orange-400 focus:outline focus:outline-2 focus:outline-orange-500`}
        style={style}
        onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
        onFocus={(e: React.FocusEvent<HTMLElement>) => {
          if (blurTimeout.current) clearTimeout(blurTimeout.current);
          const rect = e.currentTarget.getBoundingClientRect();
          setPosBottom(rect.top < 80);
          setActive(true);
        }}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          blurTimeout.current = setTimeout(() => {
            setActive(false);
            setColorOpen(false);
            setAiOpen(false);
          }, 200);
          const next = (e.currentTarget.innerHTML ?? "").trim();
          if (!next || next === "<br>") {
            if (clearable) edit.setValue(where, "");
            else e.currentTarget.innerHTML = String(value);
            return;
          }
          if (next !== value) edit.setValue(where, next);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === "Enter" && as !== "p" && as !== "div") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
          e.preventDefault();
          document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </span>
  );
}

/** A clickable element. In edit mode it becomes a div, so the text inside can be edited. */
function Tap({ className, style, onClick, children }: { className?: string; style?: CSSProperties; onClick?: () => void; children: ReactNode }) {
  const { on } = useEd();
  if (on) return <div className={className} style={style}>{children}</div>;
  return <button type="button" className={className} style={style} onClick={onClick}>{children}</button>;
}

/** Wraps one list item (testimonial, FAQ, plan...) with duplicate and delete buttons. */
function Box({ i, label, className = "h-full", children }: { i: number; label: string; className?: string; children: ReactNode }) {
  const { edit, sec, on } = useEd();
  if (!on || !edit) return <div className={className}>{children}</div>;
  const b = "flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-white/20";
  return (
    <div className={`group/item relative ${className}`}>
      <div className="absolute -top-3 right-2 z-30 flex items-center gap-0.5 rounded-lg bg-slate-900/95 p-0.5 text-white opacity-0 shadow-lg transition group-hover/item:opacity-100">
        <button type="button" title={`Duplicate ${label}`} className={b} onClick={(e) => { e.stopPropagation(); edit.duplicateItem(sec.page, sec.index, i); }}>
          <Copy size={12} />
        </button>
        <button type="button" title={`Delete ${label}`} className={`${b} hover:!bg-red-500`} onClick={(e) => { e.stopPropagation(); edit.removeItem(sec.page, sec.index, i); }}>
          <Trash2 size={12} />
        </button>
      </div>
      {children}
    </div>
  );
}

function AddItem({ label, className = "mt-6" }: { label: string; className?: string }) {
  const { edit, sec, on } = useEd();
  if (!on || !edit) return null;
  return (
    <div className={`flex justify-center ${className}`}>
      <button
        type="button"
        onClick={() => edit.addItem(sec.page, sec.index)}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-sky-400 px-4 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-50"
      >
        <Plus size={13} /> Add {label}
      </button>
    </div>
  );
}

/** Small red x for one entry of a text list (bullets, features, links...). */
function RowX({ f, i, col, idx }: { f: string; i?: number; col?: number; idx: number }) {
  const { edit, on, loc } = useEd();
  if (!on || !edit) return null;
  return (
    <button
      type="button"
      title="Remove"
      onClick={(e) => {
        e.stopPropagation();
        edit.setValue(loc(f, { item: i, col, idx }), "");
      }}
      className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 transition group-hover/row:opacity-100"
    >
      <X size={11} />
    </button>
  );
}

function AddStr({ f, i, col, label, value = "New item", className = "mt-2" }: {
  f: string; i?: number; col?: number; label: string; value?: string; className?: string;
}) {
  const { edit, on, loc } = useEd();
  if (!on || !edit) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        edit.addString(loc(f, { item: i, col }), value);
      }}
      className={`rounded-full border border-dashed border-sky-400 px-2.5 py-0.5 text-[11px] font-medium text-sky-500 transition hover:bg-sky-50 ${className}`}
    >
      + {label}
    </button>
  );
}

function Frame({ index, total, type, children }: { index: number; total: number; type: string; children: ReactNode }) {
  const edit = useContext(EditCtx);
  const { page } = useContext(SecCtx);
  if (!edit?.editing) return <>{children}</>;
  const b = "flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="group/sec relative">
      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 ring-2 ring-inset ring-sky-400 transition group-hover/sec:opacity-100" />
      <div className="absolute left-1/2 top-2 z-30 -translate-x-1/2 opacity-0 transition group-hover/sec:opacity-100">
        <div className="flex items-center gap-0.5 rounded-xl bg-slate-900/95 p-1 text-white shadow-xl">
          <span className="px-2 text-[11px] font-semibold capitalize text-sky-300">{type}</span>
          <button type="button" title="Ask AI to change this section" className={b} onClick={() => edit.askAi(page, index)}><Sparkles size={14} /></button>
          <button type="button" title="Move up" className={b} disabled={index === 0} onClick={() => edit.moveSection(page, index, -1)}><ChevronUp size={14} /></button>
          <button type="button" title="Move down" className={b} disabled={index === total - 1} onClick={() => edit.moveSection(page, index, 1)}><ChevronDown size={14} /></button>
          <button type="button" title="Duplicate section" className={b} onClick={() => edit.duplicateSection(page, index)}><Copy size={14} /></button>
          <button type="button" title="Delete section" className={`${b} hover:!bg-red-500`} onClick={() => edit.removeSection(page, index)}><Trash2 size={14} /></button>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ---------- small building blocks ---------- */

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(26px)",
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Btn({
  p, kind = "primary", children, onClick, submit = false, full = false,
}: { p: Pal; kind?: "primary" | "ghost"; children: ReactNode; onClick?: () => void; submit?: boolean; full?: boolean }) {
  const { on } = useEd();
  const style: CSSProperties = {
    ...(kind === "primary"
      ? { background: p.grad, color: "#fff", boxShadow: `0 12px 30px -12px ${p.accent}` }
      : { border: `1px solid ${p.border}`, color: p.text, background: "transparent" }),
    borderRadius: p.btnRadius,
  };
  const cls = `px-5 py-2.5 text-center text-sm font-semibold transition hover:-translate-y-0.5 active:translate-y-0 ${full ? "block w-full" : "inline-block"}`;
  if (on) return <div className={cls} style={style}>{children}</div>;
  return (
    <button type={submit ? "submit" : "button"} onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

function Pic({
  prompt, alt = "", className = "", style, fallback, children, f, i, page, small = false,
}: {
  prompt?: string; alt?: string; className?: string; style?: CSSProperties;
  fallback: ReactNode; children?: ReactNode; f?: string; i?: number; page?: string; small?: boolean;
}) {
  const images = useContext(ImgCtx);
  const base = useContext(BaseCtx);
  const edit = useContext(EditCtx);
  const sec = useContext(SecCtx);
  const uploaded = prompt?.startsWith("upload:") ? prompt.slice(7) : null;
  const isDirect = prompt?.startsWith("http://") || prompt?.startsWith("https://") || prompt?.startsWith("/");
  const url = isDirect
    ? prompt
    : uploaded !== null
    ? (uploaded.startsWith("/media/") ? base + uploaded : uploaded)
    : images[prompt ?? ""];
  const [loadedUrl, setLoadedUrl] = useState<string | undefined>(undefined);
  const loaded = !!url && (isDirect || loadedUrl === url);
  return (
    <div className={`group/pic relative overflow-hidden ${className}`} style={style}>
      <div className="absolute inset-0">{fallback}</div>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          onLoad={() => setLoadedUrl(url)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
      {children}
      {edit?.editing && f && (
        <button
          type="button"
          title="Change image"
          onClick={(e) => {
            e.stopPropagation();
            edit.editImage({ page: page ?? sec.page, section: page ? 0 : sec.index, item: i, field: f }, prompt);
          }}
          className={
            small
              ? "absolute inset-0 z-10 m-auto flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 shadow-lg transition hover:bg-black group-hover/pic:opacity-100"
              : "absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur transition hover:bg-black group-hover/pic:opacity-100"
          }
        >
          <ImageIcon size={small ? 12 : 13} /> {!small && "Change"}
        </button>
      )}
    </div>
  );
}

function Glow({ p, children, className = "" }: { p: Pal; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={`group relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
      style={cardStyle(p)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), ${p.accent}30, transparent 70%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function LeadModal({ p, open, onClose }: { p: Pal; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        className="w-full max-w-sm space-y-3 p-6 shadow-2xl"
        style={{ ...cardStyle(p), color: p.text }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <h3 className="text-lg font-bold" style={{ fontFamily: p.heading }}>Let’s talk</h3>
        <p className="text-sm" style={{ color: p.muted }}>This popup is a live preview, nothing is saved yet.</p>
        <input required placeholder="Your name" className="w-full border px-3 py-2 text-sm outline-none" style={inputStyle(p)} />
        <input required type="email" placeholder="Email" className="w-full border px-3 py-2 text-sm outline-none" style={inputStyle(p)} />
        <textarea placeholder="Message" rows={3} className="w-full border px-3 py-2 text-sm outline-none" style={inputStyle(p)} />
        <Btn p={p} submit>Send message</Btn>
      </form>
    </div>
  );
}

function Sec({ p, alt, children }: { p: Pal; alt: boolean; children: ReactNode }) {
  return (
    <section className="px-6 py-16 @2xl:px-10 @2xl:py-24" style={{ background: alt ? p.alt : p.bg }}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

function Head({ s, p }: { s: Section; p: Pal }) {
  if (!s.title) return null;
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <Ed as="h2" f="title" value={s.title} className="block text-3xl font-extrabold tracking-tight @2xl:text-4xl" style={{ fontFamily: p.heading }} />
      <Ed as="p" f="subtitle" value={s.subtitle} clearable addLabel="subtitle" addDefault="A short supporting line." className="mt-3" style={{ color: p.muted }} />
    </Reveal>
  );
}

/* ---------- navigation ---------- */

function Navbar({
  s, p, cart, showCart, logo, current, onNav,
}: { s: Section; p: Pal; cart: number; showCart: boolean; logo?: string; current: string; onNav: OnNav }) {
  const [open, setOpen] = useState(false);
  const editing = !!useContext(EditCtx)?.editing;
  const links = s.links ?? [];
  return (
    <SecCtx.Provider value={{ page: "_navbar", index: 0 }}>
      <header className="relative z-30" style={{ background: p.bg, borderBottom: `1px solid ${p.border}` }}>
        <div className="flex items-center justify-between gap-4 px-6 py-4 @2xl:px-10">
          <Tap onClick={() => onNav("home")} className="flex items-center gap-2.5">
            {(logo || editing) && (
              <Pic
                prompt={logo}
                alt={s.brand}
                f="logo"
                page="_root"
                small
                className="h-9 w-9 shrink-0"
                style={{ borderRadius: "10px" }}
                fallback={<div className="h-full w-full" style={{ background: p.grad }} />}
              />
            )}
            <Ed f="brand" value={s.brand} className="text-lg font-extrabold" style={{ fontFamily: p.heading, ...gradText(p) }} />
          </Tap>

          <nav className="hidden flex-wrap items-center gap-x-6 gap-y-1 text-sm @2xl:flex">
            {links.map((l, j) =>
              editing ? (
                <span key={j} className="group/row flex items-center">
                  <Ed f="links" idx={j} value={l} className="font-medium" style={{ color: p.muted }} />
                  <RowX f="links" idx={j} />
                </span>
              ) : (
                <button
                  key={j}
                  type="button"
                  onClick={() => onNav(l)}
                  className="font-medium transition hover:opacity-70"
                  style={{ color: l.toLowerCase() === current.toLowerCase() ? p.accent : p.muted }}
                >
                  {l}
                </button>
              )
            )}
            <AddStr f="links" label="page" className="mt-0" />
          </nav>

          <div className="flex items-center gap-4">
            {showCart && (
              <span className="relative">
                <ShoppingCart size={18} />
                {cart > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white" style={{ background: p.accent }}>
                    {cart}
                  </span>
                )}
              </span>
            )}
            {s.cta ? (
              <Btn p={p} onClick={() => onNav(s.cta!)}>
                <Ed f="cta" value={s.cta} clearable />
              </Btn>
            ) : (
              <Ed f="cta" value="" clearable addLabel="button" addDefault="Get started" />
            )}
            {links.length > 0 && (
              <button type="button" aria-label="Menu" className="@2xl:hidden" onClick={() => setOpen((o) => !o)}>
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>

        {open && !editing && (
          <div className="flex flex-col gap-1 px-6 pb-4 @2xl:hidden" style={{ borderTop: `1px solid ${p.border}` }}>
            {links.map((l, j) => (
              <button
                key={j}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onNav(l);
                }}
                className="py-2 text-left text-sm font-medium"
                style={{ color: l.toLowerCase() === current.toLowerCase() ? p.accent : p.text }}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </header>
    </SecCtx.Provider>
  );
}

function Footer({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  const edit = useContext(EditCtx);
  const editing = !!edit?.editing;
  const [done, setDone] = useState(false);
  const cols: Column[] = s.columns ?? (s.links?.length ? [{ title: "Explore", links: s.links }] : []);
  const copyright = s.copyright ?? `© ${new Date().getFullYear()} ${s.brand ?? ""}. All rights reserved.`;
  return (
    <SecCtx.Provider value={{ page: "_footer", index: 0 }}>
      <footer className="px-6 py-14 @2xl:px-10" style={{ background: p.alt, borderTop: `1px solid ${p.border}` }}>
        <div className="mx-auto grid max-w-5xl gap-10 @3xl:grid-cols-4">
          <div>
            <Ed as="p" f="brand" value={s.brand} className="text-lg font-extrabold" style={{ fontFamily: p.heading, ...gradText(p) }} />
            <Ed as="p" f="text" value={s.text} clearable addLabel="tagline" addDefault="A short line about your brand." className="mt-2 text-sm" style={{ color: p.muted }} />
            {editing && (
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs" style={{ color: p.muted }}>
                <input
                  type="checkbox"
                  checked={!!s.newsletter}
                  onChange={(e) => edit?.setValue({ page: "_footer", section: 0, field: "newsletter" }, e.target.checked)}
                />
                Show newsletter box
              </label>
            )}
            {s.newsletter && (
              <form
                className="mt-5 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
              >
                {done ? (
                  <p className="flex items-center gap-1.5 text-sm font-medium" style={{ color: p.accent }}>
                    <Check size={15} /> Subscribed (preview)
                  </p>
                ) : (
                  <>
                    <input required type="email" placeholder="Your email" className="min-w-0 flex-1 border px-3 py-2 text-sm outline-none" style={inputStyle(p)} />
                    <Btn p={p} submit>Join</Btn>
                  </>
                )}
              </form>
            )}
          </div>

          {cols.slice(0, 3).map((c, ci) => (
            <div key={ci} className="group/col">
              <div className="flex items-center justify-between gap-2">
                <Ed as="p" f="title" col={ci} value={c.title} className="block text-sm font-bold" />
                {editing && (
                  <button
                    type="button"
                    title="Delete column"
                    onClick={() => edit?.removeColumn(ci)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 transition group-hover/col:opacity-100"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: p.muted }}>
                {c.links.map((l, j) => (
                  <li key={j} className="group/row flex items-center">
                    {editing ? (
                      <Ed f="links" col={ci} idx={j} value={l} />
                    ) : (
                      <button type="button" onClick={() => onNav(l)} className="transition hover:opacity-70">{l}</button>
                    )}
                    <RowX f="links" col={ci} idx={j} />
                  </li>
                ))}
              </ul>
              <AddStr f="links" col={ci} label="link" value="New link" />
            </div>
          ))}
        </div>

        {editing && cols.length < 3 && (
          <div className="mx-auto mt-6 max-w-5xl">
            <button
              type="button"
              onClick={() => edit?.addColumn()}
              className="rounded-full border border-dashed border-sky-400 px-3 py-1 text-xs font-semibold text-sky-500 transition hover:bg-sky-50"
            >
              + Add column
            </button>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-5xl pt-6 text-xs" style={{ borderTop: `1px solid ${p.border}`, color: p.muted }}>
          <Ed f="copyright" value={copyright} />
        </div>
      </footer>
    </SecCtx.Provider>
  );
}

/* ---------- heroes ---------- */

function HeroCopy({ s, p, onNav, center = false }: { s: Section; p: Pal; onNav: OnNav; center?: boolean }) {
  return (
    <>
      <Reveal>
        <Ed f="badge" value={s.badge} clearable addLabel="badge" addDefault="New" className="inline-block rounded-full px-3.5 py-1 text-xs font-semibold" style={{ background: p.tint, color: p.accent, border: `1px solid ${p.border}` }} />
      </Reveal>
      <Reveal delay={80}>
        <Ed as="h1" f="title" value={s.title} className="mt-6 block text-4xl font-extrabold leading-[1.05] tracking-tight @2xl:text-6xl" style={{ fontFamily: p.heading }} />
      </Reveal>
      <Reveal delay={160}>
        <Ed as="p" f="subtitle" value={s.subtitle} className={`mt-5 text-base @2xl:text-lg ${center ? "mx-auto max-w-xl" : "max-w-lg"}`} style={{ color: p.muted }} />
      </Reveal>
      <Reveal delay={240}>
        <div className={`mt-8 flex flex-wrap items-center gap-3 ${center ? "justify-center" : ""}`}>
          {s.cta ? (
            <Btn p={p} onClick={() => onNav(s.cta!)}><Ed f="cta" value={s.cta} clearable /></Btn>
          ) : (
            <Ed f="cta" value="" clearable addLabel="button" addDefault="Get started" />
          )}
          {s.cta2 ? (
            <Btn p={p} kind="ghost" onClick={() => onNav(s.cta2!)}><Ed f="cta2" value={s.cta2} clearable /></Btn>
          ) : (
            <Ed f="cta2" value="" clearable addLabel="second button" addDefault="Learn more" />
          )}
        </div>
      </Reveal>
    </>
  );
}

function Floaters({ s, p, positions }: { s: Section; p: Pal; positions: CSSProperties[] }) {
  return (
    <>
      {(s.floaters ?? []).slice(0, positions.length).map((f, i) => (
        <span
          key={i}
          className="anim-float absolute whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur"
          style={{ background: p.card, border: `1px solid ${p.border}`, color: p.text, animationDelay: `${i * -1.5}s`, ...positions[i] }}
        >
          <Ed f="floaters" idx={i} value={f} clearable />
        </span>
      ))}
    </>
  );
}

function HeroAurora({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  const mask = "radial-gradient(ellipse at center, black 30%, transparent 75%)";
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 @2xl:px-10 @2xl:pt-32" style={{ background: p.bg }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `linear-gradient(${p.border} 1px, transparent 1px), linear-gradient(90deg, ${p.border} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div className="anim-blob pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ background: p.accent }} />
      <div className="anim-blob pointer-events-none absolute right-1/4 top-10 h-72 w-72 rounded-full opacity-35 blur-3xl" style={{ background: p.accent2, animationDelay: "-5s" }} />

      <motion.div className="relative mx-auto max-w-3xl text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <HeroCopy s={s} p={p} onNav={onNav} center />
      </motion.div>

      <motion.div className="relative mx-auto mt-16 max-w-4xl" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}>
        <div className="p-2 shadow-2xl" style={{ background: p.card, border: `1px solid ${p.border}`, borderRadius: p.radius }}>
          <Pic
            prompt={s.image}
            alt={s.title}
            f="image"
            className="aspect-[16/9]"
            style={{ borderRadius: `calc(${p.radius} - 6px)` }}
            fallback={<div className="flex h-full w-full items-center justify-center text-8xl" style={{ background: p.grad }}>{s.visual}</div>}
          />
        </div>
        <Floaters s={s} p={p} positions={[{ top: "-14px", left: "6%" }, { bottom: "-14px", right: "8%" }]} />
      </motion.div>
    </section>
  );
}

function HeroSpotlight({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-36"
      style={{ background: p.bg }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(520px circle at var(--x, 50%) var(--y, 35%), ${p.accent}38, transparent 65%)` }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }} />
      <div className="relative mx-auto grid max-w-5xl items-center gap-12 @2xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <HeroCopy s={s} p={p} onNav={onNav} />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}>
          <Pic
            prompt={s.image}
            alt={s.title}
            f="image"
            className="aspect-square w-full shadow-2xl"
            style={{ borderRadius: p.radius, border: `1px solid ${p.accent}55`, boxShadow: `0 0 80px -20px ${p.accent}` }}
            fallback={<div className="flex h-full w-full items-center justify-center text-8xl" style={{ background: p.grad }}>{s.visual}</div>}
          />
        </motion.div>
      </div>
    </section>
  );
}

function Hero({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  if (s.variant === "aurora") return <HeroAurora s={s} p={p} onNav={onNav} />;
  if (s.variant === "spotlight") return <HeroSpotlight s={s} p={p} onNav={onNav} />;
  const split = s.layout === "split";
  return (
    <section className="relative overflow-hidden px-6 py-20 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="anim-blob pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: p.accent }} />
      <div className="anim-blob pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full opacity-30 blur-3xl" style={{ background: p.accent2, animationDelay: "-6s" }} />
      <div className={`relative mx-auto grid max-w-5xl items-center gap-12 ${split ? "@2xl:grid-cols-2" : "text-center"}`}>
        <div className={split ? "" : "mx-auto max-w-3xl"}>
          {!split && s.visual && (
            <div className="anim-float mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white shadow-xl" style={{ background: p.grad }}>
              {s.visual}
            </div>
          )}
          <HeroCopy s={s} p={p} onNav={onNav} center={!split} />
        </div>

        {split && (s.visual || s.image) && (
          <div className="relative mx-auto w-full max-w-sm">
            <Pic
              prompt={s.image}
              alt={s.title}
              f="image"
              className="anim-float aspect-square w-full shadow-2xl"
              style={{ borderRadius: "2rem" }}
              fallback={<div className="flex h-full w-full items-center justify-center text-8xl @2xl:text-9xl" style={{ background: p.grad }}>{s.visual}</div>}
            />
            <Floaters s={s} p={p} positions={[{ top: "-12px", left: "-18px" }, { top: "42%", right: "-22px" }, { bottom: "-10px", left: "14%" }]} />
          </div>
        )}
      </div>
    </section>
  );
}

function Hero3D({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  const items = s.items ?? [
    { icon: "⚡", title: "10x Faster", description: "From idea to live production site in under a minute" },
    { icon: "🎨", title: "Visual Control", description: "Click any text or image to change it with real-time preview" },
    { icon: "🚀", title: "Clean Next.js Code", description: "Tailwind v4, TypeScript, and modern responsive components" },
  ];
  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-36" style={{ background: p.bg }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(${p.border} 1px, transparent 1px), linear-gradient(90deg, ${p.border} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)",
        }}
      />
      <div className="anim-blob pointer-events-none absolute left-1/3 -top-20 h-96 w-96 rounded-full opacity-30 blur-[100px]" style={{ background: p.accent }} />
      <div className="anim-blob pointer-events-none absolute right-1/4 top-32 h-80 w-80 rounded-full opacity-25 blur-[100px]" style={{ background: p.accent2, animationDelay: "-4s" }} />

      <div className="relative mx-auto max-w-4xl text-center">
        <HeroCopy s={s} p={p} onNav={onNav} center />
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl [perspective:1200px]">
        <div className="grid gap-6 @xl:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              className="anim-float group relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: `linear-gradient(145deg, ${p.card}, ${p.alt})`,
                border: `1px solid ${p.border}`,
                boxShadow: `0 20px 50px -15px ${p.accent}20`,
                animationDelay: `${i * -2}s`,
              }}
            >
              <div
                className="absolute inset-x-0 -top-px h-px rounded-full opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
              />
              <Box i={i} label="card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-lg" style={{ background: p.grad }}>
                  {it.icon ?? "✦"}
                </div>
                <Ed as="h3" f="title" i={i} value={it.title} className="mt-5 block text-lg font-bold" style={{ fontFamily: p.heading }} />
                <Ed as="p" f="description" i={i} value={it.description} className="mt-2 text-sm leading-relaxed" style={{ color: p.muted }} />
              </Box>
            </motion.div>
          ))}
        </div>
      </div>
      <AddItem label="card" className="mt-8" />
    </section>
  );
}

function HeroMarquee({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  const items = s.items ?? [
    { title: "AI Generation" },
    { title: "Visual Edit" },
    { title: "Clean Next.js" },
    { title: "Tailwind v4" },
    { title: "Framer Motion" },
    { title: "Instant Hosting" },
    { title: "High-Res Stock" },
    { title: "Zero Lock-in" },
  ];
  return (
    <section className="relative overflow-hidden px-6 py-20 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="anim-blob pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full opacity-30 blur-3xl" style={{ background: p.accent }} />
      <div className="anim-blob pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full opacity-25 blur-3xl" style={{ background: p.accent2, animationDelay: "-5s" }} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 @3xl:grid-cols-2">
        <div>
          <HeroCopy s={s} p={p} onNav={onNav} />
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#f97316", "#8b5cf6", "#3b82f6", "#10b981"].map((bg, idx) => (
                <span
                  key={idx}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-white/10"
                  style={{ background: bg }}
                >
                  {["A", "R", "S", "K"][idx]}
                </span>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-400">★★★★★ <span style={{ color: p.text }} className="ml-1 text-[11px] font-medium">4.9/5</span></p>
              <p className="text-[11px]" style={{ color: p.muted }}>Loved by 10,000+ creators worldwide</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6" style={{ background: p.card, border: `1px solid ${p.border}` }}>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14"
            style={{ background: `linear-gradient(180deg, ${p.card}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14"
            style={{ background: `linear-gradient(0deg, ${p.card}, transparent)` }}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="anim-bob flex flex-col gap-3" style={{ animationDuration: "6s" }}>
              {items.slice(0, 4).map((it, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: p.alt, border: `1px solid ${p.border}` }}
                >
                  <Box i={i} label="item">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs" style={{ background: p.tint, color: p.accent }}>✦</span>
                    <Ed as="p" f="title" i={i} value={it.title} className="mt-2 text-xs font-semibold" />
                  </Box>
                </div>
              ))}
            </div>
            <div className="anim-bob flex flex-col gap-3" style={{ animationDuration: "7s", animationDelay: "-2.5s" }}>
              {items.slice(4).map((it, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: p.alt, border: `1px solid ${p.border}` }}
                >
                  <Box i={i + 4} label="item">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs" style={{ background: p.tint, color: p.accent2 }}>⚡</span>
                    <Ed as="p" f="title" i={i + 4} value={it.title} className="mt-2 text-xs font-semibold" />
                  </Box>
                </div>
              ))}
            </div>
          </div>
          <AddItem label="marquee item" className="relative z-20 mt-4" />
        </div>
      </div>
    </section>
  );
}

/* ---------- 21st.dev & Aceternity-inspired 3D Components ---------- */

function Bento3D({ s, p }: { s: Section; p: Pal }) {
  const items = s.items ?? [
    {
      icon: "⚡",
      title: "Real-time AI Generation Engine",
      description: "Transform natural language briefs into live, editable, multi-page web applications with instant preview and interactive states.",
      badge: "Engine v4.2",
      stat: "0.8s",
      size: "large",
    },
    {
      icon: "🛡️",
      title: "Enterprise Grade Security",
      description: "Bank-level encryption, SOC-2 readiness, and instant compliance out of the box.",
      stat: "99.99%",
      size: "small",
    },
    {
      icon: "🎨",
      title: "Pixel-Perfect Visual Canvas",
      description: "Edit any text, color, image, and motion directly with intuitive inline tools.",
      stat: "100%",
      size: "small",
    },
    {
      icon: "🚀",
      title: "Production Next.js & Tailwind v4 Codebase",
      description: "Export clean, developer-approved TypeScript code that seamlessly deploys to Vercel, AWS, or any cloud platform.",
      badge: "Zero Lock-in",
      stat: "10x",
      size: "large",
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="anim-blob pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full opacity-20 blur-[100px]" style={{ background: p.accent }} />
      <div className="anim-blob pointer-events-none absolute -right-20 top-1/4 h-96 w-96 rounded-full opacity-15 blur-[100px]" style={{ background: p.accent2, animationDelay: "-6s" }} />

      <div className="relative mx-auto max-w-6xl">
        <Head s={s} p={p} />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => {
            const isLarge = it.size === "large" || i === 0 || i === 3;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${
                  isLarge ? "md:col-span-2" : "md:col-span-1"
                }`}
                style={{
                  background: `linear-gradient(145deg, ${p.card}, ${p.alt})`,
                  border: `1px solid ${p.border}`,
                  boxShadow: `0 15px 40px -15px ${p.accent}15`,
                }}
              >
                <div
                  className="absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
                />

                <Box i={i} label="bento card">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{ background: p.grad }}
                    >
                      {it.icon ?? "✦"}
                    </span>
                    {it.stat && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider"
                        style={{ background: p.tint, color: p.accent, border: `1px solid ${p.accent}33` }}
                      >
                        <Ed f="stat" i={i} value={it.stat} />
                      </span>
                    )}
                  </div>

                  <div className="mt-6">
                    {it.badge && (
                      <span className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                        <Ed f="badge" i={i} value={it.badge} />
                      </span>
                    )}
                    <Ed as="h3" f="title" i={i} value={it.title} className="block text-xl font-bold tracking-tight" style={{ fontFamily: p.heading }} />
                    <Ed as="p" f="description" i={i} value={it.description} className="mt-2.5 block text-sm leading-relaxed" style={{ color: p.muted }} />
                  </div>

                  {isLarge && (
                    <div
                      className="mt-6 rounded-2xl p-4 font-mono text-xs overflow-hidden opacity-85 transition-opacity group-hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${p.border}` }}
                    >
                      <div className="flex items-center gap-1.5 pb-2 text-[10px] text-slate-500 border-b border-white/[0.06]">
                        <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                        <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                        <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                        <span className="ml-2">app/experience/page.tsx</span>
                      </div>
                      <p className="mt-2 text-slate-400"><span className="text-purple-400">export default</span> <span className="text-orange-400">function</span> <span className="text-blue-400">Showcase</span>() &#123;</p>
                      <p className="ml-4 text-slate-300"><span className="text-purple-400">return</span> &lt;<span className="text-emerald-400">ExperienceEngine</span> interactive=&#123;<span className="text-orange-400">true</span>&#125; 3D=&#123;<span className="text-cyan-400">&quot;active&quot;</span>&#125; /&gt;;</p>
                      <p className="text-slate-400">&#125;</p>
                    </div>
                  )}
                </Box>
              </motion.div>
            );
          })}
        </div>
        <AddItem label="bento card" className="mt-8" />
      </div>
    </section>
  );
}

function Testimonials3D({ s, p }: { s: Section; p: Pal }) {
  const items = s.items ?? [
    {
      quote: "Codube replaced an entire agency contract for our startup. We went live in 2 days and closed our seed round with the new site.",
      name: "Marcus Vance",
      role: "CEO & Co-founder at Lumina AI",
      badge: "Seed Stage · $3.2M",
      stat: "★★★★★",
    },
    {
      quote: "The visual editing combined with real-time 3D animations is insane. We doubled our landing page conversion rate overnight.",
      name: "Elena Rostova",
      role: "VP of Growth at HyperScale",
      badge: "Series A · Y Combinator",
      stat: "★★★★★",
    },
    {
      quote: "No other AI builder outputs code this clean. Our senior developers actually complimented the Next.js and Tailwind export.",
      name: "David Kim",
      role: "Head of Product at NexusCloud",
      badge: "Enterprise Tech",
      stat: "★★★★★",
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="anim-blob pointer-events-none absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full opacity-20 blur-[120px]" style={{ background: p.accent }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold"
            style={{ background: p.tint, color: p.accent, border: `1px solid ${p.accent}44` }}
          >
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <Ed f="badge" value={s.badge ?? "Loved by 12,000+ founders worldwide"} />
          </span>
          <Ed as="h2" f="title" value={s.title ?? "Trusted by industry leaders"} className="mt-4 block text-3xl font-extrabold tracking-tight @2xl:text-5xl" style={{ fontFamily: p.heading }} />
          <Ed as="p" f="subtitle" value={s.subtitle ?? "See why high-growth startups and creative studios build with us."} className="mx-auto mt-3 max-w-xl text-base" style={{ color: p.muted }} />
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3 [perspective:1200px]">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="anim-float group relative rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: `linear-gradient(150deg, ${p.card}, ${p.alt})`,
                border: `1px solid ${p.border}`,
                boxShadow: `0 20px 50px -15px ${p.accent}20`,
                animationDelay: `${i * -2.5}s`,
              }}
            >
              <div
                className="absolute inset-x-0 -top-px h-px opacity-70"
                style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
              />
              <Box i={i} label="testimonial">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-widest text-amber-400">
                    <Ed f="stat" i={i} value={it.stat ?? "★★★★★"} />
                  </span>
                  {it.badge && (
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-slate-400 border border-white/10">
                      <Ed f="badge" i={i} value={it.badge} />
                    </span>
                  )}
                </div>

                <Ed as="p" f="quote" i={i} value={it.quote} className="mt-5 block text-sm leading-relaxed" style={{ color: p.text }} />

                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ring-2 ring-white/20"
                    style={{ background: p.grad }}
                  >
                    {(it.name?.[0] ?? "U").toUpperCase()}
                  </div>
                  <div>
                    <Ed as="p" f="name" i={i} value={it.name} className="block text-sm font-bold" style={{ fontFamily: p.heading }} />
                    <Ed as="p" f="role" i={i} value={it.role} className="block text-xs" style={{ color: p.muted }} />
                  </div>
                </div>
              </Box>
            </motion.div>
          ))}
        </div>
        <AddItem label="testimonial" className="mt-8" />
      </div>
    </section>
  );
}

function Pricing3D({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  const [annual, setAnnual] = useState(false);
  const items = s.items ?? [
    {
      title: "Starter",
      price: annual ? "$29" : "$39",
      description: "Ideal for solo builders and early prototypes.",
      features: ["3 Live websites", "Full Visual Click-to-Edit", "Unsplash Stock Photos", "Community support"],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      title: "Pro Creator",
      price: annual ? "$79" : "$99",
      description: "For startups, agencies, and high-velocity creators.",
      features: ["Unlimited Live Websites", "3D & Animated Component Library", "Next.js & TypeScript Code Export", "Custom Domain & Zero Branding", "Priority 24/7 VIP Support"],
      cta: "Unlock Pro Power",
      highlighted: true,
      badge: "🔥 Most Popular",
    },
    {
      title: "Enterprise",
      price: annual ? "$199" : "$249",
      description: "Dedicated infrastructure, custom SLAs, and VIP support.",
      features: ["Everything in Pro", "Custom Component Design", "Dedicated Account Manager", "SSO & SOC2 Compliance", "Unlimited Team Seats"],
      cta: "Talk to Sales",
      highlighted: false,
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="anim-blob pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full opacity-25 blur-[120px]" style={{ background: p.accent }} />
      <div className="anim-blob pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full opacity-20 blur-[120px]" style={{ background: p.accent2, animationDelay: "-5s" }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold"
            style={{ background: p.tint, color: p.accent, border: `1px solid ${p.accent}44` }}
          >
            ✦ Transparent Pricing
          </span>
          <Ed as="h2" f="title" value={s.title ?? "Invest in speed & excellence"} className="mt-4 block text-3xl font-extrabold tracking-tight @2xl:text-5xl" style={{ fontFamily: p.heading }} />
          <Ed as="p" f="subtitle" value={s.subtitle ?? "Cancel anytime. No hidden fees. Instant setup."} className="mx-auto mt-3 max-w-xl text-base" style={{ color: p.muted }} />

          <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs font-medium backdrop-blur">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 transition ${!annual ? "bg-white/15 text-white shadow-sm font-semibold" : "text-slate-400 hover:text-white"}`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition ${annual ? "bg-brand-gradient text-white shadow-md font-semibold" : "text-slate-400 hover:text-white"}`}
            >
              <span>Annual billing</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3 items-stretch [perspective:1200px]">
          {items.map((it, i) => {
            const isFeatured = !!it.highlighted;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className={`relative flex flex-col rounded-3xl p-8 transition-all duration-500 ${
                  isFeatured
                    ? "md:-translate-y-3 shadow-2xl ring-2 ring-orange-500/60"
                    : "border border-white/10 hover:-translate-y-1.5 hover:shadow-xl"
                }`}
                style={{
                  background: isFeatured
                    ? `linear-gradient(155deg, ${p.card}, #131122)`
                    : `linear-gradient(155deg, ${p.card}, ${p.alt})`,
                  boxShadow: isFeatured ? `0 25px 60px -15px ${p.accent}40` : undefined,
                }}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-4 py-1 text-xs font-bold text-white shadow-lg shadow-orange-500/30">
                    <Ed f="badge" i={i} value={it.badge ?? "🔥 Best Value"} />
                  </div>
                )}

                <Box i={i} label="pricing plan" className="flex flex-col flex-1">
                  <div>
                    <Ed as="h3" f="title" i={i} value={it.title} className="block text-xl font-bold" style={{ fontFamily: p.heading }} />
                    <Ed as="p" f="description" i={i} value={it.description} className="mt-1.5 block text-xs" style={{ color: p.muted }} />
                  </div>

                  <div className="my-6 flex items-baseline gap-1.5">
                    <Ed as="span" f="price" i={i} value={it.price} className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: p.heading }} />
                    <span className="text-xs" style={{ color: p.muted }}>/ month</span>
                  </div>

                  <div className="h-px bg-white/[0.08]" />

                  <ul className="my-6 flex-1 space-y-3 text-xs leading-normal">
                    {(it.features ?? []).map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                          <Check size={11} />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onNav(it.cta ?? "get started")}
                    className={`btn-shine w-full rounded-2xl py-3 text-sm font-semibold transition hover:scale-[1.02] ${
                      isFeatured
                        ? "bg-brand-gradient text-white shadow-lg shadow-orange-500/40"
                        : "border border-white/15 bg-white/[0.05] text-white hover:bg-white/10"
                    }`}
                  >
                    <Ed f="cta" i={i} value={it.cta ?? "Get Started"} />
                  </button>
                </Box>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-xs text-slate-500">
          <span>🛡️ 14-day 100% money-back guarantee • Cancel online with 1-click anytime</span>
        </div>
        <AddItem label="pricing plan" className="mt-4" />
      </div>
    </section>
  );
}

function Products3D({ s, p, onAdd }: { s: Section; p: Pal; onAdd?: () => void }) {
  const items = s.items ?? [
    {
      title: "Codube Ultra Studio License",
      description: "Full commercial access to 50+ animated 3D components, templates, and lifetime updates.",
      price: "$149",
      badge: "20% OFF",
      emoji: "⚡",
      stat: "★★★★★ (4.9)",
    },
    {
      title: "Enterprise SaaS Accelerator Kit",
      description: "Complete design system with authentication, dashboards, billing modals, and high-converting checkout.",
      price: "$299",
      badge: "BESTSELLER",
      emoji: "🚀",
      stat: "★★★★★ (5.0)",
    },
    {
      title: "Aceternity Motion Masterpack",
      description: "Aurora meshes, 3D card tilts, particle fields, and smooth spring physics for high-ticket clients.",
      price: "$99",
      badge: "POPULAR",
      emoji: "🎆",
      stat: "★★★★★ (4.8)",
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="anim-blob pointer-events-none absolute right-1/4 top-10 h-96 w-96 rounded-full opacity-20 blur-[100px]" style={{ background: p.accent }} />

      <div className="relative mx-auto max-w-6xl">
        <Head s={s} p={p} />

        <div className="mt-14 grid gap-6 md:grid-cols-3 [perspective:1200px]">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="anim-float group relative flex flex-col overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: `linear-gradient(150deg, ${p.card}, ${p.alt})`,
                border: `1px solid ${p.border}`,
                boxShadow: `0 20px 45px -15px ${p.accent}20`,
                animationDelay: `${i * -2}s`,
              }}
            >
              <Box i={i} label="product" className="flex flex-col flex-1">
                <div
                  className="relative flex aspect-video w-full items-center justify-center rounded-2xl overflow-hidden text-5xl shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${p.card}, ${p.alt})`, border: `1px solid ${p.border}` }}
                >
                  <span className="transition-transform duration-300 group-hover:scale-125">
                    {it.emoji ?? "🎁"}
                  </span>
                  {it.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                      <Ed f="badge" i={i} value={it.badge} />
                    </span>
                  )}
                </div>

                <div className="mt-5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-400">
                      <Ed f="stat" i={i} value={it.stat ?? "★★★★★ 5.0"} />
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">● In stock</span>
                  </div>
                  <Ed as="h3" f="title" i={i} value={it.title} className="mt-2 block text-lg font-bold tracking-tight" style={{ fontFamily: p.heading }} />
                  <Ed as="p" f="description" i={i} value={it.description} className="mt-1.5 block text-xs leading-relaxed" style={{ color: p.muted }} />
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider block" style={{ color: p.muted }}>Price</span>
                    <Ed as="span" f="price" i={i} value={it.price} className="text-2xl font-extrabold" style={{ fontFamily: p.heading }} />
                  </div>
                  <button
                    type="button"
                    onClick={onAdd}
                    className="btn-shine flex items-center gap-1.5 rounded-xl bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:scale-105"
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                </div>
              </Box>
            </motion.div>
          ))}
        </div>
        <AddItem label="product" className="mt-8" />
      </div>
    </section>
  );
}

function Stats3D({ s, p }: { s: Section; p: Pal }) {
  const items = s.items ?? [
    { value: "$120M+", label: "Total Client Revenue", change: "↑ 48% YoY", icon: "💰" },
    { value: "99.99%", label: "Platform Uptime SLA", change: "Zero Downtime", icon: "⚡" },
    { value: "140K+", label: "Websites Shipped", change: "✦ 120 Countries", icon: "🚀" },
    { value: "0.2s", label: "Global Edge Latency", change: "Sub-second TTFB", icon: "🌐" },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-20 @2xl:px-10 @2xl:py-28" style={{ background: p.bg }}>
      <div className="relative mx-auto max-w-6xl">
        <Head s={s} p={p} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 [perspective:1200px]">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="anim-float group relative rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: `linear-gradient(150deg, ${p.card}, ${p.alt})`,
                border: `1px solid ${p.border}`,
                boxShadow: `0 15px 40px -15px ${p.accent}20`,
                animationDelay: `${i * -1.8}s`,
              }}
            >
              <div
                className="absolute inset-x-0 -top-px h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
              />
              <Box i={i} label="stat">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{it.icon ?? "✦"}</span>
                  {it.change && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      <Ed f="change" i={i} value={it.change} />
                    </span>
                  )}
                </div>
                <Ed as="p" f="value" i={i} value={it.value} className="mt-4 block text-3xl font-extrabold tracking-tight" style={{ fontFamily: p.heading, ...gradText(p) }} />
                <Ed as="p" f="label" i={i} value={it.label} className="mt-1 block text-xs font-medium" style={{ color: p.muted }} />
              </Box>
            </motion.div>
          ))}
        </div>
        <AddItem label="stat" className="mt-6" />
      </div>
    </section>
  );
}

function FeaturesTabs({ s, p }: { s: Section; p: Pal }) {
  const [activeTab, setActiveTab] = useState(0);
  const items = s.items ?? [
    {
      icon: "⚡",
      title: "Real-time Visual Editor",
      description: "Click any heading, text, or button to modify instantly with a live responsive preview.",
      stat: "Instant Preview",
    },
    {
      icon: "🧠",
      title: "Autonomous AI Agent",
      description: "Ask Codube to redesign sections, update colors, or improve copy with conversational precision.",
      stat: "Multi-Model AI",
    },
    {
      icon: "📦",
      title: "Production Code Export",
      description: "Full TypeScript Next.js app with clean Tailwind v4 styles ready to ship directly.",
      stat: "100% Ownership",
    },
    {
      icon: "🖼️",
      title: "Unsplash Stock Photos",
      description: "Direct high-resolution photos curated across technology, business, workspace, and products.",
      stat: "Free Stock Photos",
    },
  ];

  const current = items[activeTab] ?? items[0];

  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="relative mx-auto max-w-6xl">
        <Head s={s} p={p} />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {items.map((it, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-semibold transition-all ${
                activeTab === idx
                  ? "bg-brand-gradient text-white shadow-lg shadow-orange-500/25 scale-105"
                  : "border border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <span>{it.icon}</span>
              <span>{it.title}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 overflow-hidden rounded-3xl p-8 @2xl:p-12 shadow-2xl"
          style={{ background: `linear-gradient(145deg, ${p.card}, ${p.alt})`, border: `1px solid ${p.border}` }}
        >
          <div className="grid items-center gap-8 @3xl:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="inline-block rounded-full px-3 py-1 text-xs font-bold font-mono" style={{ background: p.tint, color: p.accent }}>
                {current.stat}
              </span>
              <Ed as="h3" f="title" i={activeTab} value={current.title} className="mt-4 block text-2xl font-extrabold tracking-tight @2xl:text-3xl" style={{ fontFamily: p.heading }} />
              <Ed as="p" f="description" i={activeTab} value={current.description} className="mt-3 block text-sm leading-relaxed" style={{ color: p.muted }} />
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Check size={16} />
                </span>
                <span className="text-xs font-medium text-slate-300">Live synchronization with code generation</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#08080f] p-4 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 text-[11px] text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 rounded-lg bg-white/[0.04] px-4 py-0.5 text-slate-400 font-mono text-[10px]">https://your-startup.codube.app</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-5 w-1/3 rounded-lg bg-gradient-to-r from-orange-500/40 to-purple-500/40" />
                <div className="h-3 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/[0.06]" />
                <div className="grid grid-cols-3 gap-2 pt-3">
                  <div className="h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] p-2">
                    <div className="h-2 w-8 rounded bg-orange-400/60" />
                    <div className="mt-2 h-4 w-12 rounded bg-white/20" />
                  </div>
                  <div className="h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] p-2">
                    <div className="h-2 w-8 rounded bg-purple-400/60" />
                    <div className="mt-2 h-4 w-12 rounded bg-white/20" />
                  </div>
                  <div className="h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] p-2">
                    <div className="h-2 w-8 rounded bg-emerald-400/60" />
                    <div className="mt-2 h-4 w-12 rounded bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CtaMesh({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-36" style={{ background: p.bg }}>
      <div className="anim-blob pointer-events-none absolute -left-20 top-0 h-[450px] w-[450px] rounded-full opacity-35 blur-[120px]" style={{ background: p.accent }} />
      <div className="anim-blob pointer-events-none absolute -right-20 bottom-0 h-[450px] w-[450px] rounded-full opacity-30 blur-[120px]" style={{ background: p.accent2, animationDelay: "-6s" }} />

      <div className="relative mx-auto max-w-4xl text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-lg backdrop-blur"
          style={{ background: p.tint, color: p.accent, border: `1px solid ${p.accent}55` }}
        >
          <span className="h-2 w-2 animate-ping rounded-full bg-orange-400" />
          <Ed f="badge" value={s.badge ?? "✦ Join the Next Generation of Builders"} />
        </span>

        <Ed as="h2" f="title" value={s.title ?? "Build something that turns heads today"} className="mt-6 block text-4xl font-extrabold tracking-tight @2xl:text-6xl" style={{ fontFamily: p.heading }} />
        <Ed as="p" f="subtitle" value={s.subtitle ?? "Turn your raw idea into a live, high-converting product with AI, 3D aesthetics, and production-ready code."} className="mx-auto mt-4 block max-w-2xl text-base leading-relaxed" style={{ color: p.muted }} />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onNav(s.cta ?? "start building free")}
            className="btn-shine rounded-2xl bg-brand-gradient px-8 py-4 text-base font-bold text-white shadow-2xl shadow-orange-500/40 transition hover:scale-105"
          >
            <Ed f="cta" value={s.cta ?? "Start Building Free →"} />
          </button>
          {s.cta2 && (
            <button
              type="button"
              onClick={() => onNav(s.cta2!)}
              className="rounded-2xl border border-white/20 bg-white/[0.05] px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Ed f="cta2" value={s.cta2} />
            </button>
          )}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {["#f97316", "#8b5cf6", "#3b82f6", "#10b981", "#ec4899"].map((bg, idx) => (
              <span
                key={idx}
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-[#060608]"
                style={{ background: bg }}
              >
                {["J", "M", "E", "D", "K"][idx]}
              </span>
            ))}
          </div>
          <span className="text-xs font-medium" style={{ color: p.muted }}>
            Over <b className="text-white">10,000+</b> websites generated this month
          </span>
        </div>
      </div>
    </section>
  );
}

function Comparisons({ s, p }: { s: Section; p: Pal }) {
  const rows = [
    { feature: "Time to Launch", codube: "Under 2 Minutes", others: "2 to 8 Weeks" },
    { feature: "Visual Click-to-Edit", codube: "Instant on Canvas", others: "Requires Code Editing" },
    { feature: "3D & Motion Aesthetics", codube: "21st.dev / Aceternity", others: "Basic Static Blocks" },
    { feature: "Export Quality", codube: "Production Next.js & TS", others: "Locked in Proprietary CMS" },
    { feature: "Curated Stock Media", codube: "High-Res Unsplash CDN", others: "Generic Placeholders" },
    { feature: "Total Cost", codube: "Affordable SaaS", others: "$5,000 - $30,000 Agency" },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="relative mx-auto max-w-5xl">
        <Head s={s} p={p} />

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 shadow-2xl" style={{ background: p.card }}>
          <div className="grid grid-cols-3 border-b border-white/[0.08] p-5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Capability</span>
            <span className="text-orange-400 font-extrabold flex items-center gap-1.5">✦ Codube</span>
            <span>Traditional Methods</span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-3 items-center p-5 text-sm transition hover:bg-white/[0.02]">
                <span className="font-semibold text-white">{r.feature}</span>
                <span className="flex items-center gap-2 font-bold text-emerald-400">
                  <Check size={16} className="text-emerald-400 shrink-0" /> {r.codube}
                </span>
                <span className="text-slate-500">{r.others}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq3D({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  const items = s.items ?? [
    {
      question: "How does Codube build complete websites so fast?",
      answer: "Codube uses advanced multi-model AI combined with modern, pre-architected Next.js and Tailwind v4 design tokens to generate layout, typography, copy, and stock photos simultaneously.",
    },
    {
      question: "Can I export and host the website on my own domain?",
      answer: "Yes! You can approve the design and download production-ready Next.js code or deploy it directly to Vercel, Netlify, AWS, or any server with zero lock-in.",
    },
    {
      question: "Can I customize the 3D animations and color themes?",
      answer: "Absolutely. Everything is 100% editable on the canvas: click any text to change color/formatting, or use the Design panel to apply custom gradients, fonts, and corner radiuses.",
    },
    {
      question: "Are the Unsplash stock photos free for commercial use?",
      answer: "Yes, all photos in the Unsplash integration are high-resolution, free for commercial projects, and delivered via instant CDN caching.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="relative mx-auto max-w-4xl">
        <Head s={s} p={p} />

        <div className="mt-14 space-y-4">
          {items.map((it, i) => {
            const isOpen = openIdx === i;
            return (
              <Box key={i} i={i} label="faq item">
                <div
                  className="rounded-2xl transition-all duration-300"
                  style={{
                    background: `linear-gradient(145deg, ${p.card}, ${p.alt})`,
                    border: `1px solid ${isOpen ? p.accent + "66" : p.border}`,
                    boxShadow: isOpen ? `0 10px 30px -10px ${p.accent}20` : undefined,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-semibold text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-orange-400">0{i + 1}</span>
                      <Ed f="question" i={i} value={it.question} />
                    </span>
                    <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-orange-400" : "text-slate-500"}`} />
                  </button>

                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <Ed as="p" f="answer" i={i} value={it.answer} className="block px-5 pb-5 text-sm leading-relaxed" style={{ color: p.muted }} />
                    </div>
                  </div>
                </div>
              </Box>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div>
            <p className="text-sm font-bold text-white">Still have questions?</p>
            <p className="text-xs text-slate-400">Our engineering team is active 24/7 on live chat and Discord.</p>
          </div>
          <button
            type="button"
            onClick={() => onNav("contact")}
            className="rounded-xl bg-white/[0.08] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.14]"
          >
            Chat with Support →
          </button>
        </div>
        <AddItem label="faq item" className="mt-6" />
      </div>
    </section>
  );
}

function Footer3D({ s, p, onNav, brand }: { s: Section; p: Pal; onNav: OnNav; brand?: string }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const brandName = s.brand ?? brand ?? "Codube";

  const columns = [
    { title: "Product", links: ["Features", "Templates", "Pricing", "Changelog", "Roadmap"] },
    { title: "Resources", links: ["Documentation", "Component Library", "Community Discord", "Tutorials", "API Reference"] },
    { title: "Company", links: ["About Us", "Careers (Hiring)", "Blog", "Brand Assets", "Contact"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "Cookie Preferences"] },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] px-6 pb-12 pt-24 @2xl:px-10" style={{ background: p.card }}>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden text-center font-extrabold tracking-tighter opacity-[0.03]"
        style={{ fontSize: "clamp(4rem, 16vw, 16rem)", lineHeight: 0.8 }}
      >
        {brandName.toUpperCase()}
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div
          className="relative mb-16 overflow-hidden rounded-3xl p-8 @2xl:p-12 shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${p.alt}, ${p.bg})`, border: `1px solid ${p.border}` }}
        >
          <div className="anim-blob pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: p.accent }} />
          <div className="relative grid items-center gap-6 @3xl:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-orange-400 border border-white/10">
                ✦ Stay on the bleeding edge
              </span>
              <Ed as="h3" f="title" value={s.title ?? "Join 40,000+ engineers building the future"} className="mt-3 block text-2xl font-extrabold tracking-tight @2xl:text-3xl" style={{ fontFamily: p.heading }} />
              <Ed as="p" f="subtitle" value={s.subtitle ?? "Weekly teardowns of high-ticket websites, prompt engineering tips, and new components."} className="mt-2 text-sm" style={{ color: p.muted }} />
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] p-2 backdrop-blur focus-within:border-orange-500/60"
            >
              {subscribed ? (
                <div className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-emerald-400">
                  <Check size={16} /> You&apos;re subscribed! Welcome aboard.
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    className="flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="btn-shine rounded-xl bg-brand-gradient px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:scale-105"
                  >
                    Subscribe
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-1">
            <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: p.heading, ...gradText(p) }}>
              {brandName}
            </span>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: p.muted }}>
              The high-velocity platform for creators, agencies, and modern startups.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> All systems operational
              </span>
            </div>
          </div>

          {columns.map((col, idx) => (
            <div key={idx}>
              <p className="text-xs font-bold uppercase tracking-wider text-white">{col.title}</p>
              <ul className="mt-4 space-y-2 text-xs">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={() => onNav(link.toLowerCase())}
                      className="transition hover:text-white text-left"
                      style={{ color: p.muted }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs" style={{ color: p.muted }}>
          <p>© {new Date().getFullYear()} {brandName}, Inc. All rights reserved. Crafted with precision.</p>
          <div className="flex items-center gap-5">
            <span className="cursor-pointer hover:text-white transition">Twitter / X</span>
            <span className="cursor-pointer hover:text-white transition">GitHub</span>
            <span className="cursor-pointer hover:text-white transition">Discord</span>
            <span className="cursor-pointer hover:text-white transition">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- content sections ---------- */

function Stats({ s, p }: { s: Section; p: Pal }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-6 text-center @3xl:grid-cols-4">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 80}>
            <Box i={i} label="stat">
              <Ed as="p" f="value" i={i} value={it.value} className="block text-4xl font-extrabold" style={{ fontFamily: p.heading, ...gradText(p) }} />
              <Ed as="p" f="label" i={i} value={it.label} className="mt-1 text-sm" style={{ color: p.muted }} />
            </Box>
          </Reveal>
        ))}
      </div>
      <AddItem label="stat" />
    </>
  );
}

function Features({ s, p }: { s: Section; p: Pal }) {
  return (
    <>
      <Head s={s} p={p} />
      <div className="grid gap-5 @md:grid-cols-2 @3xl:grid-cols-3">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 80}>
            <Box i={i} label="feature">
              <Glow p={p} className="h-full">
                <div className="p-6">
                  <Ed f="icon" i={i} value={it.icon} className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: p.tint }} />
                  <Ed as="h3" f="title" i={i} value={it.title} className="mt-4 block font-bold" style={{ fontFamily: p.heading }} />
                  <Ed as="p" f="description" i={i} value={it.description} className="mt-1.5 text-sm" style={{ color: p.muted }} />
                </div>
              </Glow>
            </Box>
          </Reveal>
        ))}
      </div>
      <AddItem label="feature" />
    </>
  );
}

function Bento({ s, p }: { s: Section; p: Pal }) {
  const { edit, on, loc } = useEd();
  return (
    <>
      <Head s={s} p={p} />
      <div className="grid gap-4 @3xl:grid-cols-3">
        {(s.items ?? []).map((it, i) => {
          const large = it.size === "large";
          return (
            <Reveal key={i} delay={(i % 3) * 80} className={large ? "@3xl:col-span-2" : ""}>
              <Box i={i} label="tile">
                <Glow p={p} className="h-full">
                  <div className="flex h-full min-h-[190px] flex-col justify-between p-6">
                    <div className="flex items-start justify-between">
                      <Ed f="icon" i={i} value={it.icon} className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: p.tint }} />
                      <Ed f="stat" i={i} value={it.stat} clearable addLabel="stat" addDefault="10x" className="text-3xl font-extrabold" style={{ fontFamily: p.heading, ...gradText(p) }} />
                    </div>
                    <div className="mt-6">
                      <Ed as="h3" f="title" i={i} value={it.title} className={`block font-bold ${large ? "text-xl" : ""}`} style={{ fontFamily: p.heading }} />
                      <Ed as="p" f="description" i={i} value={it.description} className="mt-1.5 text-sm" style={{ color: p.muted }} />
                    </div>
                  </div>
                  {on && edit && (
                    <button
                      type="button"
                      onClick={() => edit.setValue(loc("size", { item: i }), large ? "small" : "large")}
                      className="absolute bottom-2 right-2 z-20 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] text-white"
                    >
                      {large ? "Make small" : "Make wide"}
                    </button>
                  )}
                </Glow>
              </Box>
            </Reveal>
          );
        })}
      </div>
      <AddItem label="tile" />
    </>
  );
}

function Marquee({ s, p }: { s: Section; p: Pal }) {
  const { edit, sec, on } = useEd();
  const list = s.items ?? [];
  if (on && edit) {
    return (
      <div className="px-6 py-6" style={{ background: p.alt, borderTop: `1px solid ${p.border}`, borderBottom: `1px solid ${p.border}` }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold uppercase tracking-widest" style={{ color: p.muted }}>
          {list.map((it, i) => (
            <span key={i} className="group/row flex items-center gap-2">
              <Ed f="title" i={i} value={it.title} />
              <span style={{ color: p.accent }}>✦</span>
              <button
                type="button"
                title="Remove"
                onClick={() => edit.removeItem(sec.page, sec.index, i)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 transition group-hover/row:opacity-100"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <AddItem label="word" className="" />
        </div>
      </div>
    );
  }
  const items = list.map((i) => i.title).filter(Boolean) as string[];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden py-6" style={{ background: p.alt, borderTop: `1px solid ${p.border}`, borderBottom: `1px solid ${p.border}` }}>
      <div className="anim-marquee flex w-max gap-12 whitespace-nowrap text-sm font-semibold uppercase tracking-widest" style={{ color: p.muted }}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t} <span style={{ color: p.accent }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Steps({ s, p }: { s: Section; p: Pal }) {
  const items = s.items ?? [];
  return (
    <>
      <Head s={s} p={p} />
      <div className={`grid gap-5 ${items.length === 3 ? "@3xl:grid-cols-3" : "@3xl:grid-cols-4"}`}>
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 100}>
            <Box i={i} label="step">
              <div className="h-full p-6" style={cardStyle(p)}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: p.grad }}>
                  {i + 1}
                </span>
                <Ed as="h3" f="title" i={i} value={it.title} className="mt-4 block font-bold" style={{ fontFamily: p.heading }} />
                <Ed as="p" f="description" i={i} value={it.description} className="mt-1.5 text-sm" style={{ color: p.muted }} />
              </div>
            </Box>
          </Reveal>
        ))}
      </div>
      <AddItem label="step" />
    </>
  );
}

function Product({ it, idx, p, onAdd }: { it: Item; idx: number; p: Pal; onAdd: () => void }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="group h-full overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-xl" style={cardStyle(p)}>
      <Pic
        prompt={it.image}
        alt={it.title}
        f="image"
        i={idx}
        className="h-44"
        fallback={
          <div className="flex h-full w-full items-center justify-center text-6xl" style={{ background: `linear-gradient(135deg, ${p.accent}22, ${p.accent2}33)` }}>
            {it.emoji}
          </div>
        }
      >
        <div className="absolute left-3 top-3 z-10">
          <Ed f="badge" i={idx} value={it.badge} clearable addLabel="badge" addDefault="New" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white" style={{ background: p.grad }} />
        </div>
      </Pic>
      <div className="p-5">
        <Ed as="h3" f="title" i={idx} value={it.title} className="block font-bold" style={{ fontFamily: p.heading }} />
        <Ed as="p" f="description" i={idx} value={it.description} className="mt-1 text-sm" style={{ color: p.muted }} />
        <div className="mt-4 flex items-center justify-between">
          <Ed f="price" i={idx} value={it.price} className="text-lg font-bold" />
          <button
            type="button"
            onClick={() => {
              onAdd();
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: added ? "#059669" : p.grad, borderRadius: p.btnRadius }}
          >
            {added ? <><Check size={13} /> Added</> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Products({ s, p, onAdd }: { s: Section; p: Pal; onAdd: () => void }) {
  return (
    <>
      <Head s={s} p={p} />
      <div className="grid gap-5 @md:grid-cols-2 @3xl:grid-cols-3">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={(i % 3) * 80}>
            <Box i={i} label="product">
              <Product it={it} idx={i} p={p} onAdd={onAdd} />
            </Box>
          </Reveal>
        ))}
      </div>
      <AddItem label="product" />
    </>
  );
}

function Split({ s, p }: { s: Section; p: Pal }) {
  const { edit, on, loc } = useEd();
  return (
    <div className="grid items-center gap-12 @3xl:grid-cols-2">
      <Reveal className={s.reverse ? "@3xl:order-2" : ""}>
        <Pic
          prompt={s.image}
          alt={s.title}
          f="image"
          className="aspect-[4/3]"
          style={{ border: `1px solid ${p.border}`, borderRadius: p.radius }}
          fallback={
            <div className="flex h-full w-full items-center justify-center text-8xl" style={{ background: `linear-gradient(135deg, ${p.accent}22, ${p.accent2}33)` }}>
              <span className="anim-float">{s.visual}</span>
            </div>
          }
        />
      </Reveal>
      <Reveal delay={100}>
        <Ed as="h2" f="title" value={s.title} className="block text-3xl font-extrabold tracking-tight @2xl:text-4xl" style={{ fontFamily: p.heading }} />
        <Ed as="p" f="text" value={s.text} className="mt-4" style={{ color: p.muted }} />
        <ul className="mt-6 space-y-3">
          {(s.bullets ?? []).map((b, j) => (
            <li key={j} className="group/row flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: p.grad }}>
                <Check size={12} />
              </span>
              <Ed f="bullets" idx={j} value={b} className="flex-1" />
              <RowX f="bullets" idx={j} />
            </li>
          ))}
        </ul>
        <AddStr f="bullets" label="point" value="New point" className="mt-3" />
        {on && edit && (
          <button
            type="button"
            onClick={() => edit.setValue(loc("reverse"), !s.reverse)}
            className="ml-2 mt-3 rounded-full border border-dashed border-sky-400 px-2.5 py-0.5 text-[11px] font-medium text-sky-500 transition hover:bg-sky-50"
          >
            ⇄ Flip image side
          </button>
        )}
      </Reveal>
    </div>
  );
}

function Team({ s, p }: { s: Section; p: Pal }) {
  return (
    <>
      <Head s={s} p={p} />
      <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 80}>
            <Box i={i} label="member">
              <Glow p={p} className="h-full">
                <div className="p-6 text-center">
                  <Pic
                    prompt={it.image}
                    alt={it.name}
                    f="image"
                    i={i}
                    small
                    className="mx-auto h-20 w-20 rounded-full shadow-lg"
                    fallback={
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white" style={{ background: `linear-gradient(${135 + i * 40}deg, ${p.accent}, ${p.accent2})` }}>
                        {it.name?.[0]}
                      </div>
                    }
                  />
                  <Ed as="p" f="name" i={i} value={it.name} className="mt-4 block font-bold" style={{ fontFamily: p.heading }} />
                  <Ed as="p" f="role" i={i} value={it.role} className="mt-0.5 text-xs" style={{ color: p.muted }} />
                </div>
              </Glow>
            </Box>
          </Reveal>
        ))}
      </div>
      <AddItem label="member" />
    </>
  );
}

function TCard({ it, idx, p, cls }: { it: Item; idx: number; p: Pal; cls: string }) {
  return (
    <figure className={`p-6 ${cls}`} style={cardStyle(p)}>
      <div className="flex gap-0.5 text-sm" style={{ color: "#f59e0b" }}>★★★★★</div>
      <Ed as="p" f="quote" i={idx} value={it.quote} className="mt-3 text-sm leading-relaxed" style={{ color: p.muted }} />
      <figcaption className="mt-5 flex items-center gap-3">
        <Pic
          prompt={it.image}
          alt={it.name}
          f="image"
          i={idx}
          small
          className="h-10 w-10 shrink-0 rounded-full"
          fallback={
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(${135 + idx * 45}deg, ${p.accent}, ${p.accent2})` }}>
              {it.name?.[0]}
            </div>
          }
        />
        <span>
          <Ed as="span" f="name" i={idx} value={it.name} className="block text-sm font-semibold" />
          <Ed as="span" f="role" i={idx} value={it.role} className="block text-xs" style={{ color: p.muted }} />
        </span>
      </figcaption>
    </figure>
  );
}

function Testimonials({ s, p }: { s: Section; p: Pal }) {
  const { on } = useEd();
  const items = s.items ?? [];
  const mask = "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)";
  if (on) {
    return (
      <>
        <Head s={s} p={p} />
        <div className="grid gap-5 @3xl:grid-cols-3">
          {items.map((it, i) => (
            <Box key={i} i={i} label="testimonial">
              <TCard it={it} idx={i} p={p} cls="h-full" />
            </Box>
          ))}
        </div>
        <AddItem label="testimonial" />
      </>
    );
  }
  return (
    <>
      <Head s={s} p={p} />
      <div className="overflow-hidden py-2" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <div className="anim-marquee-slow flex w-max gap-5 hover:[animation-play-state:paused]">
          {[...items, ...items].map((it, i) => (
            <TCard key={i} it={it} idx={i % Math.max(items.length, 1)} p={p} cls="w-80 shrink-0" />
          ))}
        </div>
      </div>
    </>
  );
}

function Pricing({ s, p }: { s: Section; p: Pal }) {
  const { edit, on, loc } = useEd();
  return (
    <>
      <Head s={s} p={p} />
      <div className="grid items-center gap-5 @3xl:grid-cols-3">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 80}>
            <Box i={i} label="plan">
              <div
                className={`relative p-7 transition duration-300 hover:-translate-y-1.5 ${it.highlighted ? "shadow-2xl @3xl:scale-105" : ""}`}
                style={{ ...cardStyle(p), border: it.highlighted ? `2px solid ${p.accent}` : `1px solid ${p.border}` }}
              >
                {it.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-semibold text-white" style={{ background: p.grad }}>
                    Most popular
                  </span>
                )}
                <Ed as="h3" f="title" i={i} value={it.title} className="block font-bold" style={{ fontFamily: p.heading }} />
                <Ed as="p" f="price" i={i} value={it.price} className="mt-3 block text-3xl font-extrabold" />
                <Ed as="p" f="description" i={i} value={it.description} className="mt-1 text-sm" style={{ color: p.muted }} />
                <ul className="mt-5 space-y-2 text-sm">
                  {(it.features ?? []).map((f, j) => (
                    <li key={j} className="group/row flex items-center gap-2">
                      <Check size={14} className="shrink-0" style={{ color: p.accent }} />
                      <Ed f="features" i={i} idx={j} value={f} className="flex-1" />
                      <RowX f="features" i={i} idx={j} />
                    </li>
                  ))}
                </ul>
                <AddStr f="features" i={i} label="feature" value="New feature" />
                <div className="mt-6">
                  <Btn p={p} kind={it.highlighted ? "primary" : "ghost"}>
                    <Ed f="cta" i={i} value={it.cta ?? "Choose plan"} />
                  </Btn>
                </div>
                {on && edit && (
                  <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs" style={{ color: p.muted }}>
                    <input
                      type="checkbox"
                      checked={!!it.highlighted}
                      onChange={(e) => edit.setValue(loc("highlighted", { item: i }), e.target.checked)}
                    />
                    Mark as most popular
                  </label>
                )}
              </div>
            </Box>
          </Reveal>
        ))}
      </div>
      <AddItem label="plan" />
    </>
  );
}

function FaqItem({ it, idx, p }: { it: Item; idx: number; p: Pal }) {
  const { on } = useEd();
  const [open, setOpen] = useState(false);
  const show = open || on;
  return (
    <div style={cardStyle(p)}>
      <Tap onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-semibold">
        <Ed f="question" i={idx} value={it.question} />
        <ChevronDown size={18} className="shrink-0 transition-transform duration-300" style={{ transform: show ? "rotate(180deg)" : "none" }} />
      </Tap>
      <div className="grid transition-all duration-300" style={{ gridTemplateRows: show ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <Ed as="p" f="answer" i={idx} value={it.answer} className="block px-5 pb-5 text-sm" style={{ color: p.muted }} />
        </div>
      </div>
    </div>
  );
}

function Faq({ s, p }: { s: Section; p: Pal }) {
  return (
    <>
      <Head s={s} p={p} />
      <div className="mx-auto max-w-2xl space-y-3">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 60}>
            <Box i={i} label="question" className="">
              <FaqItem it={it} idx={i} p={p} />
            </Box>
          </Reveal>
        ))}
      </div>
      <AddItem label="question" />
    </>
  );
}

function Contact({ s, p }: { s: Section; p: Pal }) {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Head s={s} p={p} />
      <div className="grid gap-8 @3xl:grid-cols-2">
        <div>
          <div className="space-y-4">
            {(s.items ?? []).map((it, i) => (
              <Reveal key={i} delay={i * 80}>
                <Box i={i} label="detail" className="">
                  <div className="flex items-start gap-4 p-5" style={cardStyle(p)}>
                    <Ed f="icon" i={i} value={it.icon} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: p.tint }} />
                    <div>
                      <Ed as="p" f="title" i={i} value={it.title} className="block font-bold" style={{ fontFamily: p.heading }} />
                      <Ed as="p" f="description" i={i} value={it.description} className="mt-0.5 text-sm" style={{ color: p.muted }} />
                    </div>
                  </div>
                </Box>
              </Reveal>
            ))}
          </div>
          <AddItem label="detail" />
        </div>
        <Reveal delay={120}>
          <form
            className="space-y-3 p-6"
            style={cardStyle(p)}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ background: p.grad }}>
                  <Check size={22} />
                </span>
                <p className="mt-4 font-bold" style={{ fontFamily: p.heading }}>Message sent</p>
                <p className="mt-1 text-sm" style={{ color: p.muted }}>This form is a live preview, nothing is saved yet.</p>
              </div>
            ) : (
              <>
                <input required placeholder="Your name" className="w-full border px-3 py-2.5 text-sm outline-none" style={inputStyle(p)} />
                <input required type="email" placeholder="Email address" className="w-full border px-3 py-2.5 text-sm outline-none" style={inputStyle(p)} />
                <textarea required placeholder="How can we help?" rows={5} className="w-full border px-3 py-2.5 text-sm outline-none" style={inputStyle(p)} />
                <Btn p={p} submit full>Send message</Btn>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </>
  );
}

function Cta({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  return (
    <section className="px-6 py-16 @2xl:px-10 @2xl:py-24" style={{ background: p.bg }}>
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden px-8 py-14 text-center text-white @2xl:px-16" style={{ background: p.grad, borderRadius: p.radius }}>
            <div className="anim-blob pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <Ed as="h2" f="title" value={s.title} className="relative block text-3xl font-extrabold tracking-tight @2xl:text-4xl" style={{ fontFamily: p.heading }} />
            <Ed as="p" f="subtitle" value={s.subtitle} clearable addLabel="subtitle" addDefault="A short supporting line." className="relative mx-auto mt-3 block max-w-xl text-white/85" />
            {s.cta && (
              <Tap
                onClick={() => onNav(s.cta!)}
                className="relative mt-7 inline-block bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-105"
                style={{ borderRadius: p.btnRadius }}
              >
                <Ed f="cta" value={s.cta} />
              </Tap>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- mock account pages ---------- */

function Auth({ s, p, onNav, brand }: { s: Section; p: Pal; onNav: OnNav; brand?: string }) {
  const signup = s.mode === "signup";
  return (
    <section className="grid min-h-[620px] @3xl:grid-cols-2" style={{ background: p.bg }}>
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <Ed as="h2" f="title" value={s.title ?? (signup ? "Create your account" : "Welcome back")} className="block text-3xl font-extrabold tracking-tight" style={{ fontFamily: p.heading }} />
          <Ed as="p" f="subtitle" value={s.subtitle ?? (signup ? "It only takes a minute." : "Log in to continue.")} className="mt-2 text-sm" style={{ color: p.muted }} />
          <form
            className="mt-7 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              onNav("dashboard");
            }}
          >
            {signup && <input required placeholder="Full name" className="w-full border px-3 py-2.5 text-sm outline-none" style={inputStyle(p)} />}
            <input required type="email" placeholder="Email address" className="w-full border px-3 py-2.5 text-sm outline-none" style={inputStyle(p)} />
            <input required type="password" placeholder="Password" className="w-full border px-3 py-2.5 text-sm outline-none" style={inputStyle(p)} />
            <Btn p={p} submit full>
              <Ed f="cta" value={s.cta ?? (signup ? "Create account" : "Log in")} />
            </Btn>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs" style={{ color: p.muted }}>
            <span className="h-px flex-1" style={{ background: p.border }} /> or <span className="h-px flex-1" style={{ background: p.border }} />
          </div>
          <Btn p={p} kind="ghost" full onClick={() => onNav("dashboard")}>Continue with Google</Btn>
          <p className="mt-6 text-sm" style={{ color: p.muted }}>
            {signup ? "Already have an account? " : "New here? "}
            <button type="button" onClick={() => onNav(signup ? "login" : "signup")} className="font-semibold" style={{ color: p.accent }}>
              {signup ? "Log in" : "Sign up"}
            </button>
          </p>
          <p className="mt-6 text-xs" style={{ color: p.muted }}>Preview mode: nothing is saved yet.</p>
        </div>
      </div>
      <div className="relative hidden items-center justify-center overflow-hidden p-12 text-white @3xl:flex" style={{ background: p.grad }}>
        <div className="anim-blob pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative max-w-sm">
          <p className="text-2xl font-extrabold" style={{ fontFamily: p.heading }}>{brand}</p>
          <Ed as="p" f="text" value={s.text} clearable addLabel="text" addDefault="A short line about your brand." className="mt-4 block text-lg leading-relaxed text-white/90" />
        </div>
      </div>
    </section>
  );
}

function Auth3D({ s, p, onNav, brand }: { s: Section; p: Pal; onNav: OnNav; brand?: string }) {
  const [tab, setTab] = useState<"login" | "signup">((s.mode as any) ?? "signup");
  const brandName = s.brand ?? brand ?? "Codube";
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-32" style={{ background: p.bg }}>
      <div className="anim-blob pointer-events-none absolute -left-24 top-1/4 h-[480px] w-[480px] rounded-full opacity-25 blur-[120px]" style={{ background: p.accent }} />
      <div className="anim-blob pointer-events-none absolute -right-24 bottom-1/4 h-[480px] w-[480px] rounded-full opacity-20 blur-[120px]" style={{ background: p.accent2, animationDelay: "-5s" }} />

      <div className="relative mx-auto max-w-5xl [perspective:1400px]">
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          {/* Left: 3D Branding & Value Prop Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-3xl p-8 lg:col-span-5 lg:p-10 shadow-2xl"
            style={{
              background: `linear-gradient(145deg, ${p.card}, #0d0c18)`,
              border: `1px solid ${p.border}`,
              boxShadow: `0 20px 50px -15px ${p.accent}25`,
            }}
          >
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: p.tint, color: p.accent, border: `1px solid ${p.accent}44` }}>
                ✦ Secure Cloud Access
              </span>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight" style={{ fontFamily: p.heading, ...gradText(p) }}>
                {brandName}
              </h3>
              <Ed as="p" f="subtitle" value={s.subtitle ?? "Build, collaborate, and scale production-grade web applications in minutes."} className="mt-3 text-sm leading-relaxed" style={{ color: p.muted }} />

              <div className="mt-8 space-y-4">
                {[
                  { icon: "⚡", title: "Instant Access", desc: "No credit card required for free tier" },
                  { icon: "🛡️", title: "Enterprise Security", desc: "256-bit SSL encryption & SOC-2 ready" },
                  { icon: "🚀", title: "1-Click Code Export", desc: "Full ownership of Next.js & Tailwind code" },
                ].map((feat, fi) => (
                  <div key={fi} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm border border-white/10">
                      {feat.icon}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{feat.title}</p>
                      <p className="text-[11px]" style={{ color: p.muted }}>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                ★★★★★ <span className="text-slate-300">Loved by 40,000+ creators</span>
              </div>
              <p className="mt-1 text-[11px] italic text-slate-400">
                &ldquo;Codube feels like having an elite design & dev team in your pocket.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Right: Glassmorphic 3D Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col justify-center rounded-3xl p-8 lg:col-span-7 lg:p-10 shadow-2xl backdrop-blur-xl"
            style={{
              background: `linear-gradient(150deg, ${p.card}f0, ${p.alt}f0)`,
              border: `1px solid ${p.border}`,
              boxShadow: `0 25px 60px -15px ${p.accent}30`,
            }}
          >
            {/* Top Switcher: Sign In vs Sign Up */}
            <div className="flex rounded-2xl border border-white/10 bg-black/40 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`flex-1 rounded-xl py-2.5 transition-all ${
                  tab === "signup"
                    ? "bg-brand-gradient text-white shadow-lg shadow-orange-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`flex-1 rounded-xl py-2.5 transition-all ${
                  tab === "login"
                    ? "bg-brand-gradient text-white shadow-lg shadow-orange-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
            </div>

            <div className="mt-6">
              <Ed as="h2" f="title" value={s.title ?? (tab === "signup" ? "Get started in 30 seconds" : "Welcome back to Codube")} className="block text-2xl font-extrabold tracking-tight" style={{ fontFamily: p.heading }} />
              <p className="mt-1.5 text-xs" style={{ color: p.muted }}>
                {tab === "signup" ? "Create your workspace and start building for free." : "Enter your credentials to access your dashboard."}
              </p>
            </div>

            {/* Social Logins */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onNav("dashboard")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08] hover:border-white/20"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/></svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => onNav("dashboard")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08] hover:border-white/20"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </button>
            </div>

            <div className="my-5 flex items-center gap-3 text-xs" style={{ color: p.muted }}>
              <span className="h-px flex-1" style={{ background: p.border }} />
              <span>or continue with email</span>
              <span className="h-px flex-1" style={{ background: p.border }} />
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center text-sm font-semibold text-emerald-400">
                <Check size={24} className="mx-auto mb-2 text-emerald-400" />
                <span>Verification email sent! Welcome to {brandName}.</span>
                <button
                  type="button"
                  onClick={() => onNav("dashboard")}
                  className="mt-4 block w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black"
                >
                  Enter Dashboard →
                </button>
              </div>
            ) : (
              <form
                className="space-y-3.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                  setTimeout(() => onNav("dashboard"), 1200);
                }}
              >
                {tab === "signup" && (
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-400">Full Name</label>
                    <input
                      required
                      placeholder="Alex Mercer"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-orange-500 focus:bg-white/[0.07]"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-400">Work Email</label>
                  <input
                    required
                    type="email"
                    placeholder="alex@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-orange-500 focus:bg-white/[0.07]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-medium text-slate-400">Password</label>
                    {tab === "login" && (
                      <span className="cursor-pointer text-[10px] text-orange-400 hover:underline">Forgot?</span>
                    )}
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-orange-500 focus:bg-white/[0.07]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-shine mt-2 w-full rounded-xl bg-brand-gradient py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.01]"
                >
                  <Ed f="cta" value={s.cta ?? (tab === "signup" ? "Create Free Account →" : "Sign In to Workspace →")} />
                </button>
              </form>
            )}

            <p className="mt-5 text-center text-[11px] text-slate-500">
              By proceeding, you agree to our Terms of Service & Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Dashboard({ s, p, onNav }: { s: Section; p: Pal; onNav: OnNav }) {
  const links = s.links?.length ? s.links : ["Overview", "Orders", "Customers", "Settings"];
  const [tab, setTab] = useState(0);
  const stats = s.items ?? [];
  const headers = s.headers ?? [];
  const rows = s.rows ?? [];
  const bars = [38, 62, 48, 80, 58, 92, 74];
  return (
    <section className="grid min-h-[640px] @3xl:grid-cols-[210px_1fr]" style={{ background: p.alt }}>
      <aside className="p-5" style={{ background: p.card, borderRight: `1px solid ${p.border}` }}>
        <p className="text-lg font-extrabold" style={{ fontFamily: p.heading, ...gradText(p) }}>{s.brand}</p>
        <ul className="mt-6 space-y-1">
          {links.map((l, i) => (
            <li key={i}>
              <Tap
                onClick={() => setTab(i)}
                className="block w-full px-3 py-2 text-left text-sm font-medium transition"
                style={{ borderRadius: p.btnRadius, background: tab === i ? p.tint : "transparent", color: tab === i ? p.accent : p.muted }}
              >
                <Ed f="links" idx={i} value={l} />
              </Tap>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => onNav("home")} className="mt-8 text-sm font-medium" style={{ color: p.muted }}>
          ← Back to site
        </button>
      </aside>

      <div className="p-6 @2xl:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold" style={{ fontFamily: p.heading }}>{links[tab] ?? s.title}</h2>
          <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: p.grad }}>A</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 @3xl:grid-cols-4">
          {stats.map((it, i) => (
            <Box key={i} i={i} label="stat">
              <div className="h-full p-4" style={cardStyle(p)}>
                <Ed as="p" f="label" i={i} value={it.label} className="block text-xs" style={{ color: p.muted }} />
                <Ed as="p" f="value" i={i} value={it.value} className="mt-1 block text-2xl font-extrabold" style={{ fontFamily: p.heading }} />
                <Ed as="p" f="change" i={i} value={it.change} clearable addLabel="change" addDefault="+5%" className="mt-1 block text-xs font-semibold" style={{ color: "#059669" }} />
              </div>
            </Box>
          ))}
        </div>
        <AddItem label="stat card" className="mt-3" />

        <div className="mt-5 p-5" style={cardStyle(p)}>
          <p className="text-sm font-bold">Last 7 days</p>
          <div className="mt-4 flex h-36 items-end gap-3">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 transition-all duration-700" style={{ height: `${h}%`, background: p.grad, borderRadius: "8px 8px 2px 2px", opacity: 0.9 }} />
            ))}
          </div>
        </div>

        {headers.length > 0 && (
          <div className="mt-5 overflow-x-auto" style={cardStyle(p)}>
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr style={{ color: p.muted, borderBottom: `1px solid ${p.border}` }}>
                  {headers.map((h, j) => (
                    <th key={j} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                      <Ed f="headers" idx={j} value={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${p.border}` : "none" }}>
                    {r.map((c, j) => (
                      <td key={j} className="px-4 py-3">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- main ---------- */

export default function SiteRenderer({
  doc, images, edit, apiBase = "", page: pageProp, onPageChange,
}: {
  doc: SiteDoc;
  images?: Record<string, string>;
  edit?: EditApi;
  apiBase?: string;
  page?: string;
  onPageChange?: (slug: string) => void;
}) {
  const [cart, setCart] = useState(0);
  const [modal, setModal] = useState(false);
  const [localSlug, setLocalSlug] = useState("home");
  const topRef = useRef<HTMLDivElement>(null);

  const t = doc.theme ?? {};
  const dark = !!t.dark;
  const accent = hex(t.accent, "#2563eb");
  const accent2 = hex(t.accent2, "#7c3aed");
  const radius = RADII[t.radius ?? "soft"] ?? RADII.soft;

  const p: Pal = {
    accent,
    accent2,
    bg: dark ? "#0a0a12" : "#ffffff",
    alt: dark ? "#10101c" : "#f8fafc",
    card: dark ? "#15152a" : "#ffffff",
    border: dark ? "rgba(255,255,255,.09)" : "rgba(15,23,42,.08)",
    muted: hex(t.mutedColor, dark ? "#9ca3af" : "#64748b"),
    text: hex(t.textColor ?? t.headingColor, dark ? "#ffffff" : "#0f172a"),
    radius,
    btnRadius: t.radius === "round" ? "9999px" : radius,
    heading: FONTS[t.font ?? "modern"] ?? FONTS.modern,
    grad: `linear-gradient(135deg, ${accent}, ${accent2})`,
    tint: `${accent}1a`,
  };

  const { navbar, footer, pages } = normalize(doc);
  const slug = pageProp ?? localSlug;
  const page = pages.find((pg) => pg.slug === slug) ?? pages[0];
  if (!page) return null;

  const has = (s: string) => pages.some((pg) => pg.slug === s);
  const showCart = pages.some((pg) => pg.sections.some((s) => s.type === "products"));

  function go(target: string) {
    setLocalSlug(target);
    onPageChange?.(target);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function route(label: string) {
    const l = label.toLowerCase().trim();
    let target = pages.find((pg) => pg.slug === l || pg.name.toLowerCase() === l)?.slug;
    if (!target) {
      if (/log ?in|sign ?in/.test(l) && has("login")) target = "login";
      else if (/sign ?up|register|join|get started|start|create account|try/.test(l) && has("signup")) target = "signup";
      else if (/contact|book|talk|quote|reserve|demo|call|visit/.test(l) && has("contact")) target = "contact";
      else if (/dashboard|account/.test(l) && has("dashboard")) target = "dashboard";
      else {
        const main = ["shop", "products", "menu", "services", "courses", "pricing"].find(has);
        if (main && /shop|buy|order|menu|product|explore|browse|view|learn|pricing|plans/.test(l)) target = main;
      }
    }
    if (target) {
      go(target);
      return;
    }
    if (t.ctaModal !== false && isLeadCta(label)) setModal(true);
  }

  const navS: Section | undefined = navbar ? { ...navbar, type: "navbar", brand: navbar.brand ?? doc.brand } : undefined;
  const footS: Section = footer
    ? { ...footer, type: "footer", brand: footer.brand ?? doc.brand }
    : { type: "footer", brand: doc.brand, links: navbar?.links };

  const onDashboard = page.slug === "dashboard";
  const onAuth = page.slug === "login" || page.slug === "signup";

  function render(s: Section, i: number) {
    const alt = i % 2 === 0;
    const frame = (node: ReactNode) => (
      <SecCtx.Provider key={i} value={{ page: page.slug, index: i }}>
        <Frame index={i} total={page.sections.length} type={s.type}>{node}</Frame>
      </SecCtx.Provider>
    );
    const sec = (node: ReactNode) => frame(<Sec p={p} alt={alt}>{node}</Sec>);
    switch (s.type) {
      case "hero": return frame(<Hero s={s} p={p} onNav={route} />);
      case "hero-3d": return frame(<Hero3D s={s} p={p} onNav={route} />);
      case "hero-aurora": return frame(<HeroAurora s={s} p={p} onNav={route} />);
      case "hero-marquee": return frame(<HeroMarquee s={s} p={p} onNav={route} />);
      case "cta": return frame(<Cta s={s} p={p} onNav={route} />);
      case "cta-mesh": return frame(<CtaMesh s={s} p={p} onNav={route} />);
      case "marquee": return frame(<Marquee s={s} p={p} />);
      case "auth": return frame(<Auth s={s} p={p} onNav={route} brand={doc.brand} />);
      case "auth-3d": return frame(<Auth3D s={s} p={p} onNav={route} brand={doc.brand} />);
      case "dashboard": return frame(<Dashboard s={{ ...s, brand: s.brand ?? doc.brand }} p={p} onNav={route} />);
      case "stats": return sec(<Stats s={s} p={p} />);
      case "stats-3d": return frame(<Stats3D s={s} p={p} />);
      case "features": return sec(<Features s={s} p={p} />);
      case "features-tabs": return frame(<FeaturesTabs s={s} p={p} />);
      case "bento": return sec(<Bento s={s} p={p} />);
      case "bento-3d": return frame(<Bento3D s={s} p={p} />);
      case "steps": return sec(<Steps s={s} p={p} />);
      case "products": return sec(<Products s={s} p={p} onAdd={() => setCart((c) => c + 1)} />);
      case "products-3d": return frame(<Products3D s={s} p={p} onAdd={() => setCart((c) => c + 1)} />);
      case "split": return sec(<Split s={s} p={p} />);
      case "team": return sec(<Team s={s} p={p} />);
      case "testimonials": return sec(<Testimonials s={s} p={p} />);
      case "testimonials-3d": return frame(<Testimonials3D s={s} p={p} />);
      case "pricing": return sec(<Pricing s={s} p={p} />);
      case "pricing-3d": return frame(<Pricing3D s={s} p={p} onNav={route} />);
      case "faq": return sec(<Faq s={s} p={p} />);
      case "faq-3d": return frame(<Faq3D s={s} p={p} onNav={route} />);
      case "comparisons": return frame(<Comparisons s={s} p={p} />);
      case "contact": return sec(<Contact s={s} p={p} />);
      case "footer-3d": return frame(<Footer3D s={s} p={p} onNav={route} brand={doc.brand} />);
      default: return null;
    }
  }

  const hasCustomFooter = page.sections.some((s) => s.type === "footer-3d" || s.type === "footer");

  return (
    <EditCtx.Provider value={edit ?? null}>
      <BaseCtx.Provider value={apiBase}>
        <ImgCtx.Provider value={images ?? {}}>
          <div ref={topRef} className="@container" style={{ background: p.bg, color: p.text, fontFamily: FONTS.modern }}>
            {navS && !onDashboard && (
              <Navbar s={navS} p={p} cart={cart} showCart={showCart} logo={doc.logo} current={page.name} onNav={route} />
            )}
            <div key={page.slug} className="anim-page">
              {page.sections.map(render)}
            </div>
            {!onDashboard && !onAuth && !hasCustomFooter && <Footer s={footS} p={p} onNav={route} />}
            <LeadModal p={p} open={modal} onClose={() => setModal(false)} />
          </div>
        </ImgCtx.Provider>
      </BaseCtx.Provider>
    </EditCtx.Provider>
  );
}
