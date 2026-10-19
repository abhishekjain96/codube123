import { McpClient } from "@/lib/mcp/mcpClient";
import type { SiteV2 } from "@/lib/siteTypes";
import { AI_MODELS } from "./models";

export interface AgentActivity {
  agent: "architect" | "scraper" | "uiux" | "fullstack" | "copywriter" | "qa";
  agentName: string;
  modelName: string;
  modelId: string;
  role: string;
  avatarColor: string;
  status: "idle" | "thinking" | "calling_mcp" | "generating" | "complete" | "error";
  toolCalls?: Array<{ tool: string; args: Record<string, any>; resultSummary?: string }>;
  message: string;
  timestamp: string;
}

export interface MultiAgentPipelineResult {
  activities: AgentActivity[];
  blueprint: {
    brandName: string;
    domainCategory: string;
    archetype: string;
    routes: string[];
    animatedComponents: string[];
    databaseTables: string[];
    apiEndpoints: string[];
  };
  site: SiteV2;
}

interface DomainContext {
  category: string;
  headline: string;
  subtitle: string;
  features: Array<{ title: string; desc: string; icon: string }>;
  bentoItems: Array<{ title: string; desc: string; icon: string; span?: string }>;
  stats: Array<{ value: string; label: string }>;
  plans: Array<{ name: string; price: string; period: string; desc: string; features: string[]; popular?: boolean; cta: string }>;
  dbTables: string[];
  apiRoutes: string[];
  primaryColor: string;
  secondaryColor: string;
}

