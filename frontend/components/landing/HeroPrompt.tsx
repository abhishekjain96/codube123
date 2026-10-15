"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";
import { getToken } from "@/lib/api";

const ideas = [
  "A landing page for my AI startup...",
  "An online store for handmade jewelry...",
  "A portfolio for a wedding photographer...",
  "A rooftop restaurant website in Mumbai...",
];
const chips = ["SaaS landing page", "Online store", "Portfolio", "Restaurant", "Fitness studio", "Dashboard"];

function useTyping() {
  const [text, setText] = useState("");
  useEffect(() => {
    let idea = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      const full = ideas[idea];
      char += deleting ? -1 : 1;
      setText(full.slice(0, char));
      let delay = deleting ? 22 : 50;
      if (!deleting && char === full.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && char === 0) {
        deleting = false;
        idea = (idea + 1) % ideas.length;
        delay = 400;
      }
      timer = setTimeout(tick, delay);
    }
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);
  return text;
}

export default function HeroPrompt({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const router = useRouter();
  const placeholder = useTyping();

  function submit() {
    const text = value.trim();
    if (!text) return;
    try {
      sessionStorage.setItem("codube_prompt", text);
    } catch {}
    router.push(getToken() ? "/generating" : "/signup");
  }

  return (
    <div className="relative mx-auto max-w-2xl text-left">
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 blur-2xl" />
      <div className="relative rounded-2xl bg-gradient-to-r from-orange-500/50 via-purple-500/50 to-orange-500/50 p-px">
        <div className="rounded-[15px] bg-[#0b0b14] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={2}
              placeholder={placeholder || "Tell Codube what you want to build..."}
              className="min-h-[56px] flex-1 resize-none bg-transparent px-1 py-1 text-base text-white outline-none placeholder:text-slate-500"
            />
            <button
              onClick={submit}
              aria-label="Generate"
              className="btn-shine flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-orange-500/40 transition hover:scale-105"
            >
              <ArrowUp size={20} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <Sparkles size={14} />
            </span>
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => onChange(c)}
                className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400 transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-300"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}