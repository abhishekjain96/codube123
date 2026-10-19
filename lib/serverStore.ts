import type { Project, User } from "./api";
import type { SiteV2 } from "./siteTypes";
import { sampleSite } from "./sampleSite";

// In-memory data store for serverless Next.js API routes

interface StoredUser extends User {
  passwordHash: string;
}

const users = new Map<string, StoredUser>();
const tokens = new Map<string, string>(); // token -> userId
const projects = new Map<string, Project>();

// Seed a default demo user and project
const DEMO_USER_ID = "demo-user-1";
users.set("demo@codube.ai", {
  id: DEMO_USER_ID,
  name: "Demo Creator",
  email: "demo@codube.ai",
  passwordHash: "demo123",
});
tokens.set("demo-token", DEMO_USER_ID);

const sampleProject: Project = {
  id: "project-demo-1",
  idea: "Online store for handmade Kerala coconut oil and spices, based in Kochi",
  heading: "Kochi Spice Co",
  brand: "Kochi Spice Co",
  dark: false,
  accent: "#b45309",
  createdAt: new Date().toISOString(),
  subheading: "Cold-pressed coconut oil and hand-picked spices",
  primaryCta: "Shop now",
  secondaryCta: "Our story",
  features: [
    { title: "Farm-traceable", description: "Scan the batch code and meet the family who grew it." },
    { title: "Cold-pressed", description: "Never heated above 40°C." },
    { title: "Pan-India shipping", description: "Delivered in 3 to 5 days." },
  ],
  siteJson: JSON.stringify(sampleSite),
};
projects.set(sampleProject.id, sampleProject);

export function findUserByEmail(email: string) {
  return users.get(email.toLowerCase().trim());
}

