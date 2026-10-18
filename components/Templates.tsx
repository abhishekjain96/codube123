import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

const templates = [
  { name: "SaaS Landing Page", bg: "bg-slate-900 text-white", title: "Build The Next Big Thing" },
  { name: "AI Product", bg: "bg-indigo-50 text-slate-900", title: "The AI platform for modern teams" },
  { name: "Portfolio", bg: "bg-black text-white", title: "Hi, I'm Alex Product Designer" },
  { name: "E-commerce", bg: "bg-amber-50 text-slate-900", title: "Premium Headphones" },
  { name: "Agency", bg: "bg-gradient-to-br from-slate-900 to-indigo-950 text-white", title: "We build brands that scale" },
];

export default function Templates() {
  return (
    <section id="templates" className="bg-gradient-to-b from-violet-50/70 to-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-violet">
          Templates
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-bold tracking-tight">
            Start with a template or a blank canvas
          </h2>
          <Link href="#" className="flex items-center gap-1.5 text-sm font-medium text-brand-blue">
            Browse All Templates <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {templates.map((t) => (
            <Link key={t.name} href="/signup" className="group">
              <div
                className={`flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-xl border border-slate-200 p-3 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-indigo-500/20 ${t.bg}`}
              >
                <div className="flex items-center justify-between opacity-70">
                  <span className="h-1.5 w-6 rounded bg-current" />
                  <span className="h-1.5 w-10 rounded bg-current" />
                </div>
                <p className="text-sm font-bold leading-tight">{t.title}</p>
                <span className="h-4 w-12 rounded bg-brand-gradient" />
              </div>
              <p className="mt-2 text-sm font-medium">{t.name}</p>
            </Link>
          ))}

          <Link href="/signup" className="group">
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition group-hover:border-brand-blue group-hover:text-brand-blue">
              <Plus size={22} />
              <span className="text-xs">Start from scratch</span>
            </div>
            <p className="mt-2 text-sm font-medium">Blank Canvas</p>
          </Link>
        </div>
      </div>
    </section>
  );
}