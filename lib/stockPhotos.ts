export type StockPhoto = {
  id: string;
  title: string;
  thumb: string;
  credit: string;
  url: string;
  prompt: string;
  category: string;
  alt?: string;
};

export const STOCK_CATEGORIES = [
  "All",
  "Tech & SaaS",
  "Business & Office",
  "Coffee & Food",
  "Travel & Architecture",
  "People & Lifestyle",
];

export const STOCK_PHOTOS: StockPhoto[] = [
  {
    id: "sp-1",
    title: "Artisan Latte Art",
    thumb: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80",
    credit: "Unsplash Barista",
    category: "Coffee & Food",
    prompt: "Artisan latte art on rustic wooden table with roasted coffee beans",
    url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    alt: "Artisan latte art",
  },
  {
    id: "sp-2",
    title: "Luxury Modern Villa",
    thumb: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80",
    credit: "Architecture Studio",
    category: "Travel & Architecture",
    prompt: "Luxury modern villa with private infinity pool overlooking the ocean",
    url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern luxury villa",
  },
  {
    id: "sp-3",
    title: "Mountain Pine Lodge",
    thumb: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80",
    credit: "Alpine Woods",
    category: "Travel & Architecture",
    prompt: "Cozy timber cabin in misty pine forest mountains",
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    alt: "Mountain pine lodge",
  },
  {
    id: "sp-4",
    title: "Beachfront Villa",
    thumb: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80",
    credit: "Coastal Living",
    category: "Travel & Architecture",
    prompt: "Tropical beachfront home with palm trees and ocean views",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    alt: "Beachfront villa",
  },
  {
    id: "sp-5",
    title: "Analytics Dashboard UI",
    thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80",
    credit: "Luke Chesser",
    category: "Tech & SaaS",
    prompt: "Futuristic dark tech user interface mockup on high resolution screen",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    alt: "Analytics dashboard interface",
  },
  {
    id: "sp-6",
    title: "Developer Workstation",
    thumb: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80",
    credit: "Dev Spaces",
    category: "Tech & SaaS",
    prompt: "Modern developer workspace with multiple displays and ambient violet lighting",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    alt: "Coding setup workspace",
  },
  {
    id: "sp-7",
    title: "Startup Creative Team",
    thumb: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80",
    credit: "Annie Spratt",
    category: "Business & Office",
    prompt: "Diverse modern startup creative team collaborating in bright loft office",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    alt: "Creative team collaboration",
  },
  {
    id: "sp-8",
    title: "Professional Portrait",
    thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    credit: "Aiony Haust",
    category: "People & Lifestyle",
    prompt: "Smiling entrepreneur reviewing product metrics on tablet",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    alt: "Professional portrait",
  },
];
