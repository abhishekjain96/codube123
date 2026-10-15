"use client";

import { useState } from "react";
import Link from "next/link";
import type { Section } from "@/content/types";
import { P, cardStyle, gradText } from "../theme";

/** A sample dashboard with made-up data. Replace it with your real data. */
export function Dashboard({ s, brand }: { s: Section; brand: string }) {
  const links = s.links?.length ? s.links : ["Overview", "Orders", "Customers", "Settings"];
  const [tab, setTab] = useState(0);
  const stats = s.items ?? [];
  const headers = s.headers ?? [];
  const rows = s.rows ?? [];
  const bars = [38, 62, 48, 80, 58, 92, 74];
  return (
    <section className="grid min-h-[640px] @3xl:grid-cols-[210px_1fr]" style={{ background: P.alt }}>
      <aside className="p-5" style={{ background: P.card, borderRight: `1px solid ${P.border}` }}>
        <p className="text-lg font-extrabold" style={{ fontFamily: P.heading, ...gradText }}>
          {brand}
        </p>
        <ul className="mt-6 space-y-1">
          {links.map((l, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setTab(i)}
                className="block w-full px-3 py-2 text-left text-sm font-medium transition"
                style={{
                  borderRadius: P.btnRadius,
                  background: tab === i ? P.tint : "transparent",
                  color: tab === i ? P.accent : P.muted,
                }}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>
        <Link href="/" className="mt-8 inline-block text-sm font-medium" style={{ color: P.muted }}>
          ← Back to site
        </Link>
      </aside>

      <div className="p-6 @2xl:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: P.heading }}>
            {links[tab] ?? s.title}
          </h1>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: P.grad }}
          >
            A
          </span>
        </div>
        <p className="mt-1 text-xs" style={{ color: P.muted }}>
          Sample data for demonstration.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 @3xl:grid-cols-4">
          {stats.map((it, i) => (
            <div key={i} className="h-full p-4" style={cardStyle}>
              <p className="block text-xs" style={{ color: P.muted }}>
                {it.label}
              </p>
              <p className="mt-1 block text-2xl font-extrabold" style={{ fontFamily: P.heading }}>
                {it.value}
              </p>
              {it.change && (
                <p className="mt-1 block text-xs font-semibold" style={{ color: "#059669" }}>
                  {it.change}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 p-5" style={cardStyle}>
          <p className="text-sm font-bold">Last 7 days</p>
          <div className="mt-4 flex h-36 items-end gap-3">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 transition-all duration-700"
                style={{ height: `${h}%`, background: P.grad, borderRadius: "8px 8px 2px 2px", opacity: 0.9 }}
              />
            ))}
          </div>
        </div>

        {headers.length > 0 && (
          <div className="mt-5 overflow-x-auto" style={cardStyle}>
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr style={{ color: P.muted, borderBottom: `1px solid ${P.border}` }}>
                  {headers.map((h, j) => (
                    <th key={j} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${P.border}` : "none" }}>
                    {r.map((c, j) => (
                      <td key={j} className="px-4 py-3">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
