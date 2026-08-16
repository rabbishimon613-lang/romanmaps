import type { MetadataRoute } from "next";
import { SITE_URL } from "./siteUrl";
import { SITES } from "./sites";

/** The map itself is still a single client-side route — every layer, gazetteer
 * point and non-site POI is reached through client state and a `#lng,lat,zoomz`
 * hash, which search engines discard. But every archaeological site with a
 * street-level page (`app/sites.ts`) now also has a real server-rendered URL
 * at `/site/[slug]` (see `app/site/[slug]/page.tsx`), so those are listed here.
 *
 * No `lastModified` is stamped. The app changes most days, but a date written
 * on every build is a synthetic freshness signal, not a real one, and search
 * engines learn to distrust the field.
 *
 * Extending this to the 16k-point gazetteer is explicitly out of scope — see
 * FEATURE_BACKLOG.md's own note against generating a page per gazetteer point
 * before the 40 site pages prove out. */
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
  ];
}
