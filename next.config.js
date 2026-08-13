/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  // `next dev` and `next build` (run back-to-back by the pre-push hook while a dev server may
  // still be up) used to share one .next/ dir and corrupt each other's build output — hit
  // independently by four shifts in a row. Giving dev its own dir means the two commands can
  // physically never collide, regardless of who forgets to stop the dev server first.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};
