import {
  Play, ArrowRight, LayoutTemplate, Type, Image as ImageIcon,
  Square, CreditCard, Menu, PanelBottom,
} from "lucide-react";

const layers = [
  { icon: LayoutTemplate, label: "Sections" },
  { icon: Type, label: "Text" },
  { icon: ImageIcon, label: "Image" },
  { icon: Square, label: "Button" },
  { icon: CreditCard, label: "Card" },
  { icon: Menu, label: "Navbar" },
  { icon: PanelBottom, label: "Footer" },
];

const settings = [
  ["Width", "100%"],
  ["Height", "Auto"],
  ["Background", "Gradient"],
  ["Top", "120px"],
  ["Bottom", "120px"],
];

function EditorMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-500/15">
      {/* window bar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-sm font-semibold">acoopa</span>
        </div>
        <div className="flex gap-2 text-[11px] font-medium">
          <span className="rounded-md border border-slate-200 px-3 py-1">Preview</span>
          <span className="rounded-md bg-brand-blue px-3 py-1 text-white">Go live</span>
        </div>
      </div>

      <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[120px_1fr_170px]">
        {/* left layers */}
        <div className="border-r border-slate-100 p-3">
          <ul className="space-y-1">
            {layers.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-slate-600 hover:bg-slate-50">
                <Icon size={12} /> {label}
              </li>
            ))}
          </ul>
        </div>

        {/* canvas */}
        <div className="bg-slate-50/60 p-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-[9px] text-slate-400">
              <span className="font-semibold text-brand-blue">Aa</span>
              <span className="rounded bg-brand-blue px-2 py-0.5 text-white">Sign Up</span>
            </div>
            <div className="mt-4 grid grid-cols-2 items-center gap-3">
              <div>
                <p className="text-lg font-bold leading-tight">Turn Your Ideas Into Reality</p>
                <p className="mt-1 text-[8px] text-slate-500">Build modern products with the power of AI.</p>
                <div className="mt-2 flex gap-1.5 text-[8px]">
                  <span className="rounded bg-brand-blue px-2 py-1 text-white">Get Started</span>
                  <span className="rounded border border-slate-300 px-2 py-1">Watch Demo</span>
                </div>
              </div>
              <div className="mx-auto h-20 w-20 rounded-3xl bg-brand-gradient opacity-80 blur-[1px]" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[8px] text-slate-500">
              {["AI Powered", "Modern Design", "Production Ready"].map((t) => (
                <div key={t} className="rounded border border-slate-100 p-2 font-medium">{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* right settings (hidden on very small screens) */}
        <div className="hidden border-l border-slate-100 p-3 sm:block">
          <div className="mb-3 flex gap-3 text-[10px] text-slate-400">
            <span className="border-b-2 border-brand-blue pb-1 font-medium text-slate-900">Design</span>
            <span>Interactions</span>
            <span>Settings</span>
          </div>
          <p className="mb-2 text-[10px] font-semibold">Hero Section</p>
          <ul className="space-y-2">
            {settings.map(([k, v]) => (
              <li key={k} className="flex items-center justify-between text-[10px] text-slate-500">
                {k}
                <span className="rounded border border-slate-200 px-2 py-0.5 text-slate-700">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function EditorSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[360px_1fr]">
        <div>
          <span className="inline-block rounded-md bg-indigo-100 px-3 py-1 text-xs font-medium text-brand-blue">
            Step 2
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Design visually.
            <br />
            Then generate code.
          </h2>
          <p className="mt-4 text-slate-600">
            Edit until it feels like the real product. Click any component — no prompt needed.
            When you approve, we compile production code, not before.
          </p>
          <div className="mt-6 flex items-center gap-5">
            <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
              <Play size={14} fill="currentColor" /> Watch Demo
            </button>
            <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-brand-blue">
              Learn more <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <EditorMockup />
      </div>
    </section>
  );
}