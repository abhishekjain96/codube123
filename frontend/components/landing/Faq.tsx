import { ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const faqs = [
  ["Do I need to know coding?", "No. You describe your idea, then click to edit. You only see code if you ask for it, after you approve the design."],
  ["Why show a visual prototype first?", "Because it is much easier to judge a website by looking and clicking than by reading code. You fix the design first, so the final code needs no rework."],
  ["What can I edit?", "Almost everything. Click any text, change or upload images, add or delete single items like testimonials, FAQs and pricing features, and add or remove whole sections and pages."],
  ["What do I get at the end?", "You can download your site today. Production Next.js code generation works after approval. One-click hosting and GitHub export are coming soon."],
  ["Is it free to start?", "Yes, you can start for free without a credit card."],
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <ScrollReveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">Questions, answered</h2>
        </ScrollReveal>

        <div className="mt-12 space-y-3">
          {faqs.map(([q, a], i) => (
            <ScrollReveal key={q} delay={i * 50}>
              <details className="group glass rounded-2xl px-5 py-4 transition open:bg-white/[0.04]">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-white">
                  {q}
                  <ChevronDown size={18} className="shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{a}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}