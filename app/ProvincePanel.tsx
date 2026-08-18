"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProvincePanel, clearProvince } from "./useProvincePanel";
import { PROVINCES, provinceForField, type Province } from "./provinces";
import { SITES, type SiteInfo } from "./sites";
import { LEGIONS, type Legion } from "./legions";
import { useIsMobile } from "./useIsMobile";

/** FEATURE_BACKLOG.md P1 "Province overlay" — click a province on the map (low-zoom only, see
 * app/Map.tsx's `provinces-fill` click handler) to highlight it and open this panel: governor at
 * 117 CE, legions stationed, and the cities already on the map. Same screen slot and visual
 * language as PlaceDetails.tsx — the two are mutually exclusive "modes", same pattern as
 * Directions/the ruler, coordinated through usePoiPanel.ts's registerPoiSelectedSideEffect. No
 * new atomic research: every field here is a lens on `app/provinces.ts`, `app/legions.ts` and
 * `public/data/politics.geojson`, which already ship. */

const STATUS_LABEL: Record<Province["status"], string> = {
  region: "Roman heartland — not a province",
  senatorial: "Senatorial province (proconsul)",
  "imperial-consular": "Imperial province, consular legate",
  "imperial-praetorian": "Imperial province, praetorian legate",
  "imperial-procurator": "Imperial province, equestrian procurator",
  prefecture: "Imperial prefecture (equestrian prefect)",
};

type Governor = {
  name?: string;
  one_line?: string;
  province?: string;
};

let governorCache: Governor[] | null = null;
async function loadGovernors(): Promise<Governor[]> {
  if (governorCache) return governorCache;
  const res = await fetch("/data/politics.geojson");
  if (!res.ok) return [];
  const fc = await res.json();
  governorCache = (fc.features || [])
    .filter((f: any) => f.properties?.category === "provincial_governor")
    .map((f: any) => f.properties as Governor);
  return governorCache!;
}

export default function ProvincePanel() {
  const slug = useProvincePanel();
  const isMobile = useIsMobile();
  const [governors, setGovernors] = useState<Governor[]>([]);
  const open = slug !== null;
  // Keep rendering the last province while the panel animates closed, same pattern PlaceDetails
  // uses for `rendered` — avoids the content flashing blank mid-transition.
  const [rendered, setRendered] = useState<Province | null>(null);

  useEffect(() => {
    if (slug) {
      const p = PROVINCES.find((x) => x.slug === slug) || null;
      setRendered(p);
    }
  }, [slug]);

  useEffect(() => {
    loadGovernors().then(setGovernors);
  }, []);

  if (!rendered) return null;
  const p = rendered;

  const governor = governors.find((g) => provinceForField(g.province)?.slug === p.slug);
  const legions: Legion[] = LEGIONS.filter((l) => provinceForField(l.province)?.slug === p.slug);
  const cities: SiteInfo[] = SITES.filter((s) => provinceForField(s.province)?.slug === p.slug);

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        maxHeight: "55vh",
        borderRadius: "12px 12px 0 0",
        transform: open ? "translateY(0)" : "translateY(110%)",
        transition: "transform 220ms ease",
      }
    : {
        position: "absolute",
        left: 70,
        top: 66,
        bottom: 40,
        width: 380,
        maxWidth: "calc(100vw - 20px)",
        borderRadius: 8,
        transform: open ? "translateX(0)" : "translateX(-120%)",
        transition: "transform 220ms ease",
      };

  return (
    <div
      aria-hidden={!open}
      // @ts-ignore inert is a valid HTML attribute
      inert={!open ? "" : undefined}
      style={{
        ...panelStyle,
        background: "var(--surface)",
        boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.2)",
        zIndex: 7,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      role="dialog"
      aria-label="Province details"
    >
      <div style={{ height: 6, flexShrink: 0, background: "var(--accent)" }} />
      <button
        title="Close"
        onClick={() => clearProvince()}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 32,
          height: 32,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          background: "var(--surface)",
          boxShadow: "0 1px 3px rgba(0,0,0,.3)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--icon)">
          <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.7 2.88 18.3 9.17 12 2.88 5.71 4.3 4.3l6.29 6.28L16.89 4.3z" />
        </svg>
      </button>

      <div style={{ overflowY: "auto", padding: "18px 20px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "var(--text-2)", marginBottom: 4 }}>
          Province, 117 CE
        </div>
        <h2 className="roman-label" style={{ fontSize: 22, lineHeight: 1.2, margin: "0 0 6px", color: "var(--text)" }}>
          {p.displayName}
        </h2>
        <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 14 }}>{STATUS_LABEL[p.status]}</div>

        <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--text)", margin: "0 0 18px" }}>{p.blurb}</p>

        <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 18 }}>
          <strong>Capital:</strong>{" "}
          {p.capitalSlug ? (
            <Link href={`/site/${p.capitalSlug}`} style={{ color: "var(--accent)" }}>
              {p.capital}
            </Link>
          ) : (
            p.capital
          )}
        </div>

        {governor && (
          <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--divider)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "var(--text-2)", marginBottom: 6 }}>
              Governor
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{governor.name}</div>
            {governor.one_line && (
              <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4, lineHeight: 1.5 }}>{governor.one_line}</div>
            )}
          </div>
        )}

        {legions.length > 0 && (
          <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--divider)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "var(--text-2)", marginBottom: 8 }}>
              {legions.length} legion{legions.length === 1 ? "" : "s"} stationed
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {legions.map((l) => (
                <Link
                  key={l.poiId}
                  href={`/place/${l.poiId.replace(/^poi_/, "")}`}
                  title={`${l.fortressLatin}, ${l.modernLocation}`}
                  style={{
                    fontSize: 12.5,
                    color: "var(--text)",
                    background: "var(--surface-2)",
                    borderRadius: 999,
                    padding: "4px 10px",
                    textDecoration: "none",
                  }}
                >
                  Legio {l.numeral} {l.epithet}
                </Link>
              ))}
            </div>
          </div>
        )}

        {cities.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "var(--text-2)", marginBottom: 8 }}>
              {cities.length} cit{cities.length === 1 ? "y" : "ies"} on the map
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {cities.map((s) => (
                <li key={s.slug}>
                  <Link href={`/site/${s.slug}`} style={{ color: "var(--text)", textDecoration: "none", fontSize: 13.5 }}>
                    <strong style={{ color: "var(--accent)" }}>{s.display}</strong>
                    <span style={{ color: "var(--text-2)" }}> — {s.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={`/province/${p.slug}`}
          target="_blank"
          rel="noopener"
          style={{ display: "inline-block", marginTop: 14, fontSize: 12.5, color: "var(--accent)" }}
        >
          Full province page &rarr;
        </Link>
      </div>
    </div>
  );
}
