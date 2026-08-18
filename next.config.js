/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  // `next dev` and `next build` (run back-to-back by the pre-push hook while a dev server may
  // still be up) used to share one .next/ dir and corrupt each other's build output — hit
  // independently by four shifts in a row. Giving dev its own dir means the two commands can
  // physically never collide, regardless of who forgets to stop the dev server first.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",

  // One site, one address. Vercel does not retire a project's own subdomain, so
  // without this every page answers 200 on both hosts and the two compete in the
  // index for the same corpus.
  //
  // The verification file is deliberately not redirected: Search Console keeps
  // re-fetching it on the old host, and a redirect there reads as verification
  // lost.
  async redirects() {
    return [
      {
        source: "/:path((?!google691ef6c52ff2a910\\.html).*)",
        has: [{ type: "host", value: "romanmaps.vercel.app" }],
        destination: "https://romanmaps.org/:path",
        permanent: true,
      },
      // `poi_pantheon_rome` was a duplicate of `poi_pantheon` (same building, 8m apart) retired
      // in pois.geojson under [12-FIX-3] — this keeps its already-generated/indexed URL landing
      // somewhere real instead of a bare 404.
      {
        source: "/place/pantheon_rome",
        destination: "/place/pantheon",
        permanent: true,
      },
    ];
  },
};
