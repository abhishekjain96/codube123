import type { Section } from "@/content/types";
import { Glow } from "../Glow";
import { Reveal } from "../Reveal";
import { Head } from "../ui";
import { P } from "../theme";

export function Features({ s }: { s: Section }) {
  return (
    <>
      <Head s={s} />
      <div className="grid gap-5 @md:grid-cols-2 @3xl:grid-cols-3">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 80}>
            <Glow className="h-full">
              <div className="p-6">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: P.tint }}
                >
                  {it.icon}
                </span>
                <h3 className="mt-4 block font-bold" style={{ fontFamily: P.heading }}>
                  {it.title}
                </h3>
                <p className="mt-1.5 text-sm" style={{ color: P.muted }}>
                  {it.description}
                </p>
              </div>
            </Glow>
          </Reveal>
        ))}
      </div>
    </>
  );
}
