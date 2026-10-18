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
  title: "Codube",
  description:
    "Turn your ideas into a beautiful, functional website. Design visually, make changes with AI, and generate production-ready code.",
  openGraph: {
    title: "Codube",
    description:
      "Turn your ideas into a beautiful, functional website. Design visually, make changes with AI, and generate production-ready code.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${playfair.variable} ${space.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var origFetch = window.fetch;
                  var desc = Object.getOwnPropertyDescriptor(window, 'fetch') || (window.Window && Object.getOwnPropertyDescriptor(window.Window.prototype, 'fetch'));
                  if (!desc || !desc.set || !desc.writable) {
                    Object.defineProperty(window, 'fetch', {
                      get: function() { return origFetch; },
                      set: function(fn) { origFetch = fn; },
                      configurable: true,
                      enumerable: true
                    });
                  }
                } catch(e) {}

                window.addEventListener('error', function(e) {
                  if (e.filename && e.filename.indexOf('chrome-extension://') !== -1) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}