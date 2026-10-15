import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { testimonials } from "@/lib/testimonials";

function Card({ t, i, big }: { t: (typeof testimonials)[number]; i: number; big?: boolean }) {
  return (
    <figure className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-8">
      <span className="pointer-events-none absolute -right-2 -top-6 select-none text-[120px] font-black leading-none text-white/[0.04]">&rdquo;</span>
      <div className="relative flex items-center justify-between">
        <span className="text-sm tracking-widest text-amber-400">★★★★★</span>
        {t.sample && (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">Sample</span>
        )}
      </div>
      <blockquote className={`relative mt-4 flex-1 leading-relaxed text-slate-200 ${big ? "text-lg sm:text-xl" : "text-sm"}`}>
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="relative mt-6 flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: `linear-gradient(${135 + i * 50}deg, #f97316, #8b5cf6)` }}
        >
          {t.name[0]}
        </span>
        <span>
          <span className="block text-sm font-semibold text-white">{t.name}</span>
          <span className="block text-xs text-slate-500">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const list = testimonials;
  return (
    <section id="reviews" className="scroll-mt-20 border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Reviews</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">What builders say</h2>
        </ScrollReveal>

        {list.length === 0 ? (
          <ScrollReveal className="mx-auto mt-12 max-w-xl">
            <div className="glass rounded-3xl p-10 text-center">
              <p className="font-semibold text-white">Be one of our first builders</p>
              <p className="mt-2 text-sm text-slate-400">Build your first site and tell us what you think.</p>
              <Link href="/signup" className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900">Start for free</Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {list.map((t, i) => (
              <ScrollReveal key={i} delay={i * 90} className={`h-full ${i === 0 && list.length >= 3 ? "lg:col-span-2" : ""}`}>
                <Card t={t} i={i} big={i === 0 && list.length >= 3} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}