import { Check, Image as ImageIcon, PenLine, Sparkles } from "lucide-react";

type Kind = "saas" | "shop" | "portfolio" | "food";

function detect(prompt: string): Kind {
  const t = prompt.toLowerCase();
  if (/shop|store|e-?comm|jewel|fashion|product|oil|spice/.test(t)) return "shop";
  if (/portfolio|photo|designer|studio|resume/.test(t)) return "portfolio";
  if (/restaurant|cafe|bakery|food|menu|hotel|kitchen/.test(t)) return "food";
  return "saas";
}

const copy: Record<Kind, { brand: string; title: string; sub: string; cards: string[]; a: string; b: string }> = {
  saas: { brand: "Northstar", title: "Ship the product your users already imagine", sub: "Multi-page site, pricing, login and a dashboard, all editable.", cards: ["Click to edit", "AI images", "Approve first"], a: "#3b82f6", b: "#8b5cf6" },
  shop: { brand: "Atelier", title: "Handmade pieces, a store that feels like a boutique", sub: "Product pages, cart preview and checkout-ready layout.", cards: ["₹2,490 Ring", "₹6,800 Necklace", "₹1,200 Charm"], a: "#f43f5e", b: "#f59e0b" },
  portfolio: { brand: "Maya Rao", title: "Photographs with the quiet of late light", sub: "A portfolio that looks like it cost a fortune.", cards: ["Editorial", "Weddings", "Film"], a: "#14b8a6", b: "#3b82f6" },
  food: { brand: "Lotus Table", title: "A neighbourhood kitchen, plated for the web", sub: "Menus, reservations and a book-a-table form.", cards: ["Thali", "Seasonal", "Reserve"], a: "#f97316", b: "#ef4444" },
};

export default function Showcase({ prompt }: { prompt: string }) {
  const kind = detect(prompt);
  const c = copy[kind];
  const typed = prompt.trim().length > 8;
  const grad = `linear-gradient(135deg, ${c.a}, ${c.b})`;

  const chip = "absolute hidden items-center gap-2 rounded-full border border-white/10 bg-[#12121f] px-3.5 py-2 text-xs font-medium text-slate-200 shadow-xl lg:flex";

  return (
    <div className="relative mx-auto mt-16 max-w-4xl px-1">
      <div className="pointer-events-none absolute -inset-x-8 -top-8 bottom-0" style={{ background: `radial-gradient(55% 55% at 50% 30%, ${c.a}40, transparent 72%)` }} />

      <div className="glass relative overflow-hidden rounded-2xl shadow-[0_40px_120px_-30px_rgba(99,102,241,0.55)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </span>
          <span className="rounded-md bg-white/5 px-3 py-1 text-[11px] text-slate-400">{c.brand.toLowerCase().replace(/\s/g, "")}.codube.app</span>
          <span className="hidden rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 sm:block">Live preview</span>
        </div>

        <div key={kind} className="rise grid gap-6 bg-[#0b0b14] p-5 text-left sm:grid-cols-[1.15fr_0.85fr] sm:p-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-md" style={{ background: grad }} />
              <span className="text-sm font-semibold">{c.brand}</span>
              <span className="ml-auto hidden gap-4 text-[11px] text-slate-500 sm:flex">
                <span>Home</span><span>Shop</span><span>About</span><span>Login</span>
              </span>
            </div>
            <p className="mt-7 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white" style={{ background: grad }}>
              {typed ? "Live from your prompt" : "Type above to restyle this"}
            </p>
            <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {typed ? c.title : "Your site appears here as you type"}
            </h3>
            <p className="mt-2 text-sm text-slate-400">{c.sub}</p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-lg px-3.5 py-2 text-xs font-semibold text-white" style={{ background: grad }}>Get started</span>
              <span className="rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-300">Watch demo</span>
            </div>
          </div>

          <div className="grid gap-2.5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl" style={{ background: grad }}>
              <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/25" />
              <span className="absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-black/20" />
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white">
                <Sparkles size={10} /> AI image
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {c.cards.map((card) => (
                <div key={card} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 py-2.5 text-[11px] font-semibold text-slate-200">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${chip} anim-bob -left-10 top-24`}>
        <PenLine size={14} className="text-sky-400" /> Hero copy written
      </div>
      <div className={`${chip} anim-bob -right-8 top-44`} style={{ animationDelay: "-2s" }}>
        <ImageIcon size={14} className="text-fuchsia-400" /> Images generated
      </div>
      <div className={`${chip} anim-bob -left-6 bottom-14`} style={{ animationDelay: "-3.5s" }}>
        <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
          <span className="ping-soft absolute inset-0 rounded-full bg-emerald-500" />
          <Check size={10} className="relative" />
        </span>
        Approved, ready for code
      </div>
    </div>
  );
}