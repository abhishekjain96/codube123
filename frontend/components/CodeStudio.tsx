"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft, Check, ChevronDown, ChevronRight, Copy, Download, FileCode, FileJson, FileText,
  Folder, Image as ImageIcon, Loader2, Package, Rocket, TriangleAlert, X, XCircle,
} from "lucide-react";
import type { SiteDoc } from "./SiteRenderer";
import { generateProject } from "@/lib/codegen/build";
import { defaultAnswers, downloadBytes, fetchBinary, readTemplate, summarize } from "@/lib/codegen/browser";
import type { CheckResult, ExportAnswers, GenEvent, GenFile, PlanSummary, PlannedFile, StageId } from "@/lib/codegen/types";

/* ------------------------------------------------------------------ */
/* small helpers                                                        */
/* ------------------------------------------------------------------ */

type Phase = "review" | "questions" | "approve" | "building" | "done" | "error";
type FileStatus = "pending" | "writing" | "done";
type StageState = { id: StageId; label: string; status: "pending" | "active" | "done" };
type LogLine = { stage: StageId; text: string; level?: "info" | "warn" };

const STAGES: StageState[] = [
  { id: "read", label: "Reading your design", status: "pending" },
  { id: "plan", label: "Planning the project", status: "pending" },
  { id: "write", label: "Writing files", status: "pending" },
  { id: "check", label: "Checking the code", status: "pending" },
  { id: "pack", label: "Packaging", status: "pending" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const TYPE_LABEL: Record<string, string> = {
  hero: "Hero", stats: "Stats", features: "Features", bento: "Bento grid", marquee: "Marquee",
  steps: "Steps", products: "Products", split: "Image + text", team: "Team",
  testimonials: "Testimonials", pricing: "Pricing", faq: "FAQ", contact: "Contact",
  cta: "Call to action", auth: "Login / signup", dashboard: "Dashboard",
};

function langOf(path: string) {
  if (/\.(tsx?|mts|mjs|js)$/.test(path)) return "ts";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".md")) return "md";
  return "txt";
}

function isImage(path: string) {
  return /\.(png|jpe?g|webp)$/i.test(path);
}

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function FileIcon({ path, size = 14 }: { path: string; size?: number }) {
  if (isImage(path)) return <ImageIcon size={size} className="text-pink-500" />;
  if (path.endsWith(".json")) return <FileJson size={size} className="text-amber-500" />;
  if (/\.(tsx?|mts|mjs)$/.test(path)) return <FileCode size={size} className="text-sky-500" />;
  if (path.endsWith(".css")) return <FileCode size={size} className="text-violet-500" />;
  return <FileText size={size} className="text-slate-400" />;
}

/* ---- a tiny syntax highlighter (no dependencies) ---- */

const TOKEN =
  /(\/\/.*$|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|export|from|const|let|var|function|return|default|type|interface|async|await|if|else|new|as|typeof|extends)\b|\b(true|false|null|undefined)\b|(\b\d+(?:\.\d+)?\b)/g;

function highlight(line: string, lang: string): ReactNode {
  if (!line) return " ";
  if (lang !== "ts" && lang !== "json") return line;
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  TOKEN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1] ? "text-slate-500 italic" : m[2] ? "text-emerald-300" : m[3] ? "text-violet-300" : m[4] ? "text-amber-300" : "text-orange-300";
    out.push(<span key={k++} className={cls}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/* ---- file tree ---- */

type TreeNode = { name: string; path: string; children: Map<string, TreeNode>; file: boolean };

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: "", path: "", children: new Map(), file: false };
  for (const p of paths) {
    const parts = p.split("/");
    let node = root;
    parts.forEach((part, i) => {
      const path = parts.slice(0, i + 1).join("/");
      if (!node.children.has(part)) node.children.set(part, { name: part, path, children: new Map(), file: i === parts.length - 1 });
      node = node.children.get(part)!;
    });
  }
  return root;
}

function sortedChildren(n: TreeNode) {
  return [...n.children.values()].sort((a, b) => (a.file === b.file ? a.name.localeCompare(b.name) : a.file ? 1 : -1));
}

