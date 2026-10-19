import type { Section } from "@/components/SiteRenderer";

export type Addable = {
  type: string;
  label: string;
  icon: string;
  category: "all" | "3d" | "conversion" | "core";
  badge?: string;
  make: () => Section;
};

export const ADDABLE: Addable[] = [
  {
    type: "hero",
    label: "3D Split Hero",
    icon: "🔥",
    category: "3d",
    badge: "Popular",
    make: () => ({
      type: "hero",
      badge: "★ New Generation Platform",
      title: "Build the future of digital experiences",
      subtitle: "Experience high-performance, modular components with interactive 3D aesthetics.",
      cta: "Get Started Free",
      cta2: "Live Demo",
    }),
  },
  {
    type: "bento",
    label: "Bento Feature Grid",
    icon: "⚡",
    category: "3d",
    badge: "Trending",
    make: () => ({
      type: "bento",
      title: "Everything you need to scale",
      subtitle: "Engineered from the ground up for speed, precision, and modern workflows.",
      items: [
        { icon: "zap", title: "Real-time Sync", description: "Collaborate seamlessly across all devices." },
        { icon: "shield", title: "Enterprise Grade", description: "SOC2 Type II certified security built in." },
        { icon: "sparkles", title: "Smart Automation", description: "Save hours every week with intelligent flows." },
        { icon: "layers", title: "Modular Architecture", description: "Effortlessly adapt to any business scale." },
      ],
    }),
  },
  {
    type: "marquee",
    label: "Logo & Badge Marquee",
    icon: "🌊",
    category: "3d",
    badge: "Motion",
    make: () => ({
      type: "marquee",
      title: "Trusted by forward-thinking teams worldwide",
      bullets: ["Google Cloud", "Stripe", "Vercel", "Supabase", "Linear", "Figma", "OpenAI"],
    }),
  },
  {
    type: "stats",
    label: "Metric Counter Grid",
    icon: "📊",
    category: "conversion",
    badge: "Proof",
    make: () => ({
      type: "stats",
      items: [
        { value: "99.99%", label: "Uptime Reliability" },
        { value: "<15ms", label: "Edge Latency" },
        { value: "50,000+", label: "Active Teams" },
        { value: "4.9★", label: "Customer Rating" },
      ],
    }),
  },
  {
    type: "products",
    label: "Showcase & Product Grid",
    icon: "🛍️",
    category: "conversion",
    badge: "Commerce",
    make: () => ({
      type: "products",
      title: "Featured Products & Highlights",
      subtitle: "Explore our handpicked collection with instant ordering.",
      items: [
        { title: "Standard Edition", description: "Essential tools for individuals and solo founders.", price: "$29/mo", badge: "Starter" },
        { title: "Pro Suite", description: "Complete toolset with automation and unlimited bandwidth.", price: "$79/mo", badge: "Most Popular" },
        { title: "Enterprise Tier", description: "Dedicated infrastructure, SLAs, and custom integrations.", price: "Custom", badge: "Scale" },
      ],
    }),
  },
  {
    type: "pricing",
    label: "Interactive Pricing Table",
    icon: "💎",
    category: "conversion",
    badge: "High ROI",
    make: () => ({
      type: "pricing",
      title: "Simple, transparent pricing",
      subtitle: "Choose the plan that fits your growth. Cancel or upgrade anytime.",
      items: [
        {
          title: "Starter",
          price: "$19",
          description: "Perfect for testing and small projects.",
          features: ["Up to 3 projects", "Core component library", "Community support"],
          cta: "Start Free",
        },
        {
          title: "Pro",
          price: "$49",
          highlighted: true,
          description: "Best for growing startups and professional creators.",
          features: ["Unlimited projects", "Full Next.js source code export", "Priority edge support", "Custom domains"],
          cta: "Upgrade to Pro",
        },
        {
          title: "Enterprise",
          price: "$199",
          description: "For teams with high volume and compliance needs.",
          features: ["Dedicated account manager", "Custom SLA & SSO", "Audit logs & RBAC", "Bespoke design tokens"],
          cta: "Contact Sales",
        },
      ],
    }),
  },
  {
    type: "testimonials",
    label: "Customer Reviews & Wall",
    icon: "💬",
    category: "conversion",
    badge: "Trust",
    make: () => ({
      type: "testimonials",
      title: "Loved by creators across the globe",
      items: [
        { quote: "Codube reduced our launch time from 3 weeks to 15 minutes.", name: "Sarah Lin", role: "Product Director" },
        { quote: "The visual polish and generated code quality are genuinely incredible.", name: "Marcus Reed", role: "Full-Stack Engineer" },
        { quote: "Our conversion rate jumped 42% after switching to this design.", name: "Elena Rostova", role: "Growth Lead" },
      ],
    }),
  },
  {
    type: "faq",
    label: "Accordion FAQ",
    icon: "❓",
    category: "core",
    make: () => ({
      type: "faq",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about getting started.",
      items: [
        { question: "Can I export the full Next.js source code?", answer: "Yes, you can download a complete Next.js 15 App Router ZIP bundle anytime." },
        { question: "How does URL reverse engineering work?", answer: "Codube extracts DOM structure, layout hierarchies, and color tokens, then redesigns them into modern React components." },
        { question: "Can I use custom domains?", answer: "Yes, you can deploy to Vercel, Netlify, Cloudflare, or link any custom domain." },
      ],
    }),
  },
  {
    type: "cta",
    label: "Call to Action Banner",
    icon: "🚀",
    category: "core",
    badge: "Essential",
    make: () => ({
      type: "cta",
      title: "Ready to launch your vision?",
      subtitle: "Join thousands of teams shipping faster with Codube.",
      cta: "Get Started Now",
      cta2: "Schedule Demo",
    }),
  },
  {
    type: "split",
    label: "Visual Split Section",
    icon: "🖼️",
    category: "core",
    make: () => ({
      type: "split",
      title: "Built with obsessive attention to detail",
      subtitle: "Every pixel, transition, and responsive breakpoint is carefully crafted for maximum visual impact.",
      cta: "Learn More",
    }),
  },
];
