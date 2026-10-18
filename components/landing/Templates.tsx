"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const showcaseItems = [
  {
    id: "saas",
    name: "SaaS Landing Page",
    desc: "Modern and high converting landing page",
    prompt: "Modern AI analytics SaaS landing page with dark theme, pricing tiers, and interactive charts",
    accent: "#6366f1",
    previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "store",
    name: "E-commerce Store",
    desc: "Complete online store with product pages and cart",
    prompt: "Artisan apparel and lifestyle boutique with product catalog, cart drawer, and lookbook",
    accent: "#ec4899",
    previewUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    desc: "Admin dashboard with charts and data management",
    prompt: "Healthcare and doctor clinic operations dashboard with patient analytics, metrics, and appointments",
    accent: "#10b981",
    previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    desc: "Professional portfolio for developers and designers",
    prompt: "Creative developer portfolio with dark aesthetic, case studies, interactive project gallery, and contact",
    accent: "#f59e0b",
    previewUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Templates() {
  const router = useRouter();
  const [scrollIdx, setScrollIdx] = useState(0);

  function openTemplate(prompt: string) {
    try {
      sessionStorage.setItem("codube_prompt", prompt);
      sessionStorage.removeItem("codube_url");
    } catch {}
    router.push("/generating");
  }

  const visible = [
    ...showcaseItems.slice(scrollIdx % showcaseItems.length),
    ...showcaseItems.slice(0, scrollIdx % showcaseItems.length),
  ];

  return (
    <section id="showcase" className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header matching screenshot */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Explore what{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              you can build
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            From simple websites to complex web applications, Codube can help you build it all.
          </p>
        </div>

        {/* Carousel Grid with Left & Right Nav Controls */}
        <div className="relative mt-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((item) => (
              <div
                key={item.id}
                onClick={() => openTemplate(item.prompt)}
                className="group cursor-pointer rounded-2xl border border-white/10 bg-[#090912] p-3 text-left transition duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-600/20"
              >
                {/* Visual Preview Window */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.06] bg-[#050508]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105 opacity-80"
                    style={{ backgroundImage: `url(${item.previewUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090912] via-transparent to-black/30" />
                  <span
                    className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md"
                  >
                    <Sparkles size={10} className="text-orange-400" />
                    Preview
                  </span>
                </div>

                <div className="mt-4 px-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Arrows */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setScrollIdx((s) => Math.max(0, s - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Previous"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              onClick={() => setScrollIdx((s) => s + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Next"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}