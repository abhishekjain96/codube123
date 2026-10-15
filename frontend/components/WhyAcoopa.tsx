// import { MousePointer2, Sparkles, Layers, Cloud, Github, Wand2 } from "lucide-react";
// import ScrollReveal from "./ScrollReveal";

// const tiles = [
//   {
//     icon: MousePointer2,
//     title: "Click-to-modify canvas",
//     text: "Tap a button, headline or card. An AI menu appears: color, motion, font, rewrite — no prompt required.",
//     className: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
//     glow: "from-blue-500 to-violet-500",
//   },
//   {
//     icon: Sparkles,
//     title: "Instant micro-interactions",
//     text: "Contact opens a popup. Products add to cart. FAQ accordion. The prototype behaves like a real site.",
//     className: "sm:col-span-2 lg:col-span-2",
//     glow: "from-fuchsia-500 to-orange-400",
//   },
//   {
//     icon: Layers,
//     title: "Visual first",
//     text: "GPT-6 Astra drafts the live canvas. No database until you say go.",
//     className: "",
//     glow: "from-indigo-500 to-sky-400",
//   },
//   {
//     icon: Wand2,
//     title: "Claude compiles",
//     text: "After approval, Sonnet writes the full-stack files — cleaner loops, real architecture.",
//     className: "",
//     glow: "from-violet-600 to-indigo-400",
//   },
//   {
//     icon: Cloud,
//     title: "One-click host",
//     text: "Ship the approved design like Vercel, without touching git.",
//     className: "",
//     glow: "from-sky-500 to-cyan-400",
//   },
//   {
//     icon: Github,
//     title: "Export to GitHub",
//     text: "Developers get a clean repo. Founders never see a terminal.",
//     className: "",
//     glow: "from-slate-800 to-slate-500",
//   },
// ];

// export default function WhyAcoopa() {
//   return (
//     <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
//       <ScrollReveal>
//         <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">Why Acoopa</p>
//         <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight">
//           Three kill features Bolt and Lovable still treat as afterthoughts
//         </h2>
//       </ScrollReveal>

//       <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
//         {tiles.map(({ icon: Icon, title, text, className, glow }, i) => (
//           <ScrollReveal key={title} delay={i * 70} className={`h-full ${className}`}>
//             <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
//               <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${glow} opacity-20 blur-2xl transition group-hover:opacity-40`} />
//               <span className={`relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${glow} text-white shadow-lg`}>
//                 <Icon size={18} />
//               </span>
//               <h3 className="relative mt-4 text-lg font-semibold">{title}</h3>
//               <p className="relative mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
//             </div>
//           </ScrollReveal>
//         ))}
//       </div>
//     </section>
//   );
// }