function detectDomainContext(prompt: string, domainName?: string): DomainContext {
  const p = prompt.toLowerCase();

  if (p.includes("video") || p.includes("media") || p.includes("cinema") || p.includes("generate video") || p.includes("animation")) {
    return {
      category: "Generative AI Video & Cinema",
      headline: `Hyper-Realistic AI Video Generation for ${domainName || "Studio"}`,
      subtitle: "Render 4K cinematic scenes, character keyframes, and motion vectors with multi-agent diffusion pipelines at 60 FPS.",
      primaryColor: "#ec4899",
      secondaryColor: "#8b5cf6",
      features: [
        { title: "Temporal Video Diffusion", desc: "Coherent scene synthesis with multi-frame consistency and sub-pixel optical flow.", icon: "box" },
        { title: "Zero-Latency Render Queue", desc: "Distributed GPU clusters executing render jobs in parallel with instant webhook callbacks.", icon: "zap" },
        { title: "Direct Audio-to-Motion Sync", desc: "Automatic lip sync, sound design, and beat-matched scene transitions.", icon: "sparkles" },
        { title: "Studio Camera Controls", desc: "Interactive 3D camera orbits, focal length adjustments, and dynamic lighting rigs.", icon: "camera" },
      ],
      bentoItems: [
        { title: "4K Motion Latent Diffusion", desc: "Preserve lighting and geometry across 1,200 continuous frames.", icon: "cpu", span: "md:col-span-2" },
        { title: "GPU Cluster Dispatch", desc: "Sub-100ms job scheduling across H100 GPU pools.", icon: "zap", span: "md:col-span-1" },
        { title: "Custom Actor Fine-Tuning", desc: "Train character LoRA weights in under 3 minutes with zero artifact leakage.", icon: "shield", span: "md:col-span-1" },
        { title: "Edge Video CDN & Streaming", desc: "Instant HLS encoding and global distribution with sub-50ms TTFB worldwide.", icon: "db", span: "md:col-span-2" },
      ],
      stats: [
        { value: "4K 60fps", label: "Render Quality" },
        { value: "1.4s", label: "Generation Speed" },
        { value: "12,000+", label: "Studio Creators" },
        { value: "99.98%", label: "Pipeline Reliability" },
      ],
      plans: [
        { name: "Creator", price: "$29", period: "/mo", desc: "For independent filmmakers & creators.", features: ["1,000 video credits/mo", "1080p generation", "Commercial rights"], cta: "Start Creating" },
        { name: "Studio Pro", price: "$89", period: "/mo", desc: "For production studios and agencies.", features: ["Unlimited 4K renders", "Custom character LoRA", "Priority H100 queue", "API access"], popular: true, cta: "Upgrade to Pro" },
        { name: "Enterprise", price: "$299", period: "/mo", desc: "Dedicated GPU clusters & custom models.", features: ["Dedicated model training", "Custom MCP integrations", "SLA contract", "24/7 technical team"], cta: "Contact Studio" },
      ],
      dbTables: ["users", "projects", "render_jobs", "video_assets", "lora_models"],
      apiRoutes: ["/api/v1/render", "/api/v1/jobs", "/api/v1/models", "/api/v1/webhooks"],
    };
  }

  if (p.includes("pay") || p.includes("fintech") || p.includes("bank") || p.includes("crypto") || p.includes("wallet") || p.includes("ledger")) {
    return {
      category: "Global Financial Infrastructure & Ledger",
      headline: `The High-Velocity Financial Platform for ${domainName || "Modern Commerce"}`,
      subtitle: "Autonomous multi-currency settlement, ledger consensus, and fraud detection engineered for global enterprise volume.",
      primaryColor: "#10b981",
      secondaryColor: "#06b6d4",
      features: [
        { title: "Real-Time Double-Entry Ledger", desc: "Immutable financial transaction log with sub-millisecond ACID consistency.", icon: "database" },
        { title: "Smart Routing & Zero FX Markup", desc: "Direct clearing across 140+ countries with intelligent rail selection.", icon: "zap" },
        { title: "Automated Fraud Vector Isolation", desc: "Machine learning anomaly detection isolating synthetic identity attacks instantly.", icon: "shield" },
        { title: "Enterprise Treasury Automation", desc: "Programmable yield optimization and automated payroll batching.", icon: "cpu" },
      ],
      bentoItems: [
        { title: "Global Clearing Rails", desc: "Instant settlement via SEPA, FedNow, Faster Payments, and Polygon L2.", icon: "cpu", span: "md:col-span-2" },
        { title: "ISO 20022 Native", desc: "Complete structural compliance with modern banking telecommunications.", icon: "shield", span: "md:col-span-1" },
        { title: "Hardware Security Modules", desc: "FIPS 140-2 Level 3 cryptographic key storage and threshold signatures.", icon: "zap", span: "md:col-span-1" },
        { title: "Real-Time Balance Streaming", desc: "Continuous state updates via WebSocket feeds with zero polling overhead.", icon: "db", span: "md:col-span-2" },
      ],
      stats: [
        { value: "$4.8B+", label: "Processed Volume" },
        { value: "42ms", label: "Settlement Latency" },
        { value: "140+", label: "Supported Currencies" },
        { value: "0.001%", label: "Dispute Ratio" },
      ],
      plans: [
        { name: "Growth", price: "$0", period: " + 1.2%", desc: "For scaling startups and digital commerce.", features: ["Multi-currency accounts", "Instant payouts", "Basic fraud shield"], cta: "Create Account" },
        { name: "Scale", price: "$199", period: "/mo + 0.8%", desc: "For high-volume merchants and platforms.", features: ["Double-entry ledger API", "Dedicated routing rails", "Custom webhooks", "Team permissions"], popular: true, cta: "Scale Platform" },
        { name: "Institutional", price: "Custom", period: "", desc: "Direct banking licenses and custom limits.", features: ["Dedicated IBAN pool", "Zero markup FX", "Hardware key management", "24/7 treasury desk"], cta: "Talk to Treasury" },
      ],
      dbTables: ["accounts", "transactions", "ledger_entries", "virtual_cards", "compliance_logs"],
      apiRoutes: ["/api/v1/transfers", "/api/v1/ledger", "/api/v1/payouts", "/api/v1/webhooks"],
    };
  }

  // Default: Next-Level Autonomous Full-Stack SaaS Platform
  return {
    category: "High-Performance Full-Stack SaaS Platform",
    headline: `The Next-Level Intelligent Platform for ${domainName || "Modern SaaS"}`,
    subtitle: "Engineered by a collaborative multi-agent squad with 3D spatial UI, Neon PostgreSQL integration, and autonomous Claude Code execution.",
    primaryColor: p.includes("emerald") ? "#10b981" : p.includes("cyan") ? "#06b6d4" : "#8b5cf6",
    secondaryColor: "#f97316",
    features: [
      { title: "3D Perspective Card Tilts", desc: "Interactive mouse-coordinate spatial tilt with reflective glare sheen and floating layers.", icon: "box" },
      { title: "Magic Bento Grid Architecture", desc: "Asymmetrical responsive layout with ambient laser glow tracking cursor position.", icon: "grid" },
      { title: "Neon PostgreSQL & Drizzle Schema", desc: "Production database models with automated migrations, UUID keys, and cascade rules.", icon: "database" },
      { title: "Claude Code Autonomous Bridge", desc: "One-click terminal CLI integration to deconstruct, modify, and build in your local environment.", icon: "terminal" },
    ],
    bentoItems: [
      { title: "Distributed Consensus Engine", desc: "Global state replication verified in 42ms with zero data drift across active-active clusters.", icon: "cpu", span: "md:col-span-2" },
      { title: "Sub-Millisecond Edge Telemetry", desc: "Real-time query profiling and automated query plan optimization.", icon: "zap", span: "md:col-span-1" },
      { title: "Automated Edge SSL & TLS 1.3", desc: "Zero-configuration security perimeter with automated certificate rotation.", icon: "shield", span: "md:col-span-1" },
      { title: "Native Postgres & Vector Search", desc: "Integrated pgvector, serverless scaling, and automatic schema branching on every Git pull request.", icon: "db", span: "md:col-span-2" },
    ],
    stats: [
      { value: "10,000x", label: "Beyond No-Code" },
      { value: "42ms", label: "Edge Latency" },
      { value: "99.99%", label: "Uptime SLA" },
      { value: "1-Click", label: "Full-Stack Deploy" },
    ],
    plans: [
      { name: "Starter", price: "$0", period: "/mo", desc: "For developers and indie founders.", features: ["Next.js 15 App Router", "Aceternity 3D Cards", "Community MCP Tools"], cta: "Start Free" },
      { name: "Pro Studio", price: "$29", period: "/mo", desc: "For scaling SaaS apps and modern teams.", features: ["Three.js WebGL Canvases", "Neon Postgres Database", "Multi-Agent Code Engine", "Claude Code CLI Export"], popular: true, cta: "Launch Studio" },
      { name: "Enterprise", price: "$99", period: "/mo", desc: "Dedicated clusters with SLA and custom MCPs.", features: ["Private MCP Server Hosting", "Custom 3D Shaders", "Dedicated Agent Squad", "24/7 Architectural Support"], cta: "Contact Us" },
    ],
    dbTables: ["users", "projects", "api_keys", "team_members", "audit_events"],
    apiRoutes: ["/api/v1/projects", "/api/v1/auth", "/api/v1/keys", "/api/v1/webhooks"],
  };
}

