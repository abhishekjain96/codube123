import type { SiteV2 } from "./siteTypes";

export const sampleSite: SiteV2 = {
  brand: {
    name: "Kochi Spice Co",
    tagline: "Cold-pressed coconut oil and hand-picked spices from Kerala",
  },
  theme: {
    primary: "#b45309",
    secondary: "#059669",
    dark: false,
    font: "modern",
    radius: "soft",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Spices", href: "/shop" },
    { label: "Our Story", href: "/about" },
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
              { label: "Shop", href: "/shop" },
              { label: "Our Story", href: "/about" },
            ],
            cta: { label: "Order Online", href: "/shop" },
            loginLabel: "Sign In",
          },
        },
        {
          type: "hero-split",
          props: {
            badge: "★ 100% Single Estate Harvest",
            title: "Hand-picked Kerala spices. Pressed fresh, packed pure.",
            subtitle:
              "Direct from smallholder farms in Wayanad and Idukki. Cold-pressed virgin coconut oil, sun-dried Tellicherry black pepper, and stone-ground turmeric.",
            primaryCta: { label: "Explore The Harvest", href: "/shop" },
            secondaryCta: { label: "Read Our Story", href: "/about" },
            imageAlt: "Kerala organic spices and cold pressed coconut oil",
          },
        },
        {
          type: "stats",
          props: {
            items: [
              { value: "48 Hrs", label: "Harvest to Press" },
              { value: "100%", label: "Traceable Batches" },
              { value: "12,000+", label: "Happy Households" },
              { value: "4.9★", label: "Average Rating" },
            ],
          },
        },
        {
          type: "product-grid",
          props: {
            title: "Seasonal Harvest Favorites",
            subtitle: "Small-batch farm goods packaged directly in reusable glass containers.",
            items: [
              {
                title: "Extra Virgin Coconut Oil (500ml)",
                description: "Centrifuge extracted from freshly grated coconut milk. Delicate aroma and buttery texture.",
                price: "₹450",
                badge: "Best Seller",
              },
              {
                title: "Tellicherry Bold Black Pepper (200g)",
                description: "Hand-harvested late harvest peppercorns with complex citrus and pine notes.",
                price: "₹380",
                badge: "Signature",
              },
              {
                title: "High-Curcumin Alleppey Turmeric (250g)",
                description: "Tested 5.8% natural curcumin content. Stone-milled slowly to retain essential oils.",
                price: "₹290",
                badge: "Farm Direct",
              },
              {
                title: "Green Cardamom Extra Bold (100g)",
                description: "Jumbo 8mm pods with intense menthol-sweet aroma dried over wood fire.",
                price: "₹620",
                badge: "Limited Batch",
              },
            ],
          },
        },
        {
          type: "features-bento",
          props: {
            title: "Why Kerala spices are revered worldwide",
            subtitle: "Rooted in rich tropical monsoon soil, traditional shade farming, and zero adulteration.",
            items: [
              {
                icon: "shield-check",
                title: "Tested for Zero Adulteration",
                description: "Every single lot undergoes lab chromatography testing for essential oil concentration.",
              },
              {
                icon: "sparkles",
                title: "Cold-Pressed Under 40°C",
                description: "No chemical solvents, bleaches, or deodorizers ever touch our coconut oil.",
              },
              {
                icon: "users",
                title: "Fair Direct-to-Farmer Pricing",
                description: "We pay 35% above market standard rates directly into farmers' cooperative bank accounts.",
              },
              {
                icon: "truck",
                title: "Zero-Plastic Packaging",
                description: "Shipped nationwide in compostable corrugated wraps and amber glass bottles.",
              },
            ],
          },
        },
        {
          type: "testimonials",
          props: {
            title: "Loved in kitchens across India",
            items: [
              {
                quote: "The fragrance when you pop open the pepper jar fills the whole kitchen. Nothing like store-bought brands.",
                name: "Ananya Menon",
                role: "Home Chef, Bengaluru",
              },
              {
                quote: "Pure virgin coconut oil that tastes exactly like what my grandmother used to make in Palakkad.",
                name: "Vivek Nair",
                role: "Food Critic, Kochi",
              },
              {
                quote: "The turmeric gave our curries such vibrant natural color and depth. An absolute staple now.",
                name: "Pooja Hegde",
                role: "Culinary Enthusiast, Mumbai",
              },
            ],
          },
        },
        {
          type: "cta-banner",
          props: {
            title: "Bring authentic Kerala harvest to your dining table",
            subtitle: "Enjoy free shipping across India on orders over ₹999.",
            cta: { label: "Shop All Harvest Products", href: "/shop" },
          },
        },
        {
          type: "footer",
          props: {
            tagline: "Honoring Kerala's ancient spice heritage with single-estate purity.",
            columns: [
              {
                title: "Shop",
                links: [
                  { label: "Virgin Coconut Oil", href: "/shop" },
                  { label: "Black Pepper", href: "/shop" },
                  { label: "Alleppey Turmeric", href: "/shop" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "Our Story", href: "/about" },
                  { label: "Farmer Cooperatives", href: "/about" },
                  { label: "Contact Us", href: "/about" },
                ],
              },
            ],
            socials: ["instagram", "x", "youtube"],
          },
        },
      ],
    },
    {
      slug: "/shop",
      title: "Shop",
      sections: [
        {
          type: "navbar",
          props: {
            links: [
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Our Story", href: "/about" },
            ],
            cta: { label: "View Cart", href: "/shop" },
          },
        },
        {
          type: "product-grid",
          props: {
            title: "All Handcrafted Farm Goods",
            subtitle: "Straight from Kochi to your kitchen pantry.",
            items: [
              { title: "Virgin Coconut Oil (500ml)", description: "Fresh centrifugal cold-pressed.", price: "₹450" },
              { title: "Tellicherry Pepper (200g)", description: "Sun-dried bold grade.", price: "₹380" },
              { title: "Alleppey Turmeric (250g)", description: "5.8% natural curcumin content.", price: "₹290" },
              { title: "Cardamom Extra Bold (100g)", description: "Jumbo pods from Idukki.", price: "₹620" },
              { title: "Kerala Cinnamon Quills (100g)", description: "True Ceylon-variety aromatic sweet bark.", price: "₹310" },
              { title: "Malabar Star Anise (100g)", description: "Whole eight-pointed fragrant spice.", price: "₹260" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            tagline: "Honoring Kerala's ancient spice heritage with single-estate purity.",
            columns: [
              { title: "Navigation", links: [{ label: "Home", href: "/" }, { label: "About", href: "/about" }] },
            ],
            socials: ["instagram", "x"],
          },
        },
      ],
    },
    {
      slug: "/about",
      title: "Our Story",
      sections: [
        {
          type: "navbar",
          props: {
            links: [
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Our Story", href: "/about" },
            ],
            cta: { label: "Shop Harvest", href: "/shop" },
          },
        },
        {
          type: "hero-center",
          props: {
            badge: "Preserving Kerala Tradition",
            title: "Four generations of ethical spice cultivation.",
            subtitle:
              "We partner directly with 42 generational family farm estates in the Western Ghats to bring unadulterated flavors straight to you.",
            primaryCta: { label: "Taste The Difference", href: "/shop" },
          },
        },
        {
          type: "footer",
          props: {
            tagline: "Honoring Kerala's ancient spice heritage with single-estate purity.",
            columns: [
              { title: "Navigation", links: [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }] },
            ],
            socials: ["instagram", "x"],
          },
        },
      ],
    },
  ],
};
