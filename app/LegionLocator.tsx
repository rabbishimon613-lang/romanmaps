"use client";

import { useEffect, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { LEGIONS } from "./legions";
import { selectPoi } from "./usePoiPanel";

/** Slide-in panel listing all 28 legions of the Roman army in 117 CE, each pinned to its
 * fortress. Toggled by the left rail's "Legions" icon. Reuses the exact fortress records already
 * researched and cited in pois.geojson (category "fort") — clicking a legion flies to its real
 * fortress and opens the same Place details panel a map click would, rather than showing a
 * stripped-down duplicate. Google Maps "browse a category, jump to a place" analog. */
export default function LegionLocator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [poisById, setPoisById] = useState<Record<string, { props: Record<string, any>; coords: [number, number] }> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || poisById) return;
    let cancelled = false;
    fetch("/data/pois.geojson")
      .then((r) => r.json())
      .then((fc: GeoJSON.FeatureCollection<GeoJSON.Point, Record<string, any>>) => {
        if (cancelled) return;
        const index: Record<string, { props: Record<string, any>; coords: [number, number] }> = {};
        for (const f of fc.features || []) {
          const id = f.properties?.id;
          if (id && f.geometry?.type === "Point") {
            index[id] = { props: f.properties, coords: f.geometry.coordinates as [number, number] };
          }
        }
        setPoisById(index);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, poisById]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? LEGIONS.filter(
        (l) =>
          l.legion.toLowerCase().includes(q) ||
          l.province.toLowerCase().includes(q) ||
          l.modernLocation.toLowerCase().includes(q),
      )
    : LEGIONS;

  const jumpTo = (l: (typeof LEGIONS)[number]) => {
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.flyTo({ center: l.center, zoom: 12, duration: 1400 });
    const entry = poisById?.[l.poiId];
    if (entry) selectPoi(entry.props, entry.coords);
    // Close the list so the Place details panel it just opened isn't hidden behind it — same
    // "pick from a list, see the full detail view" flow Google Maps uses.
    onClose();
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
        background: "#fff",
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div style={{ flex: 1, fontSize: 18, fontWeight: 500, color: "#202124" }}>Legions</div>
      </div>
      <div style={{ padding: "0 16px 12px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search legions, provinces, forts…"
          style={{
            width: "100%",
            height: 40,
            border: "1px solid #dadce0",
            borderRadius: 999,
            padding: "0 16px",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#5f6368", textTransform: "uppercase", letterSpacing: 0.6, padding: "6px 16px" }}>
        {filtered.length} of 28 legions stationed in 117 CE
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
        {filtered.map((l) => (
          <button
            key={l.poiId}
            onClick={() => jumpTo(l)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              background: "transparent",
              textAlign: "left",
              marginBottom: 2,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div className="roman-label" style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>{l.legion}</div>
              <div style={{ fontSize: 12, color: "#5f6368" }}>· {l.fortressLatin}</div>
            </div>
            <div style={{ fontSize: 12, color: "#5f6368", marginTop: 2 }}>
              {l.province} · {l.modernLocation}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