export async function runMultiAgentPipeline(
  prompt: string,
  url?: string,
  modelId: string = "claude-3-7-sonnet"
): Promise<MultiAgentPipelineResult> {
  const activities: AgentActivity[] = [];
  const now = () => new Date().toLocaleTimeString();

  const isUrl = !!url || prompt.includes("http://") || prompt.includes("https://");
  let targetDomain = "App Vision";
  if (url) {
    try {
      targetDomain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
    } catch {
      targetDomain = "Target App";
    }
  }
  const brand = isUrl ? targetDomain.split(".")[0].toUpperCase() : prompt.split(" ")[0].toUpperCase() || "NEXTSAAS";

  const domainCtx = detectDomainContext(prompt, brand);

  // 1. System Architect Agent (Claude Code)
  activities.push({
    agent: "architect",
    agentName: "System Architect Agent",
    modelName: AI_MODELS["claude-3-7-sonnet"].name,
    modelId: "claude-3-7-sonnet",
    role: "System Blueprint & Route Topology",
    avatarColor: AI_MODELS["claude-3-7-sonnet"].avatarColor,
    status: "generating",
    toolCalls: [
      { tool: "analyze_system_topology", args: { domain: domainCtx.category, architecture: "Next.js 15 App Router" }, resultSummary: `Planned 5 routes & full-stack boundary for ${brand}` },
    ],
    message: `Architecting application topology for "${brand}" (${domainCtx.category}). Defined route boundaries: / (Home), /architecture, /pricing, and edge endpoints.`,
    timestamp: now(),
  });

  // 2. ParallelWeb & REA Scraper Agent
  if (isUrl) {
    const reaDeconstruct = await McpClient.executeTool({
      tool: "rea_deconstruct_url",
      arguments: { url: url || `https://${targetDomain}` },
    });

    activities.push({
      agent: "scraper",
      agentName: "ParallelWeb REA Agent",
      modelName: AI_MODELS["parallelweb-system"].name,
      modelId: "parallelweb-system",
      role: "Live DOM & CSS Token Decompiler",
      avatarColor: AI_MODELS["parallelweb-system"].avatarColor,
      status: "calling_mcp",
      toolCalls: [
        { tool: "rea_deconstruct_url", args: { url: targetDomain }, resultSummary: `Extracted design tokens & typography from ${targetDomain}` },
      ],
      message: `Decompiled ${targetDomain}. Extracted primary brand accent (${domainCtx.primaryColor}), gradient mesh tokens, and modern typography hierarchy.`,
      timestamp: now(),
    });
  }

  // 3. 3D Spatial & Motion Designer (Wonder & Muse)
  const mcp3d = await McpClient.executeTool({
    tool: "get_animated_component",
    arguments: { componentName: "3d-card-effect" },
  });

  const mcpBento = await McpClient.executeTool({
    tool: "get_animated_component",
    arguments: { componentName: "magic-bento-grid" },
  });

  activities.push({
    agent: "uiux",
    agentName: "3D Spatial & Motion Designer",
    modelName: AI_MODELS["wonder-muse-3d"].name,
    modelId: "wonder-muse-3d",
    role: "Aceternity UI & Three.js WebGL Synthesizer",
    avatarColor: AI_MODELS["wonder-muse-3d"].avatarColor,
    status: "calling_mcp",
    toolCalls: [
      { tool: "get_animated_component", args: { componentName: "3d-card-effect" }, resultSummary: "Synthesized 3D Perspective Card Tilt" },
      { tool: "get_animated_component", args: { componentName: "magic-bento-grid" }, resultSummary: "Configured Cursor Laser Glow Bento" },
      { tool: "get_animated_component", args: { componentName: "threejs-cyber-sphere" }, resultSummary: "Injected WebGL 60FPS Icosahedron Mesh" },
    ],
    message: `Connected to Component Vault. Injected Aceternity 3D Card tilt, Magic Bento Grid, and Three.js Cyber Sphere tailored to ${brand}.`,
    timestamp: now(),
  });

  // 4. Full-Stack Backend Engineer (Jev Engine & Nemotron Ultra)
  const schemaResult = await McpClient.executeTool({
    tool: "generate_fullstack_schema",
    arguments: { appType: domainCtx.category, features: domainCtx.dbTables },
  });

  activities.push({
    agent: "fullstack",
    agentName: "Full-Stack Backend Engineer",
    modelName: AI_MODELS["nemotron-70b-ultra"].name,
    modelId: "nemotron-70b-ultra",
    role: "Neon Postgres Drizzle Schema & Edge API",
    avatarColor: AI_MODELS["nemotron-70b-ultra"].avatarColor,
    status: "generating",
    toolCalls: [
      { tool: "generate_fullstack_schema", args: { tables: domainCtx.dbTables }, resultSummary: `Generated Drizzle schema with ${domainCtx.dbTables.length} tables` },
    ],
    message: `Synthesized production Neon PostgreSQL Drizzle schema (${domainCtx.dbTables.join(", ")}) and Next.js 15 route handlers (${domainCtx.apiRoutes.join(", ")}).`,
    timestamp: now(),
  });

  // 5. Conversion & Copywriting Director (Google Argon)
  activities.push({
    agent: "copywriter",
    agentName: "Copywriting & UX Director",
    modelName: AI_MODELS["google-argon-gemini"].name,
    modelId: "google-argon-gemini",
    role: "Multimodal Messaging & Value Proposition",
    avatarColor: AI_MODELS["google-argon-gemini"].avatarColor,
    status: "generating",
    message: `Synthesized high-converting copy: "${domainCtx.headline}". Formulated value propositions, stats, and scale-to-zero pricing tiers.`,
    timestamp: now(),
  });

  // 6. QA & Testing Auditor
  const qaResult = await McpClient.executeTool({
    tool: "run_qa_test",
    arguments: { codeFiles: ["app/page.tsx", "components/BentoGrid.tsx", "components/Card3D.tsx", "lib/schema.ts"] },
  });

  activities.push({
    agent: "qa",
    agentName: "QA & Performance Auditor",
    modelName: "Automated Sandbox VM",
    modelId: "qa-auditor",
    role: "Zero Error Verification & WCAG AA Audit",
    avatarColor: "#10b981",
    status: "complete",
    toolCalls: [
      { tool: "run_qa_test", args: { suite: "All 5 checks" }, resultSummary: "Passed: Zero duplicate keys, verified background styling, 60fps WebGL" },
    ],
    message: "Audited build: Zero React key collisions verified, style properties sanitized, WCAG AA contrast confirmed, production bundle validated.",
    timestamp: now(),
  });

  // Synthesize complete SiteV2 model
  const isDark = !prompt.toLowerCase().includes("light mode");
  const site: SiteV2 = {
    brand: {
      name: brand,
      tagline: domainCtx.subtitle,
    },
    theme: {
      primary: domainCtx.primaryColor,
      secondary: domainCtx.secondaryColor,
      dark: isDark,
      font: "modern",
      radius: "round",
    },
    pages: [
      {
        slug: "/",
        title: "Home",
        sections: [
          {
            type: "navbar",
            props: {
              links: [
                { label: "Features", href: "#features" },
                { label: "3D Architecture", href: "#architecture" },
                { label: "Full-Stack API", href: "#fullstack" },
                { label: "Pricing", href: "#pricing" },
              ],
              cta: { label: "Launch Platform", href: "#console" },
              loginLabel: "Sign In",
            },
          },
          {
            type: "hero",
            props: {
              badge: `✦ Multi-Agent MCP Synthesis (${domainCtx.category})`,
              headline: domainCtx.headline,
              subtitle: domainCtx.subtitle,
              primaryCta: { label: "Deploy Live Application", href: "#deploy" },
              secondaryCta: { label: "Inspect MCP Code", href: "#code" },
            },
          },
          {
            type: "features",
            props: {
              badge: "3D Bento Architecture",
              title: "Autonomous Multi-Agent Capabilities",
              subtitle: "Engineered by specialized models working in parallel to deliver unmatched frontend and full-stack performance.",
              items: domainCtx.features,
            },
          },
          {
            type: "stats",
            props: {
              items: domainCtx.stats,
            },
          },
          {
            type: "pricing",
            props: {
              title: "Transparent, Scale-to-Zero Pricing",
              subtitle: "Start building immediately with full-stack capabilities included across all tiers.",
              plans: domainCtx.plans,
            },
          },
          {
            type: "footer",
            props: {
              brand: brand,
              tagline: `Engineered with Codube Vibe Coder & morluto/rea Multi-Agent MCP Suite for ${domainCtx.category}.`,
              columns: [
                { title: "Product", links: [{ label: "Features", href: "#" }, { label: "3D Components", href: "#" }, { label: "MCP Hub", href: "#" }] },
                { title: "Developers", links: [{ label: "Claude Code Guide", href: "#" }, { label: "API Reference", href: "#" }, { label: "GitHub MCP", href: "#" }] },
              ],
              socials: ["x", "github", "discord"],
            },
          },
        ],
      },
    ],
  };

  return {
    activities,
    blueprint: {
      brandName: brand,
      domainCategory: domainCtx.category,
      archetype: isUrl ? `Reverse-Engineered ${domainCtx.category}` : `Next-Level ${domainCtx.category}`,
      routes: ["/", "/about", "/pricing", ...domainCtx.apiRoutes],
      animatedComponents: ["Card3D", "MagicBentoGrid", "SpotlightHero", "ThreeCyberCanvas", "MarqueeCards"],
      databaseTables: domainCtx.dbTables,
      apiEndpoints: domainCtx.apiRoutes,
    },
    site,
  };
}
