"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowRight, Cpu, Database, Globe, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

/* ------------------------------------------------------------------ */
/* 1. 3D Perspective Tilt Card (Aceternity style)                      */
/* ------------------------------------------------------------------ */
export function Card3DTilt({
  title = "Next-Level 3D Card",
  subtitle = "Hover to experience real-time 3D tilt, specular glare, and elevated depth.",
  badge = "✦ Aceternity UI 3D",
  cta = "Explore Features",
  accent = "#8b5cf6",
  className = "",
}: {
  title?: string;
  subtitle?: string;
  badge?: string;
  cta?: string;
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    setRotX(((y - cy) / cy) * -12);
    setRotY(((x - cx) / cx) * 12);
    setGlare({ x: (x / r.width) * 100, y: (y / r.height) * 100, o: 0.35 });
  }

  function onLeave() {
    setRotX(0);
    setRotY(0);
    setGlare((g) => ({ ...g, o: 0 }));
  }

  return (
    <div style={{ perspective: 1000 }} className={`w-full ${className}`}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: "transform 0.12s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d18] p-8 shadow-2xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-violet-600/25"
      >
        {/* Dynamic Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundImage: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${accent}50, transparent 65%)`,
            opacity: glare.o,
          }}
        />

        <div style={{ transform: "translateZ(35px)" }} className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              <Sparkles size={12} />
              {badge}
            </span>
            <span className="text-[11px] font-mono text-slate-500">60FPS // GPU</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-400">{subtitle}</p>
          <div className="pt-2">
            <button
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:scale-105"
              style={{ backgroundImage: `linear-gradient(135deg, ${accent}, #6366f1)` }}
            >
              <span>{cta}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Interactive Three.js WebGL Cyber Canvas                          */
/* ------------------------------------------------------------------ */
export function ThreeJsCyberSphere({
  accent = "#8b5cf6",
  className = "",
}: {
  accent?: string;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 4.0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(1.5, 2);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accent),
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Particle orbits
    const count = 240;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 5.5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let frameId: number;
    let mouseX = 0;
    let mouseY = 0;

    function onMouseMove(e: MouseEvent) {
      const rect = mount?.getBoundingClientRect();
      if (!rect) return;
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    }

    mount.addEventListener("mousemove", onMouseMove);

    function animate() {
      frameId = requestAnimationFrame(animate);
      mesh.rotation.y += 0.005;
      mesh.rotation.x += 0.003;
      mesh.rotation.y += (mouseX * 0.4 - mesh.rotation.y) * 0.05;
      mesh.rotation.x += (-mouseY * 0.4 - mesh.rotation.x) * 0.05;
      particles.rotation.y -= 0.002;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      mount.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [accent]);

  return <div ref={mountRef} className={`relative flex items-center justify-center ${className}`} />;
}

/* ------------------------------------------------------------------ */
/* 3. Spotlight Cursor Tracker (Magic UI / Aceternity style)          */
/* ------------------------------------------------------------------ */
export function SpotlightCursorGlow({
  children,
  accent = "#f97316",
  className = "",
}: {
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 30 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setCoords({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(600px circle at ${coords.x}% ${coords.y}%, ${accent}18, transparent 65%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Animated Laser Beams Hub                                         */
/* ------------------------------------------------------------------ */
export function AnimatedBeamsHub({ accent = "#8b5cf6" }: { accent?: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080812] p-8 max-w-4xl mx-auto text-center">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
          <Zap size={13} />
          Autonomous Agent Protocol
        </span>
        <h3 className="text-xl font-bold text-white mt-2">Active MCP Node Pipeline</h3>
      </div>

      <div className="relative flex items-center justify-between max-w-xl mx-auto py-4">
        {/* Input Nodes */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left">
            <Globe size={18} className="text-violet-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">rea/scraper</p>
              <p className="text-[10px] text-slate-500">DOM & CSS tokens</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left">
            <Lock size={18} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">auth/mcp</p>
              <p className="text-[10px] text-slate-500">JWT & Sessions</p>
            </div>
          </div>
        </div>

        {/* Central Orchestrator Core */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-white/20 text-white shadow-2xl animate-pulse"
          style={{ backgroundImage: `linear-gradient(135deg, ${accent}40, #f9731640)` }}
        >
          <Cpu size={32} className="text-white" />
        </div>

        {/* Output Nodes */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left">
            <Database size={18} className="text-cyan-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">neon/postgres</p>
              <p className="text-[10px] text-slate-500">Live Drizzle tables</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left">
            <ShieldCheck size={18} className="text-orange-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">qa/compiler</p>
              <p className="text-[10px] text-slate-500">Zero error build</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Floating Island Glass Navbar Preview                             */
/* ------------------------------------------------------------------ */
export function FloatingIslandPreview({ accent = "#8b5cf6" }: { accent?: string }) {
  return (
    <div className="w-full max-w-lg p-2">
      <div className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-[#0d0d18]/90 px-5 py-2.5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-black text-xs shadow-md"
            style={{ backgroundImage: `linear-gradient(135deg, ${accent}, #6366f1)` }}
          >
            N
          </span>
          <span className="font-bold text-xs tracking-tight text-white">NEXTSAAS</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
          <span className="text-white">Features</span>
          <span>3D Mesh</span>
          <span>Pricing</span>
        </div>
        <button
          className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-md transition hover:scale-105"
          style={{ backgroundImage: `linear-gradient(135deg, ${accent}, #3b82f6)` }}
        >
          <span>Launch</span>
          <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Dynamic ROI Pricing Preview                                      */
/* ------------------------------------------------------------------ */
export function RoiPricingPreview({ accent = "#10b981" }: { accent?: string }) {
  const [annual, setAnnual] = useState(true);
  const [seats, setSeats] = useState(8);
  const basePrice = 29;
  const unitPrice = annual ? Math.round(basePrice * 0.8) : basePrice;
  const totalPrice = unitPrice * seats;

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a14] p-5 text-center">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
          <Sparkles size={10} />
          Scale-to-Zero
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300"
        >
          <span>{annual ? "Annual (-20%)" : "Monthly"}</span>
          <span className="h-4 w-7 rounded-full bg-white/10 p-0.5 transition flex items-center">
            <span className={`h-3 w-3 rounded-full transition-transform ${annual ? "translate-x-3 bg-emerald-400" : "bg-white"}`} />
          </span>
        </button>
      </div>

      <div className="mt-4">
        <span className="text-3xl font-extrabold text-white">${totalPrice}</span>
        <span className="text-xs text-slate-400">/month</span>
      </div>

      <div className="mt-3 space-y-1 text-left">
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Active Seats: {seats}</span>
          <span>${unitPrice}/user/mo</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full accent-emerald-500 h-1.5 rounded-lg bg-white/10 cursor-pointer"
        />
      </div>
    </div>
  );
}

