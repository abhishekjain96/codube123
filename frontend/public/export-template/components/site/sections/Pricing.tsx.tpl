import { Check } from "lucide-react";
import type { Section } from "@/content/types";
import { Reveal } from "../Reveal";
import { ButtonLink, Head } from "../ui";
import { P, cardStyle } from "../theme";

export function Pricing({ s }: { s: Section }) {
  return (
    <>
      <Head s={s} />
      <div className="grid items-center gap-5 @3xl:grid-cols-3">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 80}>
            <div
              className={`relative p-7 transition duration-300 hover:-translate-y-1.5 ${it.highlighted ? "shadow-2xl @3xl:scale-105" : ""}`}
              style={{ ...cardStyle, border: it.highlighted ? `2px solid ${P.accent}` : `1px solid ${P.border}` }}
            >
              {it.highlighted && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-semibold text-white"
                  style={{ background: P.grad }}
                >
                  Most popular
                </span>
              )}
              <h3 className="block font-bold" style={{ fontFamily: P.heading }}>
                {it.title}
              </h3>
              <p className="mt-3 block text-3xl font-extrabold">{it.price}</p>
              <p className="mt-1 text-sm" style={{ color: P.muted }}>
                {it.description}
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {(it.features ?? []).map((f, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <Check size={14} className="shrink-0" style={{ color: P.accent }} />
                    <span className="flex-1">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <ButtonLink
                  link={{ label: it.cta ?? "Choose plan", href: it.href ?? "#" }}
                  kind={it.highlighted ? "primary" : "ghost"}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
