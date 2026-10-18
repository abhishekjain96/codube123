const items = [
  "Landing pages", "Online stores", "Portfolios", "SaaS products", "Restaurants",
  "Fitness studios", "Agencies", "Course platforms", "Dashboards", "Login and signup pages",
];

export default function Marquee() {
  const row = [...items, ...items];
  const mask = "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)";
  return (
    <section className="border-y border-white/[0.06] py-6">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Build any kind of website
      </p>
      <div className="overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <div className="anim-marquee flex w-max gap-10 whitespace-nowrap text-sm font-medium text-slate-400">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t} <span className="text-orange-400">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}