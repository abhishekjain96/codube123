import Link from "next/link";
import Logo from "./Logo";

const links = ["Templates", "Pricing", "Docs", "Privacy", "Terms"];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row">
        <Logo />
        <ul className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          {links.map((l) => (
            <li key={l}>
              <Link href="#" className="transition hover:text-slate-900">{l}</Link>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Acoopa. All rights reserved.</p>
      </div>
    </footer>
  );
}