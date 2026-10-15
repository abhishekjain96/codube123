import type { SiteV2 } from "@/lib/siteTypes";

const nav = {
  type: "navbar",
  props: {
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Our Story", href: "/about" },
    ],
    cta: { label: "Order now", href: "/shop" },
    loginLabel: "Login",
  },
};

const footer = {
  type: "footer",
  props: {
    tagline: "Cold-pressed coconut oil and whole spices, straight from Kochi.",
    columns: [
      { title: "Shop", links: [{ label: "Coconut oil", href: "/shop" }, { label: "Spices", href: "/shop" }] },
      { title: "Company", links: [{ label: "Our story", href: "/about" }, { label: "Contact", href: "/about" }] },
    ],
    socials: ["instagram", "youtube"],
  },
};

const cta = {
  type: "cta-banner",
  props: {
    title: "Taste the Malabar coast at home",
    subtitle: "Free shipping on orders above ₹999. Fresh batches every week.",
    cta: { label: "Shop the collection", href: "/shop" },
  },
};

const products = {
  type: "product-grid",
  props: {
    title: "Small-batch favourites",
    subtitle: "Packed within 48 hours of pressing.",
    items: [
      { title: "Virgin Coconut Oil 500ml", description: "Cold-pressed from fresh Kerala coconuts.", price: "₹549", badge: "Bestseller" },
      { title: "Malabar Black Pepper 200g", description: "Bold, sharp and sun-dried.", price: "₹299" },
      { title: "Green Cardamom 100g", description: "Hand-picked from Idukki hills.", price: "₹449", badge: "New" },
      { title: "Cinnamon Quills 150g", description: "Sweet, delicate, true Ceylon-style.", price: "₹259" },
    ],
  },
};

export const sampleSite: SiteV2 = {
  brand: { name: "Kochi Spice Co", tagline: "Pressed and packed in Kerala" },
  theme: { primary: "#b45309", secondary: "#15803d", dark: false, font: "elegant", radius: "soft" },
  pages: [
    {
      slug: "/",
      title: "Home",
      sections: [
        nav,
        {
          type: "hero-split",
          props: {
            badge: "Fresh from Kochi",
            title: "Kerala’s kitchen, delivered to yours.",
            subtitle: "Cold-pressed coconut oil and hand-picked spices from family farms along the Malabar coast.",
            primaryCta: { label: "Shop now", href: "/shop" },
            secondaryCta: { label: "Our story", href: "/about" },
            imageAlt: "Coconut oil and spices on a wooden table",
          },
        },
        {
          type: "stats",
          props: {
            items: [
              { value: "12k+", label: "Happy kitchens" },
              { value: "40", label: "Partner farms" },
              { value: "48h", label: "Farm to pack" },
              { value: "4.9★", label: "Average rating" },
            ],
          },
        },
        {
          type: "features-bento",
          props: {
            title: "Why our kitchens trust us",
            subtitle: "Every jar is traceable back to a family farm.",
            items: [
              { icon: "leaf", title: "Farm-traceable", description: "Scan the batch code and meet the family who grew it." },
              { icon: "droplets", title: "Cold-pressed", description: "Never heated above 40°C." },
              { icon: "truck", title: "Pan-India shipping", description: "Delivered in 3 to 5 days." },
              { icon: "shield-check", title: "Lab tested", description: "Purity reports for every batch." },
              { icon: "recycle", title: "Plastic-free packs", description: "Glass jars and paper pouches." },
            ],
          },
        },
        products,
        {
          type: "testimonials",
          props: {
            title: "Loved across India",
            items: [
              { quote: "The coconut oil smells like my grandmother’s kitchen in Thrissur.", name: "Anita Menon", role: "Home cook, Bengaluru" },
              { quote: "Best pepper I have bought online. Truly fresh.", name: "Rohan Gupta", role: "Chef, Delhi" },
              { quote: "Packaging is beautiful and the cardamom is unreal.", name: "Sneha Iyer", role: "Food blogger, Mumbai" },
            ],
          },
        },
        cta,
        footer,
      ],
    },
    { slug: "/shop", title: "Shop", sections: [nav, products, cta, footer] },
    {
      slug: "/about",
      title: "Our Story",
      sections: [
        nav,
        {
          type: "hero-center",
          props: {
            badge: "Since 2014",
            title: "Three generations. One coast. One promise.",
            subtitle: "We started with a single coconut grove in Kochi and a belief that good food begins at the farm.",
            primaryCta: { label: "Shop the collection", href: "/shop" },
          },
        },
        { type: "pricing", props: {} },
        footer,
      ],
    },
  ],
};