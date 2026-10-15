export type Testimonial = { quote: string; name: string; role: string; sample?: boolean };

// Replace these with real feedback from your first users, then remove `sample: true`.
export const testimonials: Testimonial[] = [
  {
    quote: "I described my store in two lines and got a full site with pages and a dashboard. Editing every little thing by clicking felt unreal.",
    name: "Sample reviewer",
    role: "Founder, online store",
    sample: true,
  },
  {
    quote: "Being able to approve the design before any code is written is exactly what I wanted as a non-technical founder.",
    name: "Sample reviewer",
    role: "Startup founder",
    sample: true,
  },
  {
    quote: "I deleted one testimonial and changed one price without touching a prompt. That small control matters a lot.",
    name: "Sample reviewer",
    role: "Freelance designer",
    sample: true,
  },
];