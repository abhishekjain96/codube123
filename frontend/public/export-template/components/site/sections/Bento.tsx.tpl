import type { Section } from "@/content/types";
import { Glow } from "../Glow";
import { Reveal } from "../Reveal";
import { Head } from "../ui";
import { P, gradText } from "../theme";

export function Bento({ s }: { s: Section }) {
  return (
    <>
      <Head s={s} />
      <div className="grid gap-4 @3xl:grid-cols-3">
        {(s.items ?? []).map((it, i) => {
          const large = it.size === "large";
          return (
            <Reveal key={i} delay={(i % 3) * 80} className={large ? "@3xl:col-span-2" : ""}>
              <Glow className="h-full">
                <div className="flex h-full min-h-[190px] flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                      style={{ background: P.tint }}
                    >
                      {it.icon}
                    </span>
                    {it.stat && (
                      <span className="text-3xl font-extrabold" style={{ fontFamily: P.heading, ...gradText }}>
                        {it.stat}
                      </span>
                    )}
                  </div>
                  <div className="mt-6">
                    <h3 className={`block font-bold ${large ? "text-xl" : ""}`} style={{ fontFamily: P.heading }}>
                      {it.title}
                    </h3>
                    <p className="mt-1.5 text-sm" style={{ color: P.muted }}>
                      {it.description}
                    </p>
                  </div>
                </div>
              </Glow>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
