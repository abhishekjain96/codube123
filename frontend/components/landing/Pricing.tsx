"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { plans } from "@/lib/plans";

const money = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative scroll-mt-20 border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">Start free. Upgrade when you ship.</h2>
          <p className="mt-4 text-slate-400">Paid plans open soon. Join the waitlist and you will be the first to know.</p>

          <div className="mx-auto mt-8 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 text-sm">
            {[false, true].map((y) => (
              <button
                key={String(y)}
                onClick={() => setYearly(y)}
                className={`rounded-lg px-4 py-1.5 font-medium transition ${yearly === y ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"}`}
              >
                {y ? "Yearly" : "Monthly"}
              </button>
            ))}
            <span className="mr-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">2 months free</span>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
          {plans.map((p, i) => {
            const perMonth = yearly ? Math.round((p.monthly * 10) / 12) : p.monthly;
            return (
              <ScrollReveal key={p.name} delay={i * 90} className="h-full">
                <div className={`h-full rounded-3xl ${p.highlighted ? "bg-gradient-to-b from-orange-500/70 via-purple-500/60 to-violet-500/40 p-px shadow-2xl shadow-orange-500/20" : ""}`}>
                  <div className={`glass relative flex h-full flex-col rounded-3xl p-7 ${p.highlighted ? "bg-[#0b0b14]" : "transition duration-300 hover:-translate-y-1 hover:border-white/20"}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                      {p.highlighted ? (
                        <span className="rounded-full bg-brand-gradient px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Most popular</span>
                      ) : (
                        p.soon && <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">Soon</span>
                      )}
                    </div>

                    <p className="mt-5 flex items-end gap-1.5">
                      <span className="text-5xl font-extrabold tracking-tight text-white">{money(perMonth)}</span>
                      <span className="pb-1.5 text-sm text-slate-500">/ month</span>
                    </p>
                    <p className="mt-1 h-4 text-xs text-slate-500">{yearly && p.monthly > 0 ? `Billed ${money(perMonth * 12)} per year` : ""}</p>
                    <p className="mt-3 text-sm text-slate-400">{p.blurb}</p>

                    <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={p.href}
                      className={`btn-shine mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition hover:scale-[1.02] ${
                        p.highlighted ? "bg-white text-slate-900 shadow-xl shadow-violet-500/20" : "border border-white/15 text-white hover:bg-white/5"
                      }`}
                    >
                      {p.cta}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}