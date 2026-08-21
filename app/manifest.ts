import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Roman Maps — the Roman Empire in 117 CE",
    short_name: "Roman Maps",
    description:
      "An interactive map of the Roman Empire at its greatest extent, 117 CE. Provinces, roads, rivers and a 16,000-place gazetteer, plus street-level plans of 40 archaeological sites.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4ead5",
    theme_color: "#f4ead5",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
