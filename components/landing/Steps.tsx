import { MessageSquare, MousePointerClick, Rocket, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  { icon: MessageSquare, title: "Describe your idea", text: "Write it in plain language. Codube plans the brand, pages and sections first." },
  { icon: MousePointerClick, title: "Click to edit", text: "Change any text or image, add or remove sections, or ask the AI. All in one live canvas." },
  { icon: ShieldCheck, title: "Approve the design", text: "Check every page like a visitor would. Nothing is built until you are happy." },
  { icon: Rocket, title: "Get production code", text: "Then Codube writes clean Next.js code you can host or hand to developers." },
];

export default function Steps() {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">From idea to website in four steps</h2>
        </ScrollReveal>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-6 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <ScrollReveal key={title} delay={i * 90} className="h-full">
                <div className="glass h-full rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-indigo-500/30">
                      <Icon size={20} />
                    </span>
                    <span className="text-3xl font-extrabold text-white/10">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}