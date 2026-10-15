import type { CSSProperties } from "react";
import type { Section } from "@/content/types";
import { Reveal } from "../Reveal";
import { Spotlight } from "../Spotlight";
import { ButtonLink, Pic } from "../ui";
import { P } from "../theme";

type Anim = CSSProperties & Record<`--${string}`, string>;

function Copy({ s, center = false }: { s: Section; center?: boolean }) {
  return (
    <>
      <Reveal>
        {s.badge && (
          <span
            className="inline-block rounded-full px-3.5 py-1 text-xs font-semibold"
            style={{ background: P.tint, color: P.accent, border: `1px solid ${P.border}` }}
          >
            {s.badge}
          </span>
        )}
      </Reveal>
      <Reveal delay={80}>
        <h1
          className="mt-6 block text-4xl font-extrabold leading-[1.05] tracking-tight @2xl:text-6xl"
          style={{ fontFamily: P.heading }}
        >
          {s.title}
        </h1>
      </Reveal>
      <Reveal delay={160}>
        <p
          className={`mt-5 text-base @2xl:text-lg ${center ? "mx-auto max-w-xl" : "max-w-lg"}`}
          style={{ color: P.muted }}
        >
          {s.subtitle}
        </p>
      </Reveal>
      <Reveal delay={240}>
        <div className={`mt-8 flex flex-wrap items-center gap-3 ${center ? "justify-center" : ""}`}>
          <ButtonLink link={s.cta} />
          <ButtonLink link={s.cta2} kind="ghost" />
        </div>
      </Reveal>
    </>
  );
}

function Floaters({ items, positions }: { items?: string[]; positions: CSSProperties[] }) {
  return (
    <>
      {(items ?? []).slice(0, positions.length).map((f, i) => (
        <span
          key={i}
          className="anim-float absolute whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur"
          style={{
            background: P.card,
            border: `1px solid ${P.border}`,
            color: P.text,
            animationDelay: `${i * -1.5}s`,
            ...positions[i],
          }}
        >
          {f}
        </span>
      ))}
    </>
  );
}

function Fallback({ s, className = "text-8xl" }: { s: Section; className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`} style={{ background: P.grad }}>
      {s.visual}
    </div>
  );
}

function Aurora({ s }: { s: Section }) {
  const mask = "radial-gradient(ellipse at center, black 30%, transparent 75%)";
  const top: Anim = { "--from-y": "30px" };
  const bottom: Anim = { "--from-y": "60px", "--delay": "0.25s" };
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 @2xl:px-10 @2xl:pt-32" style={{ background: P.bg }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `linear-gradient(${P.border} 1px, transparent 1px), linear-gradient(90deg, ${P.border} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div className="anim-blob pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ background: P.accent }} />
      <div className="anim-blob pointer-events-none absolute right-1/4 top-10 h-72 w-72 rounded-full opacity-35 blur-3xl" style={{ background: P.accent2, animationDelay: "-5s" }} />

      <div className="anim-in relative mx-auto max-w-3xl text-center" style={top}>
        <Copy s={s} center />
      </div>

      <div className="anim-in relative mx-auto mt-16 max-w-4xl" style={bottom}>
        <div className="p-2 shadow-2xl" style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: P.radius }}>
          <Pic
            src={s.image}
            alt={s.title}
            sizes="(min-width: 1024px) 896px, 100vw"
            priority
            className="aspect-[16/9]"
            style={{ borderRadius: `calc(${P.radius} - 6px)` }}
            fallback={<Fallback s={s} />}
          />
        </div>
        <Floaters items={s.floaters} positions={[{ top: "-14px", left: "6%" }, { bottom: "-14px", right: "8%" }]} />
      </div>
    </section>
  );
}

function Spot({ s }: { s: Section }) {
  const left: Anim = { "--from-x": "-30px" };
  const right: Anim = { "--from-s": "0.92", "--delay": "0.2s" };
  return (
    <Spotlight className="relative overflow-hidden px-6 py-24 @2xl:px-10 @2xl:py-36" style={{ background: P.bg }}>
      <div className="relative mx-auto grid max-w-5xl items-center gap-12 @2xl:grid-cols-[1.1fr_0.9fr]">
        <div className="anim-in" style={left}>
          <Copy s={s} />
        </div>
        <div className="anim-in" style={right}>
          <Pic
            src={s.image}
            alt={s.title}
            priority
            className="aspect-square w-full shadow-2xl"
            style={{ borderRadius: P.radius, border: `1px solid color-mix(in srgb, ${P.accent} 33%, transparent)`, boxShadow: `0 0 80px -20px ${P.accent}` }}
            fallback={<Fallback s={s} />}
          />
        </div>
      </div>
    </Spotlight>
  );
}

export function Hero({ s }: { s: Section }) {
  if (s.variant === "aurora") return <Aurora s={s} />;
  if (s.variant === "spotlight") return <Spot s={s} />;
  const split = s.layout === "split";
  return (
    <section className="relative overflow-hidden px-6 py-20 @2xl:px-10 @2xl:py-32" style={{ background: P.bg }}>
      <div className="anim-blob pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: P.accent }} />
      <div className="anim-blob pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full opacity-30 blur-3xl" style={{ background: P.accent2, animationDelay: "-6s" }} />
      <div className={`relative mx-auto grid max-w-5xl items-center gap-12 ${split ? "@2xl:grid-cols-2" : "text-center"}`}>
        <div className={split ? "" : "mx-auto max-w-3xl"}>
          {!split && s.visual && (
            <div className="anim-float mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white shadow-xl" style={{ background: P.grad }}>
              {s.visual}
            </div>
          )}
          <Copy s={s} center={!split} />
        </div>

        {split && (s.visual || s.image) && (
          <div className="relative mx-auto w-full max-w-sm">
            <Pic
              src={s.image}
              alt={s.title}
              sizes="(min-width: 1024px) 384px, 90vw"
              priority
              className="anim-float aspect-square w-full shadow-2xl"
              style={{ borderRadius: "2rem" }}
              fallback={<Fallback s={s} className="text-8xl @2xl:text-9xl" />}
            />
            <Floaters
              items={s.floaters}
              positions={[{ top: "-12px", left: "-18px" }, { top: "42%", right: "-22px" }, { bottom: "-10px", left: "14%" }]}
            />
          </div>
        )}
      </div>
    </section>
  );
}
