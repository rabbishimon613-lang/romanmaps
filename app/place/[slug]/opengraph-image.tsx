import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";
import { colorForCategory } from "../../poiCategories";

/** [13-P2-8] og-images — every /place/[slug] page gets a real, branded 1200x630 social card
 * instead of falling back to a bare link preview. Deliberately text-only (no fetch of the POI's
 * own `image_url`): this route prerenders at build time via generateStaticParams below, and
 * Wikimedia Commons is network-blocked in this sandbox — fetching a remote photo into the image
 * would break the build here. The parchment-medallion mark matches `app/appIcon.tsx`'s existing
 * icon family so social cards, favicon and PWA icons read as one brand. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type PoiProps = {
  id: string;
  category?: string;
  name_latin?: string;
  name_english?: string;
  province?: string;
  modern_location?: string;
};
type PoiFeature = { type: "Feature"; properties: PoiProps };

function loadPois(): PoiFeature[] {
  const raw = readFileSync(path.join(process.cwd(), "public", "data", "pois.geojson"), "utf8");
  const fc = JSON.parse(raw) as { features: PoiFeature[] };
  return fc.features.filter((f) => f.properties?.id);
}

function slugFor(id: string): string {
  return id.replace(/^poi_/, "");
}

export function generateStaticParams() {
  return loadPois().map((f) => ({ slug: slugFor(f.properties.id) }));
}

function titleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/(^|\s)\w/g, (c) => c.toUpperCase());
}

export default function OgImage({ params }: { params: { slug: string } }) {
  const feat = loadPois().find((f) => slugFor(f.properties.id) === params.slug);
  const p = feat?.properties;
  const name = p?.name_english || p?.name_latin || "Roman Maps";
  const subtitle = p?.name_latin && p.name_latin !== p?.name_english ? p.name_latin : "";
  const locationLine = [p?.province, p?.modern_location].filter(Boolean).join(" · ");
  const accent = colorForCategory(p?.category || "");
  const categoryLabel = p?.category ? titleCase(p.category) : "";

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
        <div style={{ width: 64, height: 6, background: accent, display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {categoryLabel ? (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: accent,
                marginBottom: 20,
              }}
            >
              {categoryLabel}
            </div>
          ) : null}
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#3a2e1f", lineHeight: 1.05 }}>
            {name}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 36, color: "#7a6a4f", marginTop: 18 }}>{subtitle}</div>
          ) : null}
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
