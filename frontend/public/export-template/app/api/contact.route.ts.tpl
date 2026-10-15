import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = { name?: unknown; email?: unknown; message?: unknown };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  if (!name || !message || !EMAIL.test(email)) {
    return NextResponse.json({ error: "Please fill in every field correctly" }, { status: 400 });
  }

  const to = process.env.CONTACT_EMAIL;
  const key = process.env.RESEND_API_KEY;

  if (to && key) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Website <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `New message from ${name}`,
        text: `${message}\n\nFrom: ${name} <${email}>`,
      }),
    });
    if (!res.ok) {
      console.error("Email provider error", res.status);
      return NextResponse.json({ error: "Could not send the message" }, { status: 502 });
    }
  } else {
    // No email provider configured yet: the message is only logged on the server.
    console.log("[contact]", { name, email, message });
  }

  return NextResponse.json({ ok: true });
}
