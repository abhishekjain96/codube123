import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function Cta() {
  return (
    <section className="px-4 pb-24 pt-8 sm:px-6">
      <ScrollReveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 px-6 py-16 text-center sm:px-12">
          <div className="aurora pointer-events-none absolute inset-0 opacity-90" />
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Your next website is
              <br />
              one sentence away.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-slate-300">Describe it, edit it, approve it. Start in under a minute.</p>
            <Link
              href="/signup"
              className="btn-shine mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-2xl shadow-orange-500/30 transition hover:scale-105"
            >
              Start Building for Free <ArrowRight size={16} />
            </Link>
            <p className="mt-3 text-xs text-slate-400">No credit card required</p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}