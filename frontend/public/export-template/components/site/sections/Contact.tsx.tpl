"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import type { Section } from "@/content/types";
import { Reveal } from "../Reveal";
import { Head, SubmitButton } from "../ui";
import { P, cardStyle, inputStyle } from "../theme";

export function Contact({ s }: { s: Section }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Head s={s} />
      <div className="grid gap-8 @3xl:grid-cols-2">
        <div className="space-y-4">
          {(s.items ?? []).map((it, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="flex items-start gap-4 p-5" style={cardStyle}>
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: P.tint }}
                >
                  {it.icon}
                </span>
                <div>
                  <p className="block font-bold" style={{ fontFamily: P.heading }}>
                    {it.title}
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: P.muted }}>
                    {it.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <form className="space-y-3 p-6" style={cardStyle} onSubmit={onSubmit}>
            {status === "sent" ? (
              <div className="flex flex-col items-center py-10 text-center" role="status">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ background: P.grad }}
                >
                  <Check size={22} />
                </span>
                <p className="mt-4 font-bold" style={{ fontFamily: P.heading }}>
                  Message sent
                </p>
                <p className="mt-1 text-sm" style={{ color: P.muted }}>
                  Thank you. We will get back to you soon.
                </p>
              </div>
            ) : (
              <>
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full border px-3 py-2.5 text-sm outline-none"
                  style={inputStyle}
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email address"
                  autoComplete="email"
                  className="w-full border px-3 py-2.5 text-sm outline-none"
                  style={inputStyle}
                />
                <textarea
                  required
                  name="message"
                  placeholder="How can we help?"
                  rows={5}
                  className="w-full border px-3 py-2.5 text-sm outline-none"
                  style={inputStyle}
                />
                {status === "error" && (
                  <p className="text-sm text-red-600" role="alert">
                    Something went wrong. Please try again.
                  </p>
                )}
                <SubmitButton full disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message"}
                </SubmitButton>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </>
  );
}
