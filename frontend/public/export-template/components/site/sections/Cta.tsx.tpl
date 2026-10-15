import Link from "next/link";
import type { Section } from "@/content/types";
import { Reveal } from "../Reveal";
import { P } from "../theme";

export function Cta({ s }: { s: Section }) {
  return (
    <section className="px-6 py-16 @2xl:px-10 @2xl:py-24" style={{ background: P.bg }}>
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div
            className="relative overflow-hidden px-8 py-14 text-center text-white @2xl:px-16"
            style={{ background: P.grad, borderRadius: P.radius }}
          >
            <div className="anim-blob pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <h2
              className="relative block text-3xl font-extrabold tracking-tight @2xl:text-4xl"
              style={{ fontFamily: P.heading }}
            >
              {s.title}
            </h2>
            {s.subtitle && <p className="relative mx-auto mt-3 block max-w-xl text-white/85">{s.subtitle}</p>}
            {s.cta && (
              <Link
                href={s.cta.href}
                className="relative mt-7 inline-block bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-105"
                style={{ borderRadius: P.btnRadius }}
              >
                {s.cta.label}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
