"use client";

type Kind = "saas" | "shop" | "portfolio" | "food";

function detect(prompt: string): Kind {
  const t = prompt.toLowerCase();
  if (/shop|store|e-?comm|jewelry|fashion|product/.test(t)) return "shop";
  if (/portfolio|photo|designer|studio|resume/.test(t)) return "portfolio";
  if (/restaurant|cafe|bakery|food|menu|hotel/.test(t)) return "food";
  return "saas";
}

const copy: Record<Kind, { brand: string; title: string; sub: string; cards: string[]; accent: string }> = {
  saas: {
    brand: "Northstar",
    title: "Ship the product your users already imagine",
    sub: "Visual first. Code only after you approve.",
    cards: ["Click to edit", "Live motion", "One-click host"],
    accent: "from-blue-500 to-violet-500",
  },
  shop: {
    brand: "Atelier",
    title: "Handmade pieces, a store that feels like a boutique",
    sub: "Tap a product — cart, pulse, checkout preview.",
    cards: ["₹2,490 Ring", "₹6,800 Neck", "₹1,200 Charm"],
    accent: "from-rose-500 to-amber-400",
  },
  portfolio: {
    brand: "Maya Rao",
    title: "Photographs with the quiet of late light",
    sub: "A portfolio that moves as you describe it.",
    cards: ["Editorial", "Weddings", "Film"],
    accent: "from-slate-800 to-zinc-600",
  },
  food: {
    brand: "Lotus Table",
    title: "A neighbourhood kitchen, plated for the web",
    sub: "Menus, reservations, a popup book-a-table form.",
    cards: ["Thali", "Seasonal", "Reserve"],
    accent: "from-orange-500 to-rose-600",
  },
};

export default function LiveHeroCanvas({ prompt }: { prompt: string }) {
  const kind = detect(prompt);
  const c = copy[kind];
  const typed = prompt.trim().length > 8;

  return (
    <div className="relative mx-auto mt-10 max-w-3xl">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-fuchsia-500/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_30px_80px_-20px_rgba(37,99,235,0.35)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 text-[11px] text-slate-400">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <span className="font-medium text-slate-500">{c.brand}.acoopa.live</span>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-brand-blue">
            Prototype · no backend yet
          </span>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-[1.2fr_.8fr] sm:p-8">
          <div>
            <p className={`inline-block rounded-full bg-gradient-to-r ${c.accent} px-2.5 py-0.5 text-[10px] font-semibold text-white`}>
              {typed ? "Live from your prompt" : "Type above to restyle this"}
            </p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight transition-all duration-500 sm:text-3xl">
              {typed ? c.title : "Your site appears here as you type"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 transition-all duration-500">{typed ? c.sub : "Colors, layout and motion follow the idea — code waits for your yes."}</p>
            <div className="mt-4 flex gap-2">
              <span className={`rounded-lg bg-gradient-to-r ${c.accent} px-3 py-1.5 text-xs font-semibold text-white shadow-lg`}>
                Get started
              </span>
              <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium">Watch it move</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {c.cards.map((card, i) => (
              <div
                key={card}
                className="rounded-2xl border border-slate-100 bg-white p-3 text-sm font-semibold shadow-sm transition duration-500"
                style={{ transform: typed ? `translateY(${i * 2}px)` : "translateY(8px)", opacity: typed ? 1 : 0.55 }}
              >
                {card}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