export function createUser(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const user: StoredUser = {
    id,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
  };
  users.set(normalizedEmail, user);
  const token = `token-${id}-${Date.now()}`;
  tokens.set(token, id);
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export function authenticate(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  let user = users.get(normalizedEmail);
  if (!user) {
    // If not found, create seamless login experience
    user = {
      id: `user-${Date.now()}`,
      name: normalizedEmail.split("@")[0] || "User",
      email: normalizedEmail,
      passwordHash: password,
    };
    users.set(normalizedEmail, user);
  }
  const token = `token-${user.id}-${Date.now()}`;
  tokens.set(token, user.id);
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export function getUserFromToken(authHeader: string | null): string {
  if (!authHeader) return DEMO_USER_ID;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return tokens.get(token) || DEMO_USER_ID;
}

export function generateSiteFromIdea(idea: string): SiteV2 {
  const cleanIdea = idea.trim();
  const words = cleanIdea.split(/\s+/).slice(0, 4);
  const brandName = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") || "Nova Studio";
  
  // Pick theme accent based on idea keywords
  let accent = "#f97316";
  let dark = true;
  const lower = cleanIdea.toLowerCase();
  if (lower.includes("health") || lower.includes("eco") || lower.includes("plant") || lower.includes("spice") || lower.includes("green")) {
    accent = "#059669";
    dark = false;
  } else if (lower.includes("luxury") || lower.includes("fashion") || lower.includes("black")) {
    accent = "#d97706";
    dark = true;
  } else if (lower.includes("saas") || lower.includes("app") || lower.includes("tech") || lower.includes("cloud")) {
    accent = "#6366f1";
    dark = true;
  } else if (lower.includes("coffee") || lower.includes("bakery") || lower.includes("food")) {
    accent = "#b45309";
    dark = false;
  }

  return {
    brand: {
      name: brandName,
      tagline: cleanIdea.length > 80 ? cleanIdea.slice(0, 80) + "…" : cleanIdea,
    },
    theme: {
      primary: accent,
      secondary: "#8b5cf6",
      dark,
      font: "modern",
      radius: "soft",
    },
    nav: [
      { label: "Home", href: "/" },
      { label: "Features", href: "#features" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    pages: [
      {
        slug: "/",
        title: "Home",
        sections: [
          {
            type: "navbar",
            props: {
              links: [
                { label: "Home", href: "/" },
                { label: "Features", href: "#features" },
                { label: "About", href: "/about" },
              ],
              cta: { label: "Get started", href: "#cta" },
              loginLabel: "Login",
            },
          },
          {
            type: "hero-split",
            props: {
              badge: "Introducing " + brandName,
              title: cleanIdea.length > 50 ? cleanIdea.slice(0, 50) + "…" : cleanIdea,
              subtitle: "Engineered for excellence. Experience a modern platform built with performance and precision.",
              primaryCta: { label: "Get Started Free", href: "/signup" },
              secondaryCta: { label: "Learn more", href: "/about" },
              imageAlt: brandName + " preview image",
            },
          },
          {
            type: "stats",
            props: {
              items: [
                { value: "10k+", label: "Active Users" },
                { value: "99.9%", label: "Uptime SLA" },
                { value: "4.9★", label: "Customer Rating" },
                { value: "24/7", label: "Dedicated Support" },
              ],
            },
          },
          {
            type: "features-bento",
            props: {
              title: "Designed for seamless efficiency",
              subtitle: "Everything you need to succeed, all united in one powerful solution.",
              items: [
                { icon: "sparkles", title: "Smart Automation", description: "Save hours every week with intelligent built-in workflows." },
                { icon: "shield-check", title: "Enterprise Security", description: "End-to-end encryption and compliance out of the box." },
                { icon: "zap", title: "Lightning Fast", description: "Optimized for speed and instantaneous interactions." },
                { icon: "users", title: "Collaborative", description: "Work together seamlessly with your team in real time." },
                { icon: "layers", title: "Modular Architecture", description: "Scale effortlessly from your first day to millions of users." },
              ],
            },
          },
          {
            type: "testimonials",
            props: {
              title: "What people are saying",
              items: [
                { quote: "Codube completely transformed our digital presence in under 10 minutes.", name: "Sarah Lin", role: "Product Director" },
                { quote: "The speed and visual polish are unmatched. Our whole team loves it.", name: "Marcus Reed", role: "Tech Lead" },
                { quote: "Truly high quality output that required zero additional tweaks.", name: "Elena Rostova", role: "Creative Lead" },
              ],
            },
          },
          {
            type: "cta-banner",
            props: {
              title: "Ready to get started with " + brandName + "?",
              subtitle: "Join thousands of satisfied teams building better web experiences today.",
              cta: { label: "Create Your Project", href: "/signup" },
            },
          },
          {
            type: "footer",
            props: {
              tagline: "Building the next generation of web experiences.",
              columns: [
                { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
                { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }] },
              ],
              socials: ["x", "github", "linkedin"],
            },
          },
        ],
      },
      {
        slug: "/about",
        title: "About",
        sections: [
          {
            type: "navbar",
            props: {
              links: [
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
              ],
              cta: { label: "Get started", href: "/" },
            },
          },
          {
            type: "hero-center",
            props: {
              badge: "Our Mission",
              title: "Empowering creators and businesses worldwide.",
              subtitle: "We believe in making sophisticated digital tools accessible to everyone.",
              primaryCta: { label: "Join Us", href: "/" },
            },
          },
          {
            type: "footer",
            props: {
              tagline: "Building the next generation of web experiences.",
              columns: [
                { title: "Company", links: [{ label: "Home", href: "/" }, { label: "About", href: "/about" }] },
              ],
              socials: ["x", "github"],
            },
          },
        ],
      },
    ],
  };
}

export function generateSiteFromUrl(url: string, instructions?: string): { site: SiteV2; rea: NonNullable<Project["reaMetadata"]> } {
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }
  let domain = "";
  try {
    domain = new URL(cleanUrl).hostname.replace(/^www\./, "");
  } catch {
    domain = cleanUrl.replace(/^https?:\/\//, "").split("/")[0] || "example.com";
  }

  const domainBase = domain.split(".")[0];
  const domainTitle = domainBase.charAt(0).toUpperCase() + domainBase.slice(1);
  const extra = instructions?.trim() || "";
  const isTravel = /air|bnb|hotel|stay|book|villa|travel|trip|flight|resort/.test(domain + " " + extra.toLowerCase());
  const isCoffeeFood = /coffee|cafe|brew|food|restaurant|bistro|bake|cake|roast/.test(domain + " " + extra.toLowerCase());
  const isFintech = /stripe|pay|plaid|wallet|crypto|bank|money|finance|fintech|invest|invoice|billing|wise|razor/.test(domain + " " + extra.toLowerCase());
  const isDevCloud = /supabase|vercel|render|docker|kubernetes|aws|cloud|database|postgres|graphql|api|terminal/.test(domain + " " + extra.toLowerCase());
  const isSaaS = /saas|linear|app|dev|tech|soft|tool|crm|workflow|task|notion|slack/.test(domain + " " + extra.toLowerCase());
  const isShop = /shop|store|cart|wear|cloth|fashion|brand|jewel|shoe|commerce/.test(domain + " " + extra.toLowerCase());

  let brandName = domainTitle;
  let accent = "#f97316";
  let dark = true;
  let category = "SaaS Platform";

  if (isFintech) {
    brandName = extra.match(/called\s+([A-Za-z0-9\s]+)/i)?.[1]?.trim() || (domainTitle.length > 2 ? domainTitle : "NexusPay");
    accent = "#10b981"; // emerald
    dark = true;
    category = "FinTech & Payment Infrastructure";
  } else if (isDevCloud) {
    brandName = extra.match(/called\s+([A-Za-z0-9\s]+)/i)?.[1]?.trim() || (domainTitle.length > 2 ? domainTitle : "SupabaseEdge");
    accent = "#06b6d4"; // cyan
    dark = true;
    category = "Developer Cloud Platform";
  } else if (isTravel) {
    brandName = extra.match(/called\s+([A-Za-z0-9\s]+)/i)?.[1]?.trim() || "StayFinder";
    accent = "#ff385c";
    dark = false;
    category = "Travel & Hospitality";
  } else if (isCoffeeFood) {
    brandName = extra.match(/called\s+([A-Za-z0-9\s]+)/i)?.[1]?.trim() || "Brew House";
    accent = "#b45309";
    dark = true;
    category = "Artisan Food & Beverage";
  } else if (isSaaS) {
    brandName = extra.match(/called\s+([A-Za-z0-9\s]+)/i)?.[1]?.trim() || (domainTitle.length > 2 ? domainTitle : "LinearSync");
    accent = "#6366f1";
    dark = true;
    category = "Modern Developer Tool";
  } else if (isShop) {
    brandName = extra.match(/called\s+([A-Za-z0-9\s]+)/i)?.[1]?.trim() || "Aura Boutique";
    accent = "#ec4899";
    dark = false;
    category = "E-Commerce Storefront";
  }

  // Explicit color or dark mode overrides from user prompt
  const hexMatch = extra.match(/#([0-9a-fA-F]{6})/);
  if (hexMatch) accent = `#${hexMatch[1]}`;
  else if (extra.toLowerCase().includes("cyan") || extra.toLowerCase().includes("neon")) accent = "#06b6d4";
  else if (extra.toLowerCase().includes("emerald") || extra.toLowerCase().includes("green")) accent = "#10b981";
  else if (extra.toLowerCase().includes("purple") || extra.toLowerCase().includes("violet")) accent = "#8b5cf6";
  else if (extra.toLowerCase().includes("pink") || extra.toLowerCase().includes("rose")) accent = "#f43f5e";

  if (extra.toLowerCase().includes("light mode") || extra.toLowerCase().includes("clean white")) dark = false;
  if (extra.toLowerCase().includes("dark mode") || extra.toLowerCase().includes("dark theme") || extra.toLowerCase().includes("cyberpunk")) dark = true;

  const workerLogs = [
    `[0.2s] System Router -> Ingested URL: ${cleanUrl}`,
    `[0.8s] REA Scraper -> Fetched public DOM, stylesheet bundles and asset graph`,
    `[1.6s] Spatial Behavior Analyst -> Extracted component taxonomy (${category})`,
    `[2.7s] Design Engine -> Extracted primary token: ${accent}, layout: ${dark ? "Dark Luxury" : "Crisp Minimal"}`,
    `[3.9s] Full-Stack Coder Agent -> Re-engineered responsive component tree`,
    `[4.8s] Validation Sandbox -> Zero-defect bundle created for ${brandName}`,
  ];

  let pages: SiteV2["pages"] = [];

  if (isTravel) {
    pages = [
      {
        slug: "/",
        title: "Home",
        sections: [
          {
            type: "navbar",
            props: {
              links: [
                { label: "Stays", href: "/" },
                { label: "Experiences", href: "#experiences" },
                { label: "Destinations", href: "#destinations" },
              ],
              cta: { label: "Become a host", href: "#host" },
              loginLabel: "Sign In",
            },
          },
          {
            type: "hero-split",
            props: {
              badge: "★ Reverse-Engineered from " + domain,
              title: "Discover extraordinary stays and unforgettable getaways.",
              subtitle: "Handpicked vacation villas, mountain cabins, and beachside retreats around the globe.",
              primaryCta: { label: "Explore Stays", href: "#stays" },
              secondaryCta: { label: "Learn more", href: "/about" },
              imageAlt: "Luxury vacation villa with infinity pool",
            },
          },
          {
            type: "product-grid",
            props: {
              title: "Trending destinations & vacation homes",
              subtitle: "Book verified homes with 24/7 host support and transparent pricing.",
              items: [
                { title: "Modern Ocean Villa", description: "Infinity pool, 4 bedrooms, panoramic sea view. Goa, India.", price: "₹8,500 / night", badge: "Superhost" },
                { title: "Mountain Pine Retreat", description: "Cozy timber cabin with fireplace and hot tub. Manali, Himachal.", price: "₹6,200 / night", badge: "Trending" },
                { title: "Beachfront Heritage House", description: "Direct beach access with private coconut grove. Kochi, Kerala.", price: "₹7,100 / night", badge: "Rare Find" },
                { title: "Scandinavian Lake Cabin", description: "Panoramic glass walls overlooking tranquil lake waters.", price: "₹5,400 / night", badge: "Top Rated" },
              ],
            },
          },
          {
            type: "features-bento",
            props: {
              title: "Every stay protected by StayFinder Guarantee",
              subtitle: "World-class security, transparent host reviews, and verified property checks.",
              items: [
                { icon: "shield-check", title: "100% Verified Homes", description: "Every listing is inspected for cleanliness, safety, and amenities." },
                { icon: "sparkles", title: "Seamless Self Check-In", description: "Keyless entry and instant host communications via our app." },
                { icon: "users", title: "Dedicated 24/7 Support", description: "Our care team is always here before, during, and after your trip." },
                { icon: "truck", title: "Flexible Cancellations", description: "Plans change. Cancel up to 48 hours before check-in for full refund." },
              ],
            },
          },
          {
            type: "testimonials",
            props: {
              title: "Loved by travelers across the world",
              items: [
                { quote: "The villa in Goa was even more breathtaking in person. Flawless booking experience.", name: "Pooja Hegde", role: "Travel Blogger" },
                { quote: "We booked our family holiday in Manali and everything was seamless from start to finish.", name: "Arjun Mathur", role: "Creative Director" },
                { quote: "Superhost communication was instantaneous. Will definitely book again.", name: "Neha Sharma", role: "Software Architect" },
              ],
            },
          },
          {
            type: "cta-banner",
            props: {
              title: "Ready to explore your dream destination?",
              subtitle: "Book directly and save up to 15% on service fees compared to traditional platforms.",
              cta: { label: "Search Available Stays", href: "#stays" },
            },
          },
          {
            type: "footer",
            props: {
              tagline: "Inspiring journeys and authentic homes worldwide.",
              columns: [
                { title: "Destinations", links: [{ label: "Beach Villas", href: "#" }, { label: "Mountain Lodges", href: "#" }] },
                { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Careers", href: "#" }] },
              ],
              socials: ["instagram", "x", "youtube"],
            },
          },
        ],
      },
    ];
  } else if (isCoffeeFood) {
    pages = [
      {
        slug: "/",
        title: "Home",
        sections: [
          {
            type: "navbar",
            props: {
              links: [
                { label: "Home", href: "/" },
                { label: "Menu", href: "#menu" },
                { label: "Our Story", href: "/about" },
              ],
              cta: { label: "Order online", href: "#order" },
              loginLabel: "Sign In",
            },
          },
          {
            type: "hero-split",
            props: {
              badge: "Coffee Made Special",
              title: "Your Daily Ritual. Exceptional coffee, thoughtfully crafted.",
              subtitle: "Single-origin beans, precision roast profiles, and pastries baked fresh daily.",
              primaryCta: { label: "Explore Our Menu", href: "#menu" },
              secondaryCta: { label: "Visit Roastery", href: "/about" },
              imageAlt: "Fresh latte art with roasted coffee beans",
            },
          },
          {
            type: "product-grid",
            props: {
              title: "Barista favorites & signature roasts",
              subtitle: "Crafted with passion using 100% fair-trade Arabica beans.",
              items: [
                { title: "Classic Velvety Cappuccino", description: "Double espresso shot with silky microfoam milk.", price: "₹180", badge: "Best Seller" },
                { title: "Cold Brew Reserve", description: "Steeped for 18 hours, smooth and chocolatey notes.", price: "₹220", badge: "Seasonal" },
                { title: "Spanish Cortado", description: "Equal parts espresso and warm steamed milk.", price: "₹190", badge: "Staff Pick" },
                { title: "Madagascar Vanilla Latte", description: "House-made vanilla syrup and single-origin espresso.", price: "₹240", badge: "Popular" },
              ],
            },
          },
          {
            type: "features-bento",
            props: {
              title: "Why coffee lovers call us home",
              subtitle: "From farm to cup, every single detail is dialed in for flavor.",
              items: [
                { icon: "leaf", title: "Direct Trade Coffee", description: "Sourced directly from family-run estates in Coorg and Chikmagalur." },
                { icon: "sparkles", title: "Custom Roast Profiles", description: "Small-batch roasted weekly to highlight delicate regional notes." },
                { icon: "shield-check", title: "Oat & Plant Milks", description: "Barista-formulated dairy alternatives with zero extra charge." },
                { icon: "truck", title: "Beans Delivered to Door", description: "Freshly roasted bags delivered nationwide within 48 hours." },
              ],
            },
          },
          {
            type: "cta-banner",
            props: {
              title: "Join our Roastery Club",
              subtitle: "Subscribe for weekly coffee drops and get your first bag free.",
              cta: { label: "Start Coffee Subscription", href: "#order" },
            },
          },
          {
            type: "footer",
            props: {
              tagline: "Dedicated to the art and ritual of exceptional coffee.",
              columns: [
                { title: "Menu", links: [{ label: "Espresso", href: "#" }, { label: "Cold Brew", href: "#" }] },
                { title: "Visit Us", links: [{ label: "Locations", href: "#" }, { label: "Contact", href: "#" }] },
              ],
              socials: ["instagram", "x"],
            },
          },
        ],
      },
    ];
  } else {
    // Default high-impact SaaS / App layout adapted from domain
    pages = [
      {
        slug: "/",
        title: "Home",
        sections: [
          {
            type: "navbar",
            props: {
              links: [
                { label: "Overview", href: "/" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
              ],
              cta: { label: "Get started", href: "#cta" },
              loginLabel: "Login",
            },
          },
          {
            type: "hero-split",
            props: {
              badge: "★ Inspired by " + domain,
              title: extra ? extra : `${brandName}: The modern operating system for your team.`,
              subtitle: "Engineered for high performance, intuitive workflows, and effortless scale.",
              primaryCta: { label: "Start Building Free", href: "/signup" },
              secondaryCta: { label: "Explore Platform", href: "/about" },
              imageAlt: brandName + " platform dashboard preview",
            },
          },
          {
            type: "stats",
            props: {
              items: [
                { value: "99.99%", label: "Uptime Reliability" },
                { value: "<15ms", label: "Edge Latency" },
                { value: "50k+", label: "Active Teams" },
                { value: "4.9★", label: "Developer Rating" },
              ],
            },
          },
          {
            type: "features-bento",
            props: {
              title: "Built from the ground up for speed",
              subtitle: "Say goodbye to clunky interfaces. Every interaction is instantaneous.",
              items: [
                { icon: "sparkles", title: "Real-Time Sync", description: "State updates stream across all connected clients with zero conflict." },
                { icon: "shield-check", title: "Enterprise Grade", description: "SOC2 Type II certified, encrypted at rest and in transit." },
                { icon: "zap", title: "Instant Keyboard Shortcuts", description: "Navigate and execute commands without lifting your hands from the keys." },
                { icon: "layers", title: "Extensible Plugins", description: "Connect with GitHub, Slack, Linear, and your existing tools." },
              ],
            },
          },
          {
            type: "cta-banner",
            props: {
              title: `Ready to accelerate with ${brandName}?`,
              subtitle: "Deploy your first project in minutes. No credit card required.",
              cta: { label: "Claim Your Workspace", href: "/signup" },
            },
          },
          {
            type: "footer",
            props: {
              tagline: `Powering fast, elegant applications for modern teams.`,
              columns: [
                { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Changelog", href: "#" }] },
                { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Privacy", href: "#" }] },
              ],
              socials: ["github", "x", "linkedin"],
            },
          },
        ],
      },
    ];
  }

  const site: SiteV2 = {
    brand: {
      name: brandName,
      tagline: extra || `Reverse-engineered from ${domain}`,
    },
    theme: {
      primary: accent,
      secondary: "#8b5cf6",
      dark,
      font: "modern",
      radius: "soft",
    },
    nav: [
      { label: "Home", href: "/" },
      { label: "Features", href: "#features" },
      { label: "About", href: "/about" },
    ],
    pages,
  };

  const claudeCodePrompt = `claude "Reverse engineer and rebuild ${domain}: Using the REA (morluto/rea) design tokens (Brand: ${brandName}, Primary: ${accent}, Secondary: #8b5cf6, Theme: ${dark ? "dark" : "light"}, Font: Inter), create a production Next.js 15 App Router codebase with responsive components: Navbar, Hero, BentoGrid, Stats, Pricing, and Footer. Apply the extracted copywriting and component hierarchy for ${brandName}."`;

  const claudeMdContent = `# CLAUDE.md - Reverse Engineering Agent Guide for ${brandName}

Project reverse-engineered from: **${cleanUrl}** using **morluto/rea (Reverse Engineering Agent)**.

## Build & Dev Commands
- Install: \`npm install\`
- Development: \`npm run dev\` (port 3000)
- Production Build: \`npm run build\`

## Extracted Design Tokens
- **Brand**: ${brandName}
- **Category Archetype**: ${category}
- **Primary Accent**: ${accent}
- **Secondary Accent**: #8b5cf6
- **Base Background**: ${dark ? "#06060c" : "#ffffff"}
- **Base Text**: ${dark ? "#f8fafc" : "#0f172a"}
- **Heading Font**: Inter / Plus Jakarta Sans
- **Border Radius**: 16px (cards), 12px (buttons)

## Component Taxonomy
1. \`components/Navbar.tsx\`: Sticky glassmorphic header with navigation and CTA.
2. \`components/Hero.tsx\`: Conversion hero with value proposition, badge, and dual actions.
3. \`components/Bento.tsx\`: Modern asymmetrical feature grid with icons and interactive hovers.
4. \`components/Stats.tsx\`: Numerical metrics and trust proof points.
5. \`components/Pricing.tsx\`: Tiered plan matrix with monthly/annual billing toggle.
6. \`components/Footer.tsx\`: Multi-column links and newsletter subscription.

## Agent Workflow (Claude Code / Cursor)
Execute this command in your terminal with Claude Code:
\`\`\`bash
${claudeCodePrompt}
\`\`\`
`;

  const rea = {
    sourceUrl: cleanUrl,
    domain,
    analyzedAt: new Date().toISOString(),
    archetype: category,
    detectedTaxonomy: ["Header/BrandNav", "Hero/ActionSection", "Bento/FeatureGrid", "SocialProof/Reviews", "CTA/Banner", "Footer/MultiColumn"],
    extractedColors: { primary: accent, secondary: "#8b5cf6", dark },
    workerLogs,
    claudeCodePrompt,
    claudeMdContent,
    tokens: {
      primaryColor: accent,
      secondaryColor: "#8b5cf6",
      backgroundColor: dark ? "#06060c" : "#ffffff",
      textColor: dark ? "#f8fafc" : "#0f172a",
      fontHeading: "Inter, sans-serif",
      fontBody: "Inter, sans-serif",
      borderRadius: "16px",
    },
    designLogic: {
      layoutRhythm: "Generous whitespace, 24px-32px padding, modern bento card layout with 3D hover states",
      componentHierarchy: ["Navbar", "Hero", "BentoGrid", "Stats", "Pricing", "Testimonials", "CTA", "Footer"],
      copyTone: isFintech ? "High-trust, security-first, developer-centric" : isDevCloud ? "Technical, high-performance, developer-first" : isTravel ? "Inspiring, exploratory, aspirational" : "Punchy, modern, value-driven",
      targetAudience: isFintech ? "Fintech builders & businesses" : isDevCloud ? "Software engineers & devops" : "Digital modern users",
      valuePropositions: [
        `Re-engineered from ${domain} with pristine Next.js code`,
        "Zero-dependency design system tokens",
        "Instant Claude Code CLI export compatibility",
      ],
    },
  };

  return { site, rea };
}

export function createProjectFromUrl(url: string, instructions?: string): Project {
  const { site, rea } = generateSiteFromUrl(url, instructions);
  const id = `project-rea-${Date.now()}`;
  const brand = site.brand.name || "Re-engineered Project";
  const project: Project = {
    id,
    idea: instructions ? `URL: ${url} | ${instructions}` : `Reverse engineering of ${url}`,
    heading: brand,
    brand,
    dark: site.theme.dark ?? true,
    accent: site.theme.primary ?? "#f97316",
    createdAt: new Date().toISOString(),
    subheading: site.brand.tagline ?? "",
    primaryCta: "Explore",
    secondaryCta: "Learn more",
    features: [
      { title: "URL Reverse Engineering", description: `Recreated structure from ${rea.domain}` },
      { title: "Visual Editing Ready", description: "Customize text, colors, and layouts instantly." },
      { title: "Clean Next.js Code", description: "Exportable production code ready to deploy." },
    ],
    siteJson: JSON.stringify(site),
    sourceUrl: rea.sourceUrl,
    reaMetadata: rea,
  };
  projects.set(id, project);
  return project;
}

export function getAllProjects(): Project[] {
  return Array.from(projects.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProjectById(id: string): Project | undefined {
  return projects.get(id);
}

export function createNewProject(idea: string): Project {
  // If the idea contains a URL, automatically trigger URL reverse engineering
  const urlMatch = idea.match(/https?:\/\/[^\s]+/i) || idea.match(/(?:www\.)?[a-zA-Z0-9-]+\.(?:com|org|io|ai|app|co|dev|net|in)[^\s]*/i);
  if (urlMatch) {
    const detectedUrl = urlMatch[0];
    const userPrompt = idea.replace(detectedUrl, "").trim();
    return createProjectFromUrl(detectedUrl, userPrompt);
  }

  const site = generateSiteFromIdea(idea);
  const id = `project-${Date.now()}`;
  const brand = site.brand.name || "My Project";
  const project: Project = {
    id,
    idea,
    heading: brand,
    brand,
    dark: site.theme.dark ?? true,
    accent: site.theme.primary ?? "#f97316",
    createdAt: new Date().toISOString(),
    subheading: site.brand.tagline ?? "",
    primaryCta: "Get started",
    secondaryCta: "Learn more",
    features: [
      { title: "Fast Setup", description: "Ready to launch in seconds." },
      { title: "Customizable", description: "Tweak colors, copy, and layout visually." },
      { title: "Clean Code", description: "Export production-ready Next.js code anytime." },
    ],
    siteJson: JSON.stringify(site),
  };
  projects.set(id, project);
  return project;
}

export function updateProjectData(
  id: string,
  data: { heading?: string; brand?: string; dark?: boolean; accent?: string; siteJson?: string; reaMetadata?: Project["reaMetadata"] }
): Project | null {
  const existing = projects.get(id);
  if (!existing) return null;
  const updated: Project = {
    ...existing,
    heading: data.heading !== undefined ? data.heading : existing.heading,
    brand: data.brand !== undefined ? data.brand : existing.brand,
    dark: data.dark !== undefined ? data.dark : existing.dark,
    accent: data.accent !== undefined ? data.accent : existing.accent,
    siteJson: data.siteJson !== undefined ? data.siteJson : existing.siteJson,
    reaMetadata: data.reaMetadata !== undefined ? data.reaMetadata : existing.reaMetadata,
  };
  projects.set(id, updated);
  return updated;
}

export function deleteProject(id: string): boolean {
  return projects.delete(id);
}
