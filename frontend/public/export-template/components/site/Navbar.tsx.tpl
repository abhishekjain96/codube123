"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import type { NavLink } from "@/content/types";
import { useCart } from "./Cart";
import { Pic, ButtonLink } from "./ui";
import { P, gradText } from "./theme";

export function Navbar({
  brand,
  logo,
  links,
  cta,
  showCart,
}: {
  brand: string;
  logo?: string;
  links: NavLink[];
  cta?: NavLink;
  showCart: boolean;
}) {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30" style={{ background: P.bg, borderBottom: `1px solid ${P.border}` }}>
      <div className="flex items-center justify-between gap-4 px-6 py-4 @2xl:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          {logo && (
            <Pic
              src={logo}
              alt={brand}
              sizes="36px"
              priority
              className="h-9 w-9 shrink-0"
              style={{ borderRadius: "10px" }}
              fallback={<div className="h-full w-full" style={{ background: P.grad }} />}
            />
          )}
          <span className="text-lg font-extrabold" style={{ fontFamily: P.heading, ...gradText }}>
            {brand}
          </span>
        </Link>

        <nav className="hidden flex-wrap items-center gap-x-6 gap-y-1 text-sm @2xl:flex" aria-label="Main">
          {links.map((l, j) => (
            <Link
              key={j}
              href={l.href}
              className="font-medium transition hover:opacity-70"
              style={{ color: l.href === pathname ? P.accent : P.muted }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {showCart && (
            <span className="relative" aria-label={`Cart, ${count} items`}>
              <ShoppingCart size={18} />
              {count > 0 && (
                <span
                  className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{ background: P.accent }}
                >
                  {count}
                </span>
              )}
            </span>
          )}
          <ButtonLink link={cta} />
          {links.length > 0 && (
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              className="@2xl:hidden"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-1 px-6 pb-4 @2xl:hidden" style={{ borderTop: `1px solid ${P.border}` }}>
          {links.map((l, j) => (
            <Link
              key={j}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-left text-sm font-medium"
              style={{ color: l.href === pathname ? P.accent : P.text }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
