"use client";

import { useEffect, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { SITES } from "./sites";
import { motionDuration } from "./reducedMotion";

/** Slide-in panel listing all archaeological sites with street-level detail.
 * Toggled by the "Explore" icon in the left rail. Google-Maps "Explore this area" analog. */
export default function SitesPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? SITES.filter(
        (s) =>
          s.display.toLowerCase().includes(q) ||
          s.province.toLowerCase().includes(q) ||
          s.modernCountry.toLowerCase().includes(q),
      )
    : SITES;

  const jumpTo = (slug: string) => {
    const s = SITES.find((x) => x.slug === slug);
    if (!s) return;
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.flyTo({ center: s.center, zoom: s.zoom, duration: motionDuration(1400) });
    // Fetch this site's building/street detail now rather than waiting for flyTo's moveend —
    // the two run in parallel, so detail is ready by the time the camera settles. See [11-P0-1].
    const loadSiteDetail = (window as any).__loadSiteDetail as ((slug: string) => void) | undefined;
    loadSiteDetail?.(slug);
  };

  return (
    <div
      aria-hidden={!open}
      // @ts-ignore inert is a valid HTML attribute
      inert={!open ? "" : undefined}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 60,
        width: 360,
        maxWidth: "calc(100vw - 60px)",
        background: "var(--surface)",
        boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.2)",
        zIndex: 9,
        transform: open ? "translateX(0)" : "translateX(-110%)",
        transition: "transform 220ms ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "12px 12px 8px", gap: 8 }}>
        <button
          onClick={onClose}
          title="Close"
          style={{ width: 36, height: 36, borderRadius: 999, display: "grid", placeItems: "center" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--icon)">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div style={{ flex: 1, fontSize: 18, fontWeight: 500, color: "var(--text)" }}>Explore</div>
      </div>
      <div style={{ padding: "0 16px 12px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cities, provinces, countries…"
          style={{
            width: "100%",
            height: 40,
            border: "1px solid var(--divider)",
            borderRadius: 999,
            padding: "0 16px",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: 0.6, padding: "6px 16px" }}>
        {filtered.length} cities with street-level detail
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
        {filtered.map((s) => (
          <button
            key={s.slug}
            onClick={() => jumpTo(s.slug)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              background: "transparent",
              textAlign: "left",
              marginBottom: 2,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div className="roman-label" style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{s.display}</div>
              <div style={{ fontSize: 12, color: "var(--text-2)" }}>· {s.modernCountry}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
              Province of {s.province} · Founded {s.founded}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-strong)", marginTop: 4, lineHeight: 1.4 }}>{s.blurb}</div>
            {s.today && (
              <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 4, lineHeight: 1.4, fontStyle: "italic" }}>
                Today: {s.today}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
