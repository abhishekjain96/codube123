"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import SiteRendererV2 from "@/components/site/SiteRendererV2";
import { generateSiteV2 } from "@/lib/api";
import type { SiteV2 } from "@/lib/siteTypes";

export default function LiveDemo() {
  const [idea, setIdea] = useState("Online store for handmade Kerala coconut oil and spices, based in Kochi");
  const [site, setSite] = useState<SiteV2 | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [secs, setSecs] = useState(0);

  async function run() {
    setBusy(true);
    setError("");
    const t0 = Date.now();
    try {
      setSite(await generateSiteV2(idea));
      setSecs(Math.round((Date.now() - t0) / 1000));
    } catch {
      setError("Generation failed. Check the backend terminal for the error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-50 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white p-3">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="min-w-[240px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <button
          onClick={run}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          {busy ? "Building…" : "Generate"}
        </button>
        {site && !busy && (
          <span className="text-xs text-slate-500">
            {site.pages.length} pages in {secs}s
          </span>
        )}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      {site && <SiteRendererV2 site={site} />}
    </div>
  );
}