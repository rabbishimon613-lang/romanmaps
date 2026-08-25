import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "../../siteUrl";
import { colorForCategory } from "../../poiCategories";
import { lifeForCategory } from "../../categoryLife";

/** Every curated POI (`public/data/pois.geojson`, ~467 records with real notes/sources/images —
 * not the 16k-point raw gazetteer, which `sitemap.ts` explicitly keeps out of scope) gets a real,
 * server-rendered URL here, mirroring `/site/[slug]`. A map click only ever produces a
 * `#lng,lat,zoomz:poiId` hash, which search engines discard — this is the crawlable front door. */

type AncientSource = { author?: string; work?: string; ref?: string; note?: string };
type PoiProps = {
  id: string;
  category?: string;
  name_latin?: string;
  name_english?: string;
  province?: string;
  modern_location?: string;
  built?: number | string;
  destroyed?: number | string;
  extant_117ce?: boolean;
  notes?: string;
  sources?: string[];
  image_url?: string;
  image_credit?: string;
  image_alt?: string;
  ancient_sources?: AncientSource[];
};
type PoiFeature = { type: "Feature"; geometry: { type: "Point"; coordinates: [number, number] }; properties: PoiProps };

function loadPois(): PoiFeature[] {
  const raw = readFileSync(path.join(process.cwd(), "public", "data", "pois.geojson"), "utf8");
  const fc = JSON.parse(raw) as { features: PoiFeature[] };
  return fc.features.filter((f) => f.geometry?.type === "Point" && f.properties?.id);
}

const EARTH_RADIUS_M = 6371008.8;
function haversineMeters(aLng: number, aLat: number, bLng: number, bLat: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(s)));
}
// Same-category boost as the live map panel's client-side ranking (app/useNearby.ts) — kept as a
// second copy rather than a shared import, matching this codebase's existing per-file haversine
// convention (ContextMenu.tsx/PlacesInViewList.tsx/Ruler.tsx each keep their own too), and because
// app/useNearby.ts is a "use client" module that a server component shouldn't reach into.
const CATEGORY_BOOST_M = 8000;
// Two records this close together are a near-duplicate pin (the same building recorded twice,
// e.g. the still-open [12-FIX-3] Pantheon duplicate), not a genuinely different nearby place.
const MIN_DISTANCE_M = 25;

/** Six related places for the bottom-of-page card row — proximity ranked, same-category boosted,
 * [03-P1-4] nearby-related. */
function nearbyFor(all: PoiFeature[], current: PoiFeature, count = 6) {
  const [lng, lat] = current.geometry.coordinates;
  const category = current.properties.category || "";
  return all
    .filter((f) => f.properties.id !== current.properties.id)
    .map((f) => {
      const [flng, flat] = f.geometry.coordinates;
      const d = haversineMeters(lng, lat, flng, flat);
      const sameCategory = !!category && f.properties.category === category;
      return { f, d, score: sameCategory ? d - CATEGORY_BOOST_M : d };
    })
    .filter(({ d }) => d >= MIN_DISTANCE_M)
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(({ f, d }) => ({ feature: f, distanceM: d }));
}

function formatKm(meters: number): string {
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)} m` : `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

function slugFor(id: string): string {
  return id.replace(/^poi_/, "");
}

function findBySlug(slug: string): PoiFeature | undefined {
  return loadPois().find((f) => slugFor(f.properties.id) === slug);
}

export function generateStaticParams() {
  return loadPois().map((f) => ({ slug: slugFor(f.properties.id) }));
}

function formatYear(y: number | string | undefined): string {
  if (y === null || y === undefined || y === "") return "";
  const n = Number(y);
  if (Number.isNaN(n)) return String(y);
  return n < 0 ? `${-n} BCE` : `${n} CE`;
}

function titleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/(^|\s)\w/g, (c) => c.toUpperCase());
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const feat = findBySlug(params.slug);
  if (!feat) return {};
  const p = feat.properties;
  const name = p.name_english || p.name_latin || "Unknown place";
  const title = `${name} — Roman Maps`;
  const description = (p.notes || "").slice(0, 300) || `${name}, on Roman Maps' 117 CE map of the empire.`;
  const url = `/place/${params.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: `${SITE_URL}${url}`,
      siteName: "Roman Maps",
      title,
      description,
      locale: "en",
      images: p.image_url ? [{ url: p.image_url }] : undefined,
    },
    twitter: {
      card: p.image_url ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default function PlacePage({ params }: { params: { slug: string } }) {
  const feat = findBySlug(params.slug);
  if (!feat) notFound();

  const p = feat.properties;
  const [lng, lat] = feat.geometry.coordinates;
  const name = p.name_english || p.name_latin || "Unknown place";
  const subtitle = p.name_latin && p.name_latin !== p.name_english ? p.name_latin : "";
  const category = p.category || "";
  const color = colorForCategory(category);
  const categoryLife = lifeForCategory(category);

  const built = formatYear(p.built);
  const destroyed = formatYear(p.destroyed);
  const dateLine = built ? (destroyed ? `Built ${built} · Destroyed ${destroyed}` : `Built ${built}`) : "";
  const locationLine = [p.province, p.modern_location].filter(Boolean).join(" · ");

  const ancientSources = Array.isArray(p.ancient_sources)
    ? p.ancient_sources.filter((s) => s && (s.author || s.work))
    : [];
  const sources = Array.isArray(p.sources) ? p.sources : [];

  const mapHref = `/#${lng.toFixed(4)},${lat.toFixed(4)},15.00z:${p.id}`;
  const nearby = nearbyFor(loadPois(), feat);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    description: p.notes || undefined,
    url: `${SITE_URL}/place/${params.slug}`,
    image: p.image_url || undefined,
    geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
    additionalProperty: category
      ? [{ "@type": "PropertyValue", name: "category", value: titleCase(category) }]
      : undefined,
  };

  return (
    <main style={{ minHeight: "100%", background: "#f4ead5", color: "#2a2118" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 96px" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link
          href="/"
          style={{ display: "inline-block", marginBottom: 32, fontSize: 14, color: "#8a5a2b", textDecoration: "none" }}
        >
          &larr; Back to the map
        </Link>

        {p.image_url && (
          <img
            src={p.image_url}
            alt={p.image_alt || name}
            style={{ display: "block", width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
          />
        )}
        {p.image_url && p.image_credit && (
          <div style={{ fontSize: 12, color: "#8a7a60", marginBottom: 24 }}>{p.image_credit}</div>
        )}
        {!p.image_url && (
          <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${color} 0%, ${color}66 100%)`, marginBottom: 28 }} />
        )}

        <h1 className="roman-label" style={{ fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.15, margin: "0 0 4px" }}>
          {name}
        </h1>
        {subtitle && <div style={{ fontSize: 15, color: "#6b5a42", marginBottom: 8 }}>{subtitle}</div>}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", fontSize: 14, color: "#6b5a42", margin: "8px 0 20px" }}>
          {category && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: color, display: "inline-block" }} />
              {titleCase(category)}
            </span>
          )}
          {locationLine && <span>{locationLine}</span>}
          {dateLine && <span>{dateLine}</span>}
        </div>

        {p.extant_117ce === false && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#8a4a1a",
              background: "#f3e0c2",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 20,
              display: "inline-block",
            }}
          >
            Not standing in 117 CE
          </div>
        )}

        {p.notes && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 8px" }}>
              About
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>{p.notes}</p>
          </section>
        )}

        {categoryLife && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 8px" }}>
              What happened here
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#4a3d2a", margin: 0 }}>{categoryLife}</p>
          </section>
        )}

        {ancientSources.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 10px" }}>
              In ancient writing
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {ancientSources.map((s, i) => (
                <li key={i}>
                  <div style={{ fontSize: 15, color: "#2a2118" }}>
                    {s.author && <strong>{s.author}</strong>}
                    {s.work && (
                      <>
                        {s.author ? ", " : ""}
                        <em>{s.work}</em>
                      </>
                    )}
                    {s.ref && <span style={{ color: "#6b5a42" }}>{` ${s.ref}`}</span>}
                  </div>
                  {s.note && <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#5a4c38", margin: "4px 0 0" }}>{s.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {sources.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 8px" }}>
              Sources
            </h2>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.7, color: "#6b5a42" }}>
              {sources.map((s, i) => (
                <li key={i}>
                  {/^https?:\/\//.test(s) ? (
                    <a href={s} style={{ color: "#8a5a2b" }}>{s}</a>
                  ) : (
                    s
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {nearby.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 10px" }}>
              Nearby
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
              {nearby.map(({ feature: f, distanceM }) => {
                const np = f.properties;
                const nSlug = slugFor(np.id);
                const nName = np.name_english || np.name_latin || "Unnamed place";
                const nColor = colorForCategory(np.category || "");
                return (
                  <Link
                    key={np.id}
                    href={`/place/${nSlug}`}
                    style={{
                      display: "block",
                      border: "1px solid #e2d4b0",
                      borderRadius: 8,
                      overflow: "hidden",
                      textDecoration: "none",
                      color: "#2a2118",
                      background: "#fdf6e8",
                    }}
                  >
                    {np.image_url ? (
                      <img
                        src={np.image_url}
                        alt=""
                        style={{ display: "block", width: "100%", height: 80, objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ height: 80, background: `linear-gradient(135deg, ${nColor}55, ${nColor}22)` }} />
                    )}
                    <div style={{ padding: "8px 10px" }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{nName}</div>
                      <div style={{ fontSize: 11.5, color: "#8a7a60", marginTop: 3 }}>{formatKm(distanceM)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <a
          href={mapHref}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: 8,
            background: "#8a5a2b",
            color: "#fdf6e8",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Open {name} on the interactive map &rarr;
        </a>

        <p style={{ marginTop: 56, fontSize: 13, color: "#8a7a60" }}>
          Roman Maps shows the empire frozen at 11 August 117 CE, the day Trajan died — its
          moment of greatest territorial extent.{" "}
          <Link href="/" style={{ color: "#8a5a2b" }}>
            Explore the full map &rarr;
          </Link>
        </p>
      </div>
    </main>
  );
}
