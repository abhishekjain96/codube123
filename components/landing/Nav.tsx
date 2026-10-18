"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Layers, Menu, MousePointerClick, ShieldCheck, Sparkles, X } from "lucide-react";
import Logo from "@/components/Logo";
import UserMenu from "@/components/UserMenu";
import { getToken } from "@/lib/api";

const product = [
  { icon: Sparkles, title: "AI design", text: "Describe it, get a full multi-page site.", href: "#product" },
  { icon: MousePointerClick, title: "Click to edit", text: "Edit any text, image or single item.", href: "#product" },
  { icon: Layers, title: "Templates", text: "Start from a style you like.", href: "#templates" },
  { icon: ShieldCheck, title: "Approve, then code", text: "Code is written only after you say yes.", href: "#how-it-works" },
];

const links = [
  ["How it works", "#features"],
  ["Showcase", "#showcase"],
  ["Pricing", "#pricing"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [authed, setAuthed] = useState(false);
  const box = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setAuthed(!!getToken());
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setMenu(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenu(false);
        setMobile(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => {
    setMenu(false);
    setMobile(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled || mobile
          ? "border-white/10 bg-[#060608]/95 shadow-lg shadow-black/50"
          : "border-white/[0.04] bg-[#060608]/60"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-white" onClick={close}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          <li ref={box} className="relative" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
            <button
              type="button"
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
              className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Product <ChevronDown size={14} className={`transition-transform duration-200 ${menu ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`absolute left-1/2 top-full w-[440px] -translate-x-1/2 pt-3 transition duration-200 ${
                menu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="glass-dark rounded-2xl bg-[#0a0a0f] p-2 shadow-2xl shadow-orange-500/10 ring-1 ring-white/[0.06]">
                <div className="grid grid-cols-2 gap-1">
                  {product.map(({ icon: Icon, title, text, href }) => (
                    <a key={title} href={href} onClick={close} className="group flex gap-3 rounded-xl p-3 transition hover:bg-white/[0.05]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-md shadow-orange-500/30">
                        <Icon size={16} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-white">{title}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-slate-500 group-hover:text-slate-400">{text}</span>
                      </span>
                    </a>
                  ))}
                </div>
                <Link
                  href="/signup"
                  onClick={close}
                  className="mt-1 flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 px-4 py-3 text-sm font-medium text-white transition hover:from-orange-500/20 hover:to-purple-500/20"
                >
                  Start building for free <ArrowRight size={15} className="text-orange-300" />
                </Link>
              </div>
            </div>
          </li>

          {links.map(([label, href]) => (
            <li key={label}>
              <a href={href} className="rounded-lg px-3.5 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {authed ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:block"
              >
                Dashboard
              </Link>
              <UserMenu />
              <Link
                href="/generating"
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/40 transition hover:bg-violet-500"
              >
                <span>Start building</span>
                <span>→</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/40 transition hover:bg-violet-500"
              >
                <span>Start building</span>
                <span>→</span>
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            onClick={() => setMobile((m) => !m)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition hover:bg-white/5 lg:hidden"
          >
            {mobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`grid transition-all duration-300 lg:hidden ${mobile ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="space-y-1 border-t border-white/10 px-4 pb-5 pt-3">
            {product.map(({ icon: Icon, title, href }) => (
              <a key={title} href={href} onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                  <Icon size={15} />
                </span>
                {title}
              </a>
            ))}
            <div className="my-2 h-px bg-white/10" />
            {links.map(([label, href]) => (
              <a key={label} href={href} onClick={close} className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
                {label}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-3">
              {authed ? (
                <Link href="/dashboard" onClick={close} className="col-span-2 rounded-xl bg-brand-gradient py-3 text-center text-sm font-semibold text-white">
                  Open dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={close} className="rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-slate-200">
                    Login
                  </Link>
                  <Link href="/signup" onClick={close} className="rounded-xl bg-brand-gradient py-3 text-center text-sm font-semibold text-white">
                    Start building
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}