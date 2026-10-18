import { MessageSquare, MousePointerClick, Code, Cloud, ArrowRight } from "lucide-react";

const steps = [
  { icon: MessageSquare, title: "1. Describe your idea", text: "Plain language. Acoopa designs a live page — not a repo.", color: "bg-blue-50 text-blue-600" },
  { icon: MousePointerClick, title: "2. Click to edit", text: "Touch any block. Recolor, animate, rewrite. Chat is optional.", color: "bg-violet-50 text-violet-600" },
  { icon: Code, title: "3. Approve, then compile", text: "Only then Claude writes APIs, auth-ready files and clean Next.js.", color: "bg-orange-50 text-orange-500" },
  { icon: Cloud, title: "4. Host or export", text: "One-click cloud for founders. GitHub export for developers.", color: "bg-emerald-50 text-emerald-600" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
        How it works
      </p>
      <h2 className="mt-2 text-center text-3xl font-bold tracking-tight">
        From idea to live website in simple steps
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, text, color }, i) => (
          <div key={title} className="relative">
            <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight
                size={16}
                className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-brand-blue lg:block"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}