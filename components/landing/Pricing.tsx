"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  const tiers = [
    {
      name: "Free",
      desc: "Perfect for trying out Codube.",
      monthlyPrice: 0,
      highlighted: false,
      cta: "Get started",
      features: [
        "Limited generations",
        "Basic features",
        "Community support",
      ],
    },
    {
      name: "Starter",
      desc: "For personal projects.",
      monthlyPrice: 999,
      highlighted: false,
      cta: "Upgrade",
      features: [
        "More generations",
        "All core features",
        "Download code",
        "Standard support",
      ],
    },
    {
      name: "Pro",
      badge: "Most popular",
      desc: "For professionals and teams.",
      monthlyPrice: 1999,
      highlighted: true,
      cta: "Get started",
      features: [
        "Unlimited generations",
        "Advanced AI models",
        "Priority support",
        "Deploy to Vercel & more",
      ],
    },
    {
      name: "Team",
      desc: "For growing businesses.",
      monthlyPrice: 4999,
      highlighted: false,
      cta: "Contact sales",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared projects",
        "Dedicated support",
      ],
    },
  ];

  return (
    <section id="pricing" className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
            <Sparkles size={12} className="text-orange-400" />
            PRICING
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Simple and{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Start for free and upgrade as you grow.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center rounded-xl border border-white/10 bg-[#0c0c18] p-1 text-xs font-semibold">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-lg px-4 py-1.5 transition ${
                !yearly ? "bg-violet-600 text-white shadow-md shadow-violet-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-1 rounded-lg px-4 py-1.5 transition ${
                yearly ? "bg-violet-600 text-white shadow-md shadow-violet-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Yearly</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400">Save 20%</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {tiers.map((t) => {
            const price = yearly ? Math.round(t.monthlyPrice * 0.8) : t.monthlyPrice;
            return (
              <div
                key={t.name}
                className={`flex flex-col justify-between rounded-2xl p-6 text-left transition duration-300 ${
                  t.highlighted
                    ? "border-2 border-violet-500 bg-gradient-to-b from-[#141026] to-[#0c0c18] shadow-2xl shadow-violet-600/30 scale-105"
                    : "border border-white/10 bg-[#090912] hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{t.name}</h3>
                    {t.badge && (
                      <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{t.desc}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-white">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Check size={14} className="text-violet-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className={`mt-8 block w-full rounded-xl py-2.5 text-center text-xs font-semibold transition ${
                    t.highlighted
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/40 hover:bg-violet-500"
                      : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}