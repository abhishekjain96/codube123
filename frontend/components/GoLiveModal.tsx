// "use client";

// import { useState } from "react";
// import { Check, Cloud, Github, Loader2, Rocket, X } from "lucide-react";
// import type { SiteDoc } from "./SiteRenderer";
// import { downloadHtml } from "@/lib/exportHtml";
// import { compileProject, type CodeFile } from "@/lib/api";

// export default function GoLiveModal({
//   id,
//   doc,
//   onClose,
// }: {
//   id: string;
//   doc: SiteDoc;
//   onClose: () => void;
// }) {
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");
//   const [files, setFiles] = useState<CodeFile[] | null>(null);
//   const [note, setNote] = useState("");

//   async function compile() {
//     setBusy(true);
//     setError("");
//     try {
//       const res = await compileProject(id);
//       setFiles(res.files);
//       setNote(res.reply);
//     } catch {
//       setError("Production compile needs the Anthropic key. You can still download the live HTML prototype.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   function downloadFiles() {
//     if (!files?.length) {
//       downloadHtml(doc);
//       return;
//     }
//     for (const f of files) {
//       const blob = new Blob([f.content], { type: "text/plain;charset=utf-8" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = f.path.replaceAll("/", "_");
//       a.click();
//       URL.revokeObjectURL(url);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
//       <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
//           aria-label="Close"
//         >
//           <X size={18} />
//         </button>
//         <div className="bg-brand-gradient px-6 py-8 text-white">
//           <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Design is final</p>
//           <h2 className="mt-1 text-2xl font-bold">Now we write the real code</h2>
//           <p className="mt-2 text-sm text-white/80">
//             The canvas stayed visual on purpose. Full-stack logic, APIs and hosting start only after you approve.
//           </p>
//         </div>
//         <div className="space-y-3 p-6">
//           {busy ? (
//             <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-slate-700">
//               <Loader2 className="animate-spin text-brand-blue" size={18} />
//               Compiling production files with Claude. This can take about a minute.
//             </div>
//           ) : files ? (
//             <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-slate-700">
//               <p className="flex items-center gap-2 font-semibold text-emerald-800">
//                 <Check size={16} /> Stack ready
//               </p>
//               <p className="mt-1">{note || `${files.length} files generated.`}</p>
//               <ul className="mt-2 max-h-28 overflow-auto font-mono text-[11px] text-slate-500">
//                 {files.map((f) => (
//                   <li key={f.path}>{f.path}</li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <p className="text-sm text-slate-600">
//               Non-technical users can host in one click. Developers can export a clean repo.
//             </p>
//           )}
//           {error && <p className="text-sm text-rose-600">{error}</p>}
//           <div className="grid gap-2 sm:grid-cols-2">
//             <button
//               type="button"
//               onClick={files ? downloadFiles : compile}
//               disabled={busy}
//               className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
//             >
//               <Rocket size={16} /> {files ? "Download project" : "Generate production code"}
//             </button>
//             <button
//               type="button"
//               onClick={() => downloadHtml(doc)}
//               className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
//             >
//               Download live HTML
//             </button>
//             <button
//               type="button"
//               className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600"
//             >
//               <Cloud size={16} /> Host on Acoopa Cloud
//             </button>
//             <button
//               type="button"
//               className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600"
//             >
//               <Github size={16} /> Export to GitHub
//             </button>
//           </div>
//           <p className="text-center text-[11px] text-slate-400">
//             Cloud hosting and GitHub export ship next — HTML and production compile work now.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
