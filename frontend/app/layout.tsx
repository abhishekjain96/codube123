import type { Metadata } from "next";
import { Inter, Caveat, Playfair_Display, Space_Grotesk, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", preload: false });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap", preload: false });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Codube – Describe your idea. Codube builds it for you.",
  description:
    "Turn your ideas into a beautiful, functional website. Design visually, make changes with AI, and generate production-ready code.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${playfair.variable} ${space.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}