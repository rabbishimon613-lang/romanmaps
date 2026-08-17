import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "../../siteUrl";
import { HUBS, HUB_GENERAL_SOURCES, type Hub } from "../../hubs";
import { LEGIONS } from "../../legions";

/** [14-P2-8] hub-pages. Five explainer essays, each followed by a live-pulled slice of real
 * data — mirrors `/province/[slug]`'s split between hand-written framing and data aggregated
 * at build time, just organized by theme instead of by province. Same static parchment card
 * styling as `/province/[slug]` and `/place/[slug]` (this app's pattern for content pages,
 * distinct from the dark interactive-map chrome). */

type Props = { params: { slug: string } };

function dataPath(name: string): string {
  return path.join(process.cwd(), "public", "data", name);
}
function loadFC<T = any>(name: string): { features: T[] } {
  return JSON.parse(readFileSync(dataPath(name), "utf8"));
}

function mapHash(lng: number, lat: number, zoom = 8): string {
  return `/#${lng.toFixed(4)},${lat.toFixed(4)},${zoom.toFixed(2)}z`;
}

/** A view-on-map anchor for any feature geometry this page touches. `events_117.geojson` mixes
 * point events with polygon zones (the Kitos War revolt areas) in the same file — for a polygon
 * this takes a crude centroid of the outer ring, which is plenty precise for a "center the map
 * here" link. */
function pointFor(geom: { type: string; coordinates: any }): [number, number] {
  if (geom.type === "Point") return geom.coordinates as [number, number];
  if (geom.type === "Polygon") {
    const ring: [number, number][] = geom.coordinates[0];
    const lng = ring.reduce((s, c) => s + c[0], 0) / ring.length;
    const lat = ring.reduce((s, c) => s + c[1], 0) / ring.length;
    return [lng, lat];
  }
  if (geom.type === "LineString") {
    const coords: [number, number][] = geom.coordinates;
    return coords[Math.floor(coords.length / 2)];
  }
  return [0, 0];
}

