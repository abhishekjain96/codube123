"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowUp, Bot, Check, ChevronDown, Code2, Copy, ExternalLink, Eye, Globe, Lock, Loader2, Monitor, Palette, Pencil, Plus, Redo2, Rocket, RotateCcw, Search, Smartphone, Sparkles, Tablet, Undo2, Upload, X, Zap } from "lucide-react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import CodeStudio from "./CodeStudio";
import DeployModal from "./DeployModal";
import LiveCodeViewer from "./LiveCodeViewer";
import ReaInspectorModal from "./ReaInspectorModal";
import SiteRenderer, { normalize, parseSite, type EditApi, type Item, type Loc, type Section, type SiteDoc, type Theme } from "./SiteRenderer";
import { ADDABLE, type Addable } from "@/lib/blockDefaults";
import { API_BASE, chatProject, createProjectFromUrl, getProject, requestImages, saveSite, uploadImage } from "@/lib/api";
import { STOCK_CATEGORIES, STOCK_PHOTOS, type StockPhoto } from "@/lib/stockPhotos";

type Message = { role: "user" | "ai"; text: string };

const swatches = ["#f97316", "#8b5cf6", "#3b82f6", "#10b981", "#e11d48", "#f59e0b"];
const headingSwatches = ["#ffffff", "#f1f5f9", "#fef3c7", "#f97316", "#38bdf8", "#c084fc", "#34d399", "#fbbf24"];
const mutedSwatches = ["#9ca3af", "#64748b", "#cbd5e1", "#94a3b8", "#a1a1aa", "#fed7aa", "#e9d5ff", "#a7f3d0"];

const THEME_PRESETS = [
  { id: "flame", name: "Codube Flame", dark: true, accent: "#f97316", accent2: "#8b5cf6", textColor: "#ffffff", mutedColor: "#9ca3af", icon: "🔥" },
  { id: "cyber", name: "Cyberpunk", dark: true, accent: "#ec4899", accent2: "#06b6d4", textColor: "#ffffff", mutedColor: "#a5f3fc", icon: "⚡" },
  { id: "emerald", name: "Emerald SaaS", dark: true, accent: "#10b981", accent2: "#34d399", textColor: "#ffffff", mutedColor: "#a7f3d0", icon: "🟢" },
  { id: "obsidian", name: "Obsidian Gold", dark: true, accent: "#f59e0b", accent2: "#d97706", textColor: "#fef3c7", mutedColor: "#fde68a", icon: "👑" },
  { id: "ocean", name: "Ocean Blue", dark: true, accent: "#2563eb", accent2: "#38bdf8", textColor: "#ffffff", mutedColor: "#bae6fd", icon: "🌊" },
  { id: "minimal", name: "Clean Light", dark: false, accent: "#4f46e5", accent2: "#7c3aed", textColor: "#0f172a", mutedColor: "#64748b", icon: "☀️" },
];

const suggestions = ["Add a pricing section", "Make it feel more premium", "Rewrite the copy to sound friendlier"];
const fonts = [
  ["modern", "Modern (Inter)"],
  ["elegant", "Elegant (Playfair)"],
  ["bold", "Bold Tech (Space)"],
  ["friendly", "Friendly (Poppins)"],
  ["handwriting", "Handwritten (Caveat)"],
] as const;
const radii = [["sharp", "Sharp"], ["soft", "Soft"], ["round", "Round"]] as const;
const promptIdeas = [
  "Friendly portrait photo of a smiling customer, natural light",
  "Product on a clean studio background, soft shadow",
  "Modern bright workspace, natural light, minimal",
];

const MODELS = [
  { id: "auto", label: "Auto (Best)", desc: "Always picks the best model", icon: "⚡" },
  { id: "gpt4o", label: "GPT-4o", desc: "OpenAI's Most Powerful", icon: "🌐" },
  { id: "claude", label: "Claude 3.5 Sonnet", desc: "Anthropic's Flagship Model", icon: "🌟" },
  { id: "gemini", label: "Gemini 2.0 Flash", desc: "Google's Fastest Model", icon: "💎" },
] as const;
type ModelId = typeof MODELS[number]["id"];

const AI_SUGGESTIONS_AFTER_RESPONSE = [
  ["Make it more modern", "Add animations", "Improve the hero"],
  ["Add social proof", "Simplify the copy", "Add a FAQ section"],
  ["Make it darker", "Add a CTA button", "Change the font"],
  ["Add a pricing table", "Show team members", "Add testimonials"],
];

/** Always work with the multi-page shape while editing, with a footer that has columns. */
function upgrade(input: SiteDoc): SiteDoc {
  let d = input;
  if (!d.pages?.length) {
    const n = normalize(d);
    d = { ...d, navbar: n.navbar, footer: n.footer, pages: n.pages };
    delete d.sections;
  }
  const f: Section = d.footer ?? { type: "footer", brand: d.brand, text: "", newsletter: false };
  if (!f.columns) {
    f.columns = f.links?.length
      ? [{ title: "Explore", links: f.links }]
      : d.navbar?.links?.length
        ? [{ title: "Explore", links: [...d.navbar.links] }]
        : [];
  }
  delete f.links;
  d.footer = f;
  return d;
}

function collectPrompts(doc: SiteDoc | null): string[] {
  if (!doc) return [];
  const list: string[] = [];
  const add = (v?: string) => {
    if (v && v.trim() && !v.startsWith("upload:")) list.push(v);
  };
  add(doc.logo);
  for (const pg of normalize(doc).pages) {
    for (const s of pg.sections) {
      add(s.image);
      for (const it of s.items ?? []) add(it.image);
    }
  }
  return [...new Set(list)].slice(0, 60);
}

function secAt(d: SiteDoc, page: string, index: number): Section | undefined {
  return d.pages?.find((p) => p.slug === page)?.sections[index];
}

/** Finds the object a Loc points to (document, navbar, footer, section, item or footer column). */
function baseObj(d: SiteDoc, loc: Loc): Record<string, unknown> | null {
  let b: Record<string, unknown> | undefined;
  if (loc.page === "_root") b = d as unknown as Record<string, unknown>;
  else if (loc.page === "_navbar") {
    d.navbar ??= { type: "navbar" };
    b = d.navbar as unknown as Record<string, unknown>;
  } else if (loc.page === "_footer") {
    d.footer ??= { type: "footer" };
    b = d.footer as unknown as Record<string, unknown>;
  } else {
    const sec = secAt(d, loc.page, loc.section);
    if (!sec) return null;
    b = (loc.item !== undefined ? sec.items?.[loc.item] : sec) as unknown as Record<string, unknown> | undefined;
  }
  if (!b) return null;
  if (loc.col !== undefined) {
    const c = (b.columns as Record<string, unknown>[] | undefined)?.[loc.col];
    return c ?? null;
  }
  return b;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "page";
}

