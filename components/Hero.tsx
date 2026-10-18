"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import PromptBox from "./PromptBox";
import LiveHeroCanvas from "./LiveHeroCanvas";

const perks = ["Visual first — no code dump", "Click any block to edit", "Code only after you approve"];

export default function Hero() {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white">
      <div className="anim-blob pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="anim-blob pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" style={{ animationDelay: "-6s" }} />

      <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-14 text-center sm:px-6 sm:pt-20">
        <p className="mb-4 inline-flex rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-blue shadow-sm">
          Visual first, code later
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Touch a live website.
          <br />
          <span className="text-brand-gradient">Approve it.</span> Then we code.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-slate-600">
          Lovable and Bolt jump straight into a codebase. Acoopa shows a clickable prototype first —
          so non-technical founders can feel the product before any database exists.
        </p>

        <div className="relative mt-10 text-left">
          <p className="absolute -left-44 -top-6 hidden w-36 -rotate-6 text-center font-hand text-xl leading-tight text-brand-blue xl:block">
            Type. The preview moves.
          </p>
          <p className="absolute -right-44 -top-8 hidden w-36 rotate-6 text-center font-hand text-xl leading-tight text-brand-blue xl:block">
            No backend yet
          </p>
          <PromptBox value={prompt} onChange={setPrompt} />
        </div>

        <LiveHeroCanvas prompt={prompt} />

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-1.5">
              <Check size={14} className="text-brand-blue" /> {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
