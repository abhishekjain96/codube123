export interface AiModelConfig {
  id: string;
  name: string;
  provider: "Anthropic" | "Google" | "NVIDIA" | "Wonder/Muse" | "Jev Engine" | "ParallelWeb";
  badge: string;
  description: string;
  strengths: string[];
  contextWindow: string;
  recommendedFor: string;
  avatarColor: string;
}

export const AI_MODELS: Record<string, AiModelConfig> = {
  "claude-3-7-sonnet": {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet (Claude Code)",
    provider: "Anthropic",
    badge: "Agent & MCP Native",
    description: "State-of-the-art hybrid reasoning with direct Model Context Protocol tool calling, architectural code generation, and terminal CLI execution.",
    strengths: ["MCP Tool Orchestration", "Deep Refactoring", "Strict Next.js 15 App Router", "Full-Stack System Design"],
    contextWindow: "200k tokens",
    recommendedFor: "Autonomous coding & terminal CLI execution",
    avatarColor: "#6366f1",
  },
  "google-argon-gemini": {
    id: "google-argon-gemini",
    name: "Google Argon (Gemini 2.5 Pro / Flash)",
    provider: "Google",
    badge: "Multimodal Visual Core",
    description: "High-speed multimodal visual token extraction, layout decompilation, and conversion-optimized copywriting.",
    strengths: ["Sub-second latency", "Multimodal DOM & visual token extraction", "High-volume generation", "Punchy value copy"],
    contextWindow: "1M tokens",
    recommendedFor: "Instant site reverse-engineering & live previews",
    avatarColor: "#38bdf8",
  },
  "nemotron-70b-ultra": {
    id: "nemotron-70b-ultra",
    name: "Nemotron 70B Ultra",
    provider: "NVIDIA",
    badge: "Synthetic Data & Logic",
    description: "Optimized for dense synthetic code generations, database schemas, and microservice topologies.",
    strengths: ["Deterministic code syntax", "PostgreSQL DDL & DML", "Low error rate on complex state"],
    contextWindow: "128k tokens",
    recommendedFor: "Enterprise full-stack schemas & database rules",
    avatarColor: "#10b981",
  },
  "wonder-muse-3d": {
    id: "wonder-muse-3d",
    name: "Wonder & Muse Spatial Engine",
    provider: "Wonder/Muse",
    badge: "Three.js & 3D Spatial",
    description: "Specialized in WebGL shaders, Three.js particle systems, Aceternity-style 3D tilts, and spatial layout mathematics.",
    strengths: ["Three.js camera orbits", "WebGL shaders & physics", "Atmospheric lighting & glows", "Framer Motion math"],
    contextWindow: "64k tokens",
    recommendedFor: "Aceternity UI, 3D Canvas, and immersive animations",
    avatarColor: "#ec4899",
  },
  "jev-engine": {
    id: "jev-engine",
    name: "Jev Full-Stack Engine",
    provider: "Jev Engine",
    badge: "Next.js 15 App Router Pro",
    description: "Generates production-grade Next.js server actions, Drizzle ORM queries, type-safe API route handlers, and middleware.",
    strengths: ["Next.js 15 App Router", "Drizzle & Prisma ORM", "Edge API Endpoints", "Type-safe RPC"],
    contextWindow: "128k tokens",
    recommendedFor: "Backend logic, server actions, and edge API routes",
    avatarColor: "#f59e0b",
  },
  "parallelweb-system": {
    id: "parallelweb-system",
    name: "ParallelWeb System (morluto/rea)",
    provider: "ParallelWeb",
    badge: "Deep Web Decompiler",
    description: "Autonomous web scraper and token extractor that reverse-engineers live URLs, CSS stylesheets, and design hierarchies into React.",
    strengths: ["Live DOM crawling", "CSS token reconstruction", "Font & color reverse-engineering", "Layout decompilation"],
    contextWindow: "256k tokens",
    recommendedFor: "Reverse-engineering live sites (Linear, Stripe, Raycast)",
    avatarColor: "#8b5cf6",
  },
};

export function getAllModels(): AiModelConfig[] {
  return Object.values(AI_MODELS);
}