function uniqueName(d: SiteDoc, base = "New page") {
  const names = new Set((d.pages ?? []).map((p) => p.name.toLowerCase()));
  let name = base;
  let n = 2;
  while (names.has(name.toLowerCase())) name = `${base} ${n++}`;
  return name;
}

function createPage(d: SiteDoc, rawName: string): string {
  const name = rawName.trim() || uniqueName(d);
  const taken = new Set((d.pages ?? []).map((p) => p.slug));
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  const starter = ADDABLE.find((a) => a.type === "split")?.make();
  if (starter) starter.title = name;
  d.pages = [...(d.pages ?? []), { slug, name, sections: starter ? [starter] : [] }];
  if (d.navbar) d.navbar.links = [...(d.navbar.links ?? []), name];
  return slug;
}

function variation(prompt: string) {
  const m = prompt.match(/ Variation (\d+)\.$/);
  const n = m ? Number(m[1]) + 1 : 2;
  return prompt.replace(/ Variation \d+\.$/, "") + ` Variation ${n}.`;
}

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<SiteDoc | null>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [canvasTab, setCanvasTab] = useState<"preview" | "code">("preview");
  const [pageSlug, setPageSlug] = useState("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [loadError, setLoadError] = useState(false);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const [images, setImages] = useState<Record<string, string>>({});
  const [imagePanel, setImagePanel] = useState<{ loc: Loc; prompt: string; original: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imageTab, setImageTab] = useState<"unsplash" | "ai" | "upload">("unsplash");
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashCat, setUnsplashCat] = useState("All");
  const [customUrl, setCustomUrl] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addCat, setAddCat] = useState<"all" | "3d" | "conversion" | "core">("all");
  const [addSearch, setAddSearch] = useState("");
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [askTarget, setAskTarget] = useState<{ page: string; index: number; type: string } | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [reaOpen, setReaOpen] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [hist, setHist] = useState({ past: 0, future: 0 });

  async function handleRunRea(targetUrl: string, instructions: string) {
    setThinking(true);
    try {
      const p = await createProjectFromUrl(targetUrl, instructions);
      setProjectData(p);
      const parsed = parseSite(p.siteJson);
      if (parsed) {
        const up = upgrade(parsed);
        docRef.current = up;
        setDoc(up);
        commit(up);
      }
      setMessages((m) => [
        ...m,
        { role: "user", text: `Reverse engineer website: ${targetUrl}${instructions ? ` | ${instructions}` : ""}` },
        {
          role: "ai",
          text: `Reverse engineering complete for ${targetUrl}. Extracted tokens, layout, and redesigned into modern Next.js components. Inspect the Code, Edit visually, or Deploy!`,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Failed to reverse engineer target URL. Please verify the URL and try again." },
      ]);
    } finally {
      setThinking(false);
    }
  }
  // New: model selector
  const [selectedModel, setSelectedModel] = useState<ModelId>("auto");
  const [modelOpen, setModelOpen] = useState(false);
  // New: AI suggestion chips shown after AI response
  const [aiChips, setAiChips] = useState<string[]>([]);
  const modelRef = useRef<HTMLDivElement>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const loadedFor = useRef<string | null>(null);
  const docRef = useRef<SiteDoc | null>(null);
  const pastRef = useRef<SiteDoc[]>([]);
  const futureRef = useRef<SiteDoc[]>([]);

  /* ----- load ----- */
  useEffect(() => {
    if (loadedFor.current === id) return;
    loadedFor.current = id;
    getProject(id)
      .then(async (p) => {
        setProjectData(p);
        let d = parseSite(p.siteJson);
        setMessages([
          { role: "user", text: p.idea },
          {
            role: "ai",
            text: "Your website is ready. Click any text to edit it, hover a card or section to copy or delete it, hover an image to change it, or tell me what to change.",
          },
        ]);
        if (!d) {
          setThinking(true);
          try {
            const res = await chatProject(id, "Design the complete website for this idea.");
            d = parseSite(res.project.siteJson);
          } catch {}
          setThinking(false);
        }
        if (d) {
          const up = upgrade(d);
          docRef.current = up;
          setDoc(up);
        } else setLoadError(true);
      })
      .catch(() => setLoadError(true));
  }, [id]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, thinking]);

  /* ----- image generation polling (batches of 12) ----- */
  const promptKey = useMemo(() => collectPrompts(doc).join("\u0001"), [doc]);
  useEffect(() => {
    if (!promptKey) return;
    const prompts = promptKey.split("\u0001");
    let stop = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function poll() {
      try {
        const found: Record<string, string> = {};
        let pending = false;
        for (let i = 0; i < prompts.length; i += 12) {
          const res = await requestImages(id, prompts.slice(i, i + 12));
          if (stop) return;
          for (const r of res) {
            if (r.ready) found[r.prompt] = API_BASE + r.url;
            else if (!r.failed) pending = true;
          }
        }
        setImages((prev) => ({ ...prev, ...found }));
        if (pending) timer = setTimeout(poll, 3000);
      } catch {}
    }
    poll();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [promptKey, id]);

  /* ----- saving and history ----- */
  function persist(next: SiteDoc) {
    setStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTimer.current = undefined;
      saveSite(id, JSON.stringify(next))
        .then(() => setStatus("saved"))
        .catch(() => setStatus("error"));
    }, 600);
  }

  function commit(next: SiteDoc, save = true) {
    if (docRef.current) pastRef.current = [...pastRef.current.slice(-49), docRef.current];
    futureRef.current = [];
    docRef.current = next;
    setDoc(next);
    setHist({ past: pastRef.current.length, future: futureRef.current.length });
    if (save) persist(next);
  }

  function undo() {
    const prev = pastRef.current[pastRef.current.length - 1];
    if (!prev || !docRef.current) return;
    pastRef.current = pastRef.current.slice(0, -1);
    futureRef.current = [docRef.current, ...futureRef.current];
    docRef.current = prev;
    setDoc(prev);
    setHist({ past: pastRef.current.length, future: futureRef.current.length });
    persist(prev);
  }

  function redo() {
    const next = futureRef.current[0];
    if (!next || !docRef.current) return;
    futureRef.current = futureRef.current.slice(1);
    pastRef.current = [...pastRef.current, docRef.current];
    docRef.current = next;
    setDoc(next);
    setHist({ past: pastRef.current.length, future: futureRef.current.length });
    persist(next);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (k === "y") {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close model dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setModelOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /** Copies the document, lets fn change the copy, then saves it as one undo step. */
  function mutate(fn: (d: SiteDoc) => void | false) {
    const cur = docRef.current;
    if (!cur) return;
    const next = structuredClone(cur);
    if (fn(next) === false) return;
    commit(next);
  }

  function setValue(loc: Loc, value: unknown) {
    mutate((d) => {
      const b = baseObj(d, loc);
      if (!b) return false;
      if (loc.idx !== undefined) {
        const arr = (b[loc.field] ??= []) as unknown[];
        if (value === "") {
          arr.splice(loc.idx, 1);
        } else {
          const old = arr[loc.idx];
          arr[loc.idx] = value;
          // renaming a navbar link also renames the page it points to
          if (loc.page === "_navbar" && loc.field === "links" && typeof old === "string" && typeof value === "string") {
            const pg = d.pages?.find((x) => x.name.toLowerCase() === old.toLowerCase());
            if (pg) pg.name = value;
          }
        }
      } else {
        b[loc.field] = value;
      }
    });
  }

  function editTheme(patch: Partial<Theme>) {
    mutate((d) => {
      d.theme = { ...d.theme, ...patch };
    });
  }

  function addSection(b: Addable) {
    mutate((d) => {
      const pg = d.pages?.find((x) => x.slug === activeSlug);
      if (!pg) return false;
      const sec = b.make();
      if (sec.type === "footer-3d" || sec.type === "footer") {
        pg.sections.push(sec);
        return;
      }
      const last = pg.sections[pg.sections.length - 1];
      if (last && (last.type === "footer-3d" || last.type === "footer" || last.type === "cta" || last.type === "cta-mesh")) {
        pg.sections.splice(pg.sections.length - 1, 0, sec);
      } else {
        pg.sections.push(sec);
      }
    });
    setAddOpen(false);
  }

  function addPage(name: string) {
    mutate((d) => {
      setPageSlug(createPage(d, name));
    });
    setNewPageName("");
    setNewPageOpen(false);
  }

  function removePage(slug: string) {
    const pg = docRef.current?.pages?.find((p) => p.slug === slug);
    if (!pg || slug === "home") return;
    if (!window.confirm(`Delete the page "${pg.name}"?`)) return;
    mutate((d) => {
      d.pages = (d.pages ?? []).filter((p) => p.slug !== slug);
      const same = (l: string) => l.toLowerCase() === pg.name.toLowerCase();
      if (d.navbar?.links) d.navbar.links = d.navbar.links.filter((l) => !same(l));
      d.footer?.columns?.forEach((c) => {
        c.links = c.links.filter((l) => !same(l));
      });
    });
    if (pageSlug === slug) setPageSlug("home");
  }

  /* ----- image panel actions ----- */
  function regenerate() {
    if (!imagePanel) return;
    const text = imagePanel.prompt.trim();
    if (!text) return;
    const next = text === imagePanel.original.trim() ? variation(text) : text;
    setValue(imagePanel.loc, next);
    setImagePanel(null);
  }

  async function onUpload(file: File) {
    if (!imagePanel) return;
    setUploading(true);
    setUploadError("");
    try {
      const res = await uploadImage(id, file);
      setValue(imagePanel.loc, `upload:${res.url}`);
      setImagePanel(null);
    } catch {
      setUploadError("Upload failed. Use a PNG, JPG or WebP image under 5 MB.");
    } finally {
      setUploading(false);
    }
  }

  /* ----- the edit api the renderer uses ----- */
  const editApi: EditApi = {
    editing: mode === "edit",
    setValue,
    addString: (loc, value) =>
      mutate((d) => {
        if (loc.page === "_navbar" && loc.field === "links") {
          setPageSlug(createPage(d, uniqueName(d)));
          return;
        }
        const b = baseObj(d, loc);
        if (!b) return false;
        const arr = (b[loc.field] ??= []) as unknown[];
        arr.push(value);
      }),
    removeItem: (page, section, item) =>
      mutate((d) => {
        const list = secAt(d, page, section)?.items;
        if (!list || !list[item]) return false;
        list.splice(item, 1);
      }),
    duplicateItem: (page, section, item) =>
      mutate((d) => {
        const list = secAt(d, page, section)?.items;
        if (!list || !list[item]) return false;
        list.splice(item + 1, 0, structuredClone(list[item]));
      }),
    addItem: (page, section) =>
      mutate((d) => {
        const sec = secAt(d, page, section);
        if (!sec) return false;
        const items = (sec.items ??= []);
        const last = items[items.length - 1];
        const fresh: Item | undefined = last
          ? structuredClone(last)
          : structuredClone(ADDABLE.find((a) => a.type === sec.type)?.make().items?.[0]);
        if (!fresh) return false;
        delete fresh.image;
        items.push(fresh);
      }),
    removeColumn: (col) =>
      mutate((d) => {
        const cols = d.footer?.columns;
        if (!cols || !cols[col]) return false;
        cols.splice(col, 1);
      }),
    addColumn: () =>
      mutate((d) => {
        d.footer ??= { type: "footer" };
        (d.footer.columns ??= []).push({ title: "New column", links: ["Link one", "Link two"] });
      }),
    moveSection: (page, i, dir) =>
      mutate((d) => {
        const list = d.pages?.find((p) => p.slug === page)?.sections;
        const j = i + dir;
        if (!list || j < 0 || j >= list.length) return false;
        [list[i], list[j]] = [list[j], list[i]];
      }),
    removeSection: (page, i) =>
      mutate((d) => {
        const list = d.pages?.find((p) => p.slug === page)?.sections;
        if (!list || !list[i]) return false;
        list.splice(i, 1);
      }),
    duplicateSection: (page, i) =>
      mutate((d) => {
        const list = d.pages?.find((p) => p.slug === page)?.sections;
        if (!list || !list[i]) return false;
        list.splice(i + 1, 0, structuredClone(list[i]));
      }),
    askAi: (page, i) => {
      const type = docRef.current?.pages?.find((p) => p.slug === page)?.sections[i]?.type ?? "section";
      setAskTarget({ page, index: i, type });
      inputRef.current?.focus();
    },
    editImage: (loc, current) => {
      setUploadError("");
      setImagePanel({ loc, prompt: current?.startsWith("upload:") ? "" : (current ?? ""), original: current ?? "" });
    },
  };

  /* ----- chat ----- */
  async function send(text: string = input) {
    const message = text.trim();
    if (!message || thinking) return;
    const scope = askTarget;
    const payload = scope
      ? `Only change the "${scope.type}" section number ${scope.index + 1} on the "${scope.page}" page. Keep every other section, page, image prompt and style exactly as it is. Request: ${message}`
      : message;
    setMessages((m) => [...m, { role: "user", text: scope ? `[${scope.type} section] ${message}` : message }]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setAskTarget(null);
    setAiChips([]);
    setThinking(true);
    try {
      // make sure your latest manual edits are on the server before the AI reads the site
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = undefined;
        if (docRef.current) await saveSite(id, JSON.stringify(docRef.current));
        setStatus("saved");
      }
      const res = await chatProject(id, payload);
      const parsed = parseSite(res.project.siteJson);
      if (!parsed) throw new Error("bad site");
      const d = upgrade(parsed);
      commit(d, false);
      setMessages((m) => [...m, { role: "ai", text: d.reply || res.reply }]);
      // Show random suggestion chips after AI responds
      const chipSet = AI_SUGGESTIONS_AFTER_RESPONSE[Math.floor(Math.random() * AI_SUGGESTIONS_AFTER_RESPONSE.length)];
      setAiChips(chipSet);
    } catch (e) {
      console.error("Chat failed:", e);
      setMessages((m) => [...m, { role: "ai", text: "Sorry, I couldn't apply that change. Please try again." }]);
    } finally {
      setThinking(false);
    }
  }

  if (loadError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#060608] text-center text-white">
        <p className="text-lg font-semibold">Could not open this project</p>
        <p className="text-sm text-slate-500">It doesn&apos;t exist, isn&apos;t yours, or the AI request failed.</p>
        <Link href="/dashboard" className="rounded-lg bg-brand-gradient px-4 py-2 text-sm text-white">Go to dashboard</Link>
      </div>
    );
  }

  const theme = doc?.theme ?? {};
  const pages = doc?.pages ?? [];
  const activeSlug = pages.some((p) => p.slug === pageSlug) ? pageSlug : (pages[0]?.slug ?? "home");
  const activePage = pages.find((p) => p.slug === activeSlug);
  const canUndo = hist.past > 0;
  const canRedo = hist.future > 0;
  const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";
  const canvasMaxWidth = device === "mobile" ? "max-w-[380px]" : device === "tablet" ? "max-w-[768px]" : "max-w-5xl";
  const panelCurrent = imagePanel?.original ?? "";
  const panelPreview =
    panelCurrent.startsWith("http://") || panelCurrent.startsWith("https://")
      ? panelCurrent
      : panelCurrent.startsWith("upload:")
      ? API_BASE + panelCurrent.slice(7)
      : images[panelCurrent];

  return (
    <div className="flex h-screen flex-col bg-[#060608] text-white">
      {/* ── TOP HEADER ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0a0a10]/80 px-4 backdrop-blur-xl">
        <Link href="/dashboard"><Logo /></Link>

        {/* Center: Unified View switcher: Preview / Edit / See Code */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs font-medium">
            <button
              onClick={() => { setCanvasTab("preview"); setMode("preview"); setImagePanel(null); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                canvasTab === "preview" && mode === "preview"
                  ? "bg-white/10 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye size={13} /> Preview
            </button>
            <button
              onClick={() => { setCanvasTab("preview"); setMode("edit"); setImagePanel(null); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                canvasTab === "preview" && mode === "edit"
                  ? "bg-white/10 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => { setCanvasTab("code"); setImagePanel(null); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                canvasTab === "code"
                  ? "bg-gradient-to-r from-violet-600/40 to-indigo-600/40 text-white shadow-sm font-semibold ring-1 ring-violet-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 size={13} /> See Code
            </button>
          </div>

          {/* Device viewport toggle (Desktop / Tablet / Mobile) */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
            {([
              ["desktop", "Desktop view (100%)", Monitor],
              ["tablet", "Tablet view (768px)", Tablet],
              ["mobile", "Mobile view (380px)", Smartphone],
            ] as const).map(([d, tip, Icon]) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                aria-label={d}
                title={tip}
                className={`rounded-lg p-1.5 transition ${device === d ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: undo/redo + REA Inspector button + deploy + code studio + user */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <button
            onClick={() => setReaOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-2.5 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20 shadow-sm"
            title="Inspect REA extraction tokens or reverse engineer a new URL"
          >
            <Globe size={13} className="text-orange-400" />
            <span>{projectData?.reaMetadata?.domain ? `REA: ${projectData.reaMetadata.domain}` : "✦ REA Reverse Engineer"}</span>
          </button>

          <button className={iconBtn} title="Undo (Ctrl+Z)" aria-label="Undo" disabled={!canUndo} onClick={undo}><Undo2 size={15} /></button>
          <button className={iconBtn} title="Redo (Ctrl+Y)" aria-label="Redo" disabled={!canRedo} onClick={redo}><Redo2 size={15} /></button>
          <span className="hidden xl:inline mx-1 self-center text-xs font-normal text-slate-500">
            {status === "saving" ? "Saving…" : status === "error" ? "Save failed" : "Saved"}
          </span>

          <button
            onClick={() => setDeployOpen(true)}
            disabled={!doc}
            className="btn-shine flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:opacity-90 disabled:opacity-50"
          >
            <Rocket size={14} /> Deploy
          </button>
          <button
            onClick={() => setStudioOpen(true)}
            disabled={!doc || thinking}
            className="btn-shine flex items-center gap-1.5 rounded-xl bg-brand-gradient px-3.5 py-1.5 text-xs font-semibold text-white shadow-orange transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap size={14} /> Code Studio
          </button>
          <UserMenu compact />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[320px_1fr_280px]">
        {/* ── CHAT SIDEBAR ── */}
        <aside className="hidden min-h-0 flex-col border-r border-white/[0.06] bg-[#0a0a10] lg:flex">
          {/* Chat header with model selector */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-gradient">
                <Sparkles size={13} />
              </div>
              Codube AI
            </div>
            {/* Model selector */}
            <div className="relative" ref={modelRef}>
              <button
                onClick={() => setModelOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Bot size={12} />
                {MODELS.find((m) => m.id === selectedModel)?.label ?? "Auto"}
                <ChevronDown size={11} className={`transition-transform ${modelOpen ? "rotate-180" : ""}`} />
              </button>
              {modelOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-[#0d0d18] p-1.5 shadow-2xl shadow-black/50">
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                      className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition hover:bg-white/[0.06] ${selectedModel === m.id ? "bg-white/[0.06]" : ""}`}
                    >
                      <span className="mt-0.5 text-base">{m.icon}</span>
                      <span>
                        <span className="block text-xs font-semibold text-white">{m.label}</span>
                        <span className="block text-[10px] text-slate-500">{m.desc}</span>
                      </span>
                      {selectedModel === m.id && <span className="ml-auto mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />}
                    </button>
                  ))}
                  <p className="mt-1.5 border-t border-white/[0.06] px-3 pt-2 text-[10px] text-slate-600">Model changes apply from your next message</p>
                </div>
              )}
            </div>
          </div>
          <div ref={chatScrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-brand-gradient text-white"
                    : "bg-white/[0.06] text-slate-200"
                }`}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="rounded-2xl border border-orange-500/20 bg-white/[0.03] p-4">
                {/* Animated orb */}
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-orange-500/30" />
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-purple-600">
                      <Sparkles size={14} className="text-white" />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Codube is designing…</p>
                    <p className="text-[10px] text-slate-500">AI is updating your website</p>
                  </div>
                </div>
                {/* Animated step indicators */}
                <div className="space-y-2">
                  {[
                    { label: "Reading your request", delay: "0ms" },
                    { label: "Updating layout & content", delay: "300ms" },
                    { label: "Applying styles & images", delay: "600ms" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ animationDelay: step.delay }}>
                      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-purple-500"
                          style={{
                            animation: `thinking-bar 1.8s ease-in-out ${step.delay} infinite`,
                            width: "60%",
                          }}
                        />
                      </div>
                      <span className="w-36 truncate text-[10px] text-slate-500">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* AI suggestion chips after AI response */}
            {aiChips.length > 0 && !thinking && (
              <div className="space-y-1.5">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  <Sparkles size={10} className="text-orange-400" /> Suggestions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {aiChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => send(chip)}
                      disabled={thinking}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300 disabled:opacity-40"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="shrink-0 border-t border-white/[0.06] bg-[#09090f] p-3">
            {askTarget && (
              <div className="mb-2 flex items-center justify-between rounded-lg border border-orange-500/20 bg-orange-500/10 px-2.5 py-1.5 text-[11px] text-orange-300">
                <span>Changing only: <b className="capitalize">{askTarget.type}</b> on {askTarget.page}</span>
                <button onClick={() => setAskTarget(null)} aria-label="Cancel"><X size={13} /></button>
              </div>
            )}
            {/* Default suggestion chips */}
            {aiChips.length === 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setReaOpen(true)}
                  className="flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300 transition hover:bg-violet-500/20"
                >
                  <Globe size={11} className="text-orange-400" />
                  <span>Reverse Engineer URL</span>
                </button>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={thinking || !doc}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-300 disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 transition focus-within:border-orange-500/50">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  const el = e.target;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                disabled={thinking}
                placeholder={askTarget ? "What should change in this section?" : "Ask Codube to change something..."}
                className="max-h-28 min-h-[38px] flex-1 resize-none bg-transparent px-2 py-1 text-sm leading-relaxed text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
              />
              <button
                onClick={() => send()}
                disabled={thinking}
                aria-label="Send"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-orange transition hover:opacity-90 disabled:opacity-60"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── CANVAS ── */}
        <section className="min-h-0 overflow-auto bg-[#07070d] p-4 sm:p-6">
          {/* Live Code Studio view */}
          {canvasTab === "code" && doc && (
            <div className="h-full min-h-[640px] max-w-6xl mx-auto">
              <LiveCodeViewer doc={doc} onOpenFullStudio={() => setStudioOpen(true)} />
            </div>
          )}

          {/* Preview canvas */}
          {canvasTab === "preview" && doc && (
            <>
              <div className={`mx-auto mb-3 flex flex-wrap items-center gap-1.5 ${canvasMaxWidth}`}>
                {pages.map((pg) => (
                  <span
                    key={pg.slug}
                    className={`flex items-center rounded-full text-xs font-medium transition ${
                      pg.slug === activeSlug ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-white/[0.04] text-slate-500 ring-1 ring-white/10 hover:bg-white/[0.07] hover:text-slate-300"
                    }`}
                  >
                    <button onClick={() => setPageSlug(pg.slug)} className="py-1 pl-3 pr-3">{pg.name}</button>
                    {mode === "edit" && pg.slug !== "home" && pages.length > 1 && (
                      <button
                        title="Delete page"
                        aria-label={`Delete page ${pg.name}`}
                        onClick={() => removePage(pg.slug)}
                        className="mr-1.5 flex h-4 w-4 items-center justify-center rounded-full opacity-60 hover:bg-red-500 hover:text-white hover:opacity-100"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </span>
                ))}
                {mode === "edit" &&
                  (newPageOpen ? (
                    <form
                      className="flex items-center gap-1"
                      onSubmit={(e) => {
                        e.preventDefault();
                        addPage(newPageName);
                      }}
                    >
                      <input
                        autoFocus
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        placeholder="Page name"
                        className="w-28 rounded-full border border-white/20 bg-white/[0.06] px-3 py-1 text-xs text-white outline-none focus:border-orange-500/60"
                      />
                      <button type="submit" className="rounded-full bg-brand-gradient px-2.5 py-1 text-xs text-white">Add</button>
                      <button type="button" onClick={() => setNewPageOpen(false)} aria-label="Cancel" className="text-slate-500"><X size={13} /></button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setNewPageOpen(true)}
                      className="flex items-center gap-1 rounded-full border border-dashed border-white/20 px-2.5 py-1 text-xs text-slate-600 transition hover:border-orange-500/40 hover:text-orange-400"
                    >
                      <Plus size={12} /> Page
                    </button>
                  ))}
              </div>

              <div
                className={`relative mx-auto overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50 transition-all duration-300 ${canvasMaxWidth}`}
              >
                <SiteRenderer
                  doc={doc}
                  images={images}
                  edit={editApi}
                  apiBase={API_BASE}
                  page={activeSlug}
                  onPageChange={setPageSlug}
                />
                {/* ── Generation overlay (Bolt/Claude style) ── */}
                {thinking && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-[#07070d]/80 backdrop-blur-sm">
                    {/* Animated gradient orb */}
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" style={{ animationDuration: "1.5s" }} />
                      <span className="absolute inset-2 animate-ping rounded-full bg-purple-500/20" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-purple-600 shadow-2xl shadow-orange-500/40">
                        <Sparkles size={28} className="animate-pulse text-white" />
                      </span>
                    </div>
                    {/* Status text */}
                    <div className="text-center">
                      <p className="text-lg font-semibold text-white">Codube is redesigning…</p>
                      <p className="mt-1 text-sm text-slate-400">AI is applying your changes</p>
                    </div>
                    {/* Step progress */}
                    <div className="w-64 space-y-3">
                      {[
                        { label: "Parsing your request", pct: "100%", done: true },
                        { label: "Redesigning sections", pct: "70%", done: false },
                        { label: "Updating copy & images", pct: "30%", done: false },
                      ].map((step, i) => (
                        <div key={i}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-slate-400">{step.label}</span>
                            {step.done && <span className="text-[10px] text-emerald-400">✓</span>}
                          </div>
                          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-purple-500"
                              style={{
                                animation: step.done
                                  ? "none"
                                  : `thinking-bar 1.8s ease-in-out ${i * 300}ms infinite`,
                                width: step.done ? step.pct : "60%",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Skeleton shimmer rows */}
                    <div className="w-64 space-y-2 opacity-40">
                      {[80, 60, 90, 50].map((w, i) => (
                        <div
                          key={i}
                          className="h-2 rounded-full bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                          style={{
                            width: `${w}%`,
                            animation: `thinking-bar 2.2s ease-in-out ${i * 200}ms infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {mode === "edit" && (
                <div className={`mx-auto mt-6 ${canvasMaxWidth}`}>
                  {activePage && activePage.sections.length === 0 && (
                    <p className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center text-sm text-slate-400">
                      This page is empty. Choose a component from the library below to begin.
                    </p>
                  )}

                  {!addOpen ? (
                    <button
                      onClick={() => setAddOpen(true)}
                      className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-white/15 py-4 text-sm font-semibold text-slate-400 transition hover:border-orange-500/60 hover:bg-orange-500/[0.04] hover:text-orange-300 shadow-sm"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white transition group-hover:bg-brand-gradient">
                        <Plus size={14} />
                      </span>
                      <span>+ Add a 3D or Motion Section to this page</span>
                      <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400 border border-orange-500/30">
                        {ADDABLE.length} Components
                      </span>
                    </button>
                  ) : (
                    <div className="rounded-3xl border border-white/15 bg-[#0a0a14] p-5 shadow-2xl backdrop-blur-2xl">
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gradient text-xs font-bold text-white shadow-md">
                            ✦
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              Component Library
                              <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                                21st.dev & Aceternity
                              </span>
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Click any component to instantly add it to your page
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAddOpen(false)}
                          aria-label="Close"
                          className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/[0.06] text-slate-400 transition hover:bg-white/15 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Search & Categories */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            { key: "all", label: "All Blocks", count: ADDABLE.length },
                            { key: "3d", label: "🔥 3D & Motion", count: ADDABLE.filter((b) => b.category === "3d").length, highlight: true },
                            { key: "conversion", label: "💼 SaaS & Sales", count: ADDABLE.filter((b) => b.category === "conversion").length },
                            { key: "core", label: "📄 Core Content", count: ADDABLE.filter((b) => b.category === "core").length },
                          ].map((cat) => (
                            <button
                              key={cat.key}
                              type="button"
                              onClick={() => setAddCat(cat.key as any)}
                              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                addCat === cat.key
                                  ? cat.highlight
                                    ? "bg-brand-gradient text-white shadow-md shadow-orange-500/20 scale-105"
                                    : "bg-white/15 text-white shadow-sm"
                                  : "border border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              <span>{cat.label}</span>
                              <span className="text-[10px] opacity-70">({cat.count})</span>
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 focus-within:border-orange-500/50">
                          <Search size={13} className="text-slate-500" />
                          <input
                            value={addSearch}
                            onChange={(e) => setAddSearch(e.target.value)}
                            placeholder="Filter components..."
                            className="w-36 bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                          />
                          {addSearch && (
                            <button type="button" onClick={() => setAddSearch("")} className="text-slate-500 hover:text-white">
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Components Grid */}
                      <div className="mt-4 grid max-h-96 grid-cols-2 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
                        {ADDABLE.filter((b) => {
                          if (addCat !== "all" && b.category !== addCat) return false;
                          if (addSearch.trim()) {
                            const q = addSearch.toLowerCase().trim();
                            return (
                              b.label.toLowerCase().includes(q) ||
                              b.type.toLowerCase().includes(q) ||
                              (b.badge && b.badge.toLowerCase().includes(q))
                            );
                          }
                          return true;
                        }).map((b) => (
                          <button
                            key={b.type}
                            onClick={() => addSection(b)}
                            className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-orange-500/[0.07] hover:shadow-lg hover:shadow-orange-500/10"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-gradient">
                                {b.icon}
                              </span>
                              {b.badge && (
                                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                  b.category === "3d"
                                    ? "bg-gradient-to-r from-orange-500/20 to-purple-500/20 text-orange-300 border border-orange-500/30"
                                    : "bg-white/[0.06] text-slate-400 border border-white/10"
                                }`}>
                                  {b.badge}
                                </span>
                              )}
                            </div>
                            <div className="mt-3">
                              <span className="block text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                                {b.label}
                              </span>
                              <span className="mt-0.5 block text-[10px] text-slate-500 font-mono">
                                + add to canvas
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-[11px] text-slate-500">
                        <span>⚡ Pro tip: Click any text or color in Edit mode to customize.</span>
                        <button
                          type="button"
                          onClick={() => setAddOpen(false)}
                          className="font-semibold text-slate-400 hover:text-white"
                        >
                          Close library
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {/* Loading state */}
          {canvasTab === "preview" && !doc && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-slate-600">
              <Loader2 className="animate-spin text-orange-400" /> Designing your website…
            </div>
          )}
        </section>

        {/* ── RIGHT PANEL (Design settings) ── */}
        <aside className="hidden overflow-y-auto border-l border-white/[0.06] bg-[#0a0a10] p-4 lg:block">
          <div className="mb-4 flex gap-4 text-xs text-slate-600">
            <span className="border-b-2 border-orange-500 pb-1 font-medium text-white">Design</span>
            <span>Interactions</span>
            <span>Settings</span>
          </div>

          {imagePanel && (
            <div className="mb-5 rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">Change image</p>
                <button onClick={() => setImagePanel(null)} aria-label="Close" className="text-slate-500 hover:text-white"><X size={14} /></button>
              </div>
              {panelPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={panelPreview} alt="Current" className="mt-2 h-28 w-full rounded-lg object-cover" />
              )}

              {/* Tab Selector */}
              <div className="mt-3 flex rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setImageTab("unsplash")}
                  className={`flex-1 rounded-md py-1 transition ${imageTab === "unsplash" ? "bg-white/15 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
                >
                  Unsplash Stock
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("ai")}
                  className={`flex-1 rounded-md py-1 transition ${imageTab === "ai" ? "bg-white/15 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
                >
                  AI Prompt
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("upload")}
                  className={`flex-1 rounded-md py-1 transition ${imageTab === "upload" ? "bg-white/15 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
                >
                  Upload / Link
                </button>
              </div>

              {/* Tab: Unsplash Stock */}
              {imageTab === "unsplash" && (
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 focus-within:border-orange-500/50">
                    <Search size={13} className="text-slate-500" />
                    <input
                      value={unsplashQuery}
                      onChange={(e) => setUnsplashQuery(e.target.value)}
                      placeholder="Search photos, e.g. technology, workspace..."
                      className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                    />
                    {unsplashQuery && (
                      <button type="button" onClick={() => setUnsplashQuery("")} className="text-slate-500 hover:text-white">
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {STOCK_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setUnsplashCat(cat); setUnsplashQuery(""); }}
                        className={`rounded-full px-2 py-0.5 text-[10px] transition ${
                          unsplashCat === cat && !unsplashQuery
                            ? "border border-orange-500/40 bg-orange-500/20 font-semibold text-orange-300"
                            : "border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid max-h-48 grid-cols-3 gap-1.5 overflow-y-auto pr-0.5">
                    {STOCK_PHOTOS
                      .filter((p) => {
                        const q = unsplashQuery.trim().toLowerCase();
                        if (q) return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.credit.toLowerCase().includes(q);
                        if (unsplashCat === "All") return true;
                        return p.category === unsplashCat;
                      })
                      .map((photo) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => {
                            setValue(imagePanel.loc, photo.url);
                            setImagePanel(null);
                          }}
                          title={`${photo.title} by ${photo.credit}`}
                          className="group/thumb relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:scale-105 hover:border-orange-500 hover:shadow-lg"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo.thumb} alt={photo.title} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-1 opacity-0 transition group-hover/thumb:opacity-100">
                            <span className="truncate text-[9px] font-medium text-white">{photo.credit}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                  <p className="text-center text-[10px] text-slate-500">Click any photo to apply to website</p>
                </div>
              )}

              {/* Tab: AI Prompt */}
              {imageTab === "ai" && (
                <div className="mt-3">
                  <label className="block text-[11px] text-slate-500">
                    Describe the picture (AI)
                    <textarea
                      value={imagePanel.prompt}
                      onChange={(e) => setImagePanel({ ...imagePanel, prompt: e.target.value })}
                      rows={4}
                      placeholder="e.g. Friendly portrait of a customer, natural light"
                      className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] p-2 text-xs text-white outline-none focus:border-orange-500/50"
                    />
                  </label>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {promptIdeas.map((t) => (
                      <button
                        key={t}
                        onClick={() => setImagePanel({ ...imagePanel, prompt: t })}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-500 hover:border-orange-500/30 hover:text-orange-300"
                      >
                        {t.split(",")[0]}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={regenerate}
                    disabled={!imagePanel.prompt.trim()}
                    className="mt-2 w-full rounded-lg bg-brand-gradient py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    Generate with AI
                  </button>
                  <p className="mt-1 text-[10px] text-slate-600">Uses one image credit from your OpenAI account.</p>
                </div>
              )}

              {/* Tab: Upload / Custom URL */}
              {imageTab === "upload" && (
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-[11px] text-slate-400">Paste direct image URL:</p>
                    <div className="mt-1 flex gap-1.5">
                      <input
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white outline-none placeholder:text-slate-500 focus:border-orange-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customUrl.trim()) {
                            setValue(imagePanel.loc, customUrl.trim());
                            setCustomUrl("");
                            setImagePanel(null);
                          }
                        }}
                        className="rounded-lg bg-brand-gradient px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06] pt-2">
                    <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-medium text-slate-400 hover:text-white">
                      {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} Upload from computer
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          if (f) onUpload(f);
                        }}
                      />
                    </label>
                    {uploadError && <p className="mt-1.5 text-[11px] text-red-400">{uploadError}</p>}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setValue(imagePanel.loc, "");
                  setImagePanel(null);
                }}
                className="mt-3 w-full rounded-lg border border-red-500/20 py-1 text-xs text-red-400 hover:bg-red-500/10"
              >
                Remove image
              </button>
            </div>
          )}

          {mode === "edit" && !imagePanel && (
            <p className="mb-5 rounded-lg border border-orange-500/20 bg-orange-500/[0.06] p-3 text-xs leading-relaxed text-orange-300/80">
              <b>Edit mode:</b> click any text to change it. Hover a card for copy and delete, a section for move and AI, and an image to change, upload or remove it.
            </p>
          )}

          {/* 1-Click Theme Presets */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-orange-400" /> Pro Theme Presets
              </p>
              <span className="text-[10px] text-slate-500">1-click styles</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {THEME_PRESETS.map((p) => {
                const isSelected =
                  theme.accent === p.accent &&
                  !!theme.dark === p.dark &&
                  theme.textColor === p.textColor;
                return (
                  <button
                    key={p.id}
                    onClick={() =>
                      editTheme({
                        dark: p.dark,
                        accent: p.accent,
                        accent2: p.accent2,
                        textColor: p.textColor,
                        mutedColor: p.mutedColor,
                      })
                    }
                    className={`group relative flex flex-col rounded-xl border p-2.5 text-left transition hover:scale-[1.02] ${
                      isSelected
                        ? "border-orange-500/60 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{p.icon}</span>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent }} />
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent2 }} />
                      </div>
                    </div>
                    <span className="mt-1.5 text-xs font-semibold text-white group-hover:text-orange-300">
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Mode */}
          <div className="mb-5">
            <p className="mb-2 text-xs text-slate-400 font-medium">Theme Mode</p>
            <div className="flex gap-2">
              {[false, true].map((d) => (
                <button
                  key={String(d)}
                  onClick={() => editTheme({ dark: d })}
                  className={`flex-1 rounded-xl border py-2 text-xs font-medium transition ${
                    !!theme.dark === d
                      ? "border-orange-500/50 bg-orange-500/10 text-orange-300 shadow-sm"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {d ? "🌙 Dark" : "☀️ Light"}
                </button>
              ))}
            </div>
          </div>

          {/* Whole Site Headings Font Color */}
          <div className="mb-5 border-t border-white/[0.06] pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full border border-white/20"
                  style={{ background: theme.textColor ?? (theme.dark ? "#ffffff" : "#0f172a") }}
                />
                Headings & Titles Font Color
              </p>
              {theme.textColor && (
                <button
                  onClick={() => editTheme({ textColor: undefined })}
                  className="text-[10px] text-slate-500 hover:text-orange-400"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {headingSwatches.map((hex) => (
                <button
                  key={hex}
                  onClick={() => editTheme({ textColor: hex })}
                  aria-label={hex}
                  title={`Apply ${hex} to all titles`}
                  className={`h-6 w-6 rounded-lg ring-offset-1 ring-offset-[#0a0a10] border border-white/15 transition hover:scale-110 ${
                    theme.textColor === hex ? "ring-2 ring-orange-500 scale-105" : ""
                  }`}
                  style={{ background: hex }}
                />
              ))}
              <input
                type="color"
                value={theme.textColor ?? (theme.dark ? "#ffffff" : "#0f172a")}
                onChange={(e) => editTheme({ textColor: e.target.value })}
                aria-label="Custom title font color"
                title="Custom title font color"
                className="h-6 w-6 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
            </div>
          </div>

          {/* Whole Site Body / Subtitle Font Color */}
          <div className="mb-5 border-t border-white/[0.06] pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full border border-white/20"
                  style={{ background: theme.mutedColor ?? (theme.dark ? "#9ca3af" : "#64748b") }}
                />
                Body & Subtitle Font Color
              </p>
              {theme.mutedColor && (
                <button
                  onClick={() => editTheme({ mutedColor: undefined })}
                  className="text-[10px] text-slate-500 hover:text-orange-400"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {mutedSwatches.map((hex) => (
                <button
                  key={hex}
                  onClick={() => editTheme({ mutedColor: hex })}
                  aria-label={hex}
                  title={`Apply ${hex} to all body text`}
                  className={`h-6 w-6 rounded-lg ring-offset-1 ring-offset-[#0a0a10] border border-white/15 transition hover:scale-110 ${
                    theme.mutedColor === hex ? "ring-2 ring-orange-500 scale-105" : ""
                  }`}
                  style={{ background: hex }}
                />
              ))}
              <input
                type="color"
                value={theme.mutedColor ?? (theme.dark ? "#9ca3af" : "#64748b")}
                onChange={(e) => editTheme({ mutedColor: e.target.value })}
                aria-label="Custom body font color"
                title="Custom body font color"
                className="h-6 w-6 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
            </div>
          </div>

          {/* Primary Accent Color */}
          <div className="mb-5 border-t border-white/[0.06] pt-4">
            <p className="mb-2 text-xs font-medium text-slate-300">Primary Accent Color</p>
            <div className="flex flex-wrap items-center gap-2">
              {swatches.map((hex) => (
                <button
                  key={hex}
                  onClick={() => editTheme({ accent: hex })}
                  aria-label={hex}
                  className={`h-7 w-7 rounded-full ring-offset-1 ring-offset-[#0a0a10] transition hover:scale-105 ${
                    theme.accent === hex ? "ring-2 ring-white/60 scale-105" : ""
                  }`}
                  style={{ background: hex }}
                />
              ))}
              <input
                type="color"
                value={theme.accent ?? "#f97316"}
                onChange={(e) => editTheme({ accent: e.target.value })}
                aria-label="Custom accent color"
                className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
              />
            </div>
          </div>

          {/* Secondary Gradient Accent Color */}
          <div className="mb-5 border-t border-white/[0.06] pt-4">
            <p className="mb-2 text-xs font-medium text-slate-300">Secondary Accent (Gradient)</p>
            <div className="flex flex-wrap items-center gap-2">
              {swatches.map((hex) => (
                <button
                  key={hex}
                  onClick={() => editTheme({ accent2: hex })}
                  aria-label={hex}
                  className={`h-7 w-7 rounded-full ring-offset-1 ring-offset-[#0a0a10] transition hover:scale-105 ${
                    theme.accent2 === hex ? "ring-2 ring-white/60 scale-105" : ""
                  }`}
                  style={{ background: hex }}
                />
              ))}
              <input
                type="color"
                value={theme.accent2 ?? "#8b5cf6"}
                onChange={(e) => editTheme({ accent2: e.target.value })}
                aria-label="Custom secondary color"
                className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
              />
            </div>
          </div>

          {/* Typography / Font Style */}
          <div className="mb-5 border-t border-white/[0.06] pt-4">
            <p className="mb-2 text-xs font-medium text-slate-300">Typography Font Family</p>
            <div className="space-y-1.5">
              {fonts.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => editTheme({ font: key })}
                  className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-xs transition ${
                    (theme.font ?? "modern") === key
                      ? "border-orange-500/50 bg-orange-500/10 font-semibold text-orange-300"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span>{label}</span>
                  {(theme.font ?? "modern") === key && (
                    <Check size={13} className="text-orange-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Corners / Radius */}
          <div className="mb-3 border-t border-white/[0.06] pt-4">
            <p className="mb-2 text-xs font-medium text-slate-300">Corner Roundness</p>
            <div className="flex gap-2">
              {radii.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => editTheme({ radius: key })}
                  className={`flex-1 rounded-xl border py-2 text-xs font-medium transition ${
                    (theme.radius ?? "soft") === key
                      ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {studioOpen && doc && (
        <CodeStudio doc={doc} images={images} apiBase={API_BASE} onClose={() => setStudioOpen(false)} />
      )}

      {deployOpen && (
        <DeployModal id={id} doc={doc} onClose={() => setDeployOpen(false)} />
      )}

      {reaOpen && (
        <ReaInspectorModal
          project={projectData}
          onClose={() => setReaOpen(false)}
          onRunRea={handleRunRea}
        />
      )}
    </div>
  );
}
