import { Check } from "lucide-react";
import type { Section } from "@/content/types";
import { Reveal } from "../Reveal";
import { Pic } from "../ui";
import { P, mix } from "../theme";

export function Split({ s }: { s: Section }) {
  return (
    <div className="grid items-center gap-12 @3xl:grid-cols-2">
      <Reveal className={s.reverse ? "@3xl:order-2" : ""}>
        <Pic
          src={s.image}
          alt={s.title}
          className="aspect-[4/3]"
          style={{ border: `1px solid ${P.border}`, borderRadius: P.radius }}
          fallback={
            <div
              className="flex h-full w-full items-center justify-center text-8xl"
              style={{ background: `linear-gradient(135deg, ${mix(P.accent, 13)}, ${mix(P.accent2, 20)})` }}
            >
              <span className="anim-float">{s.visual}</span>
            </div>
          }
        />
      </Reveal>
      <Reveal delay={100}>
        <h2
          className="block text-3xl font-extrabold tracking-tight @2xl:text-4xl"
          style={{ fontFamily: P.heading }}
        >
          {s.title}
        </h2>
        <p className="mt-4" style={{ color: P.muted }}>
          {s.text}
        </p>
        <ul className="mt-6 space-y-3">
          {(s.bullets ?? []).map((b, j) => (
            <li key={j} className="flex items-start gap-3 text-sm">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: P.grad }}
              >
                <Check size={12} />
              </span>
              <span className="flex-1">{b}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
