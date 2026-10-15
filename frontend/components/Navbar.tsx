import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <li>
            <Link href="/" className="transition hover:text-slate-900">Home</Link>
          </li>
          <li>
            <Link href="#templates" className="transition hover:text-slate-900">Templates</Link>
          </li>
          <li>
            <Link href="#how-it-works" className="transition hover:text-slate-900">How it works</Link>
          </li>
          <li>
            <button className="flex items-center gap-1 transition hover:text-slate-900">
              Resources <ChevronDown size={14} />
            </button>
          </li>
        </ul>

        <UserMenu />
      </nav>
    </header>
  );
}