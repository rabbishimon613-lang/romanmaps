import type { MetadataRoute } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import { SITE_URL } from "./siteUrl";
import { SITES } from "./sites";
import { PROVINCES } from "./provinces";
import { HUBS } from "./hubs";

/** The map itself is still a single client-side route — every layer, gazetteer
 * point and non-site POI is reached through client state and a `#lng,lat,zoomz`
 * hash, which search engines discard. But every archaeological site with a
 * street-level page (`app/sites.ts`) now also has a real server-rendered URL
 * at `/site/[slug]` (see `app/site/[slug]/page.tsx`), and every curated POI in
 * `public/data/pois.geojson` (~467 records with real notes/sources/images) has
 * one at `/place/[slug]` (see `app/place/[slug]/page.tsx`) — both listed here.
 *
 * No `lastModified` is stamped. The app changes most days, but a date written
 * on every build is a synthetic freshness signal, not a real one, and search
 * engines learn to distrust the field.
 *
 * The 16k-point raw gazetteer stays explicitly out of scope — see
 * FEATURE_BACKLOG.md's own note against generating a page per gazetteer point.
 * `pois.geojson` is a different, much smaller, curated dataset — every record
 * already carries real prose, not just a name. */
function poiSlugs(): string[] {
  const raw = readFileSync(path.join(process.cwd(), "public", "data", "pois.geojson"), "utf8");
  const fc = JSON.parse(raw) as { features: { properties?: { id?: string } }[] };
  return fc.features
    .map((f) => f.properties?.id)
    .filter((id): id is string => !!id)
    .map((id) => id.replace(/^poi_/, ""));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SITES.map((site) => ({
      url: `${SITE_URL}/site/${site.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...poiSlugs().map((slug) => ({
      url: `${SITE_URL}/place/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...PROVINCES.map((p) => ({
      url: `${SITE_URL}/province/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...HUBS.map((h) => ({
      url: `${SITE_URL}/hub/${h.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE_URL}/how-we-know`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];
}
