import type { Section } from "@/content/types";
import { Reveal } from "../Reveal";
import { Head } from "../ui";
import { P, cardStyle } from "../theme";

export function Steps({ s }: { s: Section }) {
  const items = s.items ?? [];
  return (
    <>
      <Head s={s} />
      <div className={`grid gap-5 ${items.length === 3 ? "@3xl:grid-cols-3" : "@3xl:grid-cols-4"}`}>
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="h-full p-6" style={cardStyle}>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: P.grad }}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 block font-bold" style={{ fontFamily: P.heading }}>
                {it.title}
              </h3>
              <p className="mt-1.5 text-sm" style={{ color: P.muted }}>
                {it.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
