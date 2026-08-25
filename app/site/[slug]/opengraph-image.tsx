import { ImageResponse } from "next/og";
import { SITES } from "../../sites";

/** [13-P2-8] og-images — same branded-card treatment as app/place/[slug]/opengraph-image.tsx,
 * extended to the 40 curated `sites.ts` archaeological-site pages. See that file's header
 * comment for why this is text-only rather than embedding a fetched photo. `SiteInfo` has no
 * `image_url` field of its own yet (a separate, larger research task — see FEATURE_BACKLOG.md),
 * so there is no photo to embed even setting the build-time network block aside. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return SITES.map((s) => ({ slug: s.slug }));
}

export default function OgImage({ params }: { params: { slug: string } }) {
  const site = SITES.find((s) => s.slug === params.slug);
  const name = site?.display || "Roman Maps";
  const locationLine = [site?.province, site?.modernCountry].filter(Boolean).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4ead5",
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ width: 64, height: 6, background: "#8b1a1a", display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8b1a1a",
              marginBottom: 20,
            }}
          >
            Archaeological Site
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#3a2e1f", lineHeight: 1.05 }}>
            {name}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#5c4f38" }}>{locationLine}</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: "3px solid #7a2e2e",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700, color: "#7a2e2e" }}>M</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#3a2e1f", letterSpacing: 1 }}>ROMAN MAPS</span>
              <span style={{ fontSize: 22, color: "#7a6a4f" }}>117 CE</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
