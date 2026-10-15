import type { Item, Section } from "@/content/types";
import { Head, Pic } from "../ui";
import { P, cardStyle } from "../theme";

function Card({ it, idx }: { it: Item; idx: number }) {
  return (
    <figure className="w-80 shrink-0 p-6" style={cardStyle}>
      <div className="flex gap-0.5 text-sm" style={{ color: "#f59e0b" }}>
        ★★★★★
      </div>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: P.muted }}>
        {it.quote}
      </p>
      <figcaption className="mt-5 flex items-center gap-3">
        <Pic
          src={it.image}
          alt={it.name}
          sizes="40px"
          className="h-10 w-10 shrink-0 rounded-full"
          fallback={
            <div
              className="flex h-full w-full items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(${135 + idx * 45}deg, ${P.accent}, ${P.accent2})` }}
            >
              {it.name?.[0]}
            </div>
          }
        />
        <span>
          <span className="block text-sm font-semibold">{it.name}</span>
          <span className="block text-xs" style={{ color: P.muted }}>
            {it.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ s }: { s: Section }) {
  const items = s.items ?? [];
  const mask = "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)";
  return (
    <>
      <Head s={s} />
      <div className="overflow-hidden py-2" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <div className="anim-marquee-slow flex w-max gap-5 hover:[animation-play-state:paused]">
          {[...items, ...items].map((it, i) => (
            <Card key={i} it={it} idx={i % Math.max(items.length, 1)} />
          ))}
        </div>
      </div>
    </>
  );
}
