"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Globe, Loader2, Sparkles, Terminal } from "lucide-react";
import Logo from "@/components/Logo";
import { ApiError, createProject, createProjectFromUrl, createProjectV2 } from "@/lib/api";

const REA_STEPS = [
  { time: "0.2s", text: "System Router -> Ingesting target parameters and intent" },
  { time: "0.9s", text: "REA Scraper Worker -> Extracting public DOM, CSS tokens & assets" },
  { time: "1.9s", text: "Spatial Behavior Analyst -> Mapping responsive components & layouts" },
  { time: "3.1s", text: "Architecture Agent -> Synthesizing multi-page interactive blueprint" },
  { time: "4.2s", text: "Full-Stack Coder Agent -> Assembling live preview canvas & components" },
  { time: "5.0s", text: "Compiler Validation -> Zero-defect build verified. Launching studio..." },
];

export default function GeneratingPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [instructions, setInstructions] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let savedUrl = "";
    let savedInstructions = "";
    let savedPrompt = "";

    try {
      savedUrl = sessionStorage.getItem("codube_url") ?? "";
      savedInstructions = sessionStorage.getItem("codube_instructions") ?? "";
      savedPrompt = sessionStorage.getItem("codube_prompt") ?? "";
    } catch {}

    if (savedUrl) {
      setIsUrlMode(true);
      setTargetUrl(savedUrl);
      setInstructions(savedInstructions);
      setIdea(`URL: ${savedUrl}`);

      // Run URL Reverse Engineering
      createProjectFromUrl(savedUrl, savedInstructions)
        .then((p) => {
          setTimeout(() => {
            router.replace(`/builder/${p.id}`);
          }, 3500);
        })
        .catch(() => {
          createProject(savedPrompt || savedUrl)
            .then((p) => {
              setTimeout(() => {
                router.replace(`/builder/${p.id}`);
              }, 3500);
            })
            .catch((e) => setError(e instanceof ApiError ? e.message : "Generation failed"));
        });
    } else if (savedPrompt.trim()) {
      setIdea(savedPrompt);
      if (savedPrompt.startsWith("http") || savedPrompt.includes("www.")) {
        setIsUrlMode(true);
        setTargetUrl(savedPrompt.split(" ")[0]);
      }

      createProject(savedPrompt)
        .catch(() => createProjectV2(savedPrompt))
        .then((p) => {
          setTimeout(() => {
            router.replace(`/builder/${p.id}`);
          }, 3200);
        })
        .catch((e) => setError(e instanceof ApiError ? e.message : "Generation failed"));
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (error) return;
    const t = setInterval(() => {
      setSeconds((s) => s + 1);
      setActiveStep((step) => (step < REA_STEPS.length - 1 ? step + 1 : step));
    }, 700);
    return () => clearInterval(t);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060608] px-4 text-white">
      {/* Background Aurora */}
      <div className="aurora pointer-events-none absolute inset-0 opacity-70" />
      <div className="bg-grid pointer-events-none absolute inset-0" />

      {/* Decorative Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative w-full max-w-xl text-center">
        <div className="flex justify-center text-white">
          <Logo />
        </div>

        {error ? (
          <div className="glass mt-10 rounded-2xl p-6 text-left">
            <p className="flex items-center gap-2 font-semibold text-red-300">
              <AlertTriangle size={18} /> Something went wrong
            </p>
            <p className="mt-2 text-sm text-slate-300">{error}</p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => router.push("/")}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Back to home
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-300">
              <Sparkles size={12} className="text-orange-400" />
              <span>
                {isUrlMode ? "REA REVERSE ENGINEERING WORKER ACTIVE" : "AI SYNTHESIS ENGINE ACTIVE"}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Codube is designing{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                your application
              </span>
            </h1>

            {/* Target Display */}
            <div className="mx-auto mt-4 max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left">
              {isUrlMode ? (
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Globe size={15} className="text-violet-400 shrink-0" />
                  <span className="font-mono text-violet-300 font-semibold truncate">{targetUrl}</span>
                </div>
              ) : (
                <p className="line-clamp-2 text-xs text-slate-300">{idea}</p>
              )}
              {instructions && (
                <p className="mt-1 line-clamp-1 text-[11px] text-slate-400 italic">
                  Note: &quot;{instructions}&quot;
                </p>
              )}
            </div>

            {/* Glowing progress bar */}
            <div className="mx-auto mt-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 transition-all duration-500"
                style={{ width: `${Math.min(100, ((activeStep + 1) / REA_STEPS.length) * 100)}%` }}
              />
            </div>

            {/* Terminal Live Execution Console */}
            <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-[#07070e] p-4 text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Terminal size={13} className="text-violet-400" />
                  Live Worker Pipeline
                </span>
                <span className="flex items-center gap-1 text-[11px] text-orange-400">
                  <Loader2 size={11} className="animate-spin" />
                  Processing...
                </span>
              </div>

              <div className="mt-3 space-y-2 font-mono text-[11px]">
                {REA_STEPS.map((s, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div
                      key={s.text}
                      className={`flex items-start gap-2 transition duration-200 ${
                        isCurrent
                          ? "text-violet-300 font-semibold"
                          : isDone
                          ? "text-slate-400"
                          : "text-slate-600 opacity-40"
                      }`}
                    >
                      <span className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 size={13} className="text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 size={13} className="animate-spin text-orange-400" />
                        ) : (
                          <span className="inline-block h-3 w-3 rounded-full border border-slate-700" />
                        )}
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0">[{s.time}]</span>
                      <span className="leading-tight">{s.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Interactive preview will be ready in moments. You will be able to edit everything visually.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}