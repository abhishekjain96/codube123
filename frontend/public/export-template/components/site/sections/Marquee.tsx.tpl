import type { Section } from "@/content/types";
import { P } from "../theme";

export function Marquee({ s }: { s: Section }) {
  const words = (s.items ?? []).map((i) => i.title).filter(Boolean) as string[];
  const row = [...words, ...words];
  return (
    <div
      className="overflow-hidden py-6"
      style={{ background: P.alt, borderTop: `1px solid ${P.border}`, borderBottom: `1px solid ${P.border}` }}
    >
      <div
        className="anim-marquee flex w-max gap-12 whitespace-nowrap text-sm font-semibold uppercase tracking-widest"
        style={{ color: P.muted }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t} <span style={{ color: P.accent }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
