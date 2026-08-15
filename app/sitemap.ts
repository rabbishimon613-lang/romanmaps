import type { MetadataRoute } from "next";
import { SITE_URL } from "./siteUrl";

/** The map is a single route — every place, site and layer is reached through
 * client-side state and a `#lng,lat,zoomz` hash, which search engines discard.
 * So this sitemap honestly has one entry in it.
 *
 * No `lastModified` is stamped. The app changes most days, but a date written
 * on every build is a synthetic freshness signal, not a real one, and search
 * engines learn to distrust the field. When per-site routes exist they can
 * carry real dates from their own data.
 *
 * Making the corpus crawlable — a real URL per archaeological site — is a
 * feature, tracked in FEATURE_BACKLOG.md, not something a sitemap can fake. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
