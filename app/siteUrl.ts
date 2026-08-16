/** Single source of truth for the canonical host.
 *
 * Hard-coding a host in more than one place is how a site ends up split across
 * two addresses in Google's index. metadataBase, robots.ts and sitemap.ts all
 * derive from this constant and nothing else.
 *
 * The real domain was bought on 2026-08-16 and this moved with it. The Vercel
 * subdomain now 308s here from next.config.js rather than serving 200 — the one
 * exception is the Search Console verification file, which has to keep answering
 * on the old host for that property to stay verified. */
export const SITE_URL = "https://romanmaps.org";
