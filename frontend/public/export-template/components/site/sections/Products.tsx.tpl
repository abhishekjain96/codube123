import type { Item, Section } from "@/content/types";
import { AddButton } from "../AddButton";
import { Reveal } from "../Reveal";
import { Head, Pic } from "../ui";
import { P, cardStyle, mix } from "../theme";

function Product({ it }: { it: Item }) {
  return (
    <div
      className="group h-full overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      style={cardStyle}
    >
      <Pic
        src={it.image}
        alt={it.title}
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="h-44"
        fallback={
          <div
            className="flex h-full w-full items-center justify-center text-6xl"
            style={{ background: `linear-gradient(135deg, ${mix(P.accent, 13)}, ${mix(P.accent2, 20)})` }}
          >
            {it.emoji}
          </div>
        }
      >
        {it.badge && (
          <span
            className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
            style={{ background: P.grad }}
          >
            {it.badge}
          </span>
        )}
      </Pic>
      <div className="p-5">
        <h3 className="block font-bold" style={{ fontFamily: P.heading }}>
          {it.title}
        </h3>
        <p className="mt-1 text-sm" style={{ color: P.muted }}>
          {it.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">{it.price}</span>
          <AddButton />
        </div>
      </div>
    </div>
  );
}

export function Products({ s }: { s: Section }) {
  return (
    <>
      <Head s={s} />
      <div className="grid gap-5 @md:grid-cols-2 @3xl:grid-cols-3">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={(i % 3) * 80}>
            <div className="h-full">
              <Product it={it} />
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
