export type BlockMeta = {
  type: string;
  variant: string;
  label: string;
  best: string; // when the AI should choose it
  source: "own" | "magicui" | "shadcn" | "reactbits";
  license: "own" | "MIT";
};

export const BLOCKS: BlockMeta[] = [
  { type: "hero", variant: "split", label: "Split hero with image", best: "products and local businesses", source: "own", license: "own" },
  { type: "hero", variant: "aurora", label: "Aurora hero with grid and wide image", best: "SaaS, AI, startups", source: "own", license: "own" },
  { type: "hero", variant: "spotlight", label: "Dark spotlight hero", best: "premium, gaming, nightlife", source: "own", license: "own" },
];