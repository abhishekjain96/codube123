"use client";

import { Sparkles, Star } from "lucide-react";

const reviews = [
  {
    name: "Rohan Mehta",
    role: "Indie Founder",
    quote:
      "Codube saved me weeks of work. I built and launched my SaaS landing page in a single day without writing any code.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Priya Sharma",
    role: "Designer",
    quote:
      "The visual editor is incredible. I can make changes instantly and get the code when I'm ready. This is the future.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Aman Verma",
    role: "Product Manager",
    quote:
      "Using a website URL as a reference is a game changer. I recreated and customized a complex site in minutes.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header matching screenshot */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
            <Sparkles size={12} className="text-orange-400" />
            TESTIMONIALS
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Loved by builders{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              everywhere
            </span>
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="glass rounded-2xl p-6 text-left transition duration-300 hover:border-violet-500/40 hover:-translate-y-1"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full bg-cover bg-center border border-white/10"
                  style={{ backgroundImage: `url(${r.avatar})` }}
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{r.name}</h3>
                  <p className="text-xs text-slate-400">{r.role}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                &ldquo;{r.quote}&rdquo;
              </p>

              {/* 5-Star rating */}
              <div className="mt-4 flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}