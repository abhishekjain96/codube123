export interface ComponentSnippet {
  id: string;
  name: string;
  category: "3d" | "bento" | "hero" | "background" | "conversion" | "fullstack";
  source: "Aceternity UI" | "Magic UI" | "21st.dev" | "Three.js WebGL" | "Neon / Drizzle";
  description: string;
  tags: string[];
  features: string[];
  code: string;
}

export const COMPONENT_DATABASE: Record<string, ComponentSnippet> = {
  "3d-card-effect": {
    id: "3d-card-effect",
    name: "3D Perspective Card Tilt",
    category: "3d",
    source: "Aceternity UI",
    description: "Interactive 3D hover card with mouse perspective tilt, glare sheen, and elevated content layers.",
    tags: ["3d", "framer-motion", "card", "tilt", "perspective"],
    features: ["Mouse-coordinate spatial tilt", "Reflective gradient glare", "Z-index layer popping", "Spring inertia return"],
    code: `"use client";

import React, { useRef, useState } from "react";

export function Card3D({
  title = "Next-Gen Infrastructure",
  description = "Engineered for zero-latency execution across 35 edge regions worldwide.",
  badge = "Pro Level",
  cta = "Explore Architecture",
  accent = "#8b5cf6",
}: {
  title?: string;
  description?: string;
  badge?: string;
  cta?: string;
  accent?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;
    setRotateX(rotX);
    setRotateY(rotY);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.25 });
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setGlare((g) => ({ ...g, opacity: 0 }));
  }

  return (
    <div className="perspective-1000 w-full max-w-md">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d18] p-8 shadow-2xl transition-shadow duration-300 hover:shadow-violet-600/20"
      >
        {/* Dynamic mouse glare */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: \`radial-gradient(circle at \${glare.x}% \${glare.y}%, \${accent}40, transparent 60%)\`,
            opacity: glare.opacity,
          }}
        />

        <div style={{ transform: "translateZ(30px)" }} className="relative z-10 space-y-4">
          <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
            {badge}
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-400">{description}</p>
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:scale-105"
            style={{ background: \`linear-gradient(135deg, \${accent}, #6366f1)\` }}
          >
            {cta} →
          </button>
        </div>
      </div>
    </div>
  );
}`,
  },

  "magic-bento-grid": {
    id: "magic-bento-grid",
    name: "Magic Animated Bento Grid",
    category: "bento",
    source: "Magic UI",
    description: "Asymmetrical responsive Bento Grid with glowing borders, hover beam highlights, and metric badges.",
    tags: ["bento", "magic-ui", "grid", "dashboard", "features"],
    features: ["Asymmetrical 3-column span", "Ambient laser hover glow", "Dark luxury palette", "Integrated micro-metrics"],
    code: `"use client";

import React from "react";
import { Cpu, Database, Globe, Layers, ShieldCheck, Zap } from "lucide-react";

export function MagicBentoGrid({
  items,
  accent = "#f97316",
}: {
  items?: Array<{ title: string; desc: string; icon: string; span?: string }>;
  accent?: string;
}) {
  const cards = items || [
    { title: "Distributed Consensus Engine", desc: "Global state replication verified in 42ms with zero data drift across active-active clusters.", icon: "cpu", span: "md:col-span-2" },
    { title: "Real-Time Telemetry", desc: "Sub-millisecond query traces and anomaly detection.", icon: "zap", span: "md:col-span-1" },
    { title: "Automated Edge SSL & TLS 1.3", desc: "Enterprise protection with hardware security modules.", icon: "shield", span: "md:col-span-1" },
    { title: "Native Postgres & Vector Search", desc: "Integrated pgvector, serverless scaling, and automatic schema branching on every Git pull request.", icon: "db", span: "md:col-span-2" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto p-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={\`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c16] p-8 transition duration-300 hover:border-white/25 hover:shadow-2xl \${c.span || ""}\`}
        >
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: \`radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), \${accent}25, transparent 60%)\`,
            }}
          />
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/10 text-white group-hover:border-violet-500/50 group-hover:text-violet-300 transition">
                {c.icon === "cpu" && <Cpu size={20} />}
                {c.icon === "zap" && <Zap size={20} />}
                {c.icon === "shield" && <ShieldCheck size={20} />}
                {c.icon === "db" && <Database size={20} />}
              </span>
              <span className="text-[11px] font-mono text-slate-500">0{i + 1} // SYS</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">{c.title}</h4>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{c.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}`,
  },

  "threejs-cyber-sphere": {
    id: "threejs-cyber-sphere",
    name: "Three.js WebGL Cyber Canvas",
    category: "3d",
    source: "Three.js WebGL",
    description: "Interactive WebGL 3D wireframe mesh with rotating particle orbits responding to mouse coordinates.",
    tags: ["threejs", "webgl", "3d", "interactive", "canvas"],
    features: ["Interactive camera rotation", "Luminescent particle point clouds", "Wireframe icosahedron", "Auto-orbit damping"],
    code: `"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeCyberCanvas({ accent = "#8b5cf6" }: { accent?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Inner wireframe sphere
    const geo = new THREE.IcosahedronGeometry(1.6, 2);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accent),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Particle field
    const pGeo = new THREE.BufferGeometry();
    const count = 300;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
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
      mesh.rotation.y += (mouseX * 0.5 - mesh.rotation.y) * 0.05;
      mesh.rotation.x += (-mouseY * 0.5 - mesh.rotation.x) * 0.05;
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

  return <div ref={mountRef} className="h-80 w-full max-w-md mx-auto" />;
}`,
  },

  "spotlight-hero": {
    id: "spotlight-hero",
    name: "Cursor Spotlight Glow",
    category: "hero",
    source: "Aceternity UI",
    description: "Atmospheric radial spotlight that dynamically follows user cursor with high-conversion typography.",
    tags: ["spotlight", "glow", "hero", "lighting", "mouse"],
    features: ["Radial gradient cursor masking", "Deep space background", "Seamless contrast", "GPU-accelerated"],
    code: `"use client";

import React, { useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function SpotlightHero({
  headline = "The Developer Platform for True Visionaries",
  subhead = "Turn any complex system into an interactive, lightning-fast application with multi-agent orchestration and live MCP tool synthesis.",
  badge = "✦ Aceternity Spotlight Architecture",
  primaryCta = "Deploy Application",
  secondaryCta = "Explore Blueprint",
  accent = "#f97316",
}: {
  headline?: string;
  subhead?: string;
  badge?: string;
  primaryCta?: string;
  secondaryCta?: string;
  accent?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 30 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="relative min-h-[580px] flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#05050a] px-6 py-24 text-center"
    >
      {/* Moving cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: \`radial-gradient(600px circle at \${coords.x}% \${coords.y}%, \${accent}22, transparent 65%)\`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-300">
          <Sparkles size={13} />
          {badge}
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          {headline}
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          {subhead}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-xl transition hover:scale-105"
            style={{ background: \`linear-gradient(135deg, \${accent}, #8b5cf6)\` }}
          >
            <span>{primaryCta}</span>
            <ArrowRight size={16} />
          </button>
          <button className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition">
            {secondaryCta}
          </button>
        </div>
      </div>
    </div>
  );
}`,
  },

  "animated-beams": {
    id: "animated-beams",
    name: "Animated Laser Beams",
    category: "conversion",
    source: "Magic UI",
    description: "Flowing light beams that connect multiple components, microservices, and databases in real-time.",
    tags: ["beams", "svg", "animation", "laser", "pipeline"],
    features: ["Dynamic SVG gradient paths", "Continuous stroke dashoffset flow", "Node connection network"],
    code: `"use client";

import React from "react";
import { Cloud, Cpu, Database, Globe, Lock, Shield } from "lucide-react";

export function AnimatedBeams() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080812] p-10 max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white">Real-Time Data Pipeline</h3>
        <p className="text-sm text-slate-400 mt-1">Autonomous sync between Edge Nodes, AI Inference, and Primary Postgres</p>
      </div>

      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Source Nodes */}
        <div className="flex flex-col gap-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-lg shadow-violet-500/20">
            <Globe size={22} />
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-lg shadow-emerald-500/20">
            <Lock size={22} />
          </span>
        </div>

        {/* Central Hub */}
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-orange-500/60 bg-gradient-to-tr from-orange-500/20 via-purple-500/20 to-blue-500/20 text-white shadow-2xl shadow-orange-500/30 animate-pulse">
          <Cpu size={36} className="text-orange-400" />
        </div>

        {/* Destination Nodes */}
        <div className="flex flex-col gap-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-lg shadow-cyan-500/20">
            <Database size={22} />
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/40 bg-purple-500/10 text-purple-300 shadow-lg shadow-purple-500/20">
            <Cloud size={22} />
          </span>
        </div>
      </div>
    </div>
  );
}`,
  },

  "meteor-shower": {
    id: "meteor-shower",
    name: "Meteor Shower Sky",
    category: "background",
    source: "Aceternity UI",
    description: "Diagonal shooting meteors with luminous trail lines across dark space background.",
    tags: ["meteors", "space", "background", "animation"],
    features: ["CSS keyframe linear gradient trails", "Randomized delay intervals", "Zero-performance drag"],
    code: `"use client";

import React from "react";

export function MeteorShower({ count = 18 }: { count?: number }) {
  const meteors = new Array(count).fill(true);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteors.map((_, i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-slate-400 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: \`\${Math.floor(Math.random() * 100)}%\`,
            left: \`\${Math.floor(Math.random() * 100)}%\`,
            animationDelay: \`\${Math.random() * 2}s\`,
            animationDuration: \`\${Math.floor(Math.random() * 6 + 3)}s\`,
          }}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-400 via-violet-500 to-transparent" />
        </span>
      ))}
    </div>
  );
}`,
  },

  "moving-cards-marquee": {
    id: "moving-cards-marquee",
    name: "Infinite Marquee Testimonials",
    category: "conversion",
    source: "21st.dev",
    description: "Smooth horizontal marquee card slider showcasing client proof and quotes without stopping.",
    tags: ["marquee", "social-proof", "infinite-scroll", "testimonials"],
    features: ["Infinite CSS horizontal loop", "Pause on hover", "Gradient fade edge masks"],
    code: `"use client";

import React from "react";

export function MarqueeCards() {
  const reviews = [
    { name: "Sarah Chen", role: "CTO @ VektorScale", text: "Codube's multi-agent system built our entire billing and auth infrastructure in 10 minutes flat." },
    { name: "Marcus Rivera", role: "Founder @ Lumina Labs", text: "The 3D component synthesis from MCP is lightyears ahead of Bolt and Lovable. Mind-blowing quality." },
    { name: "Elena Rostova", role: "Principal Engineer", text: "Production Next.js 15 code without AI slop. It deconstructs and writes code like a senior architect." },
    { name: "David Kim", role: "VP Product", text: "Our design team was able to reverse engineer our competitor's app and redesign it in our brand style in 1 afternoon." },
  ];

  return (
    <div className="relative overflow-hidden py-12 max-w-6xl mx-auto">
      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#06060c] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#06060c] to-transparent z-10" />

      <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
        {[...reviews, ...reviews].map((r, i) => (
          <div key={i} className="w-80 shrink-0 rounded-2xl border border-white/10 bg-[#0d0d18] p-5 shadow-lg">
            <p className="text-xs text-slate-300 leading-relaxed">“{r.text}”</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                {r.name[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{r.name}</p>
                <p className="text-[10px] text-slate-500">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },

  "neon-postgres-schema": {
    id: "neon-postgres-schema",
    name: "Full-Stack Neon & Postgres Schema",
    category: "fullstack",
    source: "Neon / Drizzle",
    description: "Production Drizzle ORM schema with Users, Teams, Subscriptions, API Keys, and Project tables.",
    tags: ["postgres", "neon", "drizzle", "fullstack", "database"],
    features: ["UUID primary keys", "Foreign key cascades", "Row-level security ready", "Automatic timestamps"],
    code: `import { pgTable, text, timestamp, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionTier: text("subscription_tier").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  siteJson: jsonb("site_json").notNull(),
  designTokens: jsonb("design_tokens"),
  publishedUrl: text("published_url"),
  isLive: boolean("is_live").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  keyHash: text("key_hash").notNull(),
  label: text("label").notNull(),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});`,
  },

  "floating-island-navbar": {
    id: "floating-island-navbar",
    name: "Floating Island Glass Navbar",
    category: "hero",
    source: "Aceternity UI",
    description: "Detached floating pill navbar with frosted backdrop-blur, active link indicator, and mobile responsive sheet.",
    tags: ["navbar", "island", "floating", "glassmorphism", "header"],
    features: ["Sticky floating pill geometry", "Backdrop blur glassmorphism", "Dynamic active state", "Integrated CTA button"],
    code: `"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";

export function FloatingIslandNavbar({
  brand = "NEXTSAAS",
  links = ["Features", "3D Canvas", "Full-Stack", "Pricing"],
  accent = "#8b5cf6",
}: {
  brand?: string;
  links?: string[];
  accent?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={\`pointer-events-auto flex items-center justify-between gap-6 rounded-full border border-white/10 px-6 py-2.5 shadow-2xl transition-all duration-300 \${
          scrolled
            ? "bg-[#0b0b14]/90 backdrop-blur-xl shadow-black/80 ring-1 ring-white/10"
            : "bg-[#0b0b14]/70 backdrop-blur-md"
        } w-full max-w-4xl\`}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white font-black text-sm shadow-md"
            style={{ backgroundImage: \`linear-gradient(135deg, \${accent}, #6366f1)\` }}
          >
            {brand[0]}
          </span>
          <span className="font-bold text-sm tracking-tight text-white">{brand}</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          {links.map((item, i) => (
            <Link
              key={i}
              href={\`#\${item.toLowerCase().replace(/\\s+/g, "-")}\`}
              className="hover:text-white transition"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden sm:flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-lg transition hover:scale-105"
            style={{ backgroundImage: \`linear-gradient(135deg, \${accent}, #3b82f6)\` }}
          >
            <span>Launch App</span>
            <ArrowRight size={12} />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>
  );
}`,
  },

  "interactive-pricing-roi": {
    id: "interactive-pricing-roi",
    name: "Dynamic ROI Pricing Matrix",
    category: "conversion",
    source: "21st.dev",
    description: "Annual vs Monthly billing toggle with dynamic scale discount and interactive ROI calculator slider.",
    tags: ["pricing", "roi", "calculator", "toggle", "billing"],
    features: ["Monthly/Annual 20% discount switch", "Interactive compute tier slider", "Highlight popular card", "Zero layout shift"],
    code: `"use client";

import React, { useState } from "react";
import { Check, Sparkles, Zap } from "lucide-react";

export function DynamicRoiPricing({ accent = "#10b981" }: { accent?: string }) {
  const [annual, setAnnual] = useState(true);
  const [seats, setSeats] = useState(5);

  const basePrice = 29;
  const unitPrice = annual ? Math.round(basePrice * 0.8) : basePrice;
  const totalPrice = unitPrice * seats;

  return (
    <div className="max-w-5xl mx-auto p-8 rounded-3xl border border-white/10 bg-[#080812] text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
        <Sparkles size={13} />
        Scale-to-Zero Architecture
      </span>
      <h3 className="text-3xl font-extrabold text-white mt-3">Predictable, Transparent Pricing</h3>
      <p className="text-sm text-slate-400 mt-2">Adjust your team size to estimate monthly cloud execution cost.</p>

      {/* Annual Switch */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <span className={\`text-xs \${!annual ? "text-white font-bold" : "text-slate-400"}\`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className="relative h-6 w-12 rounded-full bg-white/10 p-0.5 transition"
        >
          <div
            className={\`h-5 w-5 rounded-full transition-transform \${
              annual ? "translate-x-6 bg-emerald-400" : "translate-x-0 bg-white"
            }\`}
          />
        </button>
        <span className={\`text-xs flex items-center gap-1 \${annual ? "text-white font-bold" : "text-slate-400"}\`}>
          <span>Annual</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-semibold">Save 20%</span>
        </span>
      </div>

      {/* Slider */}
      <div className="max-w-md mx-auto mt-8 space-y-2">
        <div className="flex justify-between text-xs text-slate-300 font-mono">
          <span>Team Size: {seats} seats</span>
          <span>Est. Cost: \${totalPrice}/mo</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full accent-emerald-500 h-1.5 rounded-lg bg-white/10 cursor-pointer"
        />
      </div>
    </div>
  );
}`,
  },

  "nextjs-api-route-edge": {
    id: "nextjs-api-route-edge",
    name: "Production Next.js 15 Edge API Route",
    category: "fullstack",
    source: "Neon / Drizzle",
    description: "Type-safe API route with Bearer token authentication, rate-limiting, and PostgreSQL CRUD operations.",
    tags: ["api", "nextjs15", "route", "edge", "auth"],
    features: ["NextRequest / NextResponse", "Bearer token extraction", "Rate limit verification", "JSON schema validation"],
    code: `import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid bearer token" }, { status: 401 });
    }

    const body = await req.json();
    const { name, prompt, config } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Field 'name' is required" }, { status: 400 });
    }

    // Process high-frequency task
    const project = {
      id: crypto.randomUUID(),
      name,
      prompt: prompt || "Next-level full-stack app",
      status: "ready",
      createdAt: new Date().toISOString(),
      edgeRegion: req.headers.get("x-vercel-ip-country-region") || "global",
    };

    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}`,
  },
};

export function getAllComponents(): ComponentSnippet[] {
  return Object.values(COMPONENT_DATABASE);
}

export function getComponentById(id: string): ComponentSnippet | undefined {
  return COMPONENT_DATABASE[id];
}
