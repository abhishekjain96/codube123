import type { Section } from "@/content/types";
import { Glow } from "../Glow";
import { Reveal } from "../Reveal";
import { Head, Pic } from "../ui";
import { P } from "../theme";

export function Team({ s }: { s: Section }) {
  return (
    <>
      <Head s={s} />
      <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4">
        {(s.items ?? []).map((it, i) => (
          <Reveal key={i} delay={i * 80}>
            <Glow className="h-full">
              <div className="p-6 text-center">
                <Pic
                  src={it.image}
                  alt={it.name}
                  sizes="80px"
                  className="mx-auto h-20 w-20 rounded-full shadow-lg"
                  fallback={
                    <div
                      className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
                      style={{ background: `linear-gradient(${135 + i * 40}deg, ${P.accent}, ${P.accent2})` }}
                    >
                      {it.name?.[0]}
                    </div>
                  }
                />
                <p className="mt-4 block font-bold" style={{ fontFamily: P.heading }}>
                  {it.name}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: P.muted }}>
                  {it.role}
                </p>
              </div>
            </Glow>
          </Reveal>
        ))}
      </div>
    </>
  );
}
