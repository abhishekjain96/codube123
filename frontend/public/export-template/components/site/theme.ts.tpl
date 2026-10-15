import type { CSSProperties } from "react";

// Colours, fonts and corners come from CSS variables set in app/globals.css.
export const P = {
  accent: "var(--accent)",
  accent2: "var(--accent2)",
  bg: "var(--bg)",
  alt: "var(--alt)",
  card: "var(--card)",
  border: "var(--border)",
  muted: "var(--muted)",
  text: "var(--text)",
  radius: "var(--radius)",
  btnRadius: "var(--btn-radius)",
  heading: "var(--font-heading)",
  grad: "linear-gradient(135deg, var(--accent), var(--accent2))",
  tint: "color-mix(in srgb, var(--accent) 10%, transparent)",
} as const;

/** A colour at a given opacity, for example mix(P.accent, 20). */
export const mix = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

export const cardStyle: CSSProperties = {
  background: P.card,
  border: `1px solid ${P.border}`,
  borderRadius: P.radius,
};

export const gradText: CSSProperties = {
  background: P.grad,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const inputStyle: CSSProperties = {
  borderColor: P.border,
  borderRadius: P.btnRadius,
  background: P.bg,
  color: P.text,
};
