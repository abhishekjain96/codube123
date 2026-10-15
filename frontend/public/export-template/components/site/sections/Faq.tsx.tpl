"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Item, Section } from "@/content/types";
import { Reveal } from "../Reveal";
import { Head } from "../ui";
import { P, cardStyle } from "../theme";

function FaqItem({ it }: { it: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={cardStyle}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-semibold"
      >
        <span>{it.question}</span>
        <ChevronDown
          size={18}
          className="shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="block px-5 pb-5 text-sm" style={{ color: P.muted }}>
            {it.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq({ s }: { s: Section }) {
  return (
    <>
      <Head s={s} />
      <div className="mx-auto max-w-2xl space-y-3">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 60}>
            <FaqItem it={it} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
