import type { Metadata, Viewport } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";

// Roman-inscription-style display serif for place-name headings (POI panel titles, site/legion
// list rows, map pin labels) — an open-source stand-in for Trajan Pro, per the P3 backlog item.
// Self-hosted by Next.js at build time; exposed as a CSS variable so plain inline-style HTML
// (e.g. PoiMarkers.tsx's map-pin label divs) can reference it without importing the font object.
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cinzel", display: "swap" });

export const metadata: Metadata = {
  title: "Roman Maps",
  description: "The Roman Empire at its peak — 117 CE. Pan, zoom, explore.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cinzel.variable}>
      <body>{children}</body>
    </html>
  );
}
