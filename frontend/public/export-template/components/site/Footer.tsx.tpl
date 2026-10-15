"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Site } from "@/content/types";
import { SubmitButton } from "./ui";
import { P, gradText, inputStyle } from "./theme";

export function Footer({ brand, footer }: { brand: string; footer: Site["footer"] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="px-6 py-14 @2xl:px-10" style={{ background: P.alt, borderTop: `1px solid ${P.border}` }}>
      <div className="mx-auto grid max-w-5xl gap-10 @3xl:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold" style={{ fontFamily: P.heading, ...gradText }}>
            {brand}
          </p>
          {footer.text && (
            <p className="mt-2 text-sm" style={{ color: P.muted }}>
              {footer.text}
            </p>
          )}
          {footer.newsletter && (
            <form className="mt-5 flex gap-2" onSubmit={onSubmit}>
              {status === "done" ? (
                <p className="flex items-center gap-1.5 text-sm font-medium" role="status" style={{ color: P.accent }}>
                  <Check size={15} /> Subscribed
                </p>
              ) : (
                <>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Your email"
                    autoComplete="email"
                    aria-label="Email address"
                    className="min-w-0 flex-1 border px-3 py-2 text-sm outline-none"
                    style={inputStyle}
                  />
                  <SubmitButton disabled={status === "sending"}>Join</SubmitButton>
                </>
              )}
            </form>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs text-red-600" role="alert">
              Could not subscribe. Please try again.
            </p>
          )}
        </div>

        {footer.columns.slice(0, 3).map((c, ci) => (
          <div key={ci}>
            <p className="block text-sm font-bold">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm" style={{ color: P.muted }}>
              {c.links.map((l, j) => (
                <li key={j}>
                  <Link href={l.href} className="transition hover:opacity-70">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="mx-auto mt-12 max-w-5xl pt-6 text-xs"
        style={{ borderTop: `1px solid ${P.border}`, color: P.muted }}
      >
        {footer.copyright}
      </div>
    </footer>
  );
}