function Tree({
  node, depth, closed, toggle, status, active, onPick, rowRef, plain = false,
}: {
  node: TreeNode; depth: number; closed: Set<string>; toggle: (p: string) => void;
  status: Record<string, FileStatus>; active: string | null; onPick: (p: string) => void;
  rowRef: (p: string, el: HTMLElement | null) => void; plain?: boolean;
}) {
  return (
    <>
      {sortedChildren(node).map((c) => {
        if (!c.file) {
          const isClosed = closed.has(c.path);
          return (
            <div key={c.path}>
              <button
                type="button"
                onClick={() => toggle(c.path)}
                className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-[12px] text-slate-600 hover:bg-slate-100"
                style={{ paddingLeft: 8 + depth * 14 }}
              >
                {isClosed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                <Folder size={13} className="text-sky-400" />
                <span className="truncate">{c.name}</span>
              </button>
              {!isClosed && (
                <Tree node={c} depth={depth + 1} closed={closed} toggle={toggle} status={status} active={active} onPick={onPick} rowRef={rowRef} plain={plain} />
              )}
            </div>
          );
        }
        const st = plain ? "done" : (status[c.path] ?? "pending");
        return (
          <button
            key={c.path}
            type="button"
            ref={(el) => rowRef(c.path, el)}
            disabled={st === "pending"}
            onClick={() => onPick(c.path)}
            className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-[12px] transition ${
              active === c.path ? "bg-indigo-50 text-indigo-700" : st === "pending" ? "text-slate-400" : plain ? "cursor-default text-slate-700" : "text-slate-700 hover:bg-slate-100"
            }`}
            style={{ paddingLeft: 8 + depth * 14 + 14 }}
          >
            <FileIcon path={c.path} size={13} />
            <span className="flex-1 truncate">{c.name}</span>
            {st === "writing" && <Loader2 size={12} className="animate-spin text-brand-blue" />}
            {st === "done" && !plain && <Check size={12} className="text-emerald-500" />}
          </button>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* the studio                                                           */
/* ------------------------------------------------------------------ */

export default function CodeStudio({
  doc, images, apiBase, onClose,
}: {
  doc: SiteDoc;
  images: Record<string, string>;
  apiBase: string;
  onClose: () => void;
}) {
  const summary = useMemo(() => summarize(doc, images), [doc, images]);
  const [phase, setPhase] = useState<Phase>("review");
  const [answers, setAnswers] = useState<ExportAnswers>(() => defaultAnswers(doc));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ExportAnswers, string>>>({});
  const [consent, setConsent] = useState(false);
  const [preview, setPreview] = useState<{ files: PlannedFile[]; summary: PlanSummary; warnings: string[] } | null>(null);
  const [preparing, setPreparing] = useState(false);

  // building
  const [stages, setStages] = useState<StageState[]>(STAGES);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [planned, setPlanned] = useState<PlannedFile[]>([]);
  const [fileStatus, setFileStatus] = useState<Record<string, FileStatus>>({});
  const [written, setWritten] = useState<Record<string, GenFile>>({});
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [typed, setTyped] = useState(0);
  const [counter, setCounter] = useState({ index: 0, total: 0 });
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [result, setResult] = useState<{ zip: Uint8Array; zipName: string; fileCount: number } | null>(null);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"code" | "summary">("code");
  const [copied, setCopied] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const startRef = useRef(0);
  const fastRef = useRef(false);
  const rowRefs = useRef<Record<string, HTMLElement | null>>({});
  const urlsRef = useRef<string[]>([]);

  const set = <K extends keyof ExportAnswers>(k: K, v: ExportAnswers[K]) => setAnswers((a) => ({ ...a, [k]: v }));

  // timer while building
  useEffect(() => {
    if (phase !== "building") return;
    const t = setInterval(() => setElapsed(Date.now() - startRef.current), 250);
    return () => clearInterval(t);
  }, [phase]);

  // keep the active file in view in the tree
  useEffect(() => {
    if (phase !== "building" || !current) return;
    rowRefs.current[current]?.scrollIntoView({ block: "nearest" });
  }, [current, phase]);

  // free image previews when the studio closes
  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      abortRef.current?.abort();
    };
  }, []);

  const tree = useMemo(() => buildTree(planned.map((f) => f.path)), [planned]);
  const previewTree = useMemo(() => buildTree(preview?.files.map((f) => f.path) ?? []), [preview]);

  /* ----- steps ----- */

  function validate(): boolean {
    const e: Partial<Record<keyof ExportAnswers, string>> = {};
    if (!/^[a-z0-9][a-z0-9-]*$/.test(answers.projectName.trim())) e.projectName = "Use lowercase letters, numbers and dashes, for example my-store.";
    if (!answers.siteTitle.trim()) e.siteTitle = "Add a title for search engines and browser tabs.";
    if (answers.siteUrl.trim() && !/^https?:\/\/[^\s/]+\.[^\s]+$/.test(answers.siteUrl.trim())) e.siteUrl = "Start with https://, for example https://mystore.in";
    if (answers.contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.contactEmail.trim())) e.contactEmail = "That doesn't look like an email address.";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function goApprove() {
    if (!validate()) return;
    setPreparing(true);
    try {
      let files: PlannedFile[] = [];
      let sum: PlanSummary | null = null;
      const warnings: string[] = [];
      for await (const ev of generateProject({ doc, answers, images, apiBase, readTemplate, fetchBinary, dryRun: true })) {
        if (ev.type === "plan") {
          files = ev.files;
          sum = ev.summary;
        } else if (ev.type === "log" && ev.level === "warn") warnings.push(ev.text);
      }
      if (!sum) throw new Error("Could not plan the project.");
      setPreview({ files, summary: sum, warnings });
      setConsent(false);
      setPhase("approve");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while planning.");
      setPhase("error");
    } finally {
      setPreparing(false);
    }
  }

  async function typeOut(total: number) {
    if (fastRef.current || total <= 1) {
      setTyped(total);
      return;
    }
    const frames = Math.max(1, Math.round(Math.min(240, Math.max(50, total * 2.2)) / 16));
    const step = Math.max(1, Math.ceil(total / frames));
    for (let n = step; n < total; n += step) {
      setTyped(n);
      await sleep(16);
    }
    setTyped(total);
  }

  async function handle(ev: GenEvent) {
    const pause = (ms: number) => (fastRef.current ? Promise.resolve() : sleep(ms));
    if (ev.type === "stage") {
      setStages((s) => s.map((x) => (x.id === ev.id ? { ...x, status: ev.status } : x)));
      await pause(160);
    } else if (ev.type === "log") {
      setLogs((l) => [...l, { stage: ev.stage, text: ev.text, level: ev.level }]);
      await pause(70);
    } else if (ev.type === "plan") {
      setPlanned(ev.files);
      setFileStatus(Object.fromEntries(ev.files.map((f) => [f.path, "pending" as FileStatus])));
      setCounter({ index: 0, total: ev.files.length });
    } else if (ev.type === "file") {
      const f = ev.file;
      setCurrent(f.path);
      setFileStatus((s) => ({ ...s, [f.path]: "writing" }));
      setWritten((w) => ({ ...w, [f.path]: f }));
      if (f.bytes && isImage(f.path)) {
        const url = URL.createObjectURL(new Blob([f.bytes as unknown as BlobPart]));
        urlsRef.current.push(url);
        setBlobUrls((u) => ({ ...u, [f.path]: url }));
      }
      setTyped(0);
      await typeOut(f.text ? f.text.split("\n").length : 1);
      setFileStatus((s) => ({ ...s, [f.path]: "done" }));
      setCounter({ index: ev.index, total: ev.total });
      await pause(20);
    } else if (ev.type === "checks") {
      setChecks(ev.checks);
      await pause(300);
    } else if (ev.type === "done") {
      setResult({ zip: ev.zip, zipName: ev.zipName, fileCount: ev.files.length });
      setCurrent(null);
      setTab("summary");
    }
  }

  async function run() {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    fastRef.current = false;
    setStages(STAGES.map((s) => ({ ...s })));
    setLogs([]);
    setPlanned([]);
    setFileStatus({});
    setWritten({});
    setBlobUrls({});
    setCurrent(null);
    setPinned(null);
    setChecks([]);
    setResult(null);
    setTab("code");
    setElapsed(0);
    startRef.current = Date.now();
    setPhase("building");
    try {
      for await (const ev of generateProject({ doc, answers, images, apiBase, readTemplate, fetchBinary, signal: ctrl.signal })) {
        await handle(ev);
      }
      setPhase("done");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setPhase("approve");
        return;
      }
      setError(e instanceof Error ? e.message : "Something went wrong while building.");
      setPhase("error");
    }
  }

  function close() {
    if (phase === "building" && !window.confirm("Stop building the project?")) return;
    abortRef.current?.abort();
    onClose();
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {}
  }

  /* ----- header ----- */

  const stepIndex = phase === "review" ? 0 : phase === "questions" ? 1 : 2;
  const wizard = phase === "review" || phase === "questions" || phase === "approve";
  const progress = counter.total ? Math.round((counter.index / counter.total) * 100) : 0;
  const name = answers.projectName.trim() || "my-site";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 text-slate-900">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white"><Package size={16} /></span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Generate code</p>
            <p className="text-[11px] text-slate-500">{summary.brand}</p>
          </div>
        </div>

        {wizard ? (
          <ol className="hidden items-center gap-2 text-xs sm:flex">
            {["Review", "Questions", "Approve"].map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${i < stepIndex ? "bg-emerald-500 text-white" : i === stepIndex ? "bg-brand-gradient text-white" : "bg-slate-200 text-slate-500"}`}>
                  {i < stepIndex ? <Check size={12} /> : i + 1}
                </span>
                <span className={i === stepIndex ? "font-semibold" : "text-slate-500"}>{label}</span>
                {i < 2 && <span className="mx-1 h-px w-8 bg-slate-200" />}
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center gap-3">
            <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-gradient transition-all duration-300" style={{ width: `${phase === "done" ? 100 : progress}%` }} />
            </div>
            <span className="whitespace-nowrap text-xs tabular-nums text-slate-500">
              {phase === "done" ? "Done" : `${counter.index}/${counter.total || "…"} files`} · {fmtTime(elapsed)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {phase === "building" && (
            <button onClick={() => { fastRef.current = true; }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
              Skip animation
            </button>
          )}
          <button onClick={close} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <X size={15} />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        {phase === "review" && (
          <Step title="Let's check everything before we write any code" subtitle="Nothing is generated until you approve on the last step. You can close this window, change your design, and come back.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card title={`Pages (${summary.pages.length})`}>
                <ul className="space-y-1.5 text-sm">
                  {summary.pages.map((p) => (
                    <li key={p.slug} className="flex items-center justify-between">
                      <span>{p.name}</span>
                      <span className="text-xs text-slate-400">{p.sections} section{p.sections === 1 ? "" : "s"}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="Sections used">
                <div className="flex flex-wrap gap-1.5">
                  {summary.types.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{TYPE_LABEL[t] ?? t}</span>
                  ))}
                </div>
              </Card>
              <Card title="Images">
                <p className="text-sm">
                  <b>{summary.imagesReady}</b> of <b>{summary.imagesTotal}</b> are ready
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${summary.imagesTotal ? (summary.imagesReady / summary.imagesTotal) * 100 : 100}%` }} />
                </div>
                {summary.imagesReady < summary.imagesTotal && (
                  <p className="mt-2 flex gap-1.5 text-xs text-amber-700">
                    <TriangleAlert size={13} className="mt-0.5 shrink-0" />
                    Images still generating will be exported as colour placeholders. Close this window and come back in a minute to include them.
                  </p>
                )}
              </Card>
              <Card title="What the project will include">
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <Feature on text="Next.js, TypeScript and Tailwind, ready to run" />
                  <Feature on={summary.hasCart} text="Cart counter on the product cards" />
                  <Feature on={summary.hasContact} text="Contact form with a working API route" />
                  <Feature on={summary.hasNewsletter} text="Newsletter box with an API route" />
                  <Feature on={summary.hasAuthPages} text="Login, signup and dashboard screens (UI only)" />
                </ul>
              </Card>
            </div>
            <Actions>
              <button onClick={close} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100">Back to editor</button>
              <button onClick={() => setPhase("questions")} className="rounded-lg bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90">
                Looks good, continue
              </button>
            </Actions>
          </Step>
        )}

        {phase === "questions" && (
          <Step title="A few quick questions" subtitle="These details go into your project's settings. Everything is pre-filled from your design, so you can just continue.">
            <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 sm:p-6">
              <Field label="Project folder name" hint="Used for the folder and package name." error={fieldErrors.projectName}>
                <input value={answers.projectName} onChange={(e) => set("projectName", e.target.value.toLowerCase())} className={inp(fieldErrors.projectName)} />
              </Field>
              <Field label="Website address (optional)" hint="Where it will live. Used for the sitemap and sharing previews." error={fieldErrors.siteUrl}>
                <input value={answers.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} placeholder="https://mystore.in" className={inp(fieldErrors.siteUrl)} />
              </Field>
              <Field label="Page title" hint="Shown in the browser tab and in Google results." error={fieldErrors.siteTitle}>
                <input value={answers.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} className={inp(fieldErrors.siteTitle)} />
              </Field>
              <Field label="Contact email (optional)" hint={summary.hasContact ? "Contact form messages are sent here once you add an email service." : "Used in the setup notes."} error={fieldErrors.contactEmail}>
                <input value={answers.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="hello@mystore.in" className={inp(fieldErrors.contactEmail)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Short description" hint="Shown under your title in Google results. About 150 characters is ideal.">
                  <textarea rows={2} value={answers.siteDescription} onChange={(e) => set("siteDescription", e.target.value)} className={`${inp()} resize-none`} />
                  <p className="mt-1 text-right text-[11px] text-slate-400">{answers.siteDescription.length} characters</p>
                </Field>
              </div>

              {summary.hasAuthPages && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold">Your design has login, signup and dashboard pages</p>
                  <p className="mt-0.5 text-xs text-slate-500">They only look real for now. Real accounts need a login service that you connect afterwards.</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <Radio checked={answers.authPages === "include"} onClick={() => set("authPages", "include")} title="Include them as screens" text="Keep the pages so you can connect real login later." />
                    <Radio checked={answers.authPages === "skip"} onClick={() => set("authPages", "skip")} title="Leave them out" text="A simpler site without login or dashboard." />
                  </div>
                </div>
              )}

              <div className="sm:col-span-2">
                <p className="text-sm font-semibold">Where will you put it online?</p>
                <p className="mt-0.5 text-xs text-slate-500">This only changes the instructions in your README.</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <Radio checked={answers.deploy === "vercel"} onClick={() => set("deploy", "vercel")} title="Vercel" text="Easiest for Next.js" />
                  <Radio checked={answers.deploy === "netlify"} onClick={() => set("deploy", "netlify")} title="Netlify" text="Connect a GitHub repo" />
                  <Radio checked={answers.deploy === "node"} onClick={() => set("deploy", "node")} title="My own server" text="Any machine with Node.js" />
                </div>
              </div>
            </div>
            <Actions>
              <button onClick={() => setPhase("review")} className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"><ArrowLeft size={14} /> Back</button>
              <button onClick={goApprove} disabled={preparing} className="flex items-center gap-2 rounded-lg bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 disabled:opacity-60">
                {preparing && <Loader2 size={14} className="animate-spin" />} Continue
              </button>
            </Actions>
          </Step>
        )}

        {phase === "approve" && preview && (
          <Step title="Ready to build? Here is exactly what you'll get" subtitle="Check the plan, then approve. Generating takes a few seconds and costs no AI credits.">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-4">
                <Card title="Your answers">
                  <dl className="space-y-2 text-sm">
                    <Row k="Folder" v={answers.projectName} />
                    <Row k="Page title" v={answers.siteTitle} />
                    <Row k="Address" v={answers.siteUrl || "Not set yet"} />
                    <Row k="Contact email" v={answers.contactEmail || "Not set"} />
                    {summary.hasAuthPages && <Row k="Login pages" v={answers.authPages === "include" ? "Included as screens" : "Left out"} />}
                    <Row k="Deploy" v={{ vercel: "Vercel", netlify: "Netlify", node: "Own server" }[answers.deploy]} />
                  </dl>
                </Card>
                <Card title="The plan">
                  <ul className="space-y-1.5 text-sm">
                    <li><b>{preview.files.length}</b> files, <b>{preview.summary.pages.length}</b> page{preview.summary.pages.length === 1 ? "" : "s"}</li>
                    <li>Routes: {preview.summary.pages.map((p) => p.path).join("  ")}</li>
                    <li><b>{preview.summary.imagesIncluded}</b> image{preview.summary.imagesIncluded === 1 ? "" : "s"} included</li>
                  </ul>
                  {preview.warnings.length > 0 && (
                    <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                      <p className="flex items-center gap-1.5 font-semibold"><TriangleAlert size={13} /> Heads up</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5">
                        {preview.warnings.slice(0, 6).map((w, i) => <li key={i}>{w}</li>)}
                        {preview.warnings.length > 6 && <li>and {preview.warnings.length - 6} more</li>}
                      </ul>
                    </div>
                  )}
                </Card>
              </div>
              <Card title="Files that will be created">
                <div className="max-h-[360px] overflow-auto rounded-lg bg-slate-50 p-1.5">
                  <Tree node={previewTree} depth={0} closed={closed} toggle={(p) => setClosed((c) => { const n = new Set(c); if (n.has(p)) n.delete(p); else n.add(p); return n; })}
                    status={{}} active={null} onPick={() => {}} rowRef={() => {}} plain />
                </div>
              </Card>
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4" />
              <span>I have checked the design in the editor and I am ready to generate the code. I understand that the login pages, cart and dashboard are screens only until I connect real services.</span>
            </label>
            <Actions>
              <button onClick={() => setPhase("questions")} className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"><ArrowLeft size={14} /> Back</button>
              <button onClick={run} disabled={!consent} className="flex items-center gap-2 rounded-lg bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                <Rocket size={15} /> Approve and generate
              </button>
            </Actions>
          </Step>
        )}

        {(phase === "building" || phase === "done") && (
          <BuildView
            stages={stages} logs={logs} tree={tree} fileStatus={fileStatus} written={written} blobUrls={blobUrls}
            current={current} pinned={pinned} typed={typed} phase={phase} closed={closed} tab={tab} setTab={setTab}
            setClosed={setClosed} setPinned={(p) => { setPinned(p); setTab("code"); }} rowRef={(p, el) => { rowRefs.current[p] = el; }}
            summaryPanel={
              <SummaryPanel
                name={name} result={result} checks={checks} pages={summary.pages.length} copied={copied} copy={copy}
                onDownload={() => result && downloadBytes(result.zip, result.zipName)} onClose={onClose}
              />
            }
          />
        )}

        {phase === "error" && (
          <Step title="Something went wrong" subtitle="Your design is safe. Nothing was changed.">
            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <XCircle size={18} className="mt-0.5 shrink-0" /> <span>{error}</span>
            </div>
            <Actions>
              <button onClick={close} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100">Back to editor</button>
              <button onClick={() => setPhase("approve")} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Try again</button>
            </Actions>
          </Step>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* building view                                                        */
/* ------------------------------------------------------------------ */

function BuildView({
  stages, logs, tree, fileStatus, written, blobUrls, current, pinned, typed, phase, closed, tab, setTab, setClosed, setPinned, rowRef, summaryPanel,
}: {
  stages: StageState[]; logs: LogLine[]; tree: TreeNode; fileStatus: Record<string, FileStatus>; written: Record<string, GenFile>;
  blobUrls: Record<string, string>; current: string | null; pinned: string | null; typed: number; phase: Phase; closed: Set<string>;
  tab: "code" | "summary"; setTab: (t: "code" | "summary") => void; setClosed: (f: (c: Set<string>) => Set<string>) => void;
  setPinned: (p: string | null) => void; rowRef: (p: string, el: HTMLElement | null) => void; summaryPanel: ReactNode;
}) {
  const shown = pinned ?? current;
  const file = shown ? written[shown] : undefined;
  const lines = useMemo(() => (file?.text ? file.text.split("\n") : []), [file]);
  const live = shown === current && phase === "building";
  const visible = live ? Math.min(typed, lines.length) : lines.length;
  const cap = 400;
  const logEnd = useRef<HTMLDivElement>(null);
  const codeEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ block: "nearest" });
  }, [logs.length]);
  useEffect(() => {
    if (live) codeEnd.current?.scrollIntoView({ block: "nearest" });
  }, [visible, live]);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[290px_270px_minmax(0,1fr)]">
      {/* steps and log */}
      <aside className="min-h-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
        <ol className="space-y-3">
          {stages.map((s) => {
            const own = logs.filter((l) => l.stage === s.id);
            return (
              <li key={s.id}>
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${s.status === "done" ? "bg-emerald-500 text-white" : s.status === "active" ? "bg-indigo-100 text-brand-blue" : "bg-slate-100 text-slate-300"}`}>
                    {s.status === "done" ? <Check size={11} /> : s.status === "active" ? <Loader2 size={11} className="animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className={`text-sm ${s.status === "pending" ? "text-slate-400" : "font-medium"}`}>{s.label}</span>
                </div>
                {s.status !== "pending" && own.length > 0 && (
                  <ul className="ml-[30px] mt-1.5 space-y-1 border-l border-slate-200 pl-3">
                    {own.map((l, i) => (
                      <li key={i} className={`text-[11px] leading-snug ${l.level === "warn" ? "text-amber-700" : "text-slate-500"}`}>{l.text}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
        <div ref={logEnd} />
      </aside>

      {/* files */}
      <aside className="min-h-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-2">
        <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Project files</p>
        <Tree node={tree} depth={0} closed={closed} toggle={(p) => setClosed((c) => { const n = new Set(c); if (n.has(p)) n.delete(p); else n.add(p); return n; })}
          status={fileStatus} active={shown} onPick={setPinned} rowRef={rowRef} />
      </aside>

      {/* viewer */}
      <section className="flex min-h-0 min-w-0 flex-col bg-slate-950">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 bg-slate-900 px-3">
          <div className="flex items-center gap-1">
            {phase === "done" && (
              <>
                <TabBtn on={tab === "summary"} onClick={() => setTab("summary")}>Summary</TabBtn>
                <TabBtn on={tab === "code"} onClick={() => setTab("code")}>Code</TabBtn>
              </>
            )}
            {(phase === "building" || tab === "code") && shown && (
              <span className="ml-1 flex items-center gap-2 text-xs text-slate-300">
                <FileIcon path={shown} /> {shown}
              </span>
            )}
          </div>
          {phase === "building" && (
            <button onClick={() => setPinned(null)} className={`rounded-full px-2.5 py-0.5 text-[11px] ${pinned ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-emerald-500/20 text-emerald-300"}`}>
              {pinned ? "Pinned, click to follow live" : "● Live"}
            </button>
          )}
        </div>

        {tab === "summary" && phase === "done" ? (
          <div key="summary" className="min-h-0 flex-1 overflow-y-auto bg-slate-50 text-slate-900">{summaryPanel}</div>
        ) : (
          <div key="code" className="min-h-0 flex-1 overflow-auto p-0 font-mono text-[12px] leading-5 text-slate-200">
            {!file && <p className="p-6 text-sm text-slate-500">Files will appear here as they are written.</p>}
            {file && isImage(file.path) && (
              <div className="flex h-full items-center justify-center p-6">
                {blobUrls[file.path] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blobUrls[file.path]} alt={file.path} className="max-h-full max-w-full rounded-lg shadow-2xl" />
                )}
              </div>
            )}
            {file && !isImage(file.path) && (
              <div className="py-3">
                {lines.slice(0, Math.min(visible, cap)).map((l, i) => (
                  <div key={i} className="flex whitespace-pre px-3 hover:bg-white/5">
                    <span className="w-10 shrink-0 select-none pr-3 text-right text-slate-600">{i + 1}</span>
                    <span>{highlight(l, langOf(file.path))}</span>
                  </div>
                ))}
                {lines.length > cap && visible >= cap && <p className="px-14 pt-2 text-slate-500">… {lines.length - cap} more lines in this file</p>}
                {live && <span className="ml-[52px] inline-block h-4 w-1.5 animate-pulse bg-emerald-400 align-middle" />}
                <div ref={codeEnd} />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryPanel({
  name, result, checks, pages, copied, copy, onDownload, onClose,
}: {
  name: string; result: { zip: Uint8Array; zipName: string; fileCount: number } | null; checks: CheckResult[]; pages: number;
  copied: string; copy: (t: string, k: string) => void; onDownload: () => void; onClose: () => void;
}) {
  const fails = checks.filter((c) => c.status === "fail").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const commands = [`cd ${name}`, "npm install", "cp .env.example .env.local", "npm run dev"];
  return (
    <div className="mx-auto max-w-2xl space-y-5 p-6">
      <div className="rounded-2xl border border-emerald-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${fails ? "bg-red-500" : "bg-emerald-500"}`}>
            {fails ? <XCircle size={20} /> : <Check size={20} />}
          </span>
          <div>
            <h2 className="text-lg font-bold">{fails ? "The project has problems" : "Your project is ready"}</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {result ? `${result.fileCount} files · ${pages} page${pages === 1 ? "" : "s"} · ${Math.max(1, Math.round(result.zip.length / 1024))} KB` : ""}
              {warns > 0 && ` · ${warns} thing${warns === 1 ? "" : "s"} to look at`}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={onDownload} disabled={!result} className="flex items-center gap-2 rounded-lg bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 disabled:opacity-50">
            <Download size={15} /> Download {result?.zipName ?? "ZIP"}
          </button>
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-100">Back to editor</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-bold">Checks</h3>
        <ul className="mt-3 space-y-2.5">
          {checks.map((c) => (
            <li key={c.id} className="flex items-start gap-2.5 text-sm">
              {c.status === "pass" ? <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" /> : c.status === "warn" ? <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-500" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-red-500" />}
              <span>
                <span className="font-medium">{c.label}</span>
                {c.detail && <span className="block text-xs text-slate-500">{c.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
          These checks look at your files inside the browser. The full compile happens when you run <code className="rounded bg-slate-200 px-1">npm run build</code>, which is the first thing to try after you unzip.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-bold">Run it on your computer</h3>
        <p className="mt-1 text-xs text-slate-500">Unzip the file, open a terminal inside the folder, and run these. You need Node.js 20.9 or newer.</p>
        <div className="mt-3 space-y-1.5">
          {commands.map((c) => (
            <div key={c} className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100">
              <span><span className="text-slate-500">$ </span>{c}</span>
              <button onClick={() => copy(c, c)} aria-label={`Copy ${c}`} className="text-slate-400 hover:text-white">
                {copied === c ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Then open http://localhost:3000. The README inside the folder explains how to edit your content and put the site online.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* little layout pieces                                                 */
/* ------------------------------------------------------------------ */

const inp = (err?: string) =>
  `mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue ${err ? "border-red-400" : "border-slate-200"}`;

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      {children}
    </div>
  );
}

function Feature({ on, text }: { on: boolean; text: string }) {
  if (!on) return null;
  return (
    <li className="flex items-center gap-2">
      <Check size={14} className="shrink-0 text-emerald-500" /> {text}
    </li>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex items-center justify-between gap-3">{children}</div>;
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Radio({ checked, onClick, title, text }: { checked: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-xl border p-3 text-left transition ${checked ? "border-brand-blue bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
      <span className="flex items-center gap-2 text-sm font-semibold">
        <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${checked ? "border-brand-blue" : "border-slate-300"}`}>
          {checked && <span className="h-2 w-2 rounded-full bg-brand-blue" />}
        </span>
        {title}
      </span>
      <span className="mt-1 block pl-6 text-xs text-slate-500">{text}</span>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{k}</dt>
      <dd className="truncate text-right font-medium">{v}</dd>
    </div>
  );
}

function TabBtn({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-md px-2.5 py-1 text-xs font-medium ${on ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"}`}>
      {children}
    </button>
  );
}
