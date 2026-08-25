import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "../../siteUrl";
import { PROVINCES, provinceForField, type Province } from "../../provinces";
import { SITES, type SiteInfo } from "../../sites";
import { colorForCategory } from "../../poiCategories";

/** One page per Roman province, 117 CE — mirrors `/place/[slug]` and `/site/[slug]`'s pattern.
 * Aggregates whatever `sites.ts` cities and `pois.geojson` records already carry a matching
 * `province` string, via `provinceForField`'s alias table in `app/provinces.ts`. No new atomic
 * data beyond the province registry itself; this page is a lens on data that already ships. */

type PoiProps = {
  id: string;
  category?: string;
  name_latin?: string;
  name_english?: string;
  province?: string;
  notes?: string;
  image_url?: string;
};
type PoiFeature = { type: "Feature"; geometry: { type: "Point"; coordinates: [number, number] }; properties: PoiProps };

function loadPois(): PoiFeature[] {
  const raw = readFileSync(path.join(process.cwd(), "public", "data", "pois.geojson"), "utf8");
  const fc = JSON.parse(raw) as { features: PoiFeature[] };
  return fc.features.filter((f) => f.geometry?.type === "Point" && f.properties?.id);
}

function sitesForProvince(p: Province): SiteInfo[] {
  return SITES.filter((s) => provinceForField(s.province)?.slug === p.slug);
}

function poisForProvince(p: Province, pois: PoiFeature[]): PoiFeature[] {
  return pois.filter((f) => provinceForField(f.properties.province)?.slug === p.slug);
}

function slugFor(id: string): string {
  return id.replace(/^poi_/, "");
}

function titleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/(^|\s)\w/g, (c) => c.toUpperCase());
}

function formatEra(year: number): string {
  return year < 0 ? `${-year} BCE` : `${year} CE`;
}

const STATUS_LABEL: Record<Province["status"], string> = {
  region: "Roman heartland — not a province",
  senatorial: "Senatorial province (proconsul)",
  "imperial-consular": "Imperial province, consular legate",
  "imperial-praetorian": "Imperial province, praetorian legate",
  "imperial-procurator": "Imperial province, equestrian procurator",
  prefecture: "Imperial prefecture (equestrian prefect)",
};

export function generateStaticParams() {
  return PROVINCES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = PROVINCES.find((x) => x.slug === params.slug);
  if (!p) return {};
  const title = `${p.displayName} — Roman Maps`;
  const description = p.blurb.slice(0, 300);
  const url = `/province/${params.slug}`;
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
    },
    twitter: { card: "summary", title, description },
  };
}

export default function ProvincePage({ params }: { params: { slug: string } }) {
  const p = PROVINCES.find((x) => x.slug === params.slug);
  if (!p) notFound();

  const pois = poisForProvince(p, loadPois());
  const sites = sitesForProvince(p);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AdministrativeArea",
    name: p.displayName,
    description: p.blurb,
    url: `${SITE_URL}/province/${params.slug}`,
  };

  return (
    <main style={{ minHeight: "100%", background: "#f4ead5", color: "#2a2118" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
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

        <div style={{ height: 6, borderRadius: 3, background: "linear-gradient(90deg, #8a5a2b 0%, #8a5a2b66 100%)", marginBottom: 28 }} />

        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", marginBottom: 6 }}>
          Province, 117 CE
        </div>
        <h1 className="roman-label" style={{ fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.15, margin: "0 0 12px" }}>
          {p.displayName}
        </h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", fontSize: 14, color: "#6b5a42", margin: "8px 0 24px" }}>
          <span>{STATUS_LABEL[p.status]}</span>
          <span>Capital: {p.capitalSlug ? (
            <Link href={`/site/${p.capitalSlug}`} style={{ color: "#8a5a2b" }}>{p.capital}</Link>
          ) : p.capital}</span>
          {p.establishedYear !== null && <span>Roman since {formatEra(p.establishedYear)}</span>}
        </div>

        {p.heldOnly117 && (
          <div
            style={{
              display: "inline-flex",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#8a5a2b",
              background: "#fdf0d5",
              borderRadius: 6,
              padding: "5px 10px",
              marginBottom: 20,
            }}
          >
            HELD ONLY 114–117 CE — ALREADY BEING ABANDONED
          </div>
        )}

        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>{p.blurb}</p>
          {p.establishedNote && (
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#6b5a42", margin: "10px 0 0" }}>{p.establishedNote}</p>
          )}
        </section>

        {sites.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 12px" }}>
              Cities on the map
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {sites.map((s) => (
                <li key={s.slug}>
                  <Link href={`/site/${s.slug}`} style={{ color: "#2a2118", textDecoration: "none" }}>
                    <strong style={{ color: "#8a5a2b" }}>{s.display}</strong>
                    <span style={{ color: "#6b5a42" }}> — {s.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pois.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 12px" }}>
              {pois.length} place{pois.length === 1 ? "" : "s"} on the map
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px 16px" }}>
              {pois
                .slice()
                .sort((a, b) => (a.properties.name_english || a.properties.name_latin || "").localeCompare(b.properties.name_english || b.properties.name_latin || ""))
                .map((f) => {
                  const name = f.properties.name_english || f.properties.name_latin || "Unnamed";
                  const color = colorForCategory(f.properties.category || "");
                  return (
                    <li key={f.properties.id}>
                      <Link href={`/place/${slugFor(f.properties.id)}`} style={{ display: "flex", alignItems: "baseline", gap: 8, color: "#2a2118", textDecoration: "none", fontSize: 14.5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: 999, background: color, flexShrink: 0 }} />
                        <span>
                          {name}
                          {f.properties.category && (
                            <span style={{ color: "#8a7a60", fontSize: 12.5 }}> · {titleCase(f.properties.category)}</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        )}

        {sites.length === 0 && pois.length === 0 && (
          <section style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 14.5, color: "#8a7a60" }}>
              No individually mapped places in {p.displayName} yet — the province still shows on
              the map's boundary layer.
            </p>
          </section>
        )}

        {p.sources.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 8px" }}>
              Sources
            </h2>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.7, color: "#6b5a42" }}>
              {[...p.sources, ...(p.provenanceSources || [])].map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

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
