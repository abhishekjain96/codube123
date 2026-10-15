import type { Section } from "@/content/types";
import { Reveal } from "../Reveal";
import { P, gradText } from "../theme";

export function Stats({ s }: { s: Section }) {
  return (
    <div className="grid grid-cols-2 gap-6 text-center @3xl:grid-cols-4">
      {(s.items ?? []).map((it, i) => (
        <Reveal key={i} delay={i * 80}>
          <p className="block text-4xl font-extrabold" style={{ fontFamily: P.heading, ...gradText }}>
            {it.value}
          </p>
          <p className="mt-1 text-sm" style={{ color: P.muted }}>
            {it.label}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
