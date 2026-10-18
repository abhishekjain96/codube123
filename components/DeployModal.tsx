"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Globe, Loader2, Rocket, Server, ShieldCheck, X } from "lucide-react";
import type { SiteDoc } from "./SiteRenderer";

export default function DeployModal({
  id: _id,
  doc,
  onClose,
}: {
  id?: string;
  doc: SiteDoc | null;
  onClose: () => void;
}) {
  const [provider, setProvider] = useState<"vercel" | "netlify" | "cloudflare">("vercel");
  const [customSubdomain, setCustomSubdomain] = useState(
    (doc?.brand || "my-app").toLowerCase().replace(/[^a-z0-9]+/g, "-")
  );
  const [status, setStatus] = useState<"idle" | "deploying" | "success">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = [
    "Compiling Next.js App Router bundle...",
    "Running zero-defect build and lint validation...",
    "Optimizing responsive assets and layout...",
    `Deploying to ${provider.toUpperCase()} Global Edge CDN...`,
  ];

  const deployedUrl = `https://${customSubdomain || "app"}.codube.app`;

  function startDeploy() {
    setStatus("deploying");
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((s) => {
        if (s < steps.length - 1) {
          return s + 1;
        } else {
          clearInterval(interval);
          setStatus("success");
          return s;
        }
      });
    }, 900);
  }

  function copyUrl() {
    navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d18] p-6 shadow-2xl text-left text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        {status === "idle" && (
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30">
                <Rocket size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold">1-Click Cloud Deployment</h3>
                <p className="text-xs text-slate-400">Publish your application live to the web</p>
              </div>
            </div>

            {/* Provider Selector */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Cloud Provider
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { id: "vercel", name: "Vercel", icon: "▲" },
                  { id: "netlify", name: "Netlify", icon: "◆" },
                  { id: "cloudflare", name: "Cloudflare", icon: "☁" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id as any)}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                      provider === p.id
                        ? "border-violet-500 bg-violet-600/20 text-white ring-1 ring-violet-500"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subdomain Input */}
            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Choose Live Subdomain
              </label>
              <div className="mt-2 flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
                <Globe size={15} className="text-violet-400 shrink-0" />
                <input
                  value={customSubdomain}
                  onChange={(e) => setCustomSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="my-company"
                  className="w-full bg-transparent px-2 text-sm text-white outline-none"
                />
                <span className="text-xs text-slate-500 font-mono">.codube.app</span>
              </div>
            </div>

            {/* Features list */}
            <div className="mt-6 space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Automatic SSL Certificate Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Server size={14} className="text-blue-400" />
                <span>High-Speed Global Edge Network</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={startDeploy}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/40 hover:opacity-90"
              >
                <Rocket size={14} />
                Deploy Now
              </button>
            </div>
          </div>
        )}

        {status === "deploying" && (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <h3 className="mt-4 text-lg font-bold">Deploying to {provider.toUpperCase()}...</h3>
            <p className="mt-1 text-xs text-slate-400">Please wait while your project is provisioned</p>

            <div className="mx-auto mt-6 max-w-sm space-y-3 rounded-2xl border border-white/10 bg-[#07070e] p-4 text-left font-mono text-xs">
              {steps.map((st, i) => (
                <div
                  key={st}
                  className={`flex items-center gap-2.5 ${
                    i < currentStep
                      ? "text-emerald-400"
                      : i === currentStep
                      ? "text-violet-300 font-bold"
                      : "text-slate-600"
                  }`}
                >
                  {i < currentStep ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : i === currentStep ? (
                    <Loader2 size={14} className="animate-spin text-orange-400" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-700" />
                  )}
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20">
              <Check size={28} />
            </div>
            <h3 className="mt-4 text-xl font-bold">Your Website is Live!</h3>
            <p className="mt-1 text-xs text-slate-400">
              Successfully deployed to {provider.toUpperCase()} Edge Network
            </p>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <span className="truncate text-xs font-mono text-emerald-300 font-semibold">
                {deployedUrl}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={copyUrl}
                  className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs text-white hover:bg-white/20"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500"
                >
                  <span>Open</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              Done & Return to Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
