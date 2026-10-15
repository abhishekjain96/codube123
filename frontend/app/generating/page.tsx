"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LayoutDashboard, Layers, Loader2, Palette, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { ApiError, createProject, createProjectV2 } from "@/lib/api";

const parts = [
  { icon: Palette, text: "Brand name, colors and fonts" },
  { icon: Layers, text: "Home, About, your main page and Contact" },
  { icon: LayoutDashboard, text: "Login, signup and a dashboard" },
  { icon: Sparkles, text: "Copy written for your business" },
];

function why(e: unknown) {
  if (e instanceof ApiError) {
    if (e.status === 503) return "The AI key is not set on the server. Set it in the backend terminal and restart it.";
    if (e.status === 502) return "The AI could not finish this site. Please try again.";
    if (e.status === 400) return "That idea could not be used. Go back and rewrite it.";
  }
  return "Could not reach the Codube server. Is the backend running?";
}

export default function GeneratingPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const started = useRef(false);

  function run(text: string) {
    setError("");
    setSeconds(0);
    createProject(text)
      .catch(() => createProjectV2(text))
      .then((p) => {
        try {
          sessionStorage.removeItem("codube_prompt");
        } catch {}
        router.replace(`/builder/${p.id}`);
      })
      .catch((e) => setError(why(e)));
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let saved = "";
    try {
      saved = sessionStorage.getItem("codube_prompt") ?? sessionStorage.getItem("acoopa_prompt") ?? "";
    } catch {}
    if (!saved.trim()) {
      router.replace("/dashboard");
      return;
    }
    setIdea(saved);
    run(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error || !idea) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [error, idea]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060608] px-4 text-white">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="bg-grid pointer-events-none absolute inset-0" />
      {/* Decorative glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-purple-500/5 blur-[100px]" />

      <div className="relative w-full max-w-lg text-center">
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
              <button onClick={() => run(idea)} className="rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white">
                Try again
              </button>
              <button onClick={() => router.push("/dashboard")} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
                Back to dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="mt-10 text-3xl font-extrabold tracking-tight">
              Codube is designing <span className="shimmer-text">your website</span>
            </h1>
            {idea && (
              <p className="glass mx-auto mt-5 line-clamp-2 max-w-sm rounded-xl px-4 py-2.5 text-sm text-slate-300">{idea}</p>
            )}

            <div className="mx-auto mt-8 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full animate-pulse rounded-full bg-brand-gradient" />
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Loader2 size={14} className="animate-spin text-orange-400" /> Working for {mm}:{ss}
            </p>

            <ul className="glass mx-auto mt-8 max-w-sm space-y-3 rounded-2xl p-5 text-left">
              <li className="text-xs font-semibold uppercase tracking-widest text-slate-500">Building</li>
              {parts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                    <Icon size={15} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-slate-500">
              {seconds > 75 ? "Bigger sites can take up to 3 minutes. Please keep this tab open." : "This usually takes 1 to 3 minutes."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}