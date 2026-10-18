const reviews = [
  { quote: "Codube helped me launch my SaaS in days. The visual editing with AI is next level.", name: "Riya Sharma", role: "Founder, PixelTools" },
  { quote: "I can actually edit the design until it feels perfect before generating the code.", name: "Arjun Mehta", role: "Indie Hacker" },
  { quote: "This is a game changer for agencies. Saves so much time.", name: "Neha Kapoor", role: "Product Designer" },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50/70 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
          Loved by creators and teams
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">What our users say</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <blockquote className="text-sm leading-relaxed text-slate-600">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
                  {r.name[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}