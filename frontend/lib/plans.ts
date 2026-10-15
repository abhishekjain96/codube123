export type Plan = {
  name: string;
  monthly: number; // rupees per month
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  soon?: boolean;
};

// Prices are placeholders. Change them whenever you decide your real pricing.
export const plans: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    blurb: "Try Codube and design your first sites.",
    features: ["3 projects", "AI-designed multi-page website", "Click-to-edit canvas", "Upload your own images", "Preview mode"],
    cta: "Start for free",
    href: "/signup",
  },
  {
    name: "Pro",
    monthly: 999,
    blurb: "For founders and freelancers shipping real sites.",
    features: ["Unlimited projects", "More AI images and edits", "Production code export", "Priority generation", "Everything in Free"],
    cta: "Join the Pro waitlist",
    href: "/signup",
    highlighted: true,
    soon: true,
  },
  {
    name: "Team",
    monthly: 2999,
    blurb: "For agencies building for many clients.",
    features: ["Everything in Pro", "Team workspace", "Shared projects", "Brand kit", "Priority support"],
    cta: "Join the Team waitlist",
    href: "/signup",
    soon: true,
  },
];