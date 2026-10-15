import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-orange-950 to-purple-900 px-8 py-12 sm:px-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to build something amazing?
            </h2>
            <p className="mt-2 text-slate-300">
              Join thousands of creators already building with Codube.
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-105"
            >
              Start Building for Free <ArrowRight size={15} />
            </Link>
            <p className="mt-2 text-xs text-slate-400">No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
}