export function generateStaticParams() {
  return HUBS.map((h) => ({ slug: h.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const h = HUBS.find((x) => x.slug === params.slug);
  if (!h) return {};
  const title = `${h.title} — Roman Maps`;
  const description = h.dek;
  const url = `/hub/${params.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url: `${SITE_URL}${url}`, siteName: "Roman Maps", title, description, locale: "en" },
    twitter: { card: "summary", title, description },
  };
}

// ---- per-hub supporting data, pulled live from the same files the map itself reads ----

function RoadsSupport() {
  const stations = loadFC("road_stations.geojson").features;
  const byRoad = new Map<string, any[]>();
  for (const f of stations) {
    const road = f.properties?.road || "Unassigned";
    if (!byRoad.has(road)) byRoad.set(road, []);
    byRoad.get(road)!.push(f);
  }
  const roads = [...byRoad.entries()].sort((a, b) => b[1].length - a[1].length);
  return (
    <>
      {roads.map(([road, feats]) => (
        <div key={road} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#2a2118", marginBottom: 6 }}>
            {road} <span style={{ fontWeight: 400, color: "#8a7a60", fontSize: 13 }}>— {feats.length} station{feats.length === 1 ? "" : "s"}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px" }}>
            {feats.slice(0, 12).map((f: any) => (
              <Link
                key={f.properties.id}
                href={mapHash(f.geometry.coordinates[0], f.geometry.coordinates[1], 11)}
                style={{ fontSize: 13, color: "#8a5a2b", textDecoration: "none" }}
              >
                {f.properties.name}
              </Link>
            ))}
            {feats.length > 12 && <span style={{ fontSize: 13, color: "#8a7a60" }}>+{feats.length - 12} more</span>}
          </div>
        </div>
      ))}
    </>
  );
}

function ArmySupport() {
  const politics = loadFC("politics.geojson").features;
  const household = politics.filter((f: any) =>
    ["praetorian_barrack", "urban_cohort_HQ", "equites_singulares_barrack"].includes(f.properties?.category),
  );
  const byProvince = new Map<string, typeof LEGIONS>();
  for (const l of LEGIONS) {
    if (!byProvince.has(l.province)) byProvince.set(l.province, []);
    byProvince.get(l.province)!.push(l);
  }
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 10 }}>
          The 28 legions, by province
        </div>
        {[...byProvince.entries()].map(([province, legs]) => (
          <div key={province} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#2a2118", marginBottom: 4 }}>{province}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px" }}>
              {legs.map((l) => (
                <Link
                  key={l.poiId}
                  href={`/place/${l.poiId.replace(/^poi_/, "")}`}
                  style={{ fontSize: 13, color: "#8a5a2b", textDecoration: "none" }}
                  title={`${l.legion} — ${l.fortressLatin}, ${l.modernLocation}`}
                >
                  Legio {l.numeral} {l.epithet}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {household.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 10 }}>
            Rome's household troops
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {household.map((f: any) => (
              <li key={f.properties.id}>
                <Link href={mapHash(f.geometry.coordinates[0], f.geometry.coordinates[1], 12)} style={{ color: "#2a2118", textDecoration: "none" }}>
                  <strong style={{ color: "#8a5a2b" }}>{f.properties.name}</strong>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function Era117Support() {
  const people = loadFC("people_117.geojson").features;
  const events = loadFC("events_117.geojson").features
    .slice()
    .sort((a: any, b: any) => (a.properties.date_iso || "").localeCompare(b.properties.date_iso || ""));
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 10 }}>
          {events.length} dated events
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {events.map((f: any) => {
            const [lng, lat] = pointFor(f.geometry);
            return (
            <li key={f.properties.id}>
              <Link href={mapHash(lng, lat, 7)} style={{ color: "#2a2118", textDecoration: "none" }}>
                <span style={{ fontSize: 12, color: "#8a7a60" }}>{f.properties.date_iso}</span>
                <br />
                <strong style={{ color: "#8a5a2b" }}>{f.properties.name}</strong>
              </Link>
            </li>
            );
          })}
        </ul>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 10 }}>
          {people.length} people alive that week
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 16px" }}>
          {people.map((f: any) => (
            <li key={f.properties.id}>
              <Link href={mapHash(f.geometry.coordinates[0], f.geometry.coordinates[1], 8)} style={{ color: "#2a2118", textDecoration: "none", fontSize: 14 }}>
                <strong style={{ color: "#8a5a2b" }}>{f.properties.name}</strong>
                {f.properties.role && <span style={{ color: "#8a7a60" }}> · {f.properties.role}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function EconomySupport() {
  const mints = loadFC("mints.geojson").features;
  // trade_routes.geojson mixes the named LineString routes with their individual Point waypoints
  // ("node_*" features) in one FeatureCollection — this list is the routes themselves.
  const routes = loadFC("trade_routes.geojson").features.filter((f: any) => f.geometry?.type === "LineString");
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 10 }}>
          {mints.length} mints
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 16px" }}>
          {mints.map((f: any) => (
            <li key={f.properties.id}>
              <Link href={mapHash(f.geometry.coordinates[0], f.geometry.coordinates[1], 8)} style={{ color: "#2a2118", textDecoration: "none", fontSize: 14 }}>
                <strong style={{ color: "#8a5a2b" }}>{f.properties.name}</strong>
                {f.properties.metal && <span style={{ color: "#8a7a60" }}> · {f.properties.metal}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 10 }}>
          {routes.length} trade routes
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {routes.map((f: any) => {
            const mid = f.geometry.coordinates[Math.floor(f.geometry.coordinates.length / 2)];
            return (
              <li key={f.properties.id}>
                <Link href={mapHash(mid[0], mid[1], 4)} style={{ color: "#2a2118", textDecoration: "none" }}>
                  <strong style={{ color: "#8a5a2b" }}>{f.properties.name}</strong>
                  {f.properties.commodity && <span style={{ color: "#8a7a60" }}> · {f.properties.commodity}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function ReligionSupport() {
  const cult = loadFC("imperial_cult.geojson").features;
  const religions = loadFC("religions_117.geojson").features;
  const byTradition = new Map<string, any[]>();
  for (const f of religions) {
    const t = f.properties?.tradition || "other";
    if (!byTradition.has(t)) byTradition.set(t, []);
    byTradition.get(t)!.push(f);
  }
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 10 }}>
          {cult.length} provincial imperial-cult centers
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 16px" }}>
          {cult.map((f: any) => (
            <li key={f.properties.id}>
              <Link href={mapHash(f.geometry.coordinates[0], f.geometry.coordinates[1], 8)} style={{ color: "#2a2118", textDecoration: "none", fontSize: 14 }}>
                <strong style={{ color: "#8a5a2b" }}>{f.properties.name}</strong>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 10 }}>
          {religions.length} religious communities, by tradition
        </div>
        {[...byTradition.entries()].map(([tradition, feats]) => (
          <div key={tradition} style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#2a2118", textTransform: "capitalize" }}>{tradition}</span>
            <span style={{ fontSize: 12.5, color: "#8a7a60" }}> — </span>
            {feats.map((f: any, i: number) => (
              <span key={f.properties.id}>
                <Link href={mapHash(f.geometry.coordinates[0], f.geometry.coordinates[1], 8)} style={{ color: "#8a5a2b", textDecoration: "none", fontSize: 13 }}>
                  {f.properties.name}
                </Link>
                {i < feats.length - 1 && <span style={{ color: "#8a7a60" }}>, </span>}
              </span>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

const SUPPORT: Record<string, () => JSX.Element> = {
  "roman-roads": RoadsSupport,
  "roman-army": ArmySupport,
  "117-ce": Era117Support,
  "trade-economy": EconomySupport,
  "religion-belief": ReligionSupport,
};

export default function HubPage({ params }: Props) {
  const h = HUBS.find((x) => x.slug === params.slug);
  if (!h) notFound();

  const Support = SUPPORT[h.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: h.title,
    description: h.dek,
    url: `${SITE_URL}/hub/${params.slug}`,
  };

  return (
    <main style={{ minHeight: "100%", background: "#f4ead5", color: "#2a2118" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Link href="/" style={{ display: "inline-block", marginBottom: 32, fontSize: 14, color: "#8a5a2b", textDecoration: "none" }}>
          &larr; Back to the map
        </Link>

        <div style={{ height: 6, borderRadius: 3, background: "linear-gradient(90deg, #8a5a2b 0%, #8a5a2b66 100%)", marginBottom: 28 }} />

        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 6 }}>
          Roman Maps explains
        </div>
        <h1 className="roman-label" style={{ fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.15, margin: "0 0 12px" }}>
          {h.title}
        </h1>
        <p style={{ fontSize: 17, color: "#6b5a42", margin: "0 0 28px", lineHeight: 1.5 }}>{h.dek}</p>

        <section style={{ marginBottom: 36 }}>
          {h.intro.map((para, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.65, margin: "0 0 18px" }}>
              {para}
            </p>
          ))}
        </section>

        {Support && (
          <section style={{ marginBottom: 32, paddingTop: 8, borderTop: "1px solid #dccba0" }}>
            <Support />
          </section>
        )}

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 8px" }}>
            Sources
          </h2>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.7, color: "#6b5a42" }}>
            {[...h.sources, ...HUB_GENERAL_SOURCES].map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 12px" }}>
            More to read
          </h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {HUBS.filter((x) => x.slug !== h.slug).map((x) => (
              <li key={x.slug}>
                <Link href={`/hub/${x.slug}`} style={{ color: "#8a5a2b", textDecoration: "none", fontSize: 14.5 }}>
                  {x.title} &rarr;
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p style={{ marginTop: 40, fontSize: 13, color: "#8a7a60" }}>
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
