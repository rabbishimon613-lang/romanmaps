import type { Metadata, Viewport } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "./siteUrl";

// Runs before first paint so a returning visitor who picked "Dark" or "Light" (app/useTheme.ts)
// doesn't see a flash of the wrong scheme while the page loads — mirrors the localStorage key
// and the set/clear logic useTheme.ts itself uses (`roman-maps:theme`). A plain synchronous
// <script> in <head>,
// deliberately NOT next/script's beforeInteractive strategy — that queues onto Next 14's
// `__next_s` array and only actually runs once the app-router runtime processes it, measured
// (Playwright, this repo) landing between DOMContentLoaded and `load`, well after first paint —
// exactly the flash this exists to prevent. A raw script tag is parsed and executed inline by the
// browser as it reaches it in <head>, before any body content paints.
const THEME_INIT_SCRIPT = `try{var m=localStorage.getItem('roman-maps:theme');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m);}}catch(e){}`;

// Roman-inscription-style display serif for place-name headings (POI panel titles, site/legion
// list rows, map pin labels) — an open-source stand-in for Trajan Pro, per the P3 backlog item.
// Self-hosted by Next.js at build time; exposed as a CSS variable so plain inline-style HTML
// (e.g. PoiMarkers.tsx's map-pin label divs) can reference it without importing the font object.
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cinzel", display: "swap" });

const DESCRIPTION =
  "An interactive map of the Roman Empire at its greatest extent, 117 CE. " +
  "Provinces, roads, rivers and a 16,000-place gazetteer, plus street-level " +
  "plans of 40 archaeological sites from Pompeii to Palmyra.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Roman Maps — the Roman Empire in 117 CE",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Roman Maps",
    title: "Roman Maps — the Roman Empire in 117 CE",
    description: DESCRIPTION,
    locale: "en",
  },
  twitter: {
    card: "summary",
    title: "Roman Maps — the Roman Empire in 117 CE",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cinzel.variable}>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
