"use client";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

const examples = [
  "A SaaS landing page",
  "An e-commerce store",
  "A portfolio website",
  "A dashboard",
];
const ideas = [
  "A SaaS landing page for my AI startup...",
  "A portfolio website for a photographer...",
  "An online store for handmade jewelry...",
  "A dashboard to track my sales...",
];

function useTypingPlaceholder() {
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

      let delay = deleting ? 25 : 55;
      if (!deleting && char === full.length) {
        deleting = true;
        delay = 1500;
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

export default function PromptBox({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [inner, setInner] = useState("");
  const prompt = value ?? inner;
  const router = useRouter();
  const placeholder = useTypingPlaceholder();

  function setPrompt(v: string) {
    onChange?.(v);
    if (value === undefined) setInner(v);
  }

  function submit() {
    const text = prompt.trim();
    if (!text) return;
    try {
      sessionStorage.setItem("codube_prompt", text);
    } catch {}
    router.push(getToken() ? "/generating" : "/signup");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b14] p-4 shadow-2xl sm:p-5">
      <div className="flex items-start gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder={placeholder || "Tell Codube what you want to build..."}
          className="min-h-[56px] flex-1 resize-none bg-transparent px-2 py-1 text-base text-white outline-none placeholder:text-slate-500"
        />
        <button
          onClick={submit}
          aria-label="Generate"
          className="btn-shine flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-orange-500/30 transition hover:scale-105"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
          <Sparkles size={14} />
        </span>
        {examples.map((e) => (
          <button
            key={e}
            onClick={() => setPrompt(e)}
            className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400 transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-300"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
