export type StockPhoto = {
  id: string;
  category: string;
  title: string;
  credit: string;
  url: string;
  thumb: string;
};

export const STOCK_CATEGORIES = [
  "All",
  "Technology",
  "Business",
  "People",
  "Workspace",
  "Product",
  "Minimal",
  "Creative",
] as const;

export const STOCK_PHOTOS: StockPhoto[] = [
  // Technology & SaaS
  {
    id: "tech-1",
    category: "Technology",
    title: "Software engineer coding on modern setup",
    credit: "Fotis Fotopoulos",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "tech-2",
    category: "Technology",
    title: "Analytics dashboard & growth metrics",
    credit: "Carlos Muza",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "tech-3",
    category: "Technology",
    title: "AI data center & server infrastructure",
    credit: "Taylor Vick",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "tech-4",
    category: "Technology",
    title: "Modern dark neon abstract hardware",
    credit: "Alexandre Debiève",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=70",
  },

  // Business & Startup
  {
    id: "biz-1",
    category: "Business",
    title: "Startup founders collaborating in office",
    credit: "Annie Spratt",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "biz-2",
    category: "Business",
    title: "Modern business meeting discussion",
    credit: "Jason Goodman",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "biz-3",
    category: "Business",
    title: "Executive strategy presentation",
    credit: "Slidebean",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "biz-4",
    category: "Business",
    title: "Financial report and laptop review",
    credit: "Scott Graham",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&auto=format&fit=crop&q=70",
  },

  // People & Portraits
  {
    id: "ppl-1",
    category: "People",
    title: "Friendly smiling woman team member",
    credit: "Stephanie Liverani",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "ppl-2",
    category: "People",
    title: "Professional founder portrait",
    credit: "Jurica Koletić",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "ppl-3",
    category: "People",
    title: "Young creative product designer",
    credit: "Ayo Ogunseinde",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "ppl-4",
    category: "People",
    title: "Customer success manager smiling",
    credit: "Christina @ wocintechchat.com",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=70",
  },

  // Workspace & Modern Office
  {
    id: "work-1",
    category: "Workspace",
    title: "Minimal aesthetic desk with MacBook",
    credit: "Domenico Loia",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "work-2",
    category: "Workspace",
    title: "Modern open plan bright office",
    credit: "Petr Macháček",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "work-3",
    category: "Workspace",
    title: "Minimalist studio with plant",
    credit: "Bench Accounting",
    url: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=300&auto=format&fit=crop&q=70",
  },

  // Product & Store
  {
    id: "prod-1",
    category: "Product",
    title: "Handmade artisan ring & jewelry",
    credit: "Sabrianna",
    url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "prod-2",
    category: "Product",
    title: "Minimal gold necklace jewelry",
    credit: "Cornelia Ng",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "prod-3",
    category: "Product",
    title: "Artisanal coffee cup & pour over",
    credit: "Nathan Dumlao",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "prod-4",
    category: "Product",
    title: "Fine dining restaurant presentation",
    credit: "Klara Kulikova",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=70",
  },

  // Minimal & Architecture
  {
    id: "min-1",
    category: "Minimal",
    title: "Modern geometric glass architecture",
    credit: "Joel Filipe",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "min-2",
    category: "Minimal",
    title: "Clean white curved architecture",
    credit: "Simone Hutsch",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=70",
  },

  // Creative & 3D Abstract
  {
    id: "art-1",
    category: "Creative",
    title: "Abstract 3D purple fluid wave",
    credit: "Milad Fakurian",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "art-2",
    category: "Creative",
    title: "3D holographic glass sphere geometry",
    credit: "DeepMind",
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&auto=format&fit=crop&q=70",
  },
  {
    id: "art-3",
    category: "Creative",
    title: "Dark iridescent gradient glow",
    credit: "Shubham Dhage",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&auto=format&fit=crop&q=85",
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=70",
  },
];
