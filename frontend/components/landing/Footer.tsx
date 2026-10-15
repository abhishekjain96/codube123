import Link from "next/link";
import Logo from "@/components/Logo";

const cols = [
{ title: "Product", links: [["How it works", "#how-it-works"], ["Templates", "#templates"], ["Pricing", "#pricing"], ["FAQ", "#faq"]] },
  { title: "Account", links: [["Login", "/login"], ["Sign up", "/signup"], ["Dashboard", "/dashboard"]] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="text-white">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-500">Describe your idea. Edit it visually. Approve, then get production code.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  {href.startsWith("#") ? (
                    <a href={href} className="transition hover:text-white">{label}</a>
                  ) : (
                    <Link href={href} className="transition hover:text-white">{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Codube. All rights reserved.
      </div>
    </footer>
  );
}