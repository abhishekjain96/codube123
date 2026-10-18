"use client";

import { Palette, Sparkles, Type, PenLine, MessageSquarePlus, X } from "lucide-react";

const actions = [
  { id: "color", icon: Palette, label: "Change color" },
  { id: "animate", icon: Sparkles, label: "Make it animated" },
  { id: "font", icon: Type, label: "Change font" },
  { id: "rewrite", icon: PenLine, label: "Rewrite copy" },
  { id: "popup", icon: MessageSquarePlus, label: "Open as popup" },
] as const;

export type ClickAction = (typeof actions)[number]["id"];

export default function ClickMenu({
  title,
  onAction,
  onClose,
}: {
  title: string;
  onAction: (id: ClickAction) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute left-3 top-3 z-20 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-500/20">
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
        <p className="truncate text-xs font-semibold capitalize text-slate-700">{title}</p>
        <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700">
          <X size={14} />
        </button>
      </div>
      <ul className="p-1.5">
        {actions.map(({ id, icon: Icon, label }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onAction(id)}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-brand-blue"
            >
              <Icon size={14} /> {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
