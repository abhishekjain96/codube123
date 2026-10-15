"use client";

import { useRef, type ReactNode } from "react";
import { P, cardStyle, mix } from "./theme";

/** A card with a soft light that follows the mouse. */
export function Glow({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={`group relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
      style={cardStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), ${mix(P.accent, 19)}, transparent 70%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
