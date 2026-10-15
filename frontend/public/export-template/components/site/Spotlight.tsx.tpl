"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { P, mix } from "./theme";

/** A section whose background glow follows the mouse. */
export function Spotlight({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={className}
      style={style}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(520px circle at var(--x, 50%) var(--y, 35%), ${mix(P.accent, 22)}, transparent 65%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)` }}
      />
      {children}
    </section>
  );
}
