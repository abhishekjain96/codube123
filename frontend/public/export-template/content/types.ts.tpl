// The shape of everything in content/site.ts. Edit the text there, not in the components.

export type NavLink = { label: string; href: string };

export type Theme = {
  accent: string;
  accent2: string;
  dark: boolean;
  font: "modern" | "elegant" | "bold" | "friendly";
  radius: "sharp" | "soft" | "round";
};

export type Item = {
  icon?: string;
  emoji?: string;
  image?: string;
  title?: string;
  description?: string;
  price?: string;
  badge?: string;
  value?: string;
  label?: string;
  quote?: string;
  name?: string;
  role?: string;
  question?: string;
  answer?: string;
  features?: string[];
  highlighted?: boolean;
  cta?: string;
  href?: string;
  size?: "large" | "small";
  stat?: string;
  change?: string;
};

export type Section = {
  type: string;
  variant?: string;
  image?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  cta?: NavLink;
  cta2?: NavLink;
  layout?: string;
  visual?: string;
  reverse?: boolean;
  bullets?: string[];
  items?: Item[];
  floaters?: string[];
  mode?: "login" | "signup";
  links?: string[];
  headers?: string[];
  rows?: string[][];
};

export type Page = {
  slug: string;
  path: string;
  name: string;
  sections: Section[];
};

export type FooterColumn = { title: string; links: NavLink[] };

export type Site = {
  brand: string;
  logo?: string;
  theme: Theme;
  navbar: { links: NavLink[]; cta?: NavLink };
  footer: {
    text?: string;
    newsletter: boolean;
    copyright: string;
    columns: FooterColumn[];
  };
  pages: Page[];
  features: { cart: boolean };
};
