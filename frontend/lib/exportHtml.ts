import type { Item, Section, SiteDoc, Theme } from "@/components/SiteRenderer";

function esc(s: string | undefined) {
  if (!s) return "";
  if (/<(span|b|i|u|strong|em)(\s+[^>]*)?>.*?<\/\1>/i.test(s)) {
    return s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  }
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function items(list: Item[] | undefined, render: (it: Item) => string) {
  return (list ?? []).map(render).join("");
}

function sectionHtml(s: Section): string {
  switch (s.type) {
    case "navbar":
      return `<header class="nav"><strong>${esc(s.brand)}</strong><nav>${(s.links ?? []).map((l) => `<span>${esc(l)}</span>`).join("")}</nav>${s.cta ? `<button class="btn">${esc(s.cta)}</button>` : ""}</header>`;
    case "hero":
    case "hero-3d":
    case "hero-aurora":
    case "hero-marquee":
      return `<section class="hero"><p class="badge">${esc(s.badge)}</p><h1>${esc(s.title)}</h1><p class="lead">${esc(s.subtitle)}</p><div class="row">${s.cta ? `<button class="btn">${esc(s.cta)}</button>` : ""}${s.cta2 ? `<button class="ghost">${esc(s.cta2)}</button>` : ""}</div></section>`;
    case "stats":
    case "stats-3d":
      return `<section class="wrap grid">${items(s.items, (it) => `<div><b>${esc(it.value)}</b><p>${esc(it.label)}</p></div>`)}</section>`;
    case "features":
    case "features-tabs":
      return `<section class="wrap"><h2>${esc(s.title)}</h2><p class="lead">${esc(s.subtitle)}</p><div class="grid">${items(s.items, (it) => `<article class="card"><span>${esc(it.icon)}</span><h3>${esc(it.title)}</h3><p>${esc(it.description)}</p></article>`)}</div></section>`;
    case "bento":
    case "bento-3d":
      return `<section class="wrap"><h2>${esc(s.title)}</h2><p class="lead">${esc(s.subtitle)}</p><div class="grid">${items(s.items, (it) => `<article class="card"><span>${esc(it.icon)}</span><h3>${esc(it.title)}</h3><p>${esc(it.description)}</p><b>${esc(it.stat)}</b></article>`)}</div></section>`;
    case "products":
    case "products-3d":
      return `<section class="wrap"><h2>${esc(s.title)}</h2><div class="grid">${items(s.items, (it) => `<article class="card"><div class="visual">${esc(it.emoji)}</div><h3>${esc(it.title)}</h3><p>${esc(it.description)}</p><div class="row"><b>${esc(it.price)}</b><button class="btn">Add</button></div></article>`)}</div></section>`;
    case "split":
      return `<section class="wrap split"><div class="visual">${esc(s.visual)}</div><div><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p><ul>${(s.bullets ?? []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div></section>`;
    case "testimonials":
    case "testimonials-3d":
      return `<section class="wrap"><h2>${esc(s.title)}</h2><div class="grid">${items(s.items, (it) => `<figure class="card"><p>“${esc(it.quote)}”</p><figcaption>${esc(it.name)} · ${esc(it.role)}</figcaption></figure>`)}</div></section>`;
    case "pricing":
    case "pricing-3d":
      return `<section class="wrap"><h2>${esc(s.title)}</h2><div class="grid">${items(s.items, (it) => `<article class="card"><h3>${esc(it.title)}</h3><b>${esc(it.price)}</b><p>${esc(it.description)}</p><ul>${(it.features ?? []).map((f) => `<li>${esc(f)}</li>`).join("")}</ul><button class="btn">Choose plan</button></article>`)}</div></section>`;
    case "faq":
    case "faq-3d":
      return `<section class="wrap"><h2>${esc(s.title)}</h2>${items(s.items, (it) => `<details class="card"><summary>${esc(it.question)}</summary><p>${esc(it.answer)}</p></details>`)}</section>`;
    case "comparisons":
      return `<section class="wrap"><h2>${esc(s.title)}</h2><p class="lead">${esc(s.subtitle)}</p></section>`;
    case "cta":
    case "cta-mesh":
      return `<section class="cta"><h2>${esc(s.title)}</h2><p>${esc(s.subtitle)}</p>${s.cta ? `<button class="btn light">${esc(s.cta)}</button>` : ""}</section>`;
    case "auth":
    case "auth-3d":
      return `<section class="wrap card" style="max-width:480px;margin:4rem auto;text-align:center"><h2>${esc(s.title ?? "Sign In")}</h2><p class="lead">${esc(s.subtitle ?? "Welcome")}</p><button class="btn" style="width:100%">${esc(s.cta ?? "Continue")}</button></section>`;
    case "footer":
    case "footer-3d":
      return `<footer class="foot"><div><b>${esc(s.brand)}</b><p>${esc(s.text ?? s.subtitle)}</p></div><div>${(s.links ?? []).map((l) => `<span>${esc(l)}</span>`).join("")}</div></footer>`;
    default:
      return "";
  }
}

export function exportSiteHtml(doc: SiteDoc): string {
  const t: Theme = doc.theme ?? {};
  const accent = t.accent ?? "#2563eb";
  const accent2 = t.accent2 ?? "#7c3aed";
  const dark = !!t.dark;
  const bg = dark ? "#0a0a12" : "#ffffff";
  const text = t.textColor ?? (dark ? "#ffffff" : "#0f172a");
  const muted = t.mutedColor ?? (dark ? "#9ca3af" : "#64748b");
  const card = dark ? "#15152a" : "#ffffff";
  const border = dark ? "rgba(255,255,255,.09)" : "rgba(15,23,42,.08)";
  const brand = esc(doc.brand ?? "Website");
  const fontFam =
    t.font === "elegant"
      ? "'Playfair Display', Georgia, serif"
      : t.font === "bold"
      ? "'Space Grotesk', system-ui, sans-serif"
      : t.font === "friendly"
      ? "'Poppins', system-ui, sans-serif"
      : t.font === "handwriting"
      ? "'Caveat', cursive, sans-serif"
      : "Inter, system-ui, sans-serif";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${brand}</title>
  <style>
    :root { --accent:${accent}; --accent2:${accent2}; --bg:${bg}; --text:${text}; --muted:${muted}; --card:${card}; --border:${border}; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: ${fontFam}; background:var(--bg); color:var(--text); }
    h1,h2,h3 { margin:0 0 .4em; letter-spacing:-.02em; }
    p { color:var(--muted); }
    .nav, .foot { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:18px 8vw; border-bottom:1px solid var(--border); flex-wrap:wrap; }
    .foot { border-top:1px solid var(--border); border-bottom:0; }
    nav, .foot div { display:flex; gap:18px; color:var(--muted); font-size:14px; }
    .hero { padding:12vh 8vw; text-align:center; }
    .hero h1 { font-size:clamp(2rem,6vw,4.2rem); }
    .badge { display:inline-block; padding:4px 12px; border-radius:999px; background:color-mix(in srgb, var(--accent) 12%, transparent); color:var(--accent); font-size:12px; font-weight:600; }
    .lead { max-width:42rem; margin:0 auto 1.5rem; }
    .row { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    .btn { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; border:0; padding:10px 18px; border-radius:12px; font-weight:600; cursor:pointer; }
    .btn.light { background:#fff; color:#0f172a; }
    .ghost { background:transparent; border:1px solid var(--border); color:var(--text); padding:10px 18px; border-radius:12px; }
    .wrap { padding:5rem 8vw; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
    .card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:20px; }
    .visual { height:160px; display:flex; align-items:center; justify-content:center; font-size:64px; background:linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent2) 20%, transparent)); border-radius:16px; }
    .split { display:grid; gap:32px; align-items:center; }
    @media(min-width:900px){ .split { grid-template-columns:1fr 1fr; } }
    .cta { margin:4rem 8vw; padding:4rem 2rem; text-align:center; color:#fff; border-radius:24px; background:linear-gradient(135deg,var(--accent),var(--accent2)); }
    .cta p { color:rgba(255,255,255,.85); }
    details { margin-bottom:10px; }
    summary { cursor:pointer; font-weight:600; }
    dialog { border:0; border-radius:20px; padding:24px; width:min(420px,90vw); }
    dialog::backdrop { background:rgba(0,0,0,.45); }
    form { display:grid; gap:10px; }
    input, textarea { padding:10px 12px; border-radius:10px; border:1px solid #e2e8f0; font:inherit; }
  </style>
</head>
<body>
${((doc.sections && doc.sections.length > 0) ? doc.sections : (doc.pages?.[0]?.sections ?? [])).map(sectionHtml).join("\n")}
<dialog id="lead">
  <form method="dialog">
    <h3>Get in touch</h3>
    <p>This form is live in the prototype. Connect it to your backend after you approve the design.</p>
    <input name="name" placeholder="Your name" required />
    <input name="email" type="email" placeholder="Email" required />
    <textarea name="message" rows="4" placeholder="How can we help?"></textarea>
    <button class="btn" value="ok">Send</button>
  </form>
</dialog>
<script>
  document.querySelectorAll('.btn').forEach((b) => {
    b.addEventListener('click', () => document.getElementById('lead').showModal());
  });
</script>
</body>
</html>`;
}

export function downloadHtml(doc: SiteDoc) {
  const blob = new Blob([exportSiteHtml(doc)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(doc.brand ?? "website").replace(/\s+/g, "-").toLowerCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
