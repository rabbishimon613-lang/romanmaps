/** Single source of truth for the canonical host.
 *
 * Hard-coding a host in more than one place is how a site ends up split across
 * two addresses in Google's index. metadataBase, robots.ts and sitemap.ts all
 * derive from this constant and nothing else.
 *
 * The site currently lives on its Vercel subdomain. When a real domain is
 * attached, change it here and add a redirect from the old host — do not
 * leave both serving 200. */
export const SITE_URL = "https://romanmaps.vercel.app";
