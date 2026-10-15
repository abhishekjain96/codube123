import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const templates = [
  { name: "SaaS Landing", bg: "#0b1020", fg: "#ffffff", a: "#3b82f6", b: "#8b5cf6", title: "Ship faster with AI" },
  { name: "Online Store", bg: "#fff7ed", fg: "#1c1917", a: "#f97316", b: "#e11d48", title: "Handmade, delivered" },
  { name: "Portfolio", bg: "#0a0a0a", fg: "#fafafa", a: "#14b8a6", b: "#3b82f6", title: "Hi, I'm Maya" },
  { name: "Restaurant", bg: "#1a0f0a", fg: "#fff7ed", a: "#f59e0b", b: "#dc2626", title: "Rooftop dining" },
  { name: "Fitness Studio", bg: "#f0fdf4", fg: "#052e16", a: "#22c55e", b: "#0ea5e9", title: "Train stronger" },
  { name: "Agency", bg: "#f8fafc", fg: "#0f172a", a: "#6366f1", b: "#ec4899", title: "We build brands" },
];

export default function Templates() {
  return (
    <section id="templates" className="scroll-mt-20 border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Templates</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-5xl">Start from a style, or a blank idea</h2>
          </div>
          <Link href="/signup" className="flex items-center gap-1.5 text-sm font-medium text-blue-400 transition hover:text-blue-300">
            Start from scratch <ArrowRight size={14} />
          </Link>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {templates.map((t, i) => {
            const grad = `linear-gradient(135deg, ${t.a}, ${t.b})`;
            return (
              <ScrollReveal key={t.name} delay={(i % 3) * 80}>
                <Link href="/signup" className="group block">
                  <div
                    className="flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-4 transition duration-300 group-hover:-translate-y-1.5 group-hover:border-white/25 group-hover:shadow-2xl group-hover:shadow-indigo-500/20"
                    style={{ background: t.bg, color: t.fg }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="h-4 w-4 rounded" style={{ background: grad }} />
                      <span className="flex gap-1.5 opacity-50">
                        <span className="h-1 w-5 rounded bg-current" />
                        <span className="h-1 w-5 rounded bg-current" />
                        <span className="h-1 w-5 rounded bg-current" />
                      </span>
                    </div>
                    <div>
                      <p className="text-[15px] font-extrabold leading-tight sm:text-lg">{t.title}</p>
                      <span className="mt-2 block h-1 w-3/4 rounded bg-current opacity-20" />
                      <span className="mt-1.5 block h-1 w-1/2 rounded bg-current opacity-20" />
                      <span className="mt-3 inline-block h-4 w-14 rounded-full" style={{ background: grad }} />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[0, 1, 2].map((n) => (
                        <span key={n} className="h-5 rounded" style={{ background: "currentColor", opacity: 0.08 }} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-300 transition group-hover:text-white">{t.name}</p>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}