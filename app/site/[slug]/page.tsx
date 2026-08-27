import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITES } from "../../sites";
import { SITE_URL } from "../../siteUrl";

export function generateStaticParams() {
  return SITES.map((s) => ({ slug: s.slug }));
}

function findSite(slug: string) {
  return SITES.find((s) => s.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const site = findSite(params.slug);
  if (!site) return {};
  const title = `${site.display} — Roman Maps`;
  const description = site.blurb;
  const url = `/site/${site.slug}`;
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
      images: site.image_url ? [{ url: site.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: site.image_url ? [site.image_url] : undefined,
    },
  };
}

export default function SitePage({ params }: { params: { slug: string } }) {
  const site = findSite(params.slug);
  if (!site) notFound();

  const [lng, lat] = site.center;
  const mapHref = `/#${lng.toFixed(4)},${lat.toFixed(4)},${site.zoom.toFixed(2)}z`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: site.display,
    description: site.blurb,
    url: `${SITE_URL}/site/${site.slug}`,
    image: site.image_url || undefined,
    address: { "@type": "PostalAddress", addressCountry: site.modernCountry },
    geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
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
          style={{
            display: "inline-block",
            marginBottom: 32,
            fontSize: 14,
            color: "#8a5a2b",
            textDecoration: "none",
          }}
        >
          &larr; Back to the map
        </Link>

        {site.image_url && (
          <img
            src={site.image_url}
            alt={site.image_alt || site.display}
            style={{ display: "block", width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
          />
        )}
        {site.image_url && site.image_credit && (
          <div style={{ fontSize: 12, color: "#8a7a60", marginBottom: 24 }}>{site.image_credit}</div>
        )}

        <h1
          className="roman-label"
          style={{ fontSize: "clamp(32px, 6vw, 48px)", lineHeight: 1.15, margin: "0 0 12px" }}
        >
          {site.display}
        </h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", fontSize: 14, color: "#6b5a42", marginBottom: 28 }}>
          <span>{site.province} &middot; Roman province</span>
          <span>&middot;</span>
          <span>{site.modernCountry}</span>
          <span>&middot;</span>
          <span>Founded {site.founded}</span>
        </div>

        {site.snapshotNote && (
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: "10px 14px",
              borderRadius: 8,
              background: "#fdf0d5",
              color: "#8a5a2b",
              fontSize: 14,
              lineHeight: 1.5,
              margin: "0 0 20px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#8a5a2b" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{site.snapshotNote}</span>
          </div>
        )}

        <p style={{ fontSize: 19, lineHeight: 1.6, margin: "0 0 20px" }}>{site.blurb}</p>

        <p style={{ fontSize: 16, lineHeight: 1.6, fontStyle: "italic", color: "#5a4c38", margin: "0 0 36px" }}>
          {site.today}
        </p>

        {site.excavation && site.excavation.length > 0 && (
          <div style={{ margin: "0 0 36px" }}>
            <h2 style={{ fontSize: 15, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8a7a60", margin: "0 0 14px" }}>
              Excavation history
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {site.excavation.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 14 }}>
                  <div style={{ flexShrink: 0, width: 92, fontSize: 13, fontWeight: 600, color: "#8a5a2b", paddingTop: 1 }}>
                    {e.year}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.55 }}>
                    <strong>{e.excavator}</strong> — {e.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          Open {site.display} on the interactive map &rarr;
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